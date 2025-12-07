// routes/messages.js

import express from "express";
import { supabase } from "../lib/supabase.js";
import { openai } from "../lib/openai.js";
import { loadKB } from "../lib/kbLoader.js";
import { retrieveAssistantContext } from "../lib/rag.js";

const router = express.Router();

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { content } = req.body; // user's new message text

    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ error: "Missing 'content' in request body" });
    }

    // 1. Get the conversation (who is this for? which assistant?)
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id, assistant_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      console.error("Conversation lookup error:", convError);
      return res.status(404).json({ error: "Conversation not found" });
    }

    // 2. Get the assistant linked to this conversation
    const { data: assistant, error: assistantError } = await supabase
      .from("assistants")
      .select("id, slug, display_name")
      .eq("id", conversation.assistant_id)
      .single();

    if (assistantError || !assistant) {
      console.error("Assistant lookup error:", assistantError);
      return res.status(404).json({ error: "Assistant not found" });
    }

    // 3. Load last N messages as chat history
    const { data: pastMessages, error: msgError } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    if (msgError) {
      console.error("Message history error:", msgError);
    }

    const history = (pastMessages || []).map((m) => ({
      role: m.role, // "user" or "assistant"
      content: m.content,
    }));

    // 4. Load the system prompt from your markdown
    const systemPrompt = await loadKB(assistant.slug, "full_system_prompt.md");

    // 5. 🔍 Retrieve relevant KB chunks via RAG, based on the user's new message
    const ragMatches = await retrieveAssistantContext({
      assistantSlug: assistant.slug,
      query: content,
      matchCount: 8,
    });

    const ragContext =
      ragMatches.length > 0
        ? ragMatches
            .map((m) => `Source: ${m.source_path}\n\n${m.chunk}`)
            .join("\n\n---\n\n")
        : "No relevant reference documents were retrieved.";

    // 6. Build the messages array for OpenAI
    const messages = [
      {
        role: "system",
        content: `
${systemPrompt}

---

You are the "${assistant.display_name}" PocketStaff assistant (slug: ${assistant.slug}).

You have access to the following internal Knowledge Base documentation. Use it to follow the correct rules, templates, and workflows. If some parts are not relevant to the user's request, ignore them.

When the user explicitly asks you to send an email (not just draft it), you MUST call the send_email tool with the appropriate to/subject/body instead of only replying with an email draft.

[BEGIN REFERENCE DOCUMENTS]

${ragContext}

[END REFERENCE DOCUMENTS]
      `.trim(),
      },
      ...history,
      {
        role: "user",
        content,
      },
    ];

    // 7. Define tools (currently just send_email)
    const tools = [
      {
        type: "function",
        function: {
          name: "send_email",
          description:
            "Send an email on behalf of the user. Use this when the user explicitly asks to send or email a message.",
          parameters: {
            type: "object",
            properties: {
              to: {
                type: "string",
                description: "Recipient email address",
              },
              subject: {
                type: "string",
                description: "Subject line of the email",
              },
              body: {
                type: "string",
                description: "Plain text body of the email.",
              },
            },
            required: ["to", "subject", "body"],
          },
        },
      },
    ];

    // 8. Call OpenAI to generate the assistant's reply (with tools enabled)
    const completion = await openai.chat.completions.create({
      model: process.env.CHAT_MODEL || "gpt-4.1",
      messages,
      tools,
      tool_choice: "auto",
    });

    const aiMessage = completion.choices[0].message;
    let assistantReply = aiMessage.content || "";

    // 9. Handle tool calls if the model decided to use send_email
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      console.log(
        "[PocketStaff TOOL CALLS]",
        JSON.stringify(aiMessage.tool_calls, null, 2)
      );

      for (const toolCall of aiMessage.tool_calls) {
        const toolName = toolCall.function?.name;
        const rawArgs = toolCall.function?.arguments || "{}";

        if (toolName === "send_email") {
          let args;
          try {
            args = JSON.parse(rawArgs);
          } catch (err) {
            console.error("Failed to parse send_email args:", err);
            assistantReply =
              "I tried to send the email, but I couldn't parse the email details.";
            continue;
          }

          const { to, subject, body } = args;
          console.log("[PocketStaff TOOL CALL send_email ARGS]", args);

          try {
            // Call your existing email endpoint on this backend
            const response = await fetch(
              "https://pocketstaff-backend.onrender.com/api/email/send",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to, subject, body }),
              }
            );

            const resultText = await response.text();
            console.log(
              "[PocketStaff EMAIL TOOL RESPONSE]",
              response.status,
              resultText
            );

            if (response.ok) {
              // If the model didn't already write a natural-language confirmation,
              // provide one.
              if (!assistantReply || assistantReply.trim().length === 0) {
                assistantReply = `Okay, I've sent an email to ${to} with subject "${subject}".`;
              }
            } else {
              assistantReply =
                "I tried to send the email, but the email service returned an error.";
            }
          } catch (err) {
            console.error("Error calling /api/email/send from tool:", err);
            assistantReply =
              "I tried to send the email, but there was a problem contacting the email service.";
          }
        }
      }

      if (!assistantReply || assistantReply.trim().length === 0) {
        assistantReply =
          "I've processed your request and attempted to send the email as requested.";
      }
    }

    // 10. Save the user's new message to the database
    const { error: insertUserError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      sender_type: "user",
      content,
    });

    if (insertUserError) {
      console.error("Error saving user message:", insertUserError);
    }

    // 11. Save the assistant's reply to the database
    const { error: insertAssistantError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        sender_type: "assistant",
        content: assistantReply,
      });

    if (insertAssistantError) {
      console.error("Error saving assistant message:", insertAssistantError);
    }

    // 12. Return the assistant reply to the frontend
    return res.json({
      message: assistantReply,
    });
  } catch (err) {
    console.error("Error in POST /api/conversations/:id/messages:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

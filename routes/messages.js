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
      return res.status(400).json({ error: "Missing 'content' in request body" });
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
console.log(
  "[KB DEBUG] assistantSlug:",
  assistant.slug,
  "| systemPrompt length:",
  systemPrompt ? systemPrompt.length : "NULL"
);

// 5. 🔍 Retrieve relevant KB chunks via RAG, based on the user's new message
// TEMPORARILY DISABLED FOR TESTING - RAG was overriding system prompt
// const ragMatches = await retrieveAssistantContext({
//   assistantSlug: assistant.slug,
//   query: content,
//   matchCount: 8,
// });
const ragMatches = []; // Force empty for testing

console.log(
  "[RAG DEBUG] assistantSlug:",
  assistant.slug,
  "| ragMatches count:",
  ragMatches ? ragMatches.length : 0
);

if (ragMatches && ragMatches[0]) {
  console.log(
    "[RAG DEBUG] first match source_path:",
    ragMatches[0].source_path
  );
}

const ragContext =
  ragMatches.length > 0
    ? ragMatches
        .map(
          (m) => `Source: ${m.source_path}\n\n${m.chunk}`
        )
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

    // 7. Call OpenAI to generate the assistant's reply
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages,
    });

    const assistantReply = completion.choices[0].message.content;

    // 8. Save the user's new message to the database
    const { error: insertUserError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      sender_type: "user",
      content,
    });

    if (insertUserError) {
      console.error("Error saving user message:", insertUserError);
    }

    // 9. Save the assistant's reply to the database
    const { error: insertAssistantError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      sender_type: "assistant",
      content: assistantReply,
    });

    if (insertAssistantError) {
      console.error("Error saving assistant message:", insertAssistantError);
    }

    // 10. Return the assistant reply to the frontend
    return res.json({
      message: assistantReply,
    });
  } catch (err) {
    console.error("Error in POST /api/conversations/:id/messages:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

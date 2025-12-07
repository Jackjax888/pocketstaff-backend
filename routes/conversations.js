// routes/conversations.js

import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

/**
 * POST /api/conversations
 *
 * Body:
 * {
 *   "user_id": "<uuid of the user>",
 *   "assistant_slug": "secretary"   // or other assistant slug
 * }
 */
router.post("/conversations", async (req, res) => {
  try {
    const { user_id, assistant_slug } = req.body || {};

    if (!user_id || !assistant_slug) {
      return res.status(400).json({
        error: "Missing 'user_id' or 'assistant_slug' in request body",
      });
    }

    // Look up assistant by slug
    const { data: assistant, error: assistantError } = await supabase
      .from("assistants")
      .select("id, slug, display_name, description")
      .eq("slug", assistant_slug)
      .single();

    if (assistantError || !assistant) {
      console.error("Assistant lookup error:", assistantError);
      return res.status(404).json({ error: "Assistant not found" });
    }

    // Create conversation row
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        user_id,
        assistant_id: assistant.id,
      })
      .select("id, created_at")
      .single();

    if (convError || !conversation) {
      console.error("Conversation insert error:", convError);
      return res.status(500).json({ error: "Failed to create conversation" });
    }

    return res.status(201).json({
      conversation_id: conversation.id,
      created_at: conversation.created_at,
      assistant: {
        id: assistant.id,
        slug: assistant.slug,
        display_name: assistant.display_name,
        description: assistant.description,
      },
    });
  } catch (err) {
    console.error("Error in POST /conversations:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/conversations?user_id=<uuid>
 *
 * Returns a list of conversations for the user,
 * including basic assistant info.
 */
router.get("/conversations", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        error: "Missing 'user_id' query parameter",
      });
    }

    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        created_at,
        assistant:assistants (
          id,
          slug,
          display_name,
          description
        )
      `
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Conversations lookup error:", error);
      return res.status(500).json({ error: "Failed to load conversations" });
    }

    return res.json({
      conversations: data || [],
    });
  } catch (err) {
    console.error("Error in GET /conversations:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

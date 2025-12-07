// routes/assistants.js

import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

/**
 * GET /api/assistants
 *
 * Optional query:
 *   ?only_default=true       -> filter to default assistants
 */
router.get("/assistants", async (req, res) => {
  try {
    const onlyDefault = req.query.only_default === "true";

    let query = supabase
      .from("assistants")
      .select("id, slug, name, display_name, description, is_default, created_at")
      .order("created_at", { ascending: true });

    if (onlyDefault) {
      query = query.eq("is_default", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Assistants lookup error:", error);
      return res.status(500).json({ error: "Failed to load assistants" });
    }

    return res.json({
      assistants: data || [],
    });
  } catch (err) {
    console.error("Error in GET /assistants:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

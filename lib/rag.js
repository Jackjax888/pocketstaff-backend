// lib/rag.js
import { supabase } from "./supabase.js";
import { createEmbedding } from "./openai.js";

// Retrieve relevant KB chunks for a given assistant + query
export async function retrieveAssistantContext({
  assistantSlug,
  query,
  matchCount = 8,
}) {
  if (!assistantSlug || !query) return [];

  // 1. Embed the user's message
  const queryEmbedding = await createEmbedding({ input: query });

  // 2. Call the Postgres function to match KB
  const { data, error } = await supabase.rpc("match_assistant_kb", {
    p_assistant_slug: assistantSlug,
    p_query_embedding: queryEmbedding,
    p_match_count: matchCount,
  });

  if (error) {
    console.error("RAG retrieval error:", error);
    return [];
  }

  return data || [];
}

// lib/rag.js
import { supabase } from "./supabase.js";

/**
 * Simple RAG helper:
 * Instead of doing vector similarity, just grab the first N KB chunks
 * for this assistant by assistant_slug.
 */
export async function retrieveAssistantContext({
  assistantSlug,
  query,        // not used yet, but kept for future upgrade
  matchCount = 8,
}) {
  try {
    console.log("[RAG DEBUG] SIMPLE MODE start", {
      assistantSlug,
      matchCount,
      querySnippet: query ? query.slice(0, 80) : null,
    });

    const { data, error } = await supabase
      .from("assistant_kb")
      .select("source_path, chunk")
      .eq("assistant_slug", assistantSlug)
      .limit(matchCount);

    if (error) {
      console.error("[RAG ERROR] simple select failed:", error);
      return [];
    }

    console.log(
      "[RAG DEBUG] SIMPLE MODE rows returned:",
      data ? data.length : 0
    );

    return data || [];
  } catch (err) {
    console.error("[RAG ERROR] unexpected exception:", err);
    return [];
  }
}

// scripts/ingestAssistantKb.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { createEmbedding } from "../lib/openai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CONFIG ----

// Where your assistant KB markdown lives (relative to this script)
// Make sure you have: pocketstaff-backend/ai_team_kb/secretary/...
const KB_ROOT = path.join(__dirname, "..", "ai_team_kb");

// Which assistants to ingest (folder names under ai_team_kb/)
const ASSISTANTS = [
  "secretary",
  // later you can add: "brand_expert", "gym_trainer", etc.
];

// Chunking config
const CHUNK_SIZE = 1500;       // characters
const CHUNK_OVERLAP = 200;     // characters

// Supabase client (use service key for ingestion, not anon)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- UTIL: recursively list .md files ----
function getMarkdownFiles(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);

  list.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (file.toLowerCase().endsWith(".md")) {
      results.push(fullPath);
    }
  });

  return results;
}

// ---- UTIL: simple character-based chunking ----
function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end === text.length) break;
    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}

// ---- MAIN INGEST FUNCTION ----
async function ingestAssistant(assistantSlug) {
  const assistantDir = path.join(KB_ROOT, assistantSlug);

  if (!fs.existsSync(assistantDir)) {
    console.warn(`Directory not found for assistant "${assistantSlug}": ${assistantDir}`);
    return;
  }

  console.log(`\n=== Ingesting assistant: ${assistantSlug} ===`);
  const files = getMarkdownFiles(assistantDir);

  console.log(`Found ${files.length} markdown files for ${assistantSlug}`);

  for (const filePath of files) {
    console.log(`\nProcessing: ${filePath}`);

    const raw = fs.readFileSync(filePath, "utf8");
    const chunks = chunkText(raw);

    console.log(`  -> ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      try {
        const embedding = await createEmbedding({ input: chunk });

        const { error } = await supabase.from("assistant_kb").insert({
          assistant_slug: assistantSlug,
          source_path: path.relative(KB_ROOT, filePath),
          chunk,
          embedding,
        });

        if (error) {
          console.error("  Insert error:", error);
        } else {
          console.log(`  ✓ Inserted chunk ${i + 1}/${chunks.length}`);
        }
      } catch (err) {
        console.error("  Embedding error:", err.message);
      }
    }
  }

  console.log(`\nDone ingesting assistant: ${assistantSlug}`);
}

// ---- ENTRYPOINT ----
(async () => {
  console.log("Starting KB ingestion...");

  for (const slug of ASSISTANTS) {
    await ingestAssistant(slug);
  }

  console.log("\nAll done ✅");
  process.exit(0);
})();

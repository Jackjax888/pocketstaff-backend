import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load any knowledge base markdown file for any assistant.
 *
 * Example:
 *   loadKB("secretary", "full_system_prompt.md")
 */
export async function loadKB(assistantSlug, fileName) {
  const filePath = path.join(__dirname, "..", "kb", assistantSlug, fileName);

  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(`KB Load Error: ${filePath}`, err);
    return "";
  }
}

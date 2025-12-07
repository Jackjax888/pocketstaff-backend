// lib/openai.js
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// helper for chat completions (optional, but nice to have)
export async function createChatCompletion({ messages, model = "gpt-4.1" }) {
  const response = await openai.chat.completions.create({
    model,
    messages,
  });
  return response;
}

// helper for embeddings (used by RAG)
export async function createEmbedding({
  input,
  model = "text-embedding-3-small",
}) {
  const response = await openai.embeddings.create({
    model,
    input,
  });

  return response.data[0].embedding;
}

// keep this for your existing imports: `import { openai } from "../lib/openai.js"`
export { openai };

// (optional) default export, in case you ever used `import client from "../lib/openai.js"`
export default openai;

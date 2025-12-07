// server.js — PocketStaff Backend

import express from "express";
import cors from "cors";
import "dotenv/config";

import messagesRouter from "./routes/messages.js";
import conversationsRouter from "./routes/conversations.js";

import assistantsRouter from "./routes/assistants.js";


console.log("ENV DEBUG:", {
  TEST_ENV: process.env.TEST_ENV,
  SUPABASE_URL_START: process.env.SUPABASE_URL?.slice(0, 40) || null
});

const app = express();

// === Middlewares ===
app.use(cors());
app.use(express.json());

// === Routes ===
app.use("/api", messagesRouter);
app.use("/api", conversationsRouter);
app.use("/api", assistantsRouter);

// === Server ===
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`PocketStaff backend running on port ${PORT}`);
});


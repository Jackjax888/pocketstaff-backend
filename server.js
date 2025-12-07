// server.js — PocketStaff Backend

import express from "express";
import cors from "cors";
import "dotenv/config";
import emailRoutes from "./routes/email.js";


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

// Simple email send endpoint (no real email yet)
app.post("/api/email/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body || {};

    if (!to || !subject || !body) {
      return res.status(400).json({
        error: "Missing required fields: to, subject, body",
      });
    }

    console.log("[PocketStaff EMAIL SEND request]", { to, subject, body });

    // TODO: plug in real Gmail / SMTP here
    return res.json({
      ok: true,
      message: "Email send endpoint hit successfully (no real email sent yet).",
    });
  } catch (err) {
    console.error("Error in /api/email/send:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// === Routes ===
app.use("/api", messagesRouter);
app.use("/api", conversationsRouter);
app.use("/api", assistantsRouter);
app.use("/api", emailRoutes);


// === Server ===
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`PocketStaff backend running on port ${PORT}`);
});


import express from "express";

const router = express.Router();

// POST /api/email/send
router.post("/email/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body || {};

    if (!to || !subject || !body) {
      return res.status(400).json({
        error: "Missing required fields: to, subject, body",
      });
    }

    // For now, just log it – this proves the route works.
    console.log("[PocketStaff EMAIL SEND request]", { to, subject, body });

    // TODO: replace this with real Gmail / SMTP sending
    return res.json({
      ok: true,
      message: "Email send endpoint hit successfully (no real email sent yet).",
    });
  } catch (err) {
    console.error("Error in /api/email/send:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

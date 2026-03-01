import express from "express";
import CodeSubmission from "../models/codesubmission.js";

const router = express.Router();
const SUPPORTED_LANGUAGES = ["c", "cpp", "java", "python", "javascript"];

router.post("/submit", async (req, res) => {
  try {
    const { userId, language, code } = req.body;

    if (!userId || !language || !code) {
      return res.status(400).json({
        success: false,
        error: "userId, language, and code are required",
      });
    }

    const normalizedLanguage = String(language).toLowerCase().trim();
    if (!SUPPORTED_LANGUAGES.includes(normalizedLanguage)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language. Use one of: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    const submission = await CodeSubmission.create({
      userId: String(userId).trim(),
      language: normalizedLanguage,
      code: String(code),
    });

    return res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("CREATE SUBMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create code submission",
      details: error.message,
    });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const submissions = await CodeSubmission.find({
      userId: String(req.params.userId).trim(),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;

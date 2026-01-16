import CodeSubmission from "../models/codesubmission.js";
import express from "express";

const router = express.Router();

// Route to handle code submission
router.post("/submit", async (req, res) => {
  try {
    const submssion = await CodeSubmission.create(req.body);
    res.status(201).json(submssion);
  } catch (error) {
  console.error("CREATE SUBMISSION ERROR:", error);
  res.status(500).json({
    error: "Failed to create code submission",
    details: error.message
  });
}
});

// Route to fetch all code submissions(history)
router.get("/history/:userId", async (req, res) => {
  try {
    const submissions = await CodeSubmission.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


export default router;
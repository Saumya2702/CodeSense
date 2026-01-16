import CodeSubmission from "../models/codesubmission.js";
import express from "express";

const router = express.Router();

// Route to handle code submission
router.post("/submit", async (req, res) => {
  try {
    const submssion = await CodeSubmission.create(req.body);
    res.status(201).json(submssion);
  } catch (error) {
    res.status(500).json({ error: "Failed to create code submission" });
  }
});

// Route to fetch all code submissions(history)
router.get("/history/:userId", async (req, res) => {
  try {
    const submissions = await CodeSubmission.find(
        { userId: req.params.userId },
    ).sort({createdAt: -1});
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch code submissions" });
  }
});

export default router;
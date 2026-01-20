import express from "express";
const router = express.Router();

router.get("/:submissionId", async (req, res) => {
  const mockReview = {
    overallScore: 75,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    logicIssues: [
      "Edge case not handled for empty input",
      "Loop condition may cause off-by-one error"
    ],
    securityIssues: [
      "No input validation"
    ],
    interviewerFeedback:
      "Good fundamentals, but lacks defensive coding and edge case awareness.",
    suggestedImprovements: [
      "Add null checks",
      "Handle empty inputs",
      "Improve variable naming"
    ]
  };

  res.json(mockReview);
});

export default router;

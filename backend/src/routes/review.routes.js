import express from "express";
import mongoose from "mongoose";
import CodeSubmission from "../models/codesubmission.js";

const router = express.Router();

function estimateTimeComplexity(code) {
  const nestedLoopPattern = /(for|while)[\s\S]{0,180}(for|while)/i;
  const singleLoopPattern = /(for|while)\s*\(/i;
  const recursionPattern = /\b([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{[\s\S]{0,300}\b\1\s*\(/m;
  const sortPattern = /\.sort\s*\(|Collections\.sort\s*\(|Arrays\.sort\s*\(/i;

  if (nestedLoopPattern.test(code)) return "O(n²)";
  if (sortPattern.test(code)) return "O(n log n)";
  if (recursionPattern.test(code)) return "O(2ⁿ) (possible recursive branching)";
  if (singleLoopPattern.test(code)) return "O(n)";
  return "O(1)";
}

function estimateSpaceComplexity(code) {
  const creates2D = /(new\s+\w+\s*\[[^\]]+\]\s*\[[^\]]+\])|(vector<\s*vector<)/i;
  const createsArrayLike = /(new\s+\w+\s*\[[^\]]+\])|(\[\])|(ArrayList<)|(vector<)|(map<)|(set<)/i;
  const recursionPattern = /\b([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{[\s\S]{0,300}\b\1\s*\(/m;

  if (creates2D.test(code)) return "O(n²)";
  if (createsArrayLike.test(code)) return "O(n)";
  if (recursionPattern.test(code)) return "O(n) (recursion stack)";
  return "O(1)";
}

function buildReview(submission) {
  const code = submission.code || "";
  const lines = code.split("\n").length;
  const hasInputValidation = /if\s*\(|try\s*\{|catch\s*\(/i.test(code);
  const hasComments = /\/\/|\/\*/.test(code);
  const hasLongFunctions = lines > 80;

  const logicIssues = [];
  const securityIssues = [];
  const suggestedImprovements = [];

  if (!hasInputValidation) {
    logicIssues.push("Input edge-cases are not clearly handled.");
    securityIssues.push("No obvious input validation checks found.");
    suggestedImprovements.push("Add validation and guard clauses for invalid inputs.");
  }

  if (!hasComments) {
    suggestedImprovements.push("Add concise comments for non-obvious logic.");
  }

  if (hasLongFunctions) {
    logicIssues.push("Solution appears long; consider modularizing into smaller functions.");
    suggestedImprovements.push("Split long functions for readability and testing.");
  }

  const overallScore = Math.max(55, 90 - logicIssues.length * 8 - securityIssues.length * 7);

  return {
    submissionId: submission._id,
    overallScore,
    timeComplexity: estimateTimeComplexity(code),
    spaceComplexity: estimateSpaceComplexity(code),
    logicIssues: logicIssues.length
      ? logicIssues
      : ["No major logical red flags from quick static scan."],
    securityIssues: securityIssues.length
      ? securityIssues
      : ["No immediate security anti-patterns detected in quick scan."],
    interviewerFeedback:
      overallScore >= 75
        ? "Solid baseline. With stronger edge-case handling and cleaner structure, this would perform well in interviews."
        : "Core idea is visible, but interview readiness needs stronger validation, structure, and explanation clarity.",
    suggestedImprovements,
  };
}

router.get("/:submissionId", async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid submission id",
      });
    }

    const submission = await CodeSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: buildReview(submission),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

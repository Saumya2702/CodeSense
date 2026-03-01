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

function countPatternHits(submissions) {
  const joined = submissions.map((s) => s.code || "");

  const offByOneHits = joined.filter(
    (code) => /(<=\s*\w+)|(\w+\s*<=\s*\w+)|(i\+\+\s*;\s*\})/.test(code) && !/length\s*-\s*1/.test(code)
  ).length;

  const nullCheckMisses = joined.filter(
    (code) => !/(null|undefined|if\s*\([^)]*\))/.test(code)
  ).length;

  const poorNamingHits = joined.filter(
    (code) => /\b(temp|var1|var2|data|arr|x|y)\b/.test(code)
  ).length;

  const nonOptimalSignals = joined.filter(
    (code) => /(for|while)[\s\S]{0,180}(for|while)/i.test(code)
  ).length;

  return {
    offByOneHits,
    nullCheckMisses,
    poorNamingHits,
    nonOptimalSignals,
  };
}

function buildInterviewReadinessEngine(submission, historicalSubmissions, reviewContext) {
  const total = historicalSubmissions.length || 1;
  const patternHits = countPatternHits(historicalSubmissions);

  const logicMasteryScore = Math.max(
    35,
    90 - reviewContext.logicIssues.length * 12 - Math.min(patternHits.offByOneHits * 3, 15)
  );

  const complexityUnderstandingScore = Math.max(
    30,
    88 - (reviewContext.timeComplexity.includes("n²") ? 18 : 6) - Math.min(patternHits.nonOptimalSignals * 2, 14)
  );

  const codeQualityScore = Math.max(
    40,
    92 - Math.min(patternHits.poorNamingHits * 5, 25) - (reviewContext.hasComments ? 0 : 8)
  );

  const interviewConfidenceScore = Math.round(
    logicMasteryScore * 0.35 +
      complexityUnderstandingScore * 0.3 +
      codeQualityScore * 0.2 +
      reviewContext.overallScore * 0.15
  );

  const interviewReadinessPercent = Math.round(
    (logicMasteryScore + complexityUnderstandingScore + codeQualityScore + interviewConfidenceScore) / 4
  );

  const weakestMap = {
    logic: logicMasteryScore,
    complexity: complexityUnderstandingScore,
    quality: codeQualityScore,
    confidence: interviewConfidenceScore,
  };

  const weakestAreaKey = Object.entries(weakestMap).sort((a, b) => a[1] - b[1])[0][0];

  const weakestArea = {
    logic: "Logic Mastery",
    complexity: "Time Complexity",
    quality: "Code Quality",
    confidence: "Interview Confidence",
  }[weakestAreaKey];

  const strength =
    codeQualityScore >= complexityUnderstandingScore
      ? "Clean Code Structure"
      : "Problem Solving Flow";

  const recommendedFocus =
    weakestAreaKey === "complexity"
      ? "Dynamic Programming"
      : weakestAreaKey === "logic"
      ? "Edge Cases & Boundary Handling"
      : weakestAreaKey === "quality"
      ? "Naming, Modularity, and Readability"
      : "Mock Interview Practice";

  const patternDetections = [
    {
      label: "Repeated off-by-one errors",
      detected: patternHits.offByOneHits >= Math.max(2, Math.ceil(total * 0.3)),
    },
    {
      label: "Always missing null checks",
      detected: patternHits.nullCheckMisses >= Math.max(2, Math.ceil(total * 0.4)),
    },
    {
      label: "Poor variable naming habits",
      detected: patternHits.poorNamingHits >= Math.max(2, Math.ceil(total * 0.3)),
    },
    {
      label: "Avoiding optimal solutions",
      detected: patternHits.nonOptimalSignals >= Math.max(2, Math.ceil(total * 0.35)),
    },
  ];

  return {
    logicMasteryScore,
    complexityUnderstandingScore,
    codeQualityScore,
    interviewConfidenceScore,
    interviewReadinessPercent,
    weakestArea,
    strength,
    recommendedFocus,
    patternDetections,
  };
}

async function buildReview(submission) {
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
  const timeComplexity = estimateTimeComplexity(code);
  const spaceComplexity = estimateSpaceComplexity(code);

  const historicalSubmissions = await CodeSubmission.find({ userId: submission.userId })
    .sort({ createdAt: -1 })
    .limit(30);

  const interviewReadinessEngine = buildInterviewReadinessEngine(
    submission,
    historicalSubmissions,
    {
      logicIssues,
      overallScore,
      timeComplexity,
      hasComments,
    }
  );

  return {
    submissionId: submission._id,
    overallScore,
    timeComplexity,
    spaceComplexity,
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
    interviewReadinessEngine,
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

    const review = await buildReview(submission);

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

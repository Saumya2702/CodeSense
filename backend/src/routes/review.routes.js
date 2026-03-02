import express from "express";
import mongoose from "mongoose";
import CodeSubmission from "../models/codesubmission.js";

const router = express.Router();

// router.get("/:submissionId", async (req, res) => {
//   const mockReview = {
//     overallScore: 75,
//     timeComplexity: "O(n log n)",
//     spaceComplexity: "O(n)",
//     logicIssues: [
//       "Edge case not handled for empty input",
//       "Loop condition may cause off-by-one error"
//     ],
//     securityIssues: [
//       "No input validation"
//     ],
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

function buildInterviewReadinessEngine(
  submission,
  historicalSubmissions,
  reviewContext
) {
  const total = historicalSubmissions.length || 1;
  const patternHits = countPatternHits(historicalSubmissions);

  
  const SCORING_CONFIG = {
    logic: {
      base: 90,
      issuePenalty: 12,
      offByOnePenalty: 3,
      offByOneCap: 15,
      minScore: 35,
    },
    complexity: {
      base: 88,
      nSquarePenalty: 18,
      defaultPenalty: 6,
      nonOptimalPenalty: 2,
      nonOptimalCap: 14,
      minScore: 30,
    },
    quality: {
      base: 92,
      namingPenalty: 5,
      namingCap: 25,
      noCommentPenalty: 8,
      minScore: 40,
    },
    weights: {
      logic: 0.35,
      complexity: 0.3,
      quality: 0.2,
      overall: 0.15,
    },
    weaknessThreshold: 65,
  };

  
  const logicMasteryScore = Math.max(
    SCORING_CONFIG.logic.minScore,
    SCORING_CONFIG.logic.base -
      reviewContext.logicIssues.length *
        SCORING_CONFIG.logic.issuePenalty -
      Math.min(
        patternHits.offByOneHits *
          SCORING_CONFIG.logic.offByOnePenalty,
        SCORING_CONFIG.logic.offByOneCap
      )
  );


  const complexityPenalty =
    reviewContext.timeComplexity?.includes("n²")
      ? SCORING_CONFIG.complexity.nSquarePenalty
      : SCORING_CONFIG.complexity.defaultPenalty;

  const complexityUnderstandingScore = Math.max(
    SCORING_CONFIG.complexity.minScore,
    SCORING_CONFIG.complexity.base -
      complexityPenalty -
      Math.min(
        patternHits.nonOptimalSignals *
          SCORING_CONFIG.complexity.nonOptimalPenalty,
        SCORING_CONFIG.complexity.nonOptimalCap
      )
  );

  
  const codeQualityScore = Math.max(
    SCORING_CONFIG.quality.minScore,
    SCORING_CONFIG.quality.base -
      Math.min(
        patternHits.poorNamingHits *
          SCORING_CONFIG.quality.namingPenalty,
        SCORING_CONFIG.quality.namingCap
      ) -
      (reviewContext.hasComments
        ? 0
        : SCORING_CONFIG.quality.noCommentPenalty)
  );

 
  const interviewConfidenceScore = Math.round(
    logicMasteryScore * SCORING_CONFIG.weights.logic +
      complexityUnderstandingScore *
        SCORING_CONFIG.weights.complexity +
      codeQualityScore * SCORING_CONFIG.weights.quality +
      reviewContext.overallScore *
        SCORING_CONFIG.weights.overall
  );

  let interviewReadinessPercent = interviewConfidenceScore;

if (logicMasteryScore < 65) {
  interviewReadinessPercent -= 5;
}

if (complexityUnderstandingScore < 65) {
  interviewReadinessPercent -= 7; 
}

if (codeQualityScore < 60) {
  interviewReadinessPercent -= 5;
}



interviewReadinessPercent = Math.max(0, interviewReadinessPercent);

const classification =
  interviewReadinessPercent >= 85
    ? "Strong – Interview Ready"
    : interviewReadinessPercent >= 70
    ? "Developing – Minor Gaps Identified"
    : interviewReadinessPercent >= 55
    ? "Needs Improvement Before Screening"
    : "Not Ready for Technical Evaluation";


  const weakestMap = {
    logic: logicMasteryScore,
    complexity: complexityUnderstandingScore,
    quality: codeQualityScore,
    confidence: interviewConfidenceScore,
  };

  

const sortedAreas = Object.entries(weakestMap).sort(
  (a, b) => a[1] - b[1]
);

const lowest = sortedAreas[0];
const secondLowest = sortedAreas[1];

const scoreGap = secondLowest[1] - lowest[1];

const WEAKNESS_THRESHOLD = SCORING_CONFIG.weaknessThreshold || 65;


const weakestAreaKey =
  lowest[1] < WEAKNESS_THRESHOLD && scoreGap > 5
    ? lowest[0]
    : null;


const capabilityMap = {
  logic: {
    label: "Logical Reasoning Capability",
    note:
      "Demonstrates inconsistency in conditional flow handling and edge case coverage.",
  },
  complexity: {
    label: "Algorithmic Optimization Capability",
    note:
      "Solution efficiency does not consistently meet optimal complexity expectations.",
  },
  quality: {
    label: "Code Maintainability & Structure",
    note:
      "Improvements required in modularity, naming clarity, and structural organization.",
  },
  confidence: {
    label: "Technical Communication Readiness",
    note:
      "Requires improvement in articulating implementation decisions under interview conditions.",
  },
};

const weakestArea = weakestAreaKey
  ? {
      category: weakestAreaKey,
      capability: capabilityMap[weakestAreaKey].label,
      developmentNote: capabilityMap[weakestAreaKey].note,
      score: weakestMap[weakestAreaKey],
    }
  : null;

const overallAssessment =
  weakestArea === null
    ? "Performance across core engineering evaluation dimensions remains within acceptable variance thresholds."
    : null;
  
  const strongestAreaKey = Object.entries(weakestMap).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  const strengthMap = {
    logic: "Strong Logical Structuring",
    complexity: "Efficient Problem Solving",
    quality: "Clean Code Structure",
    confidence: "Strong Interview Readiness",
  };

  const strength = strengthMap[strongestAreaKey];

  
  const focusMap = {
    logic: "Practice edge-case-heavy problems and conditional flow tracing.",
    complexity:
      "Work on optimizing brute-force solutions using HashMaps, Sliding Window, or DP.",
    quality:
      "Improve naming, modularity, and clean code structuring principles.",
    confidence:
      "Practice explaining solutions verbally in mock interview settings.",
  };

  const recommendedFocus =
    weakestAreaKey
      ? focusMap[weakestAreaKey]
      : "Advance to medium-hard problems and timed mock interviews.";

  
  const calculateSeverity = (hits) => {
    const ratio = hits / total;
    if (ratio > 0.6) return "high";
    if (ratio > 0.35) return "moderate";
    if (ratio > 0.2) return "low";
    return null;
  };

  const patternDetections = [
    {
      label: "Repeated off-by-one errors",
      severity: calculateSeverity(patternHits.offByOneHits),
    },
    {
      label: "Missing null checks",
      severity: calculateSeverity(patternHits.nullCheckMisses),
    },
    {
      label: "Poor variable naming habits",
      severity: calculateSeverity(patternHits.poorNamingHits),
    },
    {
      label: "Avoiding optimal solutions",
      severity: calculateSeverity(patternHits.nonOptimalSignals),
    },
  ].filter((pattern) => pattern.severity !== null);

 
  return {
  logicMasteryScore,
  complexityUnderstandingScore,
  codeQualityScore,
  interviewConfidenceScore,
  interviewReadinessPercent,
  classification,   
  weakestArea,
  overallAssessment,
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
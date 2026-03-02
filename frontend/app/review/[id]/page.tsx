"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { buildApiUrl } from "@/lib/api";

// -----------------------------
// Pattern Detection (Severity-Based)
// -----------------------------
type PatternItem = {
  label: string;
  severity: "low" | "moderate" | "high";
};

type WeakestArea = {
  category: "logic" | "complexity" | "quality" | "confidence";
  capability: string;
  developmentNote: string;
  score: number;
};


type ReadinessEngine = {
  logicMasteryScore: number;
  complexityUnderstandingScore: number;
  codeQualityScore: number;
  interviewConfidenceScore: number;
  interviewReadinessPercent: number;

  weakestArea: WeakestArea | null;
  overallAssessment: string | null;

  strength: string;
  recommendedFocus: string;
  patternDetections: PatternItem[];
};


type ReviewData = {
  overallScore: number;
  timeComplexity: string;
  spaceComplexity: string;
  logicIssues: string[];
  securityIssues: string[];
  interviewerFeedback: string;
  suggestedImprovements: string[];
  interviewReadinessEngine?: ReadinessEngine;
};

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(buildApiUrl(`/api/review/${params.id}`))
      .then((res) => res.json())
      .then((payload) => {
        if (!payload?.success) {
          throw new Error(payload?.error || "Review not found");
        }
        setReview(payload.data);
      })
      .catch((err) => setError(err.message || "Failed to load review"));
  }, [params?.id]);

  const engine = review?.interviewReadinessEngine;

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <h2 className="text-3xl font-extrabold">🧠 Review Insights</h2>

        {!review && !error && (
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            Loading review...
          </p>
        )}

        {error && <p className="mt-3 text-red-600">{error}</p>}

        {review && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* Core Metrics */}
            <article className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70">
              <p className="text-sm text-zinc-500">Overall Score</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-600">
                {review.overallScore}
              </p>
            </article>

            <article className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70">
              <p className="text-sm text-zinc-500">Time Complexity</p>
              <p className="mt-2 font-semibold">{review.timeComplexity}</p>
            </article>

            <article className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70">
              <p className="text-sm text-zinc-500">Space Complexity</p>
              <p className="mt-2 font-semibold">{review.spaceComplexity}</p>
            </article>

            {/* Interview Readiness Engine */}
            {engine && (
              <section className="rounded-2xl border border-violet-200 bg-violet-50/80 p-6 shadow-lg dark:border-violet-900 dark:bg-violet-950/30 md:col-span-3">
                <h3 className="text-xl font-bold">Interview Readiness Evaluation</h3>

                {/* Score Grid */}
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <p><span className="font-semibold">Logic:</span> {engine.logicMasteryScore}%</p>
                  <p><span className="font-semibold">Complexity:</span> {engine.complexityUnderstandingScore}%</p>
                  <p><span className="font-semibold">Quality:</span> {engine.codeQualityScore}%</p>
                  <p><span className="font-semibold">Confidence:</span> {engine.interviewConfidenceScore}%</p>
                </div>

                {/* Readiness */}
                <div className="mt-4">
                  <p className="text-lg font-bold">
                    Interview Readiness: {engine.interviewReadinessPercent}%
                  </p>
                </div>

                {/*Weakness Analysis */}
                <div className="mt-6">
                {engine.weakestArea ? (
                <div className="rounded-lg border bg-red-50 p-4 space-y-2 text-gray-800">
  <h3 className="font-semibold text-red-700">
    Primary Development Area
  </h3>

  <div className="text-sm">
    <p>
      <span className="font-medium text-gray-900">Capability:</span>{" "}
      {engine.weakestArea.capability}
    </p>

    <p>
      <span className="font-medium text-gray-900">Score:</span>{" "}
      {engine.weakestArea.score}
    </p>
  </div>

  <p className="text-sm text-gray-700">
    {engine.weakestArea.developmentNote}
  </p>
</div>
                ) : (
              <div className="rounded-lg border bg-green-50 p-4">
              <p className="font-semibold text-green-700">
              No Critical Development Areas Identified
              </p>
              <p className="mt-2 text-sm text-gray-700">
              {engine.overallAssessment}
              </p>
            </div>
            )}
            </div>

                {/* Strength & Focus */}
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <p>
                    <span className="font-semibold">Strength:</span>{" "}
                    {engine.strength}
                  </p>
                  <p>
                    <span className="font-semibold">Recommended Focus:</span>{" "}
                    {engine.recommendedFocus}
                  </p>
                </div>

                {/* Pattern Detection */}
                <div className="mt-6">
                  <h4 className="font-bold">Pattern Detection</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    {engine.patternDetections.map((pattern, idx) => (
                      <li key={idx}>
                        {pattern.label}:{" "}
                        <span
                          className={
                            pattern.severity === "high"
                              ? "text-red-600 font-semibold"
                              : pattern.severity === "moderate"
                              ? "text-yellow-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {pattern.severity.toUpperCase()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Logic Issues */}
            <section className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70 md:col-span-2">
              <h4 className="font-bold">Logic Issues</h4>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {review.logicIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </section>

            {/* Security Issues */}
            <section className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70">
              <h4 className="font-bold">Security Issues</h4>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {review.securityIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </section>

            {/* Interviewer Feedback */}
            <section className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70 md:col-span-3">
              <h4 className="font-bold">Interviewer Feedback</h4>
              <p className="mt-2">{review.interviewerFeedback}</p>
            </section>

            {/* Suggested Improvements */}
            <section className="rounded-2xl border bg-white/80 p-5 shadow-lg dark:bg-zinc-900/70 md:col-span-3">
              <h4 className="font-bold">Suggested Improvements</h4>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {review.suggestedImprovements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
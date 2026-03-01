"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { buildApiUrl } from "@/lib/api";

type PatternItem = {
  label: string;
  detected: boolean;
};

type ReadinessEngine = {
  logicMasteryScore: number;
  complexityUnderstandingScore: number;
  codeQualityScore: number;
  interviewConfidenceScore: number;
  interviewReadinessPercent: number;
  weakestArea: string;
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

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <h2 className="animate-fade-up text-3xl font-extrabold">🧠 Review Insights</h2>

        {!review && !error && <p className="mt-3 text-zinc-600 dark:text-zinc-300">Loading review...</p>}
        {error && <p className="mt-3 text-red-600">{error}</p>}

        {review && (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65">
              <p className="text-sm text-zinc-500 dark:text-zinc-300">Overall Score</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-300">{review.overallScore}</p>
            </article>
            <article className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65">
              <p className="text-sm text-zinc-500 dark:text-zinc-300">Time Complexity</p>
              <p className="mt-2 font-semibold">{review.timeComplexity}</p>
            </article>
            <article className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65">
              <p className="text-sm text-zinc-500 dark:text-zinc-300">Space Complexity</p>
              <p className="mt-2 font-semibold">{review.spaceComplexity}</p>
            </article>

            {review.interviewReadinessEngine && (
              <section className="rounded-2xl border border-violet-200 bg-violet-50/80 p-5 shadow-lg dark:border-violet-900 dark:bg-violet-950/30 md:col-span-3">
                <h3 className="text-xl font-bold">Interview Readiness Engine</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-4">
                  <p><span className="font-semibold">Logic Mastery:</span> {review.interviewReadinessEngine.logicMasteryScore}%</p>
                  <p><span className="font-semibold">Complexity Understanding:</span> {review.interviewReadinessEngine.complexityUnderstandingScore}%</p>
                  <p><span className="font-semibold">Code Quality:</span> {review.interviewReadinessEngine.codeQualityScore}%</p>
                  <p><span className="font-semibold">Interview Confidence:</span> {review.interviewReadinessEngine.interviewConfidenceScore}%</p>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <p><span className="font-semibold">Interview Readiness:</span> {review.interviewReadinessEngine.interviewReadinessPercent}%</p>
                  <p><span className="font-semibold">Weakest Area:</span> {review.interviewReadinessEngine.weakestArea}</p>
                  <p><span className="font-semibold">Strength:</span> {review.interviewReadinessEngine.strength}</p>
                  <p><span className="font-semibold">Recommended Focus:</span> {review.interviewReadinessEngine.recommendedFocus}</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold">🔥 Pattern Detection Engine</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700 dark:text-zinc-200">
                    {review.interviewReadinessEngine.patternDetections.map((pattern, idx) => (
                      <li key={idx}>
                        {pattern.label}: {pattern.detected ? "Detected" : "Not detected"}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65 md:col-span-2">
              <h4 className="font-bold">Logic Issues</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700 dark:text-zinc-200">
                {review.logicIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65">
              <h4 className="font-bold">Security Issues</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700 dark:text-zinc-200">
                {review.securityIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65 md:col-span-3">
              <h4 className="font-bold">Interviewer Feedback</h4>
              <p className="mt-2 text-zinc-700 dark:text-zinc-200">{review.interviewerFeedback}</p>
            </section>

            <section className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-900/65 md:col-span-3">
              <h4 className="font-bold">Suggested Improvements</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700 dark:text-zinc-200">
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

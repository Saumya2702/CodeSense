"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { buildApiUrl } from "@/lib/api";

type ReviewData = {
  overallScore: number;
  timeComplexity: string;
  spaceComplexity: string;
  logicIssues: string[];
  securityIssues: string[];
  interviewerFeedback: string;
  suggestedImprovements: string[];
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
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="text-2xl font-semibold">🧠 Code Review</h2>

        {!review && !error && <p className="mt-3">Loading review...</p>}
        {error && <p className="mt-3 text-red-600">{error}</p>}

        {review && (
          <div className="mt-4 space-y-3">
            <p><b>Score:</b> {review.overallScore}</p>
            <p><b>Time Complexity:</b> {review.timeComplexity}</p>
            <p><b>Space Complexity:</b> {review.spaceComplexity}</p>

            <section>
              <h4 className="font-semibold">Logic Issues</h4>
              <ul className="list-inside list-disc">
                {review.logicIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
              </ul>
            </section>

            <section>
              <h4 className="font-semibold">Security Issues</h4>
              <ul className="list-inside list-disc">
                {review.securityIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
              </ul>
            </section>

            <section>
              <h4 className="font-semibold">Interviewer Feedback</h4>
              <p>{review.interviewerFeedback}</p>
            </section>

            <section>
              <h4 className="font-semibold">Suggested Improvements</h4>
              <ul className="list-inside list-disc">
                {review.suggestedImprovements.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

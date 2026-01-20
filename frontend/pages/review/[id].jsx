import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/review/${id}`)
      .then(res => res.json())
      .then(data => setReview(data));
  }, [id]);

  if (!review) return <p>Loading review...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>🧠 Code Review</h2>

      <p><b>Score:</b> {review.overallScore}</p>
      <p><b>Time Complexity:</b> {review.timeComplexity}</p>
      <p><b>Space Complexity:</b> {review.spaceComplexity}</p>

      <h4>Logic Issues</h4>
      <ul>
        {review.logicIssues.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>

      <h4>Security Issues</h4>
      <ul>
        {review.securityIssues.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>

      <h4>Interviewer Feedback</h4>
      <p>{review.interviewerFeedback}</p>

      <h4>Suggested Improvements</h4>
      <ul>
        {review.suggestedImprovements.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

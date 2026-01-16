import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // This runs ONLY in browser
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/code/history/${userId}`)
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Code Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Language</th>
              <th>Submitted At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub._id}>
                <td>{sub.language}</td>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                <td>Submitted</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

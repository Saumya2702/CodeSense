import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/code/history/${userId}`)
      .then(res => res.json())
      .then(response => {
        // supports both: [] OR { data: [] }
        const data = Array.isArray(response)
          ? response
          : response.data ?? [];

        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load submissions");
        setLoading(false);
      });
  }, [userId]);

  // Sort newest first (defensive)
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={{ padding: "24px" }}>
      <h2>📜 Your Code Submissions</h2>

      {loading && <p>Loading submissions...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && sortedSubmissions.length === 0 && (
        <p>No submissions yet.</p>
      )}

      {!loading && !error && sortedSubmissions.length > 0 && (
        <table
          border="1"
          cellPadding="10"
          style={{
            marginTop: "16px",
            borderCollapse: "collapse",
            width: "100%"
          }}
        >
          <thead>
            <tr>
              <th>Language</th>
              <th>Submitted At</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sortedSubmissions.map(sub => (
              <tr key={sub._id}>
                <td>{sub.language.toUpperCase()}</td>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                <td style={{ color: "green", fontWeight: "bold" }}>
                  Submitted
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

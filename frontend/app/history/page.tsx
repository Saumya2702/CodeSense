"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { buildApiUrl } from "@/lib/api";

type Submission = {
  _id: string;
  language: string;
  createdAt: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "demo-user";

    setLoading(true);
    setError(null);

    fetch(buildApiUrl(`/api/code/history/${userId}`))
      .then((res) => res.json())
      .then((response) => {
        const data = response?.data ?? [];
        setSubmissions(data);
      })
      .catch(() => setError("Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...submissions].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="text-2xl font-semibold">📜 Your Code Submissions</h2>

        {loading && <p className="mt-3">Loading submissions...</p>}
        {error && <p className="mt-3 text-red-600">{error}</p>}

        {!loading && !error && sorted.length === 0 && <p className="mt-3">No submissions yet.</p>}

        {!loading && !error && sorted.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border text-left">
              <thead>
                <tr>
                  <th className="border p-2">Language</th>
                  <th className="border p-2">Submitted At</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((sub) => (
                  <tr key={sub._id}>
                    <td className="border p-2">{sub.language.toUpperCase()}</td>
                    <td className="border p-2">{new Date(sub.createdAt).toLocaleString()}</td>
                    <td className="border p-2">
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => router.push(`/review/${sub._id}`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

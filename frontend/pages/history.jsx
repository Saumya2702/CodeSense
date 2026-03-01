import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { buildApiUrl } from "@/lib/api";

export default function HistoryPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <section className="animate-fade-up rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/65">
          <h2 className="text-2xl font-bold">📜 Your Submissions</h2>

          {loading && <p className="mt-3 text-zinc-600 dark:text-zinc-300">Loading submissions...</p>}
          {error && <p className="mt-3 text-red-600">{error}</p>}

          {!loading && !error && sorted.length === 0 && (
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">No submissions yet.</p>
          )}

          {!loading && !error && sorted.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
              <table className="w-full border-collapse text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/70">
                  <tr>
                    <th className="p-3">Language</th>
                    <th className="p-3">Submitted At</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((sub) => (
                    <tr key={sub._id} className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="p-3 font-medium">{sub.language.toUpperCase()}</td>
                      <td className="p-3 text-sm text-zinc-600 dark:text-zinc-300">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <button
                          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
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
        </section>
      </main>
    </div>
  );
}

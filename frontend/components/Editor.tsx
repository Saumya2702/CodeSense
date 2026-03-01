"use client";

import { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "@/lib/api";

const LANGUAGE_OPTIONS = ["c", "cpp", "java", "python", "javascript"];

export default function Editor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("function solve() {\n  // write your solution\n}\n");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState("demo-user");

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) setUserId(stored);
  }, []);

  const stats = useMemo(() => {
    const lines = code.trim() ? code.split("\n").length : 0;
    const chars = code.length;
    return { lines, chars };
  }, [code]);

  const submitCode = async () => {
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(buildApiUrl("/api/code/submit"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, language, code }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to submit code");
      }

      setStatus(`Submitted successfully. Submission ID: ${payload.data._id}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-up rounded-2xl border border-white/40 bg-white/75 p-5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/65">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="language" className="font-semibold text-zinc-800 dark:text-zinc-100">
            Language
          </label>
          <select
            id="language"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 transition focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <p className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {stats.lines} lines • {stats.chars} chars
        </p>
      </div>

      <textarea
        className="mt-4 min-h-[360px] w-full rounded-xl border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 shadow-inner transition focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={submitCode}
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit for Review"}
        </button>

        {submitting && (
          <span className="text-sm text-zinc-500 dark:text-zinc-300">
            Analyzing your submission...
          </span>
        )}
      </div>

      {status && (
        <p className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          {status}
        </p>
      )}
    </div>
  );
}

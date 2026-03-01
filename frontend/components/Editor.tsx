"use client";

import { useEffect, useState } from "react";
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
    <div className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <label htmlFor="language" className="font-medium">
          Language
        </label>
        <select
          id="language"
          className="rounded border px-3 py-2"
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

      <textarea
        className="min-h-[320px] rounded border p-3 font-mono text-sm"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={submitCode}
        disabled={submitting}
        className="w-fit rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit for Review"}
      </button>

      {status && <p className="text-sm text-zinc-700">{status}</p>}
    </div>
  );
}

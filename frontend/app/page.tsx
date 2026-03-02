import Link from "next/link";
import Navbar from "@/components/Navbar";

const highlights = [
  {
    title: "Deep Code Reviews",
    description: "Get structured logic, complexity, and security feedback in one place.",
  },
  {
    title: "Interview Signals",
    description: "See what interviewers might flag before your real interview does.",
  },
  {
    title: "Track Growth",
    description: "Review your history and observe how your coding style improves over time.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
        <section className="animate-fade-up rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            Interview Readiness Engine
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Build interview-ready coding confidence.
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-300">
            Submit your solution, get actionable feedback, and improve with each attempt.
            CodeSense helps you understand not just what to fix, but why it matters.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/submit"
              className="animate-glow rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              Start Reviewing ✨
            </Link>
            <Link
              href="/history"
              className="rounded-xl border border-zinc-300 bg-white px-5 py-3 font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              View Your History
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((item, idx) => (
            <article
              key={item.title}
              className="animate-fade-up rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/60"
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

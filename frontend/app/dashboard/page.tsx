import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <section className="animate-fade-up rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/65">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Continue improving with focused practice and review insights.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/history" className="rounded-lg border px-4 py-2 transition hover:bg-zinc-50 dark:hover:bg-zinc-800">
              Open History
            </Link>
            <Link href="/submit" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
              New Submission
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

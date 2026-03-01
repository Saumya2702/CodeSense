import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-2 text-zinc-700">
          Your high-level progress view. Use history and individual reviews to inspect details.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/history" className="rounded border px-4 py-2">
            Go to History
          </Link>
          <Link href="/submit" className="rounded bg-black px-4 py-2 text-white">
            New Submission
          </Link>
        </div>
      </main>
    </div>
  );
}

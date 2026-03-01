import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-14">
        <h1 className="text-4xl font-bold">CodeSense</h1>
        <p className="max-w-2xl text-lg text-zinc-700">
          AI-assisted code review for students and interns. Submit solutions,
          receive structured feedback, and track your growth over time.
        </p>
        <div className="flex gap-3">
          <Link href="/submit" className="rounded bg-black px-4 py-2 text-white">
            Submit Code
          </Link>
          <Link href="/history" className="rounded border px-4 py-2">
            View History
          </Link>
        </div>
      </main>
    </div>
  );
}

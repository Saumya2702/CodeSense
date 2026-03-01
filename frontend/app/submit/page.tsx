import Navbar from "@/components/Navbar";
import Editor from "@/components/Editor";

export default function SubmitPage() {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <header className="animate-fade-up mb-5">
          <h2 className="text-3xl font-extrabold">Submit Code</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Paste your latest solution, get an instant structured review, and open the report immediately after submission.
          </p>
        </header>
        <Editor />
      </main>
    </div>
  );
}

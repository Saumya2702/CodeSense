import Navbar from "@/components/Navbar";
import Editor from "@/components/Editor";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="mb-4 text-2xl font-semibold">Submit Code</h2>
        <Editor />
      </main>
    </div>
  );
}

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 border-b">
      <h1 className="font-bold text-xl">CodeSense</h1>
      <div className="flex gap-4">
        <Link href="/submit">Submit Code</Link>
        <Link href="/dashboard">Dashboard</Link>
        <UserButton />
      </div>
    </nav>
  );
}

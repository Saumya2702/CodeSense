"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">CodeSense</h1>
      <div className="flex items-center gap-4">
        <Link href="/submit">Submit Code</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/history">History</Link>
        <UserButton />
      </div>
    </nav>
  );
}

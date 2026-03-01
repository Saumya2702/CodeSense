"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/submit", label: "Submit Code" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 border-b border-white/40 bg-white/70 px-6 py-4 text-zinc-900 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
            CodeSense
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                  active
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200"
                    : "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

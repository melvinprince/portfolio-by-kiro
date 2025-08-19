"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SkipLink {
  href: string;
  label: string;
}

const skipLinks: SkipLink[] = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#footer", label: "Skip to footer" },
];

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-[100] flex gap-2 p-2 bg-background border-b border-border">
        {skipLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              "bg-primary text-primary-foreground",
              "rounded-md shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "transition-all duration-200",
              "hover:bg-primary/90"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, PlusSquare, Search, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "All Restaurants", icon: UtensilsCrossed },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/data", label: "Setup", icon: PlusSquare },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center border border-border bg-muted">
              <MapPin className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                NYC Restaurants
              </p>
              <p className="text-xs text-muted-foreground">
                Find places to eat across the city
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-border bg-muted text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-6">
        {children}
      </main>
    </div>
  );
}

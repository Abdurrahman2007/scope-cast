import { Link } from "@tanstack/react-router";
import { CircleUserRound, Gift, House, LineChart, Search } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { Button } from "./ui/button";

const navItems = [
  { to: "/" as const, label: "Home", icon: House },
  { to: "/markets" as const, label: "Markets", icon: LineChart },
  { to: "/rewards" as const, label: "Rewards", icon: Gift },
  { to: "/profile" as const, label: "Profile", icon: CircleUserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="TacPredict home">
            <BrandMark className="size-8" />
            <span className="font-[var(--font-display)] text-[1.05rem] font-bold">TacPredict</span>
          </Link>
          <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search markets" title="Search markets" asChild>
              <Link to="/markets"><Search /></Link>
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
              <p className="text-xs font-bold tabular-nums">10,000 <span className="text-muted-foreground">TAC</span></p>
            </div>
            <Button variant="outline" size="icon" aria-label="Open profile" title="Open profile" asChild>
              <Link to="/profile"><CircleUserRound /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-3 sm:px-6 md:pb-12 md:pt-6">
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex min-h-12 flex-col items-center justify-center gap-1 text-[0.64rem] font-semibold text-muted-foreground transition-colors duration-150"
                activeProps={{ className: "text-foreground [&_.nav-icon]:text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                <span className="nav-icon transition-colors group-hover:text-foreground">
                  <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
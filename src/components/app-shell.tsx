import { Link, useRouterState } from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="TacPredict home">
            <BrandMark />
            <span className="text-[1.05rem] font-extrabold">TacPredict</span>
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
            <Button variant="ghost" size="icon" aria-label="Search markets" title="Search markets">
              <Search />
            </Button>
            <div className="hidden rounded-md border border-border bg-card px-3 py-1.5 text-right sm:block">
              <p className="text-[0.65rem] font-semibold text-muted-foreground">TAC BALANCE</p>
              <p className="text-sm font-extrabold tabular-nums">10,000</p>
            </div>
            <Button variant="outline" size="icon" aria-label="Open profile" title="Open profile" asChild>
              <Link to="/profile"><CircleUserRound /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-8">
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/96 px-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex min-h-12 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold text-muted-foreground"
                aria-current={active ? "page" : undefined}
              >
                <span className={active ? "text-primary" : "transition-colors group-hover:text-foreground"}>
                  <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span className={active ? "text-foreground" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
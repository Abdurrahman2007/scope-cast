import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { memo } from "react";
import type { Market } from "@/domain/markets/types";
import { cn } from "@/lib/utils";
import { MarketIcon } from "./market-icon";

export const MarketCard = memo(function MarketCard({ market }: { market: Market }) {
  return (
    <article className="group ios-press grid h-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-b border-border bg-background py-5 sm:rounded-lg sm:border sm:bg-card sm:p-5 sm:hover:border-primary/35">
      <Link to="/markets/$marketId" params={{ marketId: market.id }} className="flex min-w-0 gap-3">
        <MarketIcon market={market} />
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase text-primary">{market.category}{market.source === "Polymarket" && <span className="rounded-full bg-positive-soft px-1.5 py-0.5 text-[0.55rem] text-positive">LIVE</span>}</span>
          <h3 className="mt-1 line-clamp-2 text-[0.98rem] font-bold leading-snug transition-colors group-hover:text-primary sm:text-base">{market.title}</h3>
        </div>
      </Link>
      <Link to="/markets/$marketId" params={{ marketId: market.id }} className="shrink-0 text-right">
        <span className="block font-[var(--font-display)] text-lg font-bold tabular-nums">{market.outcomes[0]?.probability ?? 0}%</span>
        <span className="text-[0.65rem] font-semibold text-muted-foreground">chance</span>
      </Link>

      <div className={cn("col-span-2 mt-3 grid gap-2", market.outcomes.length > 2 ? "grid-cols-3" : "grid-cols-2")}>
        {market.outcomes.slice(0, 3).map((outcome, index) => (
          <Link
            key={outcome.id}
            to="/markets/$marketId"
            params={{ marketId: market.id }}
            search={{ outcome: outcome.id }}
            className={cn(
              "flex min-h-11 items-center justify-between rounded-md border px-3 text-sm font-bold transition-all duration-150 active:scale-[0.98]",
              index === 0
                ? "border-positive/20 bg-positive-soft text-positive hover:border-positive/40"
                : "border-border bg-secondary text-secondary-foreground hover:border-foreground/20",
            )}
          >
            <span className="truncate">{outcome.label}</span>
            <span className="tabular-nums">{outcome.probability}%</span>
          </Link>
        ))}
      </div>

      <div className="col-span-2 mt-3 flex min-w-0 items-center gap-3 text-[0.68rem] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {market.closesAt}</span>
        <span className="truncate">{market.participants.toLocaleString()} predictors</span>
        <span className="ml-auto shrink-0 tabular-nums">{market.volume}</span>
      </div>
    </article>
  );
});
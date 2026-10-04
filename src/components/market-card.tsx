import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { memo } from "react";
import type { Market } from "@/domain/markets/types";
import { cn } from "@/lib/utils";
import { MarketIcon } from "./market-icon";

export const MarketCard = memo(function MarketCard({ market }: { market: Market }) {
  return (
    <article className="market-list-item group ios-press grid h-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-b border-border bg-background py-6 sm:rounded-lg sm:border sm:bg-card sm:p-5 sm:hover:border-primary/35">
      <Link to="/markets/$marketId" params={{ marketId: market.id }} className="flex min-w-0 gap-3">
        <MarketIcon market={market} />
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase text-primary">{market.category}{market.source === "Polymarket" && <span className="rounded-full bg-positive-soft px-1.5 py-0.5 text-[0.55rem] text-positive">LIVE</span>}</span>
          <h3 className="mt-1.5 line-clamp-2 text-[1.05rem] font-bold leading-snug transition-colors group-hover:text-primary sm:text-lg">{market.title}</h3>
        </div>
      </Link>
      <Link to="/markets/$marketId" params={{ marketId: market.id }} className="shrink-0 text-right">
        <span className="block font-[var(--font-display)] text-xl font-bold tabular-nums">{market.outcomes[0]?.probability ?? 0}%</span>
        <span className="text-[0.68rem] font-semibold text-muted-foreground">chance</span>
      </Link>

      <div className="col-span-2 mt-4 space-y-2.5">
        {market.outcomes.slice(0, 3).map((outcome, index) => (
          <Link
            key={outcome.id}
            to="/markets/$marketId"
            params={{ marketId: market.id }}
            search={{ outcome: outcome.id }}
            className={cn("grid min-h-12 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-md border px-3.5 text-[0.93rem] font-bold transition-all duration-150 active:scale-[0.98]", index === 0 ? "border-positive/20 bg-positive-soft text-positive hover:border-positive/40" : index === 1 ? "border-destructive/20 bg-destructive/10 text-destructive hover:border-destructive/40" : "border-border bg-secondary text-secondary-foreground hover:border-foreground/20")}
          >
            <span className="min-w-0"><span className="block truncate">{outcome.label}</span><span className={cn("mt-1 block h-0.5 w-12 rounded-full", index === 0 ? "bg-positive" : index === 1 ? "bg-destructive" : "bg-chart")} /></span>
            <span className="text-xs tabular-nums opacity-75">{(100 / Math.max(1, outcome.probability)).toFixed(2)}x</span>
            <span className="rounded-full bg-background/35 px-2.5 py-1 tabular-nums">{outcome.probability}%</span>
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
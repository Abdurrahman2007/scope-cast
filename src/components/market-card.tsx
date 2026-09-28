import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, UsersRound } from "lucide-react";
import { memo } from "react";
import type { Market } from "@/domain/markets/types";
import { cn } from "@/lib/utils";

export const MarketCard = memo(function MarketCard({ market }: { market: Market }) {
  return (
    <article className="market-card group flex h-full flex-col border-b border-border bg-card py-4 transition-colors sm:rounded-lg sm:border sm:p-4 sm:hover:border-primary/35 sm:hover:shadow-card">
      <div className="flex gap-3">
        {market.image ? (
          <img
            src={market.image}
            alt=""
            width={912}
            height={912}
            loading="lazy"
            className="size-14 shrink-0 rounded-md object-cover sm:size-16"
          />
        ) : (
          <div className="grid size-14 shrink-0 place-items-center rounded-md bg-category text-xl font-black text-category-foreground sm:size-16">
            {market.category.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[0.67rem] font-bold uppercase text-primary">{market.category}</span>
            {market.trend === "up" && <ArrowUpRight className="size-3.5 text-positive" aria-label="Trending up" />}
          </div>
          <Link
            to="/markets"
            className="line-clamp-2 text-[0.94rem] font-bold leading-snug transition-colors hover:text-primary sm:text-base"
          >
            {market.title}
          </Link>
        </div>
      </div>

      <div className={cn("mt-4 grid gap-2", market.outcomes.length > 2 ? "grid-cols-3" : "grid-cols-2")}>
        {market.outcomes.slice(0, 3).map((outcome, index) => (
          <Link
            key={outcome.id}
            to="/markets"
            className={cn(
              "flex min-h-9 items-center justify-between rounded-md border px-2.5 text-xs font-bold transition-transform active:scale-[0.98]",
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

      <div className="mt-3 flex items-center gap-3 text-[0.68rem] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {market.closesAt}</span>
        <span className="inline-flex items-center gap-1"><UsersRound className="size-3.5" /> {market.participants.toLocaleString()}</span>
        <span className="ml-auto tabular-nums">{market.volume}</span>
      </div>
    </article>
  );
});
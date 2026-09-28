import { cn } from "@/lib/utils";

export function MarketSparkline({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("relative w-full", compact ? "h-16" : "h-28")} aria-hidden="true">
      <svg className="size-full overflow-visible text-chart" viewBox="0 0 320 112" preserveAspectRatio="none">
        <defs>
          <linearGradient id={compact ? "market-fill-compact" : "market-fill"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="35" x2="320" y2="35" className="stroke-border" strokeDasharray="4 5" />
        <path d="M0 37 C28 19 58 15 88 20 C125 27 149 19 174 31 C205 46 228 54 250 73 C270 91 292 88 320 98 L320 112 L0 112 Z" fill={`url(#${compact ? "market-fill-compact" : "market-fill"})`} />
        <path d="M0 37 C28 19 58 15 88 20 C125 27 149 19 174 31 C205 46 228 54 250 73 C270 91 292 88 320 98" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="98" x2="320" y2="98" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="4 5" />
        <circle cx="320" cy="98" r="4" fill="currentColor" />
      </svg>
      {!compact && <span className="absolute right-0 top-0 rounded-sm bg-chart-label px-2 py-1 text-[0.62rem] font-bold text-chart-label-foreground">$120,000 target</span>}
    </div>
  );
}
import { cn } from "@/lib/utils";
import { memo, useId } from "react";

export const MarketSparkline = memo(function MarketSparkline({ compact = false, values }: { compact?: boolean; values?: number[] }) {
  const gradientId = useId().replaceAll(":", "");
  const width = 320;
  const height = 112;
  const safeValues = values?.filter(Number.isFinite) ?? [];
  const min = safeValues.length ? Math.min(...safeValues) : 0;
  const max = safeValues.length ? Math.max(...safeValues) : 1;
  const range = Math.max(max - min, 1);
  const points = safeValues.length > 1
    ? safeValues.map((value, index) => `${(index / (safeValues.length - 1)) * width},${10 + ((max - value) / range) * 88}`).join(" ")
    : "0,37 42,22 88,28 132,20 174,34 218,50 260,72 320,58";
  const lastPoint = points.split(" ").at(-1)?.split(",") ?? ["320", "58"];

  return (
    <div className={cn("relative w-full", compact ? "h-16" : "h-28")} role="img" aria-label={safeValues.length ? "Bitcoin price over the last 24 hours" : "Price trend unavailable"}>
      <svg className="size-full overflow-visible text-chart" viewBox="0 0 320 112" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="55" x2="320" y2="55" className="stroke-border" strokeDasharray="4 5" />
        <polygon points={`0,112 ${points} 320,112`} fill={`url(#${gradientId})`} />
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill="currentColor" />
      </svg>
    </div>
  );
});
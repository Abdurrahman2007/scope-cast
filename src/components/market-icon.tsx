import { Bot, Landmark, Newspaper, Trophy } from "lucide-react";
import type { Market } from "@/domain/markets/types";
import { cn } from "@/lib/utils";

export function MarketIcon({ market, className }: { market: Market; className?: string }) {
  const lowerTitle = market.title.toLowerCase();

  if (market.category === "Crypto") {
    const symbol = lowerTitle.includes("ethereum") ? "Ξ" : lowerTitle.includes("sol") ? "S" : "₿";
    return <span className={cn("market-icon bg-bitcoin font-[var(--font-display)] font-black text-foreground", className)} aria-label={symbol === "₿" ? "Bitcoin" : symbol === "Ξ" ? "Ethereum" : "Solana"}>{symbol}</span>;
  }

  if (market.category === "Sports") return <span className={cn("market-icon bg-sport text-sport-foreground", className)} aria-label="Sports"><Trophy /></span>;
  if (market.category === "Technology") return <span className={cn("market-icon bg-tech text-tech-foreground", className)} aria-label="Technology"><Bot /></span>;
  if (market.category === "News") return <span className={cn("market-icon bg-news text-news-foreground", className)} aria-label="News"><Newspaper /></span>;
  return <span className={cn("market-icon bg-business text-business-foreground", className)} aria-label={market.category}><Landmark /></span>;
}
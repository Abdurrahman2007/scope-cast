import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MarketCard } from "@/components/market-card";
import { categories, markets } from "@/domain/markets/demo-markets";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — TacPredict" },
      { name: "description", content: "Explore active prediction markets across crypto, sports, technology, business, and culture." },
      { property: "og:title", content: "Markets — TacPredict" },
      { property: "og:description", content: "Explore active prediction markets and make your call with TAC Points." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketsPage,
});

function MarketsPage() {
  return (
    <div className="animate-enter">
      <div className="flex items-end justify-between gap-4">
        <div><p className="section-kicker">Explore</p><h1 className="page-title">Markets</h1></div>
        <span className="text-xs font-semibold text-muted-foreground">{markets.length} live</span>
      </div>
      <label className="mt-5 flex h-11 items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring/30">
        <Search className="size-4 text-muted-foreground" />
        <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search markets" aria-label="Search markets" />
      </label>
      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {categories.map((category, index) => <button key={category} className={index === 0 ? "filter-chip-active" : "filter-chip"}>{category}</button>)}
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
        {markets.map((market) => <MarketCard key={market.id} market={market} />)}
      </div>
    </div>
  );
}
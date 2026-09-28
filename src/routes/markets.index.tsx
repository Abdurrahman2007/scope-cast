import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { MarketCard } from "@/components/market-card";
import { categories, markets } from "@/domain/markets/demo-markets";

const sortOptions = ["Trending", "Most active", "Ending soon", "New"] as const;
type SortOption = (typeof sortOptions)[number];

export const Route = createFileRoute("/markets/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search["category"] === "string" ? search["category"] : "All",
    sort: sortOptions.includes(search["sort"] as SortOption) ? (search["sort"] as SortOption) : "Trending",
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
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
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/markets/" });
  const filtered = markets.filter((market) => {
    const categoryMatches = search.category === "All" || market.category === search.category;
    const queryMatches = market.title.toLowerCase().includes(search.q.toLowerCase());
    return categoryMatches && queryMatches;
  });

  return (
    <div className="animate-enter">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0"><p className="section-kicker">Discover</p><h1 className="page-title truncate">Markets</h1></div>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">{filtered.length} live</span>
      </div>

      <label className="mt-5 flex h-11 items-center gap-2 rounded-md border border-input bg-card px-3 transition-shadow focus-within:ring-2 focus-within:ring-ring/30">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={search.q}
          onChange={(event) => navigate({ search: (previous) => ({ ...previous, q: event.target.value }), replace: true })}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search markets"
          aria-label="Search markets"
        />
        <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
      </label>

      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {categories.map((category) => (
          <Link key={category} to="/markets" search={(previous) => ({ ...previous, category })} className={search.category === category ? "filter-chip-active" : "filter-chip"}>{category}</Link>
        ))}
      </div>

      <div className="scrollbar-none -mx-4 mt-3 flex gap-5 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0">
        {sortOptions.map((sort) => (
          <Link key={sort} to="/markets" search={(previous) => ({ ...previous, sort })} className={search.sort === sort ? "market-tab-active" : "market-tab"}>{sort}</Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
          {filtered.map((market) => <MarketCard key={market.id} market={market} />)}
        </div>
      ) : (
        <div className="py-16 text-center"><p className="font-bold">No matching markets</p><p className="mt-1 text-sm text-muted-foreground">Try another search or category.</p></div>
      )}
    </div>
  );
}
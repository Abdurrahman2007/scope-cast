import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock3, Flame, Search, TrendingUp } from "lucide-react";
import { MarketCard } from "@/components/market-card";
import { Button } from "@/components/ui/button";
import { categories, markets } from "@/domain/markets/demo-markets";

const feeds = ["For you", "Trending", "Ending soon", "New"] as const;
type Feed = (typeof feeds)[number];

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({ feed: feeds.includes(search.feed as Feed) ? (search.feed as Feed) : "For you" }),
  head: () => ({ meta: [
    { title: "TacPredict — Prediction Markets" },
    { name: "description", content: "Discover prediction markets across crypto, sports, technology, news, and business. Predict with TAC Points." },
    { property: "og:title", content: "TacPredict — Prediction Markets" },
    { property: "og:description", content: "Discover markets, make predictions, and earn rewards with TAC Points." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function HomePage() {
  const { feed } = Route.useSearch();
  const featured = markets[0];
  if (!featured) return null;
  const feedMarkets = feed === "Ending soon" ? markets.slice().reverse() : feed === "New" ? markets.slice(3) : feed === "Trending" ? markets.slice(1) : markets.slice(1, 5);

  return (
    <div className="animate-enter">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0"><p className="section-kicker">10,000 TAC available</p><h1 className="page-title truncate">Prediction markets</h1></div>
        <Button variant="outline" size="icon" className="shrink-0" asChild><Link to="/markets" aria-label="Search markets"><Search /></Link></Button>
      </section>

      <div className="scrollbar-none -mx-4 mt-5 flex gap-5 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0">
        {feeds.map((item) => <Link key={item} to="/" search={{ feed: item }} className={feed === item ? "market-tab-active" : "market-tab"}>{item}</Link>)}
      </div>

      <section className="mt-4 grid overflow-hidden rounded-lg border border-border bg-card shadow-card md:grid-cols-[1.15fr_0.85fr]">
        <Link to="/markets/$marketId" params={{ marketId: featured.id }} className="relative min-h-40 overflow-hidden md:min-h-64">
          <img src={featured.image} alt="Bitcoin market" width={1200} height={800} className="absolute inset-0 size-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-featured-overlay" />
          <div className="relative flex h-full min-h-40 flex-col justify-between p-4 text-featured-foreground md:min-h-64 md:p-6">
            <span className="w-fit rounded-md bg-surface-glass px-2 py-1 text-[0.65rem] font-extrabold uppercase">Featured · {featured.category}</span>
            <h2 className="max-w-lg text-xl font-black leading-tight md:text-3xl">{featured.title}</h2>
          </div>
        </Link>
        <div className="flex flex-col justify-center border-t border-border p-4 md:border-l md:border-t-0 md:p-6">
          <p className="text-xs font-bold text-muted-foreground">CURRENT CHANCE</p>
          <p className="mt-1 text-4xl font-black tabular-nums">{featured.outcomes[0]?.probability}%</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {featured.outcomes.map((outcome, index) => (
              <Button key={outcome.id} variant={index === 0 ? "default" : "secondary"} asChild>
                <Link to="/markets/$marketId" params={{ marketId: featured.id }} search={{ outcome: outcome.id }}>{outcome.label} {outcome.probability}%</Link>
              </Button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {featured.closesAt}</span><span>{featured.volume}</span></div>
        </div>
      </section>

      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {categories.slice(0, 7).map((category, index) => <Link key={category} to="/markets" search={{ category, sort: "Trending", q: "" }} className={index === 0 ? "filter-chip-active" : "filter-chip"}>{category}</Link>)}
      </div>

      <MarketSection title={feed} markets={feedMarkets} />

      <section className="mt-8 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-streak-soft text-streak"><Flame className="size-5" /></div>
        <div className="min-w-0"><p className="truncate font-extrabold">4-day check-in streak</p><p className="truncate text-sm text-muted-foreground">Claim 100 TAC Points today</p></div>
        <Button size="sm" className="shrink-0" asChild><Link to="/rewards">Claim</Link></Button>
      </section>
    </div>
  );
}

function MarketSection({ title, markets: sectionMarkets }: { title: string; markets: typeof markets }) {
  return (
    <section className="mt-7">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="section-title inline-flex min-w-0 items-center gap-2 truncate"><TrendingUp className="size-4 shrink-0 text-positive" />{title}</h2>
        <Link to="/markets" className="inline-flex shrink-0 items-center text-xs font-bold text-muted-foreground hover:text-foreground">See all <ChevronRight className="size-4" /></Link>
      </div>
      <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">{sectionMarkets.map((market) => <MarketCard key={market.id} market={market} />)}</div>
    </section>
  );
}
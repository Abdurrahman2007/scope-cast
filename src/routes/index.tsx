import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Clock3, Flame, Radio, Sparkles, TrendingUp } from "lucide-react";
import { MarketCard } from "@/components/market-card";
import { MarketSparkline } from "@/components/market-sparkline";
import { Button } from "@/components/ui/button";
import { categories, markets } from "@/domain/markets/demo-markets";

const feeds = ["Trending", "Live", "Upcoming", "New"] as const;
type Feed = (typeof feeds)[number];

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { feed?: Feed } =>
    feeds.includes(search["feed"] as Feed) ? { feed: search["feed"] as Feed } : {},
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
  const { feed = "Trending" } = Route.useSearch();
  const featured = markets[0];
  if (!featured) return null;
  const feedMarkets = feed === "Upcoming" ? markets.slice().reverse() : feed === "New" ? markets.slice(3) : markets.slice(1, 5);

  return (
    <div className="animate-enter">
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-2 sm:mx-0 sm:px-0">
        {feeds.map((item) => <Link key={item} to="/" search={{ feed: item }} className={feed === item ? "filter-chip-active" : "filter-chip"}>{item === "Trending" ? <Flame className="mr-1 inline size-3.5" /> : item === "Live" ? <Radio className="mr-1 inline size-3.5 text-primary" /> : item === "Upcoming" ? <CalendarDays className="mr-1 inline size-3.5" /> : <Sparkles className="mr-1 inline size-3.5" />}{item}</Link>)}
      </div>

      <section className="mt-3 rounded-lg border border-border bg-card p-4 shadow-card md:grid md:grid-cols-[1fr_0.85fr] md:gap-6 md:p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link to="/markets/$marketId" params={{ marketId: featured.id }} className="flex min-w-0 items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bitcoin text-lg font-black text-foreground">₿</span>
              <span className="min-w-0"><span className="block text-[0.65rem] font-bold uppercase text-muted-foreground">{featured.category} · Featured</span><h1 className="mt-1 text-base font-bold leading-tight sm:text-lg">{featured.title}</h1><span className="mt-1 block text-[0.68rem] text-muted-foreground">Closes in {featured.closesAt}</span></span>
            </Link>
            <span className="flex shrink-0 items-center gap-1.5 rounded-sm border border-positive/20 bg-positive-soft px-2 py-1 text-[0.62rem] font-bold text-positive"><span className="size-1.5 rounded-full bg-positive motion-safe:animate-pulse" /> LIVE</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div><p className="text-[0.62rem] font-bold uppercase text-muted-foreground">Market target</p><p className="mt-1 text-lg font-bold tabular-nums">$120,000</p></div>
            <div className="text-right"><p className="text-[0.62rem] font-bold uppercase text-chart">Current chance</p><p className="mt-1 text-lg font-bold text-chart tabular-nums">{featured.outcomes[0]?.probability}% <span className="text-xs text-positive">↑ 3%</span></p></div>
          </div>
          <div className="mt-4"><MarketSparkline /></div>
        </div>
        <div className="mt-4 flex flex-col justify-end border-t border-border pt-4 md:mt-0 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="grid grid-cols-2 gap-2">
            {featured.outcomes.map((outcome, index) => (
              <Button key={outcome.id} variant={index === 0 ? "default" : "secondary"} className="h-11 justify-between" asChild>
                <Link to="/markets/$marketId" params={{ marketId: featured.id }} search={{ outcome: outcome.id }}>{outcome.label} {outcome.probability}%</Link>
              </Button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[0.68rem] font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {featured.participants.toLocaleString()} predictors</span><span>{featured.volume}</span></div>
        </div>
      </section>

      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {categories.slice(0, 7).map((category, index) => <Link key={category} to="/markets" search={{ category, sort: "Trending", q: "" }} className={index === 0 ? "filter-chip-active" : "filter-chip"}>{category}</Link>)}
      </div>

      <MarketSection title={feed} markets={feedMarkets} />

      <section className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-4">
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
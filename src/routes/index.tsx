import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Activity, CalendarDays, ChevronRight, Clock3, Flame, Radio, Sparkles, TrendingUp } from "lucide-react";
import { MarketCard } from "@/components/market-card";
import { MarketSparkline } from "@/components/market-sparkline";
import { Button } from "@/components/ui/button";
import { categories, markets } from "@/domain/markets/demo-markets";
import { cryptoMarketQueryOptions } from "@/lib/market-data.functions";
import { polymarketFeedQueryOptions } from "@/lib/polymarket.functions";

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
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(cryptoMarketQueryOptions),
    context.queryClient.ensureQueryData(polymarketFeedQueryOptions),
  ]),
  errorComponent: ({ error }) => <div role="alert" className="py-16 text-center"><h1 className="page-title">Markets unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p></div>,
  notFoundComponent: () => <div className="py-16 text-center">No markets found.</div>,
  component: HomePage,
});

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const compactUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

function HomePage() {
  const { feed = "Trending" } = Route.useSearch();
  const { data: crypto } = useSuspenseQuery(cryptoMarketQueryOptions);
  const { data: polymarket } = useSuspenseQuery(polymarketFeedQueryOptions);
  const featured = markets[0];
  if (!featured) return null;
  const feedMarkets = useMemo(() => {
    const liveMarkets = polymarket.markets.length > 0 ? polymarket.markets : markets.slice(1);
    return feed === "Upcoming" ? liveMarkets.slice().reverse().slice(0, 9) : feed === "New" ? liveMarkets.slice(-9).reverse() : liveMarkets.slice(0, 9);
  }, [feed, polymarket.markets]);

  return (
    <div className="animate-enter">
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-2.5 sm:mx-0 sm:px-0">
        {feeds.map((item) => <Link key={item} to="/" search={{ feed: item }} className={feed === item ? "filter-chip-active" : "filter-chip"}>{item === "Trending" ? <Flame className="mr-1 inline size-3.5" /> : item === "Live" ? <Radio className="mr-1 inline size-3.5 text-primary" /> : item === "Upcoming" ? <CalendarDays className="mr-1 inline size-3.5" /> : <Sparkles className="mr-1 inline size-3.5" />}{item}</Link>)}
      </div>

      <section className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card md:grid md:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b border-border px-5 py-4 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase text-muted-foreground"><Activity className="size-3.5 text-positive" /> Live crypto event</p>
            <p className="text-[0.65rem] font-semibold text-muted-foreground">CoinGecko · updated {new Date(crypto.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <Link to="/markets/$marketId" params={{ marketId: featured.id }} className="flex min-w-0 items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-bitcoin text-xl font-black text-foreground">₿</span>
              <span className="min-w-0"><span className="block text-[0.68rem] font-bold uppercase text-muted-foreground">{featured.category} · Featured</span><h1 className="mt-1.5 text-lg font-bold leading-tight sm:text-xl">{featured.title}</h1><span className="mt-1.5 block text-xs text-muted-foreground">Closes in {featured.closesAt}</span></span>
            </Link>
            <span className="flex shrink-0 items-center gap-1.5 rounded-sm border border-positive/20 bg-positive-soft px-2 py-1 text-[0.62rem] font-bold text-positive"><span className="size-1.5 rounded-full bg-positive" /> OPEN</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div><p className="text-[0.65rem] font-bold uppercase text-muted-foreground">Bitcoin now</p><p className="mt-1 text-xl font-bold tabular-nums">{usd.format(crypto.bitcoin.price)}</p></div>
            <div className="text-right"><p className="text-[0.65rem] font-bold uppercase text-muted-foreground">24h change</p><p className={crypto.bitcoin.change24h >= 0 ? "mt-1 text-xl font-bold text-positive tabular-nums" : "mt-1 text-xl font-bold text-destructive tabular-nums"}>{crypto.bitcoin.change24h >= 0 ? "+" : ""}{crypto.bitcoin.change24h.toFixed(2)}%</p></div>
          </div>
          <div className="mt-4"><MarketSparkline values={crypto.bitcoinHistory} /></div>
          <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[0.66rem]">
            <div><span className="block text-muted-foreground">24h low</span><strong className="mt-0.5 block tabular-nums">{usd.format(crypto.bitcoin.low24h)}</strong></div>
            <div className="text-center"><span className="block text-muted-foreground">24h high</span><strong className="mt-0.5 block tabular-nums">{usd.format(crypto.bitcoin.high24h)}</strong></div>
            <div className="text-right"><span className="block text-muted-foreground">Market cap</span><strong className="mt-0.5 block tabular-nums">{compactUsd.format(crypto.bitcoin.marketCap)}</strong></div>
          </div>
        </div>
        <div className="flex flex-col justify-end border-t border-border bg-secondary/35 p-5 md:border-l md:border-t-0 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[0.62rem] font-bold uppercase text-muted-foreground">Target</p><p className="mt-1 text-xl font-black tabular-nums">$120,000</p></div><div className="text-right"><p className="text-[0.62rem] font-bold uppercase text-muted-foreground">Community odds</p><p className="mt-1 text-xl font-black text-chart tabular-nums">{featured.outcomes[0]?.probability}%</p></div></div>
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

      <section className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          { name: "Bitcoin", symbol: "BTC", value: crypto.bitcoin.price, change: crypto.bitcoin.change24h },
          { name: "Ethereum", symbol: "ETH", value: crypto.ethereum.price, change: crypto.ethereum.change24h },
          { name: "Solana", symbol: "SOL", value: crypto.solana.price, change: crypto.solana.change24h },
        ].map((asset) => <div key={asset.symbol} className="rounded-md border border-border bg-card p-4 last:col-span-2 sm:last:col-span-1"><div className="flex items-center justify-between gap-2"><span className="text-sm font-bold">{asset.symbol}</span><span className={asset.change >= 0 ? "text-xs font-bold text-positive" : "text-xs font-bold text-destructive"}>{asset.change >= 0 ? "+" : ""}{asset.change.toFixed(1)}%</span></div><p className="mt-2 font-[var(--font-display)] text-lg font-bold tabular-nums">{usd.format(asset.value)}</p><p className="mt-1 text-xs text-muted-foreground">{asset.name} · live</p></div>)}
      </section>

      <MarketSection title={feed} markets={feedMarkets} />
      <p className="mt-3 text-center text-[0.65rem] font-semibold text-muted-foreground">Market odds and volume supplied by {polymarket.source} · refreshed {new Date(polymarket.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>

      <section className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-streak-soft text-streak"><Flame className="size-5" /></div>
        <div className="min-w-0"><p className="truncate font-extrabold">4-day check-in streak</p><p className="truncate text-sm text-muted-foreground">Claim 100 TAC Points today</p></div>
        <Button size="sm" className="shrink-0" asChild><Link to="/rewards">Claim</Link></Button>
      </section>
    </div>
  );
}

function MarketSection({ title, markets: sectionMarkets }: { title: string; markets: import("@/domain/markets/types").Market[] }) {
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
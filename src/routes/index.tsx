import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CalendarDays, ChevronRight, Flame, Radio, Sparkles, TrendingUp } from "lucide-react";
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

      <SportsCarousel markets={feedMarkets} />

      <UpDownSection crypto={crypto} bitcoinHistory={crypto.bitcoinHistory} liveMarkets={polymarket.cryptoUpDown} />

      <div className="scrollbar-none -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {categories.slice(0, 7).map((category, index) => <Link key={category} to="/markets" search={{ category, sort: "Trending", q: "" }} className={index === 0 ? "filter-chip-active" : "filter-chip"}>{category}</Link>)}
      </div>

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

const multiplier = (probability: number) => `${(100 / Math.max(1, probability)).toFixed(2)}x`;

function SportsCarousel({ markets: allMarkets }: { markets: import("@/domain/markets/types").Market[] }) {
  const cards = [...allMarkets, ...markets].filter((market, index, list) => market.category === "Sports" && list.findIndex((item) => item.id === market.id) === index).slice(0, 8);
  if (cards.length === 0) return null;
  return (
    <section className="mt-7">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="section-title truncate">Top Sports Markets</h2>
        <Link to="/markets" search={{ category: "Sports", sort: "Trending", q: "" }} className="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">View All <ChevronRight className="size-4" /></Link>
      </div>
      <div className="scrollbar-none -mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {cards.map((market) => (
          <Link key={market.id} to="/markets/$marketId" params={{ marketId: market.id }} className="ios-press w-[19rem] shrink-0 snap-start rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold uppercase text-muted-foreground">{market.category}</span>
              <span className="text-xs font-semibold text-muted-foreground">{market.closesAt}</span>
            </div>
            <h3 className="mt-2 line-clamp-1 text-[0.95rem] font-bold">{market.title}</h3>
            <div className="mt-3 space-y-2.5">
              {market.outcomes.slice(0, 2).map((outcome, index) => (
                <div key={outcome.id} className="flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{outcome.label}</span>
                    <progress className={index === 0 ? "outcome-progress outcome-progress-positive mt-1" : "outcome-progress outcome-progress-negative mt-1"} value={outcome.probability} max={100} aria-label={`${outcome.label} ${outcome.probability}%`} />
                  </span>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">{multiplier(outcome.probability)}</span>
                  <span className={index === 0 ? "shrink-0 rounded-full bg-positive-soft px-3 py-1.5 text-sm font-bold tabular-nums text-positive" : "shrink-0 rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-bold tabular-nums text-destructive"}>{outcome.probability}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>{market.participants.toLocaleString()} predictors</span>
              <span className="tabular-nums">{market.volume} Vol</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function UpDownSection({ crypto, bitcoinHistory, liveMarkets }: { crypto: { bitcoin: { price: number; change24h: number }; ethereum: { price: number; change24h: number }; solana: { price: number; change24h: number } }; bitcoinHistory: number[]; liveMarkets: import("@/lib/polymarket.functions").PolymarketFeed["cryptoUpDown"] }) {
  const assets = [
    { key: "bitcoin" as const, name: "Bitcoin", symbol: "BTC", icon: "₿", iconClass: "bg-bitcoin", price: crypto.bitcoin.price },
    { key: "ethereum" as const, name: "Ethereum", symbol: "ETH", icon: "Ξ", iconClass: "bg-ethereum", price: crypto.ethereum.price },
    { key: "solana" as const, name: "Solana", symbol: "SOL", icon: "◎", iconClass: "bg-solana", price: crypto.solana.price },
  ].filter((asset) => liveMarkets[asset.key]);
  const bitcoin = assets[0];
  if (!bitcoin) return null;
  const bitcoinMarket = liveMarkets[bitcoin.key];
  if (!bitcoinMarket) return null;
  const bitcoinUp = bitcoinMarket.outcomes[0]?.probability ?? 0;
  const bitcoinDown = bitcoinMarket.outcomes[1]?.probability ?? 0;
  return (
    <section className="mt-7">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="section-title truncate">Trending Up &amp; Down</h2>
        <Link to="/markets" search={{ category: "Crypto", sort: "Trending", q: "" }} className="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">View More <ChevronRight className="size-4" /></Link>
      </div>
      <Link to="/markets/$marketId" params={{ marketId: bitcoinMarket.id }} className="ios-press mt-3 block overflow-hidden rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-bitcoin text-xl font-black text-foreground">₿</span><span className="min-w-0"><span className="block truncate text-lg font-extrabold">Bitcoin Up or Down</span><span className="mt-0.5 block text-xs font-semibold text-muted-foreground">Polymarket odds · {usd.format(crypto.bitcoin.price)}</span></span></span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-positive"><span className="size-1.5 rounded-full bg-positive" /> LIVE</span>
        </div>
        <div className="mt-5 h-24"><MarketSparkline values={bitcoinHistory} /></div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <span className="rounded-md border border-positive/20 bg-positive-soft p-3.5 text-positive"><span className="flex items-center justify-between text-sm font-extrabold"><span>Up</span><span>{bitcoinUp}%</span></span><span className="mt-2 block text-xs font-bold tabular-nums opacity-80">{multiplier(bitcoinUp)} reward</span></span>
          <span className="rounded-md border border-destructive/20 bg-destructive/10 p-3.5 text-destructive"><span className="flex items-center justify-between text-sm font-extrabold"><span>Down</span><span>{bitcoinDown}%</span></span><span className="mt-2 block text-xs font-bold tabular-nums opacity-80">{multiplier(bitcoinDown)} reward</span></span>
        </div>
      </Link>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {assets.filter((asset) => asset.key !== "bitcoin").map((asset) => {
          const market = liveMarkets[asset.key];
          if (!market) return null;
          const upProb = market.outcomes[0]?.probability ?? 0;
          const downProb = market.outcomes[1]?.probability ?? 0;
          return (
            <Link key={asset.symbol} to="/markets/$marketId" params={{ marketId: market.id }} className="ios-press block rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full text-base font-black text-foreground ${asset.iconClass}`}>{asset.icon}</span>
                  <span className="min-w-0"><span className="block truncate text-[0.95rem] font-bold">{asset.name} Up or Down</span><span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{usd.format(asset.price)} · Polymarket odds</span></span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-positive"><span className="size-1.5 rounded-full bg-positive" /> LIVE</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">Up</span>
                    <progress className="outcome-progress outcome-progress-positive mt-1" value={upProb} max={100} aria-label={`Up ${upProb}%`} />
                  </span>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">{multiplier(upProb)}</span>
                  <span className="shrink-0 rounded-full bg-positive-soft px-3 py-1.5 text-sm font-bold tabular-nums text-positive">{upProb}%</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">Down</span>
                    <progress className="outcome-progress outcome-progress-negative mt-1" value={downProb} max={100} aria-label={`Down ${downProb}%`} />
                  </span>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">{multiplier(downProb)}</span>
                  <span className="shrink-0 rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-bold tabular-nums text-destructive">{downProb}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
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
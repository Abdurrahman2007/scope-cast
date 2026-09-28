import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Clock3, Flame, Sparkles, TrendingUp } from "lucide-react";
import { MarketCard } from "@/components/market-card";
import { Button } from "@/components/ui/button";
import { categories, markets } from "@/domain/markets/demo-markets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TacPredict — Make Your Call" },
      { name: "description", content: "Discover prediction markets across crypto, sports, technology, news, and business. Predict with TAC Points." },
      { property: "og:title", content: "TacPredict — Make Your Call" },
      { property: "og:description", content: "Discover markets, make predictions, and earn rewards with TAC Points." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = markets[0];
  const trending = markets.slice(1, 4);
  const endingSoon = [markets[2], markets[4]];
  if (!featured) return null;

  return (
    <div className="animate-enter">
      <section className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Prediction markets</p>
          <h1 className="page-title max-w-lg">What will happen next?</h1>
        </div>
        <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
          <Link to="/markets">Explore all <ArrowRight /></Link>
        </Button>
      </section>

      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {categories.slice(0, 7).map((category, index) => (
          <Link key={category} to="/markets" className={index === 0 ? "filter-chip-active" : "filter-chip"}>{category}</Link>
        ))}
      </div>

      <section className="relative mt-5 min-h-[19rem] overflow-hidden rounded-lg bg-featured shadow-featured sm:min-h-[22rem]">
        <img src={featured.image} alt="Bitcoin market" width={1200} height={800} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-featured-overlay" />
        <div className="relative z-10 flex min-h-[19rem] max-w-xl flex-col justify-end p-5 sm:min-h-[22rem] sm:p-8">
          <div className="mb-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-glass px-2.5 py-1 text-[0.7rem] font-extrabold uppercase text-featured-foreground backdrop-blur-md"><Sparkles className="size-3.5 text-primary" /> Featured</span>
            <span className="rounded-md bg-surface-glass px-2.5 py-1 text-xs font-bold text-featured-foreground backdrop-blur-md">{featured.category}</span>
          </div>
          <h2 className="max-w-lg text-2xl font-black leading-tight text-featured-foreground sm:text-4xl">{featured.title}</h2>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:max-w-md">
            {featured.outcomes.map((outcome, index) => (
              <Link key={outcome.id} to="/markets" className={index === 0 ? "featured-outcome-primary" : "featured-outcome-secondary"}>
                <span>{outcome.label}</span><span className="text-lg tabular-nums">{outcome.probability}%</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-featured-muted">
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> Ends in {featured.closesAt}</span>
            <span>{featured.volume} volume</span>
          </div>
        </div>
      </section>

      <MarketSection title="Trending" icon={<TrendingUp className="size-4 text-positive" />} markets={trending} />

      <section className="mt-9 border-y border-border py-5 sm:rounded-lg sm:border sm:px-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-streak-soft text-streak"><Flame className="size-5" /></div>
          <div className="min-w-0 flex-1"><p className="font-extrabold">Keep your 4-day streak</p><p className="text-sm text-muted-foreground">Check in for 100 TAC Points</p></div>
          <Button size="sm" asChild><Link to="/rewards">Claim</Link></Button>
        </div>
      </section>

      <MarketSection title="Ending soon" icon={<Clock3 className="size-4 text-streak" />} markets={endingSoon} />

      <section className="mt-9 flex items-center justify-between border-t border-border pt-6">
        <div><p className="section-kicker">More to predict</p><h2 className="section-title">Explore every market</h2></div>
        <Button variant="outline" size="sm" asChild><Link to="/markets">Markets <ChevronRight /></Link></Button>
      </section>
    </div>
  );
}

function MarketSection({ title, icon, markets: sectionMarkets }: { title: string; icon: React.ReactNode; markets: typeof markets }) {
  return (
    <section className="mt-9">
      <div className="flex items-center justify-between">
        <h2 className="section-title inline-flex items-center gap-2">{icon}{title}</h2>
        <Link to="/markets" className="inline-flex items-center text-xs font-bold text-muted-foreground transition-colors hover:text-foreground">See all <ChevronRight className="size-4" /></Link>
      </div>
      <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">{sectionMarkets.map((market) => <MarketCard key={market.id} market={market} />)}</div>
    </section>
  );
}
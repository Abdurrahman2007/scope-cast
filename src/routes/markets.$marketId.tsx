import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock3, ExternalLink, Info, ShieldCheck, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MarketSparkline } from "@/components/market-sparkline";
import { markets } from "@/domain/markets/demo-markets";
import { cn } from "@/lib/utils";
import { MarketIcon } from "@/components/market-icon";
import { usePredictionWallet } from "@/lib/prediction-wallet";
import { polymarketFeedQueryOptions } from "@/lib/polymarket.functions";

export const Route = createFileRoute("/markets/$marketId")({
  validateSearch: (search: Record<string, unknown>): { outcome?: string } =>
    typeof search["outcome"] === "string" ? { outcome: search["outcome"] } : {},
  head: () => ({ meta: [
    { title: "Market — TacPredict" },
    { name: "description", content: "Review market odds and make a prediction using TAC Points." },
    { property: "og:title", content: "Prediction Market — TacPredict" },
    { property: "og:description", content: "Review the market and make your prediction with TAC Points." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(polymarketFeedQueryOptions),
  errorComponent: ({ error }) => <div role="alert" className="py-16 text-center"><h1 className="page-title">Market unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p></div>,
  notFoundComponent: () => <div className="py-16 text-center">Market not found.</div>,
  component: MarketDetailPage,
});

function MarketDetailPage() {
  const { marketId } = Route.useParams();
  const { outcome: initialOutcome } = Route.useSearch();
  const { data: liveFeed } = useSuspenseQuery(polymarketFeedQueryOptions);
  const market = useMemo(() => [...liveFeed.markets, ...Object.values(liveFeed.cryptoUpDown), ...markets].find((item) => item?.id === marketId), [liveFeed.markets, liveFeed.cryptoUpDown, marketId]);
  const [selectedOutcome, setSelectedOutcome] = useState(initialOutcome || market?.outcomes[0]?.id || "");
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { balance, enterMarket } = usePredictionWallet();

  if (!market) return <div className="py-16 text-center"><h1 className="page-title">Market not found</h1><Button className="mt-5" asChild><Link to="/markets">Back to markets</Link></Button></div>;
  const chosen = market.outcomes.find((outcome) => outcome.id === selectedOutcome);
  const potential = chosen ? Math.round(amount * (100 / chosen.probability)) : 0;

  return (
    <div className="animate-enter mx-auto max-w-3xl">
      <Link to="/markets" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Markets</Link>
       <article className="mt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
          <div className="min-w-0"><p className="section-kicker">{market.category}</p><h1 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">{market.title}</h1></div>
            <MarketIcon market={market} className="size-14" />
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="size-4" /> Ends in {market.closesAt}</span><span className="inline-flex items-center gap-1"><UsersRound className="size-4" /> {market.participants.toLocaleString()} predictors</span><span>{market.volume} volume</span></div>
         <p className="mt-5 text-sm leading-6 text-muted-foreground sm:text-base">{market.description}</p>
           <div className="mt-5 rounded-lg border border-border bg-card p-5 shadow-card">
           <div className="grid grid-cols-2 gap-4"><div><p className="text-[0.65rem] font-bold uppercase text-muted-foreground">Leading outcome</p><p className="mt-1 text-lg font-bold">{market.outcomes[0]?.label} {market.outcomes[0]?.probability}%</p></div><div className="text-right"><p className="text-[0.65rem] font-bold uppercase text-muted-foreground">Market volume</p><p className="mt-1 text-lg font-bold">{market.volume}</p></div></div>
           <div className="mt-3"><MarketSparkline /></div>
         </div>
      </article>

      <section className="mt-7 border-y border-border py-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3"><h2 className="section-title min-w-0">Choose an outcome</h2><span className="shrink-0 text-xs font-semibold text-muted-foreground">Current probability</span></div>
        <div className={cn("mt-3 grid gap-2", market.outcomes.length > 2 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2")}>
          {market.outcomes.map((outcome) => <Button key={outcome.id} variant={selectedOutcome === outcome.id ? "default" : "outline"} className="h-14 justify-between text-base" onClick={() => { setSelectedOutcome(outcome.id); setMessage(""); }}><span>{outcome.label}</span><span className="text-lg tabular-nums">{outcome.probability}%</span></Button>)}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3"><div><p className="text-xs font-semibold text-muted-foreground">Your balance</p><p className="mt-1 text-xl font-black tabular-nums">{balance.toLocaleString()} TAC</p></div><div className="text-right"><p className="text-xs font-semibold text-muted-foreground">Potential return</p><p className="mt-1 text-xl font-black tabular-nums">{potential.toLocaleString()} TAC</p></div></div>
        <label className="mt-5 block text-xs font-bold text-muted-foreground">PREDICTION AMOUNT</label>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring/30"><input value={amount} min={10} max={balance} step={10} onChange={(event) => { setAmount(Math.max(0, Number(event.target.value))); setMessage(""); }} type="number" className="h-12 min-w-0 bg-transparent text-lg font-bold outline-none" /><span className="shrink-0 text-xs font-bold text-muted-foreground">TAC Points</span></div>
        <div className="mt-3 grid grid-cols-4 gap-2">{[100, 500, 1000].map((value) => <Button key={value} variant="secondary" size="sm" onClick={() => { setAmount(Math.min(value, balance)); setMessage(""); }}>{value.toLocaleString()}</Button>)}<Button variant="secondary" size="sm" onClick={() => { setAmount(balance); setMessage(""); }}>Max</Button></div>
        <Button className="mt-5 h-13 w-full text-base" disabled={!selectedOutcome || amount < 10 || amount > balance || submitting} onClick={() => {
          if (!chosen || submitting) return;
          setSubmitting(true);
          const result = enterMarket({ marketId: market.id, marketTitle: market.title, outcomeId: chosen.id, outcomeLabel: chosen.label, amount, potentialReturn: potential });
          setMessage(result.ok ? `${amount.toLocaleString()} TAC entered on ${chosen.label}.` : result.message);
          setSubmitting(false);
        }}>{message.includes("entered") ? <><Check /> Entry placed</> : `Enter ${chosen?.label ?? ""}`}</Button>
        {message && <p role="status" className={cn("mt-3 text-center text-xs font-semibold", message.includes("entered") ? "text-positive" : "text-destructive")}>{message}</p>}
        <p className="mt-3 flex items-center justify-center gap-1 text-[0.68rem] text-muted-foreground"><ShieldCheck className="size-3.5" /> TAC is deducted immediately after confirmation</p>
      </section>

      <section className="mt-7 pb-4"><h2 className="section-title inline-flex items-center gap-2"><Info className="size-4" /> Resolution</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{market.resolutionCriteria}</p><a href={market.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">{market.source}<ExternalLink className="size-3.5" /></a></section>
    </div>
  );
}
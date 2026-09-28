import { createFileRoute } from "@tanstack/react-router";
import { Flame, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [
    { title: "Rewards — TacPredict" },
    { name: "description", content: "Track TAC Points, check-in streaks, tasks, and prediction rewards." },
    { property: "og:title", content: "Rewards — TacPredict" },
    { property: "og:description", content: "Earn and track TAC Points through predictions and rewards." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RewardsPage,
});

function RewardsPage() {
  return <div className="animate-enter max-w-2xl">
    <p className="section-kicker">Your progress</p><h1 className="page-title">Rewards</h1>
    <section className="mt-5 rounded-lg bg-foreground p-5 text-background shadow-card">
      <div className="flex items-start justify-between"><div><p className="text-xs font-bold opacity-65">TAC POINTS</p><p className="mt-1 text-3xl font-black tabular-nums">10,000</p></div><Gift className="size-6 text-primary" /></div>
      <p className="mt-6 text-sm font-medium opacity-70">Use points to make predictions and earn rewards.</p>
    </section>
    <section className="mt-6"><div className="flex items-center justify-between"><h2 className="section-title">Daily check-in</h2><span className="inline-flex items-center gap-1 text-sm font-bold text-streak"><Flame className="size-4" /> 4 days</span></div>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-card p-4"><div><p className="font-bold">Today’s reward</p><p className="text-sm text-muted-foreground">+100 TAC Points</p></div><Button><Sparkles /> Claim</Button></div>
    </section>
  </div>;
}
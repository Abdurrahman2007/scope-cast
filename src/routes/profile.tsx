import { createFileRoute } from "@tanstack/react-router";
import { Bell, ChevronDown, CircleUserRound, Gift, HelpCircle, History, Settings, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePredictionWallet } from "@/lib/prediction-wallet";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Profile — TacPredict" },
    { name: "description", content: "View your TAC Points balance, active predictions, history, and account settings." },
    { property: "og:title", content: "Profile — TacPredict" },
    { property: "og:description", content: "Your TacPredict account and prediction history." },
    { property: "og:type", content: "profile" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { balance, positions } = usePredictionWallet();
  const [open, setOpen] = useState<string | null>(null);
  const rows = [
    { icon: Target, label: "Active predictions", value: String(positions.filter((item) => item.status === "active").length) },
    { icon: History, label: "Prediction history", value: String(positions.length) },
    { icon: Gift, label: "Rewards", value: "" },
    { icon: Bell, label: "Notifications", value: "" },
    { icon: Settings, label: "Settings", value: "" },
    { icon: HelpCircle, label: "Help & support", value: "" },
  ];
  return <div className="animate-enter mx-auto max-w-3xl">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><div><p className="section-kicker">Account</p><h1 className="page-title">Profile</h1></div><Button variant="outline" size="icon" aria-label="Account security" onClick={() => setOpen(open === "security" ? null : "security")}><ShieldCheck /></Button></div>
    <section className="mt-5 rounded-lg border border-border bg-card p-5 shadow-card"><div className="flex items-center gap-4"><div className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary ring-1 ring-border"><CircleUserRound className="size-8" /></div><div className="min-w-0"><h2 className="truncate text-lg font-extrabold">TacPredictor</h2><p className="text-sm text-muted-foreground">Prediction member</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5"><div><p className="text-xs font-semibold text-muted-foreground">Available balance</p><p className="mt-1 text-2xl font-black tabular-nums">{balance.toLocaleString()}</p><p className="text-xs font-bold text-primary">TAC Points</p></div><div className="text-right"><p className="text-xs font-semibold text-muted-foreground">Total entries</p><p className="mt-1 text-2xl font-black tabular-nums">{positions.length}</p><p className="text-xs text-muted-foreground">Predictions</p></div></div></section>
    {open === "security" && <section className="mt-3 rounded-lg border border-positive/20 bg-positive-soft p-4 text-sm"><p className="font-bold">Account security</p><p className="mt-1 text-muted-foreground">Your prediction history stays on this device in this preview.</p></section>}
    <section className="mt-6"><h2 className="section-title">Activity</h2>{positions.length === 0 ? <div className="mt-3 rounded-lg border border-border bg-card p-5 text-center"><Target className="mx-auto size-7 text-muted-foreground"/><p className="mt-3 font-bold">No predictions yet</p><p className="mt-1 text-sm text-muted-foreground">Your entries will appear here.</p></div> : <div className="mt-3 space-y-2">{positions.slice(0, 4).map((position) => <div key={position.id} className="rounded-lg border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="line-clamp-2 font-bold">{position.marketTitle}</p><p className="mt-1 text-xs text-muted-foreground">{position.outcomeLabel} · {position.amount.toLocaleString()} TAC</p></div><span className="shrink-0 rounded-full bg-positive-soft px-2 py-1 text-[0.65rem] font-bold text-positive">ACTIVE</span></div></div>)}</div>}</section>
    <section className="mt-7"><h2 className="section-title">More</h2><div className="mt-3 overflow-hidden rounded-lg border border-border bg-card divide-y divide-border">{rows.map(({ icon: Icon, label, value }) => <div key={label}><Button variant="ghost" className="h-14 w-full justify-start rounded-none px-4 text-left" onClick={() => setOpen(open === label ? null : label)}><Icon className="size-5 text-muted-foreground" /><span className="flex-1 font-semibold">{label}</span>{value && <span className="text-sm font-bold tabular-nums">{value}</span>}<ChevronDown className={open === label ? "size-4 rotate-180 text-muted-foreground transition-transform" : "size-4 text-muted-foreground transition-transform"} /></Button>{open === label && <div className="border-t border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">{label === "Active predictions" || label === "Prediction history" ? `${positions.length} recorded prediction${positions.length === 1 ? "" : "s"} on this device.` : `${label} controls are ready for your account.`}</div>}</div>)}</div></section>
  </div>;
}
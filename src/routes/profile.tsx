import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, CircleUserRound, History, Settings, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const rows = [{ icon: Target, label: "Active predictions", value: "3" }, { icon: History, label: "Prediction history", value: "24" }, { icon: Settings, label: "Settings", value: "" }];
  return <div className="animate-enter max-w-2xl">
    <p className="section-kicker">Account</p><h1 className="page-title">Profile</h1>
    <section className="mt-5 flex items-center gap-4 border-b border-border pb-6"><div className="grid size-14 place-items-center rounded-full bg-secondary"><CircleUserRound className="size-7" /></div><div><h2 className="font-extrabold">TacPredictor</h2><p className="text-sm text-muted-foreground">10,000 TAC Points</p></div></section>
    <div className="mt-3 divide-y divide-border">{rows.map(({ icon: Icon, label, value }) => <Button key={label} variant="ghost" className="h-auto w-full justify-start rounded-none px-0 py-4 text-left"><Icon className="size-5 text-muted-foreground" /><span className="flex-1 font-semibold">{label}</span>{value && <span className="text-sm font-bold tabular-nums">{value}</span>}<ChevronRight className="size-4 text-muted-foreground" /></Button>)}</div>
  </div>;
}
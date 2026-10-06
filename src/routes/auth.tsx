import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { usePredictionWallet } from "@/lib/prediction-wallet";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — TacPredict" },
    { name: "description", content: "Sign in to TacPredict to predict with TAC Points." },
    { property: "og:title", content: "Sign in — TacPredict" },
    { property: "og:description", content: "Sign in and get 10,000 TAC Points to start predicting." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = usePredictionWallet();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) void navigate({ to: "/" }); }, [user, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setMessage("");
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) setMessage(error.message);
    else if (mode === "up") setMessage("Check your email to confirm your account.");
  };

  return (
    <div className="animate-enter mx-auto max-w-sm py-8">
      <h1 className="page-title">{mode === "in" ? "Welcome back" : "Create account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">New accounts start with 10,000 TAC Points.</p>
      <Button variant="outline" className="mt-6 h-12 w-full" onClick={async () => {
        const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
        if (result.error) setMessage("Google sign-in failed. Try again.");
      }}>Continue with Google</Button>
      <div className="my-5 text-center text-xs text-muted-foreground">or</div>
      <form onSubmit={submit} className="space-y-3">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring/30" />
        <input required type="password" minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring/30" />
        <Button type="submit" className="h-12 w-full" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}</Button>
      </form>
      {message && <p role="status" className="mt-3 text-center text-sm text-muted-foreground">{message}</p>}
      <button type="button" className="mt-5 w-full text-center text-sm font-bold text-primary" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMessage(""); }}>
        {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
      </button>
    </div>
  );
}

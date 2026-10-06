import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { loadOpenProviderMarket } from "./polymarket.functions";
import { markets as demoMarkets } from "@/domain/markets/demo-markets";

const placeSchema = z.object({
  marketId: z.string().min(1).max(100),
  outcomeId: z.string().min(1).max(120),
  amount: z.number().int().min(10).max(1_000_000),
  idempotencyKey: z.string().uuid(),
});

export const placePrediction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => placeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const market = data.marketId.startsWith("poly-")
      ? await loadOpenProviderMarket(data.marketId)
      : demoMarkets.find((item) => item.id === data.marketId) ?? null;
    if (!market) return { ok: false as const, message: "This market is closed or unavailable." };
    const outcome = market.outcomes.find((item) => item.id === data.outcomeId);
    if (!outcome) return { ok: false as const, message: "That outcome is no longer available." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("place_prediction", {
      _user_id: context.userId,
      _market_id: market.id,
      _market_title: market.title,
      _outcome_id: outcome.id,
      _outcome_label: outcome.label,
      _amount: data.amount,
      _probability: Math.max(1, outcome.probability),
      _idempotency_key: data.idempotencyKey,
    });
    if (error) {
      console.error("place_prediction failed", error);
      return { ok: false as const, message: "Could not place prediction. Please try again." };
    }
    const r = result as { ok: boolean; message?: string; balance?: number };
    return r.ok ? { ok: true as const, balance: r.balance ?? 0 } : { ok: false as const, message: r.message ?? "Prediction rejected." };
  });

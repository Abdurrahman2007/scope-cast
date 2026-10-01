import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import type { Market, MarketCategory, MarketOutcome } from "@/domain/markets/types";

type GammaMarket = {
  id?: string;
  question?: string;
  description?: string;
  outcomes?: string | string[];
  outcomePrices?: string | string[];
  endDate?: string;
  volume?: string | number;
  volume24hr?: string | number;
  liquidity?: string | number;
  active?: boolean;
  closed?: boolean;
  slug?: string;
  resolutionSource?: string;
};

export type PolymarketFeed = {
  markets: Market[];
  updatedAt: string;
  source: "Polymarket";
  error?: string;
};

const CACHE_MS = 60_000;
let cachedFeed: { value: PolymarketFeed; expiresAt: number } | undefined;
let pendingFeed: Promise<PolymarketFeed> | undefined;

function parseList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function categoryFor(title: string): MarketCategory {
  const value = title.toLowerCase();
  if (/bitcoin|btc|ethereum|eth|solana|crypto|token|coin/.test(value)) return "Crypto";
  if (/nba|nfl|mlb|nhl|football|soccer|cricket|tennis|win the|championship|league/.test(value)) return "Sports";
  if (/ai |artificial intelligence|apple|google|microsoft|openai|technology|spacex/.test(value)) return "Technology";
  if (/election|president|government|congress|minister|war|ceasefire|country/.test(value)) return "News";
  if (/price|market cap|company|fed |rate cut|gdp|recession/.test(value)) return "Business";
  if (/movie|album|award|celebrity|culture/.test(value)) return "Culture";
  return "Other";
}

function formatClose(endDate: string | undefined) {
  if (!endDate) return "TBA";
  const end = new Date(endDate);
  const milliseconds = end.getTime() - Date.now();
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "Soon";
  const hours = Math.ceil(milliseconds / 3_600_000);
  if (hours < 48) return `${hours}h`;
  const days = Math.ceil(hours / 24);
  if (days < 45) return `${days}d`;
  return end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function compact(value: string | number | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number.isFinite(amount) ? amount : 0);
}

function mapMarket(item: GammaMarket): Market | null {
  const title = item.question?.trim();
  const id = item.id?.trim();
  if (!title || !id) return null;
  const labels = parseList(item.outcomes);
  const prices = parseList(item.outcomePrices);
  const outcomes: MarketOutcome[] = labels.map((label, index) => ({
    id: `${id}-${index}`,
    label,
    probability: Math.max(0, Math.min(100, Math.round(Number(prices[index] ?? 0) * 100))),
  }));
  if (outcomes.length < 2) return null;
  const volume = Number(item.volume ?? 0);
  const sourceUrl = item.slug ? `https://polymarket.com/event/${item.slug}` : "https://polymarket.com/markets";
  return {
    id: `poly-${id}`,
    title,
    category: categoryFor(title),
    closesAt: formatClose(item.endDate),
    volume: `$${compact(volume)}`,
    participants: Math.max(1, Math.round(Number(item.liquidity ?? item.volume24hr ?? 0))),
    outcomes,
    featured: Number(item.volume24hr ?? 0) > 10_000,
    trend: "flat",
    description: item.description?.trim() || "Live market pricing and outcome data supplied by Polymarket.",
    source: "Polymarket",
    sourceUrl,
    resolutionCriteria: item.resolutionSource?.trim() || `This market resolves according to the rules and verified sources published on Polymarket.`,
  };
}

async function fetchFeed(): Promise<PolymarketFeed> {
  try {
    const response = await fetch("https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=36&order=volume24hr&ascending=false", {
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Market feed returned ${response.status}`);
    const payload = (await response.json()) as GammaMarket[];
    return { markets: payload.map(mapMarket).filter((market): market is Market => market !== null), updatedAt: new Date().toISOString(), source: "Polymarket" };
  } catch (error) {
    console.error("Polymarket feed unavailable", error);
    return { markets: [], updatedAt: new Date().toISOString(), source: "Polymarket", error: "Live markets are temporarily unavailable." };
  }
}

export const getPolymarketFeed = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cachedFeed && cachedFeed.expiresAt > now) return cachedFeed.value;
  if (pendingFeed) return pendingFeed;
  pendingFeed = fetchFeed().then((value) => {
    cachedFeed = { value, expiresAt: Date.now() + CACHE_MS };
    return value;
  }).finally(() => { pendingFeed = undefined; });
  return pendingFeed;
});

export const polymarketFeedQueryOptions = queryOptions({
  queryKey: ["polymarket-feed"],
  queryFn: () => getPolymarketFeed(),
  staleTime: CACHE_MS,
  gcTime: 10 * CACHE_MS,
  retry: 1,
  refetchOnWindowFocus: false,
});
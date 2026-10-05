import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export type CryptoMarketSnapshot = {
  bitcoin: {
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    marketCap: number;
  };
  ethereum: { price: number; change24h: number };
  solana: { price: number; change24h: number };
  bitcoinHistory: number[];
  updatedAt: string;
};

type CoinGeckoPrice = {
  usd?: number;
  usd_24h_change?: number;
  usd_24h_high?: number;
  usd_24h_low?: number;
  usd_market_cap?: number;
};

type CoinGeckoPriceResponse = Record<string, CoinGeckoPrice>;
type CoinGeckoChartResponse = { prices?: Array<[number, number]> };

const CACHE_MS = 60_000;
let cachedSnapshot: { value: CryptoMarketSnapshot; expiresAt: number } | undefined;
let pendingRequest: Promise<CryptoMarketSnapshot> | undefined;

function numeric(value: number | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

async function fetchCryptoMarketSnapshot(): Promise<CryptoMarketSnapshot> {
  const apiKey = process.env["COINGECKO_API_KEY"];
  const headers = apiKey ? { accept: "application/json", "x-cg-demo-api-key": apiKey } : { accept: "application/json" };
  const request = (url: string) => fetch(url, { headers }).then(async (response) => {
    if (response.ok || !apiKey) return response;
    return fetch(url, { headers: { accept: "application/json" } });
  });
  const [priceResponse, chartResponse] = await Promise.all([
    request("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_market_cap=true&include_24hr_change=true"),
    request("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"),
  ]);

  if (!priceResponse.ok) {
    console.error(`CoinGecko price request unavailable [${priceResponse.status}]`);
    return {
      bitcoin: { price: 0, change24h: 0, high24h: 0, low24h: 0, marketCap: 0 },
      ethereum: { price: 0, change24h: 0 },
      solana: { price: 0, change24h: 0 },
      bitcoinHistory: [],
      updatedAt: new Date().toISOString(),
    };
  }

  const prices = (await priceResponse.json()) as CoinGeckoPriceResponse;
  const chart = chartResponse.ok ? (await chartResponse.json()) as CoinGeckoChartResponse : {};
  const history = (chart.prices ?? []).map((point) => point[1]).filter(Number.isFinite);
  const btc = prices["bitcoin"] ?? {};

  return {
    bitcoin: {
      price: numeric(btc.usd),
      change24h: numeric(btc.usd_24h_change),
      high24h: history.length ? Math.max(...history) : numeric(btc.usd),
      low24h: history.length ? Math.min(...history) : numeric(btc.usd),
      marketCap: numeric(btc.usd_market_cap),
    },
    ethereum: {
      price: numeric(prices["ethereum"]?.usd),
      change24h: numeric(prices["ethereum"]?.usd_24h_change),
    },
    solana: {
      price: numeric(prices["solana"]?.usd),
      change24h: numeric(prices["solana"]?.usd_24h_change),
    },
    bitcoinHistory: history.filter((_, index) => index % 3 === 0).slice(-96),
    updatedAt: new Date().toISOString(),
  };
}

export const getCryptoMarketSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cachedSnapshot && cachedSnapshot.expiresAt > now) return cachedSnapshot.value;
  if (pendingRequest) return pendingRequest;

  pendingRequest = fetchCryptoMarketSnapshot()
    .then((value) => {
      cachedSnapshot = { value, expiresAt: Date.now() + CACHE_MS };
      return value;
    })
    .finally(() => {
      pendingRequest = undefined;
    });

  return pendingRequest;
});

export const cryptoMarketQueryOptions = queryOptions({
  queryKey: ["crypto-market-snapshot"],
  queryFn: () => getCryptoMarketSnapshot(),
  staleTime: CACHE_MS,
  gcTime: 10 * CACHE_MS,
  retry: 0,
  refetchOnWindowFocus: false,
});
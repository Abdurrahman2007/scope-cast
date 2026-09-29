import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type PredictionPosition = {
  id: string;
  marketId: string;
  marketTitle: string;
  outcomeId: string;
  outcomeLabel: string;
  amount: number;
  potentialReturn: number;
  createdAt: string;
  status: "active" | "resolved";
};

type WalletState = { balance: number; positions: PredictionPosition[]; claimedDailyReward: boolean };
type EntryInput = Omit<PredictionPosition, "id" | "createdAt" | "status">;
type EntryResult = { ok: true; position: PredictionPosition } | { ok: false; message: string };

const STORAGE_KEY = "tacpredict-wallet-v1";
const initialState: WalletState = { balance: 10_000, positions: [], claimedDailyReward: false };

type WalletContextValue = WalletState & {
  enterMarket: (input: EntryInput) => EntryResult;
  claimDailyReward: () => boolean;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function parseWallet(value: string | null): WalletState {
  if (!value) return initialState;
  try {
    const parsed = JSON.parse(value) as Partial<WalletState>;
    return {
      balance: typeof parsed.balance === "number" && parsed.balance >= 0 ? parsed.balance : initialState.balance,
      positions: Array.isArray(parsed.positions) ? parsed.positions : [],
      claimedDailyReward: parsed.claimedDailyReward === true,
    };
  } catch {
    return initialState;
  }
}

export function PredictionWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWallet(parseWallet(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  }, [ready, wallet]);

  const value = useMemo<WalletContextValue>(() => ({
    ...wallet,
    enterMarket: (input) => {
      if (!Number.isFinite(input.amount) || input.amount < 10) return { ok: false, message: "Enter at least 10 TAC." };
      if (input.amount > wallet.balance) return { ok: false, message: "You do not have enough TAC Points." };
      const position: PredictionPosition = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: "active",
      };
      setWallet((current) => ({ ...current, balance: current.balance - input.amount, positions: [position, ...current.positions] }));
      return { ok: true, position };
    },
    claimDailyReward: () => {
      if (wallet.claimedDailyReward) return false;
      setWallet((current) => ({ ...current, balance: current.balance + 100, claimedDailyReward: true }));
      return true;
    },
  }), [wallet]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function usePredictionWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("usePredictionWallet must be used inside PredictionWalletProvider");
  return context;
}
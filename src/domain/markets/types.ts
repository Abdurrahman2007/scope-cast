export type MarketCategory =
  | "Crypto"
  | "Sports"
  | "News"
  | "Technology"
  | "Business"
  | "Culture"
  | "Other";

export type MarketOutcome = {
  id: string;
  label: string;
  probability: number;
};

export type Market = {
  id: string;
  title: string;
  category: MarketCategory;
  closesAt: string;
  volume: string;
  participants: number;
  outcomes: MarketOutcome[];
  image?: string;
  featured?: boolean;
  trend?: "up" | "down" | "flat";
};
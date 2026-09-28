import featuredBitcoin from "@/assets/featured-bitcoin.jpg";
import marketAi from "@/assets/market-ai.jpg";
import marketCricket from "@/assets/market-cricket.jpg";
import type { Market } from "./types";

export const markets: Market[] = [
  {
    id: "btc-120k-december",
    title: "Will Bitcoin reach $120,000 before December?",
    category: "Crypto",
    closesAt: "2d 8h",
    volume: "2.4M TAC",
    participants: 12482,
    outcomes: [
      { id: "yes", label: "Yes", probability: 64 },
      { id: "no", label: "No", probability: 36 },
    ],
    image: featuredBitcoin,
    featured: true,
    trend: "up",
  },
  {
    id: "ai-product-2026",
    title: "Will a major AI lab release a consumer robot in 2026?",
    category: "Technology",
    closesAt: "18d",
    volume: "842K TAC",
    participants: 6381,
    outcomes: [
      { id: "yes", label: "Yes", probability: 42 },
      { id: "no", label: "No", probability: 58 },
    ],
    image: marketAi,
    trend: "up",
  },
  {
    id: "cricket-final",
    title: "Will the final be decided in the last five overs?",
    category: "Sports",
    closesAt: "6h 24m",
    volume: "610K TAC",
    participants: 4209,
    outcomes: [
      { id: "yes", label: "Yes", probability: 55 },
      { id: "no", label: "No", probability: 45 },
    ],
    image: marketCricket,
    trend: "flat",
  },
  {
    id: "eth-5k",
    title: "Will Ethereum trade above $5,000 this year?",
    category: "Crypto",
    closesAt: "24d",
    volume: "1.1M TAC",
    participants: 8952,
    outcomes: [
      { id: "yes", label: "Yes", probability: 38 },
      { id: "no", label: "No", probability: 62 },
    ],
    trend: "down",
  },
  {
    id: "rate-cut",
    title: "Will the next central bank decision cut rates?",
    category: "Business",
    closesAt: "4d 12h",
    volume: "955K TAC",
    participants: 7124,
    outcomes: [
      { id: "yes", label: "Yes", probability: 71 },
      { id: "no", label: "No", probability: 29 },
    ],
    trend: "up",
  },
  {
    id: "global-tech-event",
    title: "Which category will lead the next global tech event?",
    category: "Technology",
    closesAt: "9d",
    volume: "384K TAC",
    participants: 2901,
    outcomes: [
      { id: "ai", label: "AI", probability: 49 },
      { id: "xr", label: "XR", probability: 27 },
      { id: "robotics", label: "Robotics", probability: 24 },
    ],
    trend: "flat",
  },
];

export const categories = [
  "All",
  "Crypto",
  "Sports",
  "News",
  "Technology",
  "Business",
  "Culture",
  "Other",
] as const;
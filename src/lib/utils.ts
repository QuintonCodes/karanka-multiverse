import { clsx, type ClassValue } from "clsx";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

export const usdToZarRate = 17.71;
export const bnbToZarRate = 12987.6;

type PackagePricing = {
  zarPrice: number;
  bnbValue: number;
  tokensToSend: number;
};

type Stat = {
  id: string;
  title: string;
  number: number;
  icon: JSX.Element;
};

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format utility functions
export function formatPrice(
  price: number,
  currency: "ZAR" | "USD" = "ZAR",
  locale: string = currency === "USD" ? "en-US" : "en-ZA"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatResendTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Calculation functions
export function calculatePackagePricing(
  input: {
    usdPrice: number;
    tokenAmount: number;
  },
  usdToZarRate: number,
  bnbToZarRate: number
): PackagePricing {
  const { usdPrice, tokenAmount } = input;

  const zarPrice = parseFloat((usdPrice * usdToZarRate).toFixed(2));
  const bnbValue = parseFloat((zarPrice / bnbToZarRate).toFixed(6));
  const tokensToSend = parseFloat((tokenAmount * 1.05).toFixed(2)); // 5% bonus

  return {
    zarPrice,
    bnbValue,
    tokensToSend,
  };
}

export function calculateZarPrice(usdPrice: number): number {
  return parseFloat((usdPrice * usdToZarRate).toFixed(2));
}

export function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-green-400 border-green-400/20";
    case "pending":
      return "text-yellow-400 border-yellow-400/20";
    case "failed":
      return "text-red-400 border-red-400/20";
    default:
      return "text-[#EBEBEB]/70 border-[#EBEBEB]/20";
  }
}

export function getStatDisplay(stat: Stat): string {
  switch (stat.id) {
    case "total_profit":
      return formatPrice(stat.number, "USD");
    case "success_rate":
      return `${stat.number}%`;
    default:
      return `${stat.number}`;
  }
}

export function getChainName(chainId: number) {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 5:
      return "Goerli Testnet";
    case 56: // BSC Mainnet
      return "BSC Mainnet";
    case 97: // BSC Testnet
      return "BSC Testnet";
    case 137:
      return "Polygon Mainnet";
    case 80001:
      return "Polygon Mumbai Testnet";
    default:
      return `Chain ID ${chainId}`;
  }
}

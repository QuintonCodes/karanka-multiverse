import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function formatTime(date: Date) {
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

type TokenPackageInput = {
  usdPrice: number;
  tokenAmount: number;
};

type PackagePricing = {
  zarPrice: number;
  bnbValue: number;
  tokensToSend: number;
};

export function calculatePackagePricing(
  input: TokenPackageInput,
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

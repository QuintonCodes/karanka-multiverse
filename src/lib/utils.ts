import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const usdToZarRate = 17.71;
export const bnbToZarRate = 12987.6;

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

export function calculateZarPrice(
  usdPrice: number,
  usdToZarRate: number
): number {
  return parseFloat((usdPrice * usdToZarRate).toFixed(2));
}

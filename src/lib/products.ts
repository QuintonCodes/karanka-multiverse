import {
  bnbToZarRate,
  calculatePackagePricing,
  calculateZarPrice,
  usdToZarRate,
} from "./utils";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  zarPrice: number;
  tokens: number;
  image: string;
  isSubscription?: boolean;
  unavailable?: boolean;
};

export const products: Product[] = [
  (() => {
    const price = 100;
    const zarPrice = calculateZarPrice(price, usdToZarRate);

    return {
      id: "trading-signal-bot",
      name: "Trading Signal Bot",
      description:
        "Get real-time trading signals directly to your dashboard. Make informed trading decisions with our advanced algorithm.",
      price,
      zarPrice,
      tokens: 25,
      image: "/products/trading-bot.webp",
      isSubscription: false,
    };
  })(),
  (() => {
    const price = 25;
    const zarPrice = calculateZarPrice(price, usdToZarRate);

    return {
      id: "trading-signal-subscription",
      name: "Weekly Signal Subscription",
      description:
        "Subscribe to our weekly trading signals service. Perfect for active traders who need constant market insights.",
      price,
      zarPrice,
      tokens: 6.25,
      image: "/products/signals.webp",
      isSubscription: true,
    };
  })(),
  (() => {
    const price = 50;
    const zarPrice = calculateZarPrice(price, usdToZarRate);

    return {
      id: "drone-flight-lessons",
      name: "Monthly Drone Flight Lessons",
      description:
        "Learn to fly drones with our comprehensive monthly lessons. Perfect for beginners and intermediate pilots.",
      price,
      zarPrice,
      tokens: 12.5,
      image: "/products/drone.webp",
      unavailable: true,
    };
  })(),
  (() => {
    const price = 80;
    const zarPrice = calculateZarPrice(price, usdToZarRate);

    return {
      id: "trading-lessons",
      name: "Trading Lessons",
      description:
        "One month of comprehensive trading lessons. Learn strategies, risk management, and technical analysis from experts.",
      price,
      zarPrice,
      tokens: 20,
      image: "/products/trading-lessons.webp",
    };
  })(),
];

export type Package = {
  id: string;
  name: string;
  description: string;
  tokens: number;
  price: number; // in USD
  zarPrice: number; // in ZAR
  bnbValue?: number; // in BNB, optional for non-crypto packages
  tokensToSend?: number; // tokens sent to user, optional for non-token packages
  popular?: boolean;
  features: string[];
};

export const packages: Package[] = [
  (() => {
    const { zarPrice, bnbValue, tokensToSend } = calculatePackagePricing(
      { usdPrice: 100, tokenAmount: 500 },
      usdToZarRate,
      bnbToZarRate
    );

    return {
      id: "basic",
      name: "Basic Package",
      description: "Perfect for getting started with crypto trading",
      tokens: 500,
      price: 100,
      zarPrice,
      bnbValue,
      tokensToSend,
      features: [
        "500 Trading Tokens",
        "Access to basic trading signals",
        "Email support",
        "Basic analytics dashboard",
      ],
    };
  })(),
  (() => {
    const { zarPrice, bnbValue, tokensToSend } = calculatePackagePricing(
      { usdPrice: 180, tokenAmount: 500 },
      usdToZarRate,
      bnbToZarRate // BNB to ZAR rate
    );

    return {
      id: "pro",
      name: "Pro Package",
      description: "Advanced features for serious traders",
      tokens: 1200,
      price: 180,
      zarPrice,
      bnbValue,
      tokensToSend,
      popular: true,
      features: [
        "1,200 Trading Tokens",
        "Premium trading signals",
        "Priority support",
        "Advanced analytics",
        "Risk management tools",
        "Weekly market reports",
      ],
    };
  })(),
  (() => {
    const { zarPrice, bnbValue, tokensToSend } = calculatePackagePricing(
      { usdPrice: 300, tokenAmount: 500 },
      usdToZarRate,
      bnbToZarRate
    );
    return {
      id: "premium",
      name: "Premium Package",
      description: "Ultimate package for professional traders",
      tokens: 2500,
      price: 300,
      zarPrice,
      bnbValue,
      tokensToSend,
      features: [
        "2,500 Trading Tokens",
        "VIP trading signals",
        "24/7 priority support",
        "Professional analytics suite",
        "Custom risk profiles",
        "Daily market insights",
        "One-on-one consultation",
        "API access",
      ],
    };
  })(),
];

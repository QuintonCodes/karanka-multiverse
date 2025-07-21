import { calculatePackagePricing } from "./utils";

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
  {
    id: "trading-signal-bot",
    name: "Trading Signal Bot",
    description:
      "Get real-time trading signals directly to your dashboard. Make informed trading decisions with our advanced algorithm.",
    price: 100,
    zarPrice: 100 * 18.5,
    tokens: 25,
    image: "/placeholder.svg",
    isSubscription: false,
  },
  {
    id: "trading-signal-subscription",
    name: "Weekly Signal Subscription",
    description:
      "Subscribe to our weekly trading signals service. Perfect for active traders who need constant market insights.",
    price: 25,
    zarPrice: 25 * 18.5,
    tokens: 6.25,
    image: "/placeholder.svg",
    isSubscription: true,
  },
  {
    id: "drone-flight-lessons",
    name: "Monthly Drone Flight Lessons",
    description:
      "Learn to fly drones with our comprehensive monthly lessons. Perfect for beginners and intermediate pilots.",
    price: 50,
    zarPrice: 50 * 18.5,
    tokens: 12.5,
    image: "/placeholder.svg",
    unavailable: true,
  },
  {
    id: "trading-lessons",
    name: "Trading Lessons",
    description:
      "One month of comprehensive trading lessons. Learn strategies, risk management, and technical analysis from experts.",
    price: 80,
    zarPrice: 80 * 18.5,
    tokens: 20,
    image: "/placeholder.svg",
  },
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
      17.71, // USD to ZAR rate
      12987.6 // BNB to ZAR rate
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
      { usdPrice: 100, tokenAmount: 500 },
      17.71, // USD to ZAR rate
      12987.6 // BNB to ZAR rate
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
      17.71, // USD to ZAR rate
      12987.6 // BNB to ZAR rate
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

import { Activity, ArrowDownLeft, ArrowUpRight, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type TradingSignal = {
  id: string;
  pair: string;
  action: "BUY" | "SELL";
  price: number;
  change: number;
  confidence: number;
  timestamp: string;
  profit?: number;
};

const mockSignals: TradingSignal[] = [
  {
    id: "1",
    pair: "BTC/USDT",
    action: "BUY",
    price: 43250.5,
    change: 2.4,
    confidence: 92,
    timestamp: "2 min ago",
    profit: 1250.75,
  },
  {
    id: "2",
    pair: "ETH/USDT",
    action: "SELL",
    price: 2650.75,
    change: -1.8,
    confidence: 87,
    timestamp: "5 min ago",
    profit: 890.25,
  },
  {
    id: "3",
    pair: "ADA/USDT",
    action: "BUY",
    price: 0.485,
    change: 4.2,
    confidence: 95,
    timestamp: "8 min ago",
    profit: 425.5,
  },
];

export default function TradingSignals() {
  const [activeSignal, setActiveSignal] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // Auto-cycle through signals
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % mockSignals.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate live status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#EBEBEB]/10 bg-linear-to-br from-[#121C2B]/80 to-[#11120E]/90 p-1 backdrop-blur-sm">
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#EBEBEB]/20 via-transparent to-[#EBEBEB]/20 opacity-50">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-[#EBEBEB]/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative rounded-xl bg-[#11120E]/95 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <div
                className={`absolute inset-0 h-3 w-3 rounded-full bg-green-400 ${isLive ? "animate-ping" : ""}`}
              ></div>
            </div>
            <h3 className="text-xl font-bold text-[#EBEBEB]">
              Trading Signal Bot
            </h3>
            <Badge
              variant="outline"
              className="border-green-400/20 bg-green-400/10 text-green-400"
            >
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-[#EBEBEB]/70">AI Powered</span>
          </div>
        </div>

        {/* Active Signal Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSignal}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      mockSignals[activeSignal].action === "BUY"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {mockSignals[activeSignal].action === "BUY" ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#EBEBEB]">
                        {mockSignals[activeSignal].pair}
                      </span>
                      <Badge
                        variant="outline"
                        className={`${
                          mockSignals[activeSignal].action === "BUY"
                            ? "border-green-400/20 text-green-400"
                            : "border-red-400/20 text-red-400"
                        }`}
                      >
                        {mockSignals[activeSignal].action}
                      </Badge>
                    </div>
                    <div className="text-sm text-[#EBEBEB]/70">
                      {mockSignals[activeSignal].timestamp}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#EBEBEB]">
                    ${mockSignals[activeSignal].price.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm ${
                      mockSignals[activeSignal].change > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {mockSignals[activeSignal].change > 0 ? "+" : ""}
                    {mockSignals[activeSignal].change}%
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#EBEBEB]/70">Confidence</span>
                  <span className="text-[#EBEBEB]">
                    {mockSignals[activeSignal].confidence}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#EBEBEB]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${mockSignals[activeSignal].confidence}%`,
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-linear-to-r from-green-400 to-blue-400"
                  />
                </div>
              </div>

              {/* Profit Display */}
              {mockSignals[activeSignal].profit && (
                <div className="mt-3 flex items-center justify-between rounded-md bg-green-400/10 px-3 py-2">
                  <span className="text-sm text-[#EBEBEB]/70">
                    Projected Profit
                  </span>
                  <span className="font-semibold text-green-400">
                    +${mockSignals[activeSignal].profit?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Signal Indicators */}
        <div className="mb-6 flex justify-center space-x-2">
          {mockSignals.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSignal(index)}
              className={`h-2 w-8 rounded-full transition-all ${
                index === activeSignal
                  ? "bg-[#EBEBEB]"
                  : "bg-[#EBEBEB]/20 hover:bg-[#EBEBEB]/40"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          className="w-full bg-linear-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
          asChild
        >
          <Link href="/products">
            <Activity className="mr-2 h-4 w-4" />
            Get Trading Signals
          </Link>
        </Button>
      </div>
    </div>
  );
}

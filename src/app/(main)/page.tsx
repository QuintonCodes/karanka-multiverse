"use client";

import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Clock,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import ProductCard from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MainSection from "@/components/ui/main-section";
import { products } from "@/lib/products";
import { useEffect, useState } from "react";

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

type PerformanceMetric = {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
};

const features = [
  {
    icon: <LineChart className="h-10 w-10" />,
    title: "Real-time Trading Signals",
    description:
      "Receive accurate trading signals based on advanced algorithms and market analysis.",
  },
  {
    icon: <Bell className="h-10 w-10" />,
    title: "Instant Notifications",
    description:
      "Get notified immediately when profitable trading opportunities arise.",
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: "Performance Analytics",
    description:
      "Track your trading performance with detailed analytics and reports.",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Fast Execution",
    description:
      "Our signals are designed for quick implementation to maximize profit potential.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Risk Management",
    description:
      "Built-in risk assessment to protect your investments during market volatility.",
  },
  {
    icon: <Clock className="h-10 w-10" />,
    title: "24/7 Market Monitoring",
    description:
      "Our bots never sleep, constantly scanning markets for the best opportunities.",
  },
];

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

const performanceMetrics: PerformanceMetric[] = [
  {
    label: "Success Rate",
    value: "94.2%",
    change: 2.1,
    icon: <Target className="h-4 w-4" />,
  },
  {
    label: "Avg. Profit",
    value: "$1,247",
    change: 15.3,
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    label: "Active Signals",
    value: "12",
    change: 0,
    icon: <Activity className="h-4 w-4" />,
  },
];

export default function HomePage() {
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
    <MainSection className="pt-16">
      {/* Hero Section */}
      <section className="w-full relative z-10 mx-auto flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-[#EBEBEB] sm:text-5xl md:text-6xl">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-[#121C2B] to-[#191a14] bg-clip-text text-transparent">
              Karanka Multiverse
            </span>
          </h1>

          <p className="mb-8 text-lg text-[#EBEBEB]/70 md:text-xl">
            Unlock the power of algorithmic trading with our cutting-edge crypto
            trading bots and expert services. Navigate the crypto universe with
            confidence.
          </p>

          {/* CTA Section */}
          <div className="rounded-2xl border border-[#EBEBEB]/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 text-center max-w-xl mx-auto">
            <h4 className="mb-2 font-semibold text-[#EBEBEB]">
              Ready to Start Trading?
            </h4>
            <p className="mb-4 text-sm text-[#EBEBEB]/70">
              Join thousands of successful traders using our AI-powered signals
            </p>
            <div className="flex space-x-3">
              <Link href="/register" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                >
                  Start Today
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40">
                  View Products
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 w-full max-w-5xl mx-auto"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-[#EBEBEB]/10 bg-gradient-to-br from-[#121C2B]/80 to-[#11120E]/90 p-1 backdrop-blur-sm">
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#EBEBEB]/20 via-transparent to-[#EBEBEB]/20 opacity-50">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#EBEBEB]/10 to-transparent animate-pulse"></div>
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
                      <span className="text-sm text-[#EBEBEB]/70">
                        AI Powered
                      </span>
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
                              $
                              {mockSignals[activeSignal].price.toLocaleString()}
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
                            <span className="text-[#EBEBEB]/70">
                              Confidence
                            </span>
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
                              className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-400"
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
                  <Link href="/products">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold">
                      <Activity className="mr-2 h-4 w-4" />
                      Get Trading Signals
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Performance Metrics & Features */}
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="rounded-2xl border border-[#EBEBEB]/10 bg-gradient-to-br from-[#121C2B]/50 to-[#11120E]/80 p-6">
                <div className="mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-[#EBEBEB]/70" />
                  <h4 className="font-semibold text-[#EBEBEB]">
                    Live Performance
                  </h4>
                </div>

                <div className="grid gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between rounded-lg bg-[#11120E]/50 p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-[#EBEBEB]/70">{metric.icon}</div>
                        <span className="text-sm text-[#EBEBEB]/70">
                          {metric.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#EBEBEB]">
                          {metric.value}
                        </div>
                        {metric.change !== 0 && (
                          <div
                            className={`text-xs ${metric.change > 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change}%
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 crypto-bg opacity-10"></div>
        <div className="w-full mx-auto px-4">
          <div className="mb-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold text-[#EBEBEB] md:text-4xl"
            >
              Our Products & Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-[#EBEBEB]/70"
            >
              Discover our range of crypto trading tools and educational
              services designed to enhance your trading experience
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative py-20">
        <div className="w-full mx-auto px-4">
          <div className="mb-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold text-[#EBEBEB] md:text-4xl"
            >
              Why Choose Our Trading Solutions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-[#EBEBEB]/70"
            >
              Our advanced trading tools are designed to give you the edge in
              the volatile cryptocurrency markets
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-[#EBEBEB]/10 bg-gradient-to-br from-[#121C2B]/50 to-[#11120E] p-6 transition-all duration-300 hover:border-[#EBEBEB]/20"
              >
                <div className="mb-4 rounded-full bg-[#121C2B]/50 p-3 inline-block">
                  <div className="text-[#EBEBEB]/90">{feature.icon}</div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#EBEBEB]">
                  {feature.title}
                </h3>
                <p className="text-[#EBEBEB]/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainSection>
  );
}

"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Clock,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { JSX } from "react";

import ProductCard from "@/components/product-card";
import TradingSignals from "@/components/trading-signals";
import { Button } from "@/components/ui/button";
import { MainSection } from "@/components/ui/main-section";
import { useAuth } from "@/context/auth-provider";
import { products } from "@/lib/products";

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
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

type PerformanceMetric = {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
};

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
  const { isAuthenticated } = useAuth();

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
            <span className="bg-linear-to-r from-[#121C2B]/50 to-[#191a14] bg-clip-text text-transparent">
              Karanka Multiverse
            </span>
          </h1>

          <p className="mb-8 text-lg text-[#EBEBEB]/70 md:text-xl">
            Unlock the power of algorithmic trading with our cutting-edge crypto
            trading bots and expert services. Navigate the crypto universe with
            confidence.
          </p>

          {/* CTA Section */}
          {!isAuthenticated && (
            <div className="rounded-2xl border border-[#EBEBEB]/10 bg-linear-to-r from-[#121C2B]/50 to-[#11120E]/80 p-6 text-center max-w-xl mx-auto">
              <h4 className="mb-2 font-semibold text-[#EBEBEB]">
                Ready to Start Trading?
              </h4>
              <p className="mb-4 text-sm text-[#EBEBEB]/70">
                Join thousands of successful traders using our AI-powered
                signals
              </p>
              <div className="flex space-x-3">
                <Link href="/register" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full text-[#EBEBEB] border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                  >
                    Start Today
                  </Button>
                </Link>
                <Link href="/products" className="flex-1">
                  <Button className="w-full bg-linear-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40">
                    View Products
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 w-full max-w-5xl mx-auto"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <TradingSignals />

              {/* Performance Metrics & Features */}
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="rounded-2xl border border-[#EBEBEB]/10 bg-linear-to-br from-[#121C2B]/50 to-[#11120E]/80 p-6">
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
                        <PerformanceCard metric={metric} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
                className="rounded-xl border border-[#EBEBEB]/10 bg-linear-to-br from-[#121C2B]/50 to-[#11120E] p-6 transition-all duration-300 hover:border-[#EBEBEB]/20"
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainSection>
  );
}

function PerformanceCard({ metric }: { metric: PerformanceMetric }) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <div className="text-[#EBEBEB]/70">{metric.icon}</div>
        <span className="text-sm text-[#EBEBEB]/70">{metric.label}</span>
      </div>
      <div className="text-right">
        <div className="font-semibold text-[#EBEBEB]">{metric.value}</div>
        {metric.change !== 0 && (
          <div
            className={`text-xs ${metric.change > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {metric.change > 0 ? "+" : ""}
            {metric.change}%
          </div>
        )}
      </div>
    </>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div>
      <div className="mb-4 rounded-full bg-[#121C2B]/50 p-3 inline-block">
        <div className="text-[#EBEBEB]/90">{feature.icon}</div>
      </div>
      <h3 className="mb-2 text-xl font-bold text-[#EBEBEB]">{feature.title}</h3>
      <p className="text-[#EBEBEB]/70">{feature.description}</p>
    </div>
  );
}

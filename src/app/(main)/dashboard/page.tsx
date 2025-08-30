"use client";

import {
  Activity,
  Bell,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { JSX } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MainSection from "@/components/ui/main-section";
import { formatPrice, formatTime, getStatDisplay } from "@/lib/utils";

type Signal = {
  id: string;
  pair: string;
  action: string;
  price: number;
  timestamp: Date;
  confidence: number;
  status: string;
  profit: number;
  change: number;
};

const signals: Signal[] = [
  {
    id: "1",
    pair: "BTC/USDT",
    action: "BUY",
    price: 43250.5,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    confidence: 85,
    status: "active",
    profit: 1250.75,
    change: 2.4,
  },
  {
    id: "2",
    pair: "ETH/USDT",
    action: "SELL",
    price: 2650.75,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    confidence: 78,
    status: "active",
    profit: 890.25,
    change: -1.8,
  },
  {
    id: "3",
    pair: "ADA/USDT",
    action: "BUY",
    price: 0.485,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    confidence: 92,
    status: "completed",
    profit: 425.5,
    change: 4.2,
  },
];

type Stat = {
  id: string;
  title: string;
  number: number;
  icon: JSX.Element;
};

const stats: Stat[] = [
  {
    id: "total_signals",
    title: "Total Signals",
    number: 127,
    icon: <Activity className="h-8 w-8 text-[#EBEBEB]/50" />,
  },
  {
    id: "success_rate",
    title: "Success Rate",
    number: 78.5,
    icon: <TrendingUp className="h-8 w-8 text-green-400" />,
  },
  {
    id: "active_signals",
    title: "Active Signals",
    number: 2,
    icon: <Bell className="h-8 w-8 text-yellow-400" />,
  },
  {
    id: "total_profit",
    title: "Total Profit",
    number: 2450.75,
    icon: <DollarSign className="h-8 w-8 text-green-400" />,
  },
];

export default function DashboardPage() {
  return (
    <MainSection className="mx-auto px-4 py-32">
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EBEBEB]">
            Trading Dashboard
          </h1>
          <p className="mt-2 text-[#EBEBEB]/70">
            Monitor your trading signals and performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6"
              initial={{ opacity: 0, y: 20 }}
              key={stat.id}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard stat={stat} />
            </motion.div>
          ))}
        </div>

        {/* Trading Signals */}
        <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#EBEBEB]">
              Recent Trading Signals
            </h2>
            <Button
              className="border-[#EBEBEB]/20 text-[#EBEBEB] hover:border-[#EBEBEB]/40 bg-transparent"
              size="sm"
              variant="outline"
            >
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          </div>

          <div className="space-y-4">
            {signals.map((signal, index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4"
                initial={{ opacity: 0, x: -20 }}
                key={signal.id}
                transition={{ delay: index * 0.1 }}
              >
                <SignalCard signal={signal} />
              </motion.div>
            ))}
          </div>

          {signals.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-[#EBEBEB]/30" />
              <h3 className="mb-2 text-lg font-medium text-[#EBEBEB]">
                No signals yet
              </h3>
              <p className="text-[#EBEBEB]/70">
                Purchase a trading signal bot to start receiving signals
              </p>
            </div>
          )}
        </div>
      </section>
    </MainSection>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            signal.action === "BUY" ? "bg-green-500/20" : "bg-red-500/20"
          }`}
        >
          {signal.action === "BUY" ? (
            <TrendingUp className="h-5 w-5 text-green-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-400" />
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-[#EBEBEB]">{signal.pair}</span>
            <Badge
              variant="outline"
              className={`border-[#EBEBEB]/20 ${
                signal.action === "BUY" ? "text-green-400" : "text-red-400"
              }`}
            >
              {signal.action}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-[#EBEBEB]/70">
            <span>Price: {formatPrice(signal.price, "USD")}</span>
            <span>Confidence: {signal.confidence}%</span>
            <span>{formatTime(signal.timestamp)}</span>
            {signal.change && (
              <span
                className={
                  signal.change > 0 ? "text-green-400" : "text-red-400"
                }
              >
                {signal.change > 0 ? "+" : ""}
                {signal.change}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-right">
        <Badge
          className={`border-[#EBEBEB]/20 ${
            signal.status === "active"
              ? "text-yellow-400"
              : signal.status === "completed"
                ? "text-green-400"
                : "text-[#EBEBEB]/50"
          }`}
          variant="outline"
        >
          {signal.status.toUpperCase()}
        </Badge>
        {signal.profit && (
          <div
            className={`text-sm ${signal.profit > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {signal.profit > 0 ? "+" : ""}
            {formatPrice(signal.profit, "USD")}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[#EBEBEB]/70">Total Signals</p>
        <p className="text-2xl font-bold text-[#EBEBEB]">
          {getStatDisplay(stat)}
        </p>
      </div>
      {stat.icon}
    </div>
  );
}

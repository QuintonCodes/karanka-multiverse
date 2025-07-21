"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const SYMBOLS = ["₿", "Ξ", "Ł", "Ð", "ⓩ"];

type FloatingSymbols = {
  x: string;
  yStart: string;
  yEnd: string;
  opacity1: number;
  opacity2: number;
  opacity3: number;
  duration: number;
  left: string;
  symbol: string;
};
export default function MainSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [floatingSymbols, setFloatingSymbols] = useState<FloatingSymbols[]>([]);

  useEffect(() => {
    setFloatingSymbols(
      [...Array(10)].map(() => ({
        x: Math.random() * 100 - 50 + "%",
        yStart: Math.random() * 100 + "%",
        yEnd: Math.random() * 100 + "%",
        opacity1: 0.1 + Math.random() * 0.2,
        opacity2: 0.2 + Math.random() * 0.3,
        opacity3: 0.1 + Math.random() * 0.2,
        duration: 10 + Math.random() * 20,
        left: Math.random() * 90 + 5 + "%",
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      }))
    );
  }, []);

  return (
    <main
      className={cn(
        "bg-gradient-to-b bg-[#11120E] from-[#11120E] to-[#121C2B] min-h-[90vh] relative w-full overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingSymbols.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-[#EBEBEB]/10 text-4xl font-bold"
            initial={{
              x: item.x,
              y: item.yStart,
              opacity: item.opacity1,
            }}
            animate={{
              y: [item.yStart, item.yEnd],
              opacity: [item.opacity1, item.opacity2, item.opacity3],
            }}
            transition={{
              duration: item.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              left: item.left,
            }}
          >
            {item.symbol}
          </motion.div>
        ))}
      </div>
      {children}
    </main>
  );
}

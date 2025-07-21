"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#11120E]"
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border-2 border-[#EBEBEB]/20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 animate-pulse rounded-full border-2 border-[#EBEBEB]/40"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#EBEBEB]"></div>
        </div>
        <div className="z-10 mt-40 text-[#EBEBEB]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center font-bold"
          >
            <span className="text-2xl">Karanka</span>
            <span className="ml-2 text-2xl text-[#EBEBEB]/70">Multiverse</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

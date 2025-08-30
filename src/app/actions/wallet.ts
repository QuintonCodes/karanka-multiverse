"use server";

import { ethers } from "ethers";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function saveWalletToDB(address: string, rawBalance: string) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) throw new Error("User not authenticated");

  let decimalBalance: string;

  try {
    decimalBalance = ethers.formatUnits(rawBalance, 18);
  } catch {
    decimalBalance = rawBalance;
  }

  await db.wallet.upsert({
    where: { userId },
    update: { address, balance: decimalBalance },
    create: { userId, address, balance: decimalBalance },
  });
}

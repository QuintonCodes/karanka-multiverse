"use server";

import { db } from "@/lib/db";
import { getChainName } from "@/lib/utils";

export async function saveWalletToDB(
  address: string,
  krkuniBalance: bigint,
  chain: number,
  userId?: string
) {
  try {
    if (!address) {
      return { success: false, error: "Wallet address is required" };
    }

    const existingWallet = await db.wallet.findUnique({
      where: { address },
    });

    if (existingWallet) {
      await db.wallet.update({
        where: { address },
        data: {
          balance: krkuniBalance.toString(),
          chain: getChainName(chain),
          updatedAt: new Date(),
          ...(userId ? { userId } : {}),
        },
      });
    } else {
      await db.wallet.create({
        data: {
          userId: userId!,
          address,
          balance: krkuniBalance.toString(),
          chain: getChainName(chain),
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Save Wallet Error:", error);
    return { success: false, error: "Failed to save wallet information" };
  }
}

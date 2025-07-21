"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function saveWalletToDB(address: string, balance: string) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) throw new Error("User not authenticated");

  await db.wallet.upsert({
    where: { userId },
    update: { address, balance },
    create: { userId, address, balance },
  });
}

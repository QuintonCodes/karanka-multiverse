"use server";

import { randomBytes } from "crypto";
import { verifyMessage } from "ethers";

import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getWalletNonce(address: string) {
  try {
    const wallet = await db.wallet.findUnique({ where: { address } });

    if (!wallet) {
      return { success: false, nonce: "", error: "Wallet not found" };
    }
    const nonce = randomBytes(16).toString("hex");

    await db.wallet.update({
      where: { address },
      data: { nonce },
    });

    return { success: true, nonce };
  } catch (error) {
    console.error("Error in getWalletNonce:", error);
    return { success: false, nonce: "", error: "Internal server error" };
  }
}

export async function verifyWalletLogin(address: string, signature: string) {
  try {
    const wallet = await db.wallet.findUnique({
      where: { address },
      include: {
        user: {
          include: {
            wallet: true,
            payments: true,
            transactions: true,
            subscriptions: true,
          },
        },
      },
    });

    if (!wallet || !wallet.nonce) {
      return {
        success: false,
        user: null,
        error: "Wallet not found or nonce missing",
      };
    }

    const recovered = verifyMessage(wallet.nonce, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return {
        success: false,
        user: null,
        error: "Signature verification failed",
      };
    }

    // reset nonce
    await db.wallet.update({
      where: { address },
      data: { nonce: "" },
    });

    let user = wallet.user;

    if (!user) {
      user = await db.user.create({
        data: {
          firstName: "Wallet",
          lastName: `User ${address.slice(0, 6)}`,
          email: `${address.slice(0, 8).toLowerCase()}@wallet.local`,
          password: randomBytes(16).toString("hex"),
          isVerified: false,
          createdAt: new Date(),
          wallet: {
            connect: { id: wallet.id },
          },
        },
        include: {
          wallet: true,
          payments: true,
          transactions: true,
          subscriptions: true,
        },
      });
    } else {
      user = await db.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
        include: {
          wallet: true,
          payments: true,
          transactions: true,
          subscriptions: true,
        },
      });
    }

    await createSession(user.id, user.email);

    return { success: true, user };
  } catch (error) {
    console.error("Error in verifyWalletLogin:", error);
    return { success: false, user: null, error: "Internal server error" };
  }
}

export async function linkWalletToUser(
  address: string,
  signature: string,
  userId: string
) {
  try {
    let wallet = await db.wallet.findUnique({
      where: { address },
      include: { user: true },
    });

    if (!wallet) {
      return { success: false, error: "Wallet not found" };
    }

    if (!wallet.nonce) {
      return { success: false, error: "Nonce missing" };
    }

    const recovered = verifyMessage(wallet.nonce, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return { success: false, error: "Signature verification failed" };
    }

    // Case 1: Wallet is already linked to this user
    if (wallet.userId === userId) {
      return { success: true, wallet };
    }

    // Case 2: Wallet belongs to a different (wallet-only) user
    if (wallet.userId && wallet.userId !== userId) {
      const oldUser = await db.user.findUnique({
        where: { id: wallet.userId },
      });

      const isWalletOnly = oldUser && oldUser.email.endsWith("@wallet.local");

      if (!isWalletOnly) {
        return {
          success: false,
          error: "Wallet is already linked to another account",
        };
      }

      // Transfer ownership of payments, transactions, subscriptions
      await db.payment.updateMany({
        where: { userId: oldUser.id },
        data: { userId },
      });
      await db.transaction.updateMany({
        where: { userId: oldUser.id },
        data: { userId },
      });
      await db.subscription.updateMany({
        where: { userId: oldUser.id },
        data: { userId },
      });

      // Transfer the wallet to the real account
      wallet = await db.wallet.update({
        where: { id: wallet.id },
        data: { nonce: "", userId },
        include: { user: true },
      });

      await db.user.delete({ where: { id: oldUser.id } });

      return { success: true, wallet };
    }

    // Case 3: Wallet is unlinked -> link it
    wallet = await db.wallet.update({
      where: { id: wallet.id },
      data: { nonce: "", userId },
      include: { user: true },
    });

    return { success: true, wallet, merged: true, newUserId: userId };
  } catch (error) {
    console.error("Error in linkWalletToUser:", error);
    return { success: false, error: "Internal server error" };
  }
}

"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

import {
  KRKUNI_TOKEN_ADDRESS,
  KRKUNI_TOKEN_DECIMALS,
  KRKUNI_TOKEN_NAME,
  KRKUNI_TOKEN_SYMBOL,
} from "@/lib/wagmi";

export function useAddToken() {
  const { data: walletClient } = useWalletClient();

  const addTokenToMetaMask = useCallback(async () => {
    try {
      if (!walletClient) {
        toast.error("Wallet not connected", {
          description: "Please connect your wallet to add tokens",
        });
        return;
      }

      const wasAdded = await walletClient.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: KRKUNI_TOKEN_ADDRESS,
            symbol: KRKUNI_TOKEN_SYMBOL,
            decimals: KRKUNI_TOKEN_DECIMALS,
            name: KRKUNI_TOKEN_NAME,
            // Optional: Add token image URL here
            // image: 'https://your-domain.com/krkuni-logo.png',
          },
        },
      });

      if (wasAdded) {
        toast.success("Token added successfully!", {
          description: "KRKUNI token has been added to your MetaMask wallet",
        });
      } else {
        toast.error("Token not added", {
          description: "The token was not added to your wallet",
        });
      }
    } catch (error) {
      console.error("Error adding token:", error);
      toast.error("Error adding token", {
        description: "There was an error adding the token to your wallet",
      });
    }
  }, [walletClient]);

  return { addTokenToMetaMask };
}

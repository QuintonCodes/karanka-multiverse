"use client";

import { CheckCircle, Copy, ExternalLink, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

import { saveWalletToDB } from "@/app/actions/wallet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { useMetaMaskStore } from "@/lib/stores/metamask-store";

type MetaMaskConnectProps = {
  onConnect?: (address: string) => void;
  showBalance?: boolean;
  compact?: boolean;
};

export function MetaMaskConnect({
  onConnect,
  showBalance = true,
  compact = false,
}: MetaMaskConnectProps) {
  const {
    address: storedAddress,
    setWallet,
    disconnect: storeDisconnect,
    setIsInstalled,
  } = useMetaMaskStore();
  const { user } = useAuth();

  // Wagmi hooks
  const {
    connectAsync,
    connectors,
    isPending: isConnectLoading,
  } = useConnect();
  const { address, isConnected, chain } = useAccount();
  const { disconnectAsync } = useDisconnect();

  // balance hook (auto-updates when address changes)
  const balanceQuery = useBalance({
    address: address,
    // watch: true,
  });

  const [copied, setCopied] = useState(false);
  const isMetaMaskInstalled = useMemo(() => {
    if (typeof window === "undefined") return false;

    return !!window.ethereum;
  }, []);

  // Keep zustand install flag in sync
  useEffect(() => {
    setIsInstalled(Boolean(isMetaMaskInstalled));
  }, [isMetaMaskInstalled, setIsInstalled]);

  // Update store whenever wagmi state changes (connected, address, balance, chain)
  useEffect(() => {
    if (isConnected && address) {
      const bal = balanceQuery.data?.formatted ?? user?.wallet?.balance ?? "0";
      const chainIdHex = chain?.id
        ? `0x${chain.id.toString(16)}`
        : (user?.wallet?.chain ?? "");
      setWallet({
        address,
        balance: String(bal),
        chainId: String(chainIdHex),
      });
    }
  }, [
    isConnected,
    address,
    balanceQuery.data,
    user?.wallet,
    chain?.id,
    setWallet,
  ]);

  // Save to DB after connection stabilized (debounced-like effect)
  useEffect(() => {
    let mounted = true;
    async function persistWallet() {
      try {
        if (!isConnected || !address) return;
        const bal = balanceQuery.data?.formatted ?? "0";
        // adjust this call depending on your server action signature
        await saveWalletToDB(bal, address);
        if (!mounted) return;
        toast.success("Wallet connected and saved");
        onConnect?.(address);
      } catch (err) {
        console.error("Failed to save wallet:", err);
      }
    }

    persistWallet();

    return () => {
      mounted = false;
    };
  }, [isConnected, address, balanceQuery.data, onConnect]);

  async function handleConnect() {
    try {
      const mmConnector =
        connectors.find((connect) => connect.id === "metaMask") ?? metaMask();
      await connectAsync({ connector: mmConnector });
      // await saveWalletToDB(wallet.balance, wallet.balance);

      // onConnect?.(wallet.address);
      toast.success("Wallet connected and saved");
    } catch (error) {
      console.error(error);
      toast.error((error as Error)?.message ?? "Failed to connect MetaMask");
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectAsync?.();
      storeDisconnect();
      toast.success("Disconnected wallet");
    } catch (error) {
      console.error("Disconnect failed:", error);
      // still clear local store
      storeDisconnect();
      toast.error("Failed to disconnect wallet");
    }
  }

  async function copyAddress() {
    const toCopy = address ?? storedAddress ?? user?.wallet?.address ?? "";

    if (!toCopy) {
      toast.error("No address to copy");
      return;
    }

    await navigator.clipboard.writeText(toCopy);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenInstall() {
    window.open("https://metamask.io/download/", "_blank", "noopener");
  }

  if (!isMetaMaskInstalled) {
    return (
      <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
            <Wallet className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle className="text-[#EBEBEB]">
            MetaMask Not Detected
          </CardTitle>
          <CardDescription className="text-[#EBEBEB]/70">
            Install MetaMask to connect your wallet and access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleOpenInstall}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Install MetaMask
          </Button>
          <p className="text-center text-xs text-[#EBEBEB]/50">
            After installation, refresh this page to connect your wallet
          </p>
        </CardContent>
      </Card>
    );
  }

  if (compact && isConnected && user?.wallet) {
    const displayAddress = user.wallet.address
      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
      : address
        ? `${String(address).slice(0, 6)}...${String(address).slice(-4)}`
        : "Unknown";

    return (
      <div className="flex items-center space-x-2 rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 px-3 py-2">
        <div className="h-2 w-2 rounded-full bg-green-400"></div>
        <span className="text-sm font-medium text-[#EBEBEB]">
          {displayAddress}
        </span>
        <Button variant="ghost" size="sm" onClick={copyAddress}>
          {copied ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Wallet className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-[#EBEBEB]">MetaMask Wallet</CardTitle>
              <CardDescription className="text-[#EBEBEB]/70">
                {isConnected ? "Connected" : "Connect your MetaMask wallet"}
              </CardDescription>
            </div>
          </div>
          {isConnected && (
            <Badge
              variant="outline"
              className="border-green-400/20 bg-green-400/10 text-green-400"
            >
              <div className="mr-1 h-2 w-2 rounded-full bg-green-400"></div>
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={isConnectLoading}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnectLoading ? "Connecting..." : "Connect MetaMask"}
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#EBEBEB]/70">
                  Wallet Address
                </span>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  {copied ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="font-mono text-sm text-[#EBEBEB] break-all">
                {address
                  ? `${String(address).slice(0, 6)}...${String(address).slice(-4)}`
                  : user?.wallet?.address}
              </p>
            </div>

            {showBalance && (
              <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                <div className="mb-2 text-sm font-medium text-[#EBEBEB]/70">
                  Balance
                </div>
                <p className="text-lg font-semibold text-[#EBEBEB]">
                  {balanceQuery.data?.formatted ??
                    String(user?.wallet?.balance ?? "0")}{" "}
                  {balanceQuery.data?.symbol ?? "ETH"}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
              <div className="mb-2 text-sm font-medium text-[#EBEBEB]/70">
                Network
              </div>
              <p className="text-sm text-[#EBEBEB]">
                {user?.wallet?.chain === "0x1"
                  ? "Ethereum Mainnet"
                  : `Chain: ${user?.wallet?.chain ?? "unknown"}`}
              </p>
            </div>

            <Separator className="bg-[#EBEBEB]/10" />

            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="w-full text-[#EBEBEB] border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
            >
              Disconnect Wallet
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

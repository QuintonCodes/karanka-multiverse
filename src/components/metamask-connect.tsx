"use client";

import { CheckCircle, Copy, ExternalLink, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { MetaMaskService } from "@/lib/metamask";
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
    address,
    balance,
    chainId,
    setWallet,
    disconnect,
    isConnected,
    isInstalled,
    setIsInstalled,
  } = useMetaMaskStore();
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const service = MetaMaskService.getInstance();
      setIsInstalled(service.isInstalled());
    }, 3000);

    return () => clearInterval(interval);
  }, [setIsInstalled]);

  async function handleConnect() {
    try {
      const service = MetaMaskService.getInstance();
      await service.ensureBscNetwork();
      const wallet = await service.connectWallet();

      setWallet({
        address: wallet.address,
        balance: wallet.balance,
        chainId: wallet.chainId,
      });

      await saveWalletToDB(wallet.balance, wallet.balance);

      onConnect?.(wallet.address);
      toast.success("Wallet connected and saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(address || "");
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isInstalled) {
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
            onClick={() =>
              window.open("https://metamask.io/download/", "_blank")
            }
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
    return (
      <div className="flex items-center space-x-2 rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 px-3 py-2">
        <div className="h-2 w-2 rounded-full bg-green-400"></div>
        <span className="text-sm font-medium text-[#EBEBEB]">
          {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
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
          <Button onClick={handleConnect} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>
        ) : (
          user?.wallet && (
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
                  {`${address?.slice(0, 6)}...${address?.slice(-4)}` ||
                    user.wallet.address}
                </p>
              </div>

              {showBalance && (
                <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                  <div className="mb-2 text-sm font-medium text-[#EBEBEB]/70">
                    Balance
                  </div>
                  <p className="text-lg font-semibold text-[#EBEBEB]">
                    {balance || Number(user.wallet.balance || 0)} ETH
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                <div className="mb-2 text-sm font-medium text-[#EBEBEB]/70">
                  Network
                </div>
                <p className="text-sm text-[#EBEBEB]">
                  {user.wallet.chain === "0x1"
                    ? "Ethereum Mainnet"
                    : `Chain ID: ${chainId || user.wallet.chain}`}
                </p>
              </div>

              <Separator className="bg-[#EBEBEB]/10" />

              <Button
                variant="outline"
                onClick={disconnect}
                className="w-full border-[#EBEBEB]/20 bg-transparent"
              >
                Disconnect Wallet
              </Button>
            </motion.div>
          )
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  ExternalLink,
  Info,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

import { MetaMaskConnect } from "@/components/metamask-connect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MainSection } from "@/components/ui/main-section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { useWalletConnection } from "@/hooks/use-wallet-connection";
import { formatPrice } from "@/lib/utils";

export default function WalletPage() {
  const { user } = useAuth();
  const { isConnected } = useWalletConnection();

  function getStatusIcon(status: string) {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-[#EBEBEB]/50" />;
    }
  }

  function getTransactionIcon(type: string) {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      case "purchase":
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-[#EBEBEB]/50" />;
    }
  }

  return (
    <MainSection>
      <section className="w-full mx-auto px-4 py-32">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Badge
              variant="outline"
              className="mb-4 border-[#EBEBEB]/20 bg-[#121C2B]/50 text-[#EBEBEB]/70"
            >
              <Wallet className="mr-1 h-3 w-3" />
              Crypto Wallet
            </Badge>
            <h1 className="text-3xl font-bold text-[#EBEBEB] lg:text-4xl">
              Wallet Management
            </h1>
            <p className="mt-2 text-[#EBEBEB]/70">
              Manage your MetaMask wallet, KRKUNI tokens, and other
              cryptocurrencies securely
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Wallet className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-[#EBEBEB]/70">MetaMask</div>
                    <div className="font-semibold text-[#EBEBEB]">
                      {isConnected ? "Connected" : "Not Connected"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/10">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-[#EBEBEB]/70">
                      KRKUNI Balance
                    </div>
                    <div className="font-semibold text-[#EBEBEB]">
                      {Number(user?.wallet?.balance || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-[#EBEBEB]/70">
                      Portfolio Value
                    </div>
                    <div className="font-semibold text-[#EBEBEB]">
                      {formatPrice(Number(user?.wallet?.valueZar || 0))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 bg-[#121C2B]/50">
            <TabsTrigger
              value="overview"
              className="text-[#EBEBEB] data-[state=active]:bg-[#11120E] data-[state=active]:text-[#EBEBEB]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="metamask"
              className="text-[#EBEBEB] data-[state=active]:bg-[#11120E] data-[state=active]:text-[#EBEBEB]"
            >
              MetaMask
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-[#EBEBEB] data-[state=active]:bg-[#11120E] data-[state=active]:text-[#EBEBEB]"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Wallet Status */}
              <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
                <CardHeader>
                  <CardTitle className="text-[#EBEBEB]">
                    Wallet Status
                  </CardTitle>
                  <CardDescription className="text-[#EBEBEB]/70">
                    Overview of your connected wallets and balances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Wallet className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-[#EBEBEB]">
                          MetaMask Wallet
                        </div>
                        <div className="text-sm text-[#EBEBEB]/70">
                          {isConnected ? "Connected & Active" : "Not Connected"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        isConnected
                          ? "border-green-400/20 bg-green-400/10 text-green-400"
                          : "border-red-400/20 bg-red-400/10 text-red-400"
                      }`}
                    >
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                        <Shield className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-medium text-[#EBEBEB]">
                          Crypto Wallet
                        </div>
                        <div className="text-sm text-[#EBEBEB]/70">
                          {user?.wallet ? "Active & Secure" : "Not Created"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        user?.wallet
                          ? "border-green-400/20 bg-green-400/10 text-green-400"
                          : "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {user?.wallet ? "Active" : "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
                <CardHeader>
                  <CardTitle className="text-[#EBEBEB]">
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-[#EBEBEB]/70">
                    Common wallet operations and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-[#EBEBEB]">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                    // onClick={() => setActiveTab("metamask")}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect MetaMask Wallet
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                    // onClick={() => setActiveTab("history")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Check History
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                    onClick={() => window.open("/tokens", "_blank")}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Purchase Tokens
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Balances
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Overview */}
            <Card className="border-[#EBEBEB]/10 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#EBEBEB]">
                      Token Balance
                    </h3>
                    <p className="text-3xl font-bold text-[#EBEBEB]">
                      {Number(user?.wallet?.balance || 0).toFixed(2)} (
                      {formatPrice(Number(user?.wallet?.valueZar || 0))})
                    </p>
                    <p className="text-sm text-[#EBEBEB]/70">
                      Available tokens
                    </p>
                  </div>
                  <Zap className="h-12 w-12 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert className="border-blue-400/20 bg-blue-400/10">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-400">
                <strong>Security Tip:</strong> Never share your private keys or
                seed phrases with anyone. Karanka Multiverse will never ask for
                your private keys or passwords.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="metamask" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <MetaMaskConnect showBalance />

              <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
                <CardHeader>
                  <CardTitle className="text-[#EBEBEB]">
                    MetaMask Integration
                  </CardTitle>
                  <CardDescription className="text-[#EBEBEB]/70">
                    Benefits of connecting your MetaMask wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        icon: <Shield className="h-4 w-4" />,
                        text: "Secure wallet-based authentication",
                      },
                      {
                        icon: <Zap className="h-4 w-4" />,
                        text: "Direct token transactions",
                      },
                      {
                        icon: <TrendingUp className="h-4 w-4" />,
                        text: "Real-time balance updates",
                      },
                      {
                        icon: <ArrowUpRight className="h-4 w-4" />,
                        text: "Multi-chain asset support",
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 text-sm text-[#EBEBEB]/80"
                      >
                        <div className="text-blue-400">{feature.icon}</div>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-[#EBEBEB]/10" />

                  <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                    <h4 className="mb-2 font-medium text-[#EBEBEB]">
                      Supported Networks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Ethereum", "Polygon", "Avalanche", "BSC"].map(
                        (network) => (
                          <Badge
                            key={network}
                            variant="outline"
                            className="border-[#EBEBEB]/20 text-[#EBEBEB]"
                          >
                            {network}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardHeader>
                <CardTitle className="text-[#EBEBEB]">
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.transactions.length === 0 ? (
                  <div className="py-12 text-center">
                    <Clock className="mx-auto mb-4 h-12 w-12 text-[#EBEBEB]/30" />
                    <h3 className="mb-2 text-lg font-medium text-[#EBEBEB]">
                      No transactions yet
                    </h3>
                    <p className="text-[#EBEBEB]/70">
                      Your transaction history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user?.transactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#11120E]">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-[#EBEBEB]">
                                {transaction.type === "send"
                                  ? "Sent"
                                  : transaction.type === "receive"
                                    ? "Received"
                                    : "Purchased"}
                              </span>
                              <span className="text-[#EBEBEB]">
                                {transaction.amount.toFixed(6)}
                              </span>
                              {getStatusIcon(transaction.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-[#EBEBEB]/70">
                              <span>
                                {new Date(
                                  transaction.timestamp
                                ).toLocaleString()}
                              </span>
                              <span className="font-mono">
                                {transaction.id.substring(0, 10)}...
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-[#EBEBEB]/20 ${
                            transaction.status === "confirmed"
                              ? "text-green-400"
                              : transaction.status === "pending"
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {transaction.status.toUpperCase()}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </MainSection>
  );
}

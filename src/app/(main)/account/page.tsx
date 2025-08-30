"use client";

import { Eye, EyeOff, History, Settings, Wallet, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { EmptyCard } from "@/components/empty-card";
import AvatarForm from "@/components/forms/avatar-form";
import ProfileForm from "@/components/forms/profile-form";
import { MetaMaskConnect } from "@/components/metamask-connect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MainSection from "@/components/ui/main-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";

export default function AccountPage() {
  const { user, updateUser, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  if (!isAuthenticated) {
    return (
      <MainSection className="mx-auto px-4 py-32 flex justify-center items-center">
        <EmptyCard
          title="Please log in to view your account"
          description="Access your dashboard, subscriptions, and more."
          showAuthActions
        />
      </MainSection>
    );
  }

  return (
    <MainSection className="mx-auto px-4 py-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#EBEBEB]">Account Settings</h1>
        <p className="mt-2 text-[#EBEBEB]/70">
          Manage your profile, wallet, and transaction history
        </p>
      </div>

      <section className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6">
            <div className="mb-6 text-center">
              <AvatarForm user={user} updateUser={updateUser} />
              <h3 className="font-semibold text-[#EBEBEB]">
                {user?.firstName || "First Name"}{" "}
                {user?.lastName || "Last Name"}
              </h3>
              <p className="text-sm text-[#EBEBEB]/70">
                {user?.email || "Email Address"}
              </p>
              {user?.wallet && (
                <Badge
                  variant="outline"
                  className="mt-2 border-green-400/20 bg-green-400/10 text-green-400"
                >
                  MetaMask Connected
                </Badge>
              )}
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              orientation="vertical"
              className="gap-4"
            >
              <TabsList className="grid h-full w-full grid-rows-3 bg-[#121C2B]/50 justify-normal">
                <TabsTrigger
                  value="profile"
                  className="flex items-center space-x-2 text-[#EBEBEB] data-[state=active]:bg-[#11120E] data-[state=active]:text-[#EBEBEB] h-10"
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wallet"
                  className="flex items-center space-x-2 text-[#EBEBEB] data-[state=active]:bg-[#11120E] data-[state=active]:text-[#EBEBEB] h-10"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Wallet</span>
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="flex items-center space-x-2 text-[#EBEBEB] data-[state=active]:bg-[#11120E] data-[state=active]:text-[#EBEBEB] h-10"
                >
                  <History className="h-4 w-4" />
                  <span>Transactions</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="profile">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-[#EBEBEB]">
                          Profile Information
                        </h2>
                        <p className="text-[#EBEBEB]/70">
                          Update your personal details and preferences
                        </p>
                      </div>
                    </div>

                    <ProfileForm user={user} updateUser={updateUser} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="wallet">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-[#EBEBEB]">
                        Wallet Information
                      </h2>
                      <p className="text-[#EBEBEB]/70">
                        Manage your token balance and wallet connections
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Token Balance */}
                      <Card className="border-[#EBEBEB]/10 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-[#EBEBEB]">
                                Token Balance
                              </h3>
                              <p className="text-3xl font-bold text-[#EBEBEB]">
                                {Number(user?.wallet?.balance || 0).toFixed(2)}
                              </p>
                              <p className="text-sm text-[#EBEBEB]/70">
                                Available tokens
                              </p>
                            </div>
                            <Zap className="h-12 w-12 text-yellow-400" />
                          </div>
                        </CardContent>
                      </Card>

                      {/* MetaMask Integration */}
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-[#EBEBEB]">
                          MetaMask Wallet
                        </h3>
                        <MetaMaskConnect showBalance />
                      </div>

                      {/* Manual Wallet Address */}
                      <Card className="border-[#EBEBEB]/10 bg-[#121C2B]/30">
                        <CardHeader>
                          <CardTitle className="text-[#EBEBEB]">
                            Manual Wallet Address
                          </CardTitle>
                          <CardDescription className="text-[#EBEBEB]/70">
                            Your cryptocurrency wallet address for token
                            transactions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <Input
                              type={showWalletAddress ? "text" : "password"}
                              readOnly
                              value={user?.wallet?.address || ""}
                              placeholder="0x1234...abcd"
                              className="border-[#EBEBEB]/20 bg-[#11120E] text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowWalletAddress(!showWalletAddress)
                              }
                            >
                              {showWalletAddress ? (
                                <EyeOff className="h-4 w-4 text-[#EBEBEB]/70" />
                              ) : (
                                <Eye className="h-4 w-4 text-[#EBEBEB]/70" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="transactions">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-[#EBEBEB]">
                        Transaction History
                      </h2>
                      <p className="text-[#EBEBEB]/70">
                        View all your past transactions and payments
                      </p>
                    </div>

                    {user?.transactions.length === 0 ? (
                      <Card className="border-[#EBEBEB]/10 bg-[#121C2B]/30">
                        <CardContent className="py-12 text-center">
                          <History className="mx-auto mb-4 h-12 w-12 text-[#EBEBEB]/30" />
                          <h3 className="mb-2 text-lg font-medium text-[#EBEBEB]">
                            No transactions yet
                          </h3>
                          <p className="text-[#EBEBEB]/70">
                            Your transaction history will appear here
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {user?.transactions.map((transaction) => (
                          <Card
                            key={transaction.id}
                            className="border-[#EBEBEB]/10 bg-[#121C2B]/30"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className={`border-[#EBEBEB]/20 ${getStatusColor(transaction.status)}`}
                                    >
                                      {transaction.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div className="mt-1 flex items-center space-x-4 text-sm text-[#EBEBEB]/70">
                                    <span>
                                      {formatDate(transaction.timestamp)}
                                    </span>
                                    <span>
                                      Method:{" "}
                                      {transaction.paymentMethod.toUpperCase()}
                                    </span>
                                    {/* {transaction.tokens && <span>Tokens: {transaction.tokens}</span>} */}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-[#EBEBEB]">
                                    {formatPrice(
                                      Number(transaction.amount || 0),
                                      "USD"
                                    )}
                                  </div>
                                  <div className="text-sm text-[#EBEBEB]/70">
                                    {formatPrice(
                                      Number(transaction.amount || 0)
                                    )}
                                    {/* Price amount */}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainSection>
  );
}

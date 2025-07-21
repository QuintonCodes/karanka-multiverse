"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MainSection from "@/components/ui/main-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { formatPrice } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Eye,
  EyeOff,
  History,
  Settings,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { MetaMaskConnect } from "@/components/metamask-connect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const accountSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  walletAddress: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    setAvatarUrl(file.name);
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: "",
      city: "",
      postalCode: "",
      walletAddress: user?.wallet?.address || "",
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    setIsSubmitting(true);
    updateUser(data);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  if (!user) {
    // return (
    //   <MainSection className="w-full mx-auto px-4 py-32">
    //     <div className="flex items-center justify-center">
    //       <div className="text-center">
    //         <h1 className="text-2xl font-bold text-[#EBEBEB]">
    //           Please log in to view your account
    //         </h1>
    //       </div>
    //     </div>
    //   </MainSection>
    // );
    console.log("Cool");
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 border-green-400/20";
      case "pending":
        return "text-yellow-400 border-yellow-400/20";
      case "failed":
        return "text-red-400 border-red-400/20";
      default:
        return "text-[#EBEBEB]/70 border-[#EBEBEB]/20";
    }
  };

  return (
    <MainSection>
      <div className="w-full mx-auto px-4 py-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EBEBEB]">
            Account Settings
          </h1>
          <p className="mt-2 text-[#EBEBEB]/70">
            Manage your profile, wallet, and transaction history
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6">
              <div className="mb-6 text-center">
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <div className="relative overflow-hidden">
                    <Image
                      src={user?.avatarUrl || avatarUrl || "/placeholder.svg"}
                      alt="User Avatar"
                      className="rounded-full object-cover"
                      fill
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#EBEBEB] text-[#11120E] hover:bg-[#EBEBEB]/90 transition-colors"
                  >
                    {isUploadingAvatar ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-[#11120E] border-t-transparent" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
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
                onValueChange={(value) => setActiveTab(value)}
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

              {/* <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#121C2B]/50 text-[#EBEBEB]"
                      : "text-[#EBEBEB]/70 hover:bg-[#121C2B]/30 hover:text-[#EBEBEB]"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("wallet")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "wallet"
                      ? "bg-[#121C2B]/50 text-[#EBEBEB]"
                      : "text-[#EBEBEB]/70 hover:bg-[#121C2B]/30 hover:text-[#EBEBEB]"
                  }`}
                >
                  <Wallet className="h-5 w-5" />
                  <span>Wallet</span>
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === "transactions"
                      ? "bg-[#121C2B]/50 text-[#EBEBEB]"
                      : "text-[#EBEBEB]/70 hover:bg-[#121C2B]/30 hover:text-[#EBEBEB]"
                  }`}
                >
                  <History className="h-5 w-5" />
                  <span>Transactions</span>
                </button>
              </nav> */}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardContent className="p-8">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value)}
                >
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
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant="outline"
                          className="border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                        >
                          {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                      </div>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    First Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#EBEBEB]">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditing}
                                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#EBEBEB]">
                                  Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditing}
                                    placeholder="Enter your address"
                                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    City
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      placeholder="Enter your city"
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    Postal Code
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      placeholder="Enter postal code"
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {isEditing && (
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
                            >
                              {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                          )}
                        </form>
                      </Form>
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
                                  {Number(user?.wallet?.balance || 0)}
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
                            <Form {...form}>
                              <FormField
                                control={form.control}
                                name="walletAddress"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          type={
                                            showWalletAddress
                                              ? "text"
                                              : "password"
                                          }
                                          {...field}
                                          placeholder="Enter your wallet address"
                                          className="border-[#EBEBEB]/20 bg-[#11120E] text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                          onClick={() =>
                                            setShowWalletAddress(
                                              !showWalletAddress
                                            )
                                          }
                                        >
                                          {showWalletAddress ? (
                                            <EyeOff className="h-4 w-4 text-[#EBEBEB]/70" />
                                          ) : (
                                            <Eye className="h-4 w-4 text-[#EBEBEB]/70" />
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </Form>
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
                                      ${transaction.amount.toFixed(2)}
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

            {/* <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-8">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#EBEBEB]">
                      Profile Information
                    </h2>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isEditing && (
                        <Button
                          type="submit"
                          className="border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                        >
                          Save Changes
                        </Button>
                      )}
                    </form>
                  </Form>
                </motion.div>
              )}

              {activeTab === "wallet" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="mb-6 text-2xl font-bold text-[#EBEBEB]">
                    Wallet Information
                  </h2>

                  <div className="mb-8 rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#EBEBEB]">
                          Token Balance
                        </h3>
                        <p className="text-3xl font-bold text-[#EBEBEB]">
                          {Number(user?.wallet?.balance) || 0}
                        </p>
                        <p className="text-sm text-[#EBEBEB]/70">
                          Available tokens
                        </p>
                      </div>
                      <Wallet className="h-12 w-12 text-[#EBEBEB]/50" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#EBEBEB] mb-2">
                        Wallet Address
                      </label>
                      <div className="relative">
                        <Input
                          type={showWalletAddress ? "text" : "password"}
                          value={user?.wallet?.address || "Not set"}
                          onChange={(e) =>
                            // updateUser({
                            //   wallet: {
                            //     ...user?.wallet,
                            //     value: user?.wallet.value,
                            //     address: e.target.value,
                            //   },
                            // })
                            console.log(e.target.value)
                          }
                          className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                          placeholder="Enter your wallet address"
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
                      <p className="mt-2 text-xs text-[#EBEBEB]/50">
                        Your cryptocurrency wallet address for token
                        transactions
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "transactions" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="mb-6 text-2xl font-bold text-[#EBEBEB]">
                    Transaction History
                  </h2>

                  {user?.transactions?.length === 0 ? (
                    <div className="py-12 text-center">
                      <History className="mx-auto mb-4 h-12 w-12 text-[#EBEBEB]/30" />
                      <h3 className="mb-2 text-lg font-medium text-[#EBEBEB]">
                        No transactions yet
                      </h3>
                      <p className="text-[#EBEBEB]/70">
                        Your transaction history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user?.transactions?.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={`border-[#EBEBEB]/20 ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-[#EBEBEB]/70">
                              <span>{formatDate(transaction.timestamp)}</span>
                              <span>
                                Method:{" "}
                                {transaction.paymentMethod.toUpperCase()}
                              </span>
                              <span>Tokens: {Number(transaction.amount)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-[#EBEBEB]">
                              ${transaction.amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-[#EBEBEB]/70">
                              {formatPrice(Number(transaction.amount))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </MainSection>
  );
}

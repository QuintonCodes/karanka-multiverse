"use client";

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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateAccount, uploadAvatar } from "@/app/actions/account";
import { MetaMaskConnect } from "@/components/metamask-connect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { accountSchema, avatarSchema } from "@/lib/schemas/account";
import { formatPrice } from "@/lib/utils";

type AccountFormValues = z.infer<typeof accountSchema>;
type AvatarFormValues = z.infer<typeof avatarSchema>;

export default function AccountPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  const { user, updateUser } = useAuth();

  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      avatar: undefined,
    },
  });

  const userForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
    },
  });

  async function handleAvatarUpload(data: AvatarFormValues) {
    const file = data.avatar;
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image must be less than ${maxSizeMB}MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await uploadAvatar(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Avatar uploaded successfully!");
      updateUser(result.user);
      avatarForm.reset();
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Unexpected error during upload. Please try again.");
    }
  }

  async function onSubmit(data: AccountFormValues) {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("postalCode", data.postalCode);

    try {
      const result = await updateAccount(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Account updated successfully!");
      updateUser(result.user);
      userForm.reset();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(
        "Unexpected server error while updating account. Please try again later."
      );
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getStatusColor(status: string) {
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
  }

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
  }

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
                <Form {...avatarForm}>
                  <form onSubmit={avatarForm.handleSubmit(handleAvatarUpload)}>
                    <FormField
                      control={avatarForm.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative mx-auto mb-4 h-20 w-20">
                              <div
                                className="relative overflow-hidden cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Avatar className="size-20">
                                  <AvatarImage
                                    src={user?.avatarUrl || "/placeholder.svg"}
                                    alt="User Avatar"
                                    className="object-cover border border-[#EBEBEB]/20"
                                  />
                                  <AvatarFallback className="text-[#11120E]">
                                    {user?.firstName?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              </div>

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                    avatarForm.handleSubmit(
                                      handleAvatarUpload
                                    )();
                                  }
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (!field.value)
                                    fileInputRef.current?.click();
                                }}
                                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#EBEBEB] text-[#11120E] hover:bg-[#EBEBEB]/90 transition-colors cursor-pointer"
                              >
                                {avatarForm.formState.isSubmitting ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border border-[#11120E] border-t-transparent" />
                                ) : (
                                  <Camera className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
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

                      <Form {...userForm}>
                        <form
                          onSubmit={userForm.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={userForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    First Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={userForm.formState.isSubmitting}
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={userForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={userForm.formState.isSubmitting}
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={userForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#EBEBEB]">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={userForm.formState.isSubmitting}
                                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={userForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#EBEBEB]">
                                  Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={userForm.formState.isSubmitting}
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
                              control={userForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    City
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={userForm.formState.isSubmitting}
                                      placeholder="Enter your city"
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={userForm.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#EBEBEB]">
                                    Postal Code
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={userForm.formState.isSubmitting}
                                      placeholder="Enter postal code"
                                      className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={userForm.formState.isSubmitting}
                            className="bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
                          >
                            {userForm.formState.isSubmitting
                              ? "Saving..."
                              : "Save Changes"}
                          </Button>
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
                                  {Number(user?.wallet?.balance || 0).toFixed(
                                    2
                                  )}
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

                      {!user?.transactions ? (
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
                          {user?.transactions &&
                            user.transactions.map((transaction) => (
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
          </div>
        </div>
      </div>
    </MainSection>
  );
}

"use client";

import { loginUser } from "@/app/actions/auth";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const isInstalled = false;
  const isConnected = false;
  const error = null;
  const isConnecting = false;
  const connectedWallet = "";

  /* TODO:
    1. Add forget password functionality
    2. Improve form functionality
  */

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = loginForm;

  const handleConnect = async () => {
    console.log("Connecting...");
  };

  async function copyAddress() {
    if (user?.wallet?.address) {
      await navigator.clipboard.writeText(user.wallet.address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function onSubmit(data: LoginFormValues) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await loginUser(formData);

    if (result.error) {
      toast.error("Login failed", {
        description: result.error || "Please try again.",
      });
      return;
    }

    setUser(result.user);

    toast.success("Welcome back!", {
      description: "You have been successfully logged in.",
    });

    reset();
    router.push(searchParams.get("redirect") || "/");
  }

  return (
    <MainSection className="min-h-screen flex items-center justify-center px-4 py-32">
      <Button
        className="absolute left-4 top-4 text-[#EBEBEB] hover:text-[#EBEBEB] hover:bg-transparent hover:scale-110"
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        aria-label="Go back"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-[#EBEBEB]/10 bg-transparent backdrop-blur-[1px] p-8 hover:shadow-lg hover:shadow-[#EBEBEB]/20 hover:scale-101 transition-all duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#EBEBEB]">Welcome Back</h1>
            <p className="mt-2 text-[#EBEBEB]/70">Sign in to your account</p>
          </div>

          <Tabs defaultValue="email">
            <TabsList className="grid w-full grid-cols-2 bg-[#121C2B]/50">
              <TabsTrigger
                value="email"
                className="flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="metamask"
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>MetaMask</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6 mt-6">
              <Form {...loginForm}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                              className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="metamask" className="space-y-6 mt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Wallet className="h-6 w-6 text-orange-400" />
                  <h3 className="text-lg font-semibold text-[#EBEBEB]">
                    MetaMask Login
                  </h3>
                </div>
                <p className="text-sm text-[#EBEBEB]/70">
                  Connect your MetaMask wallet to sign in securely without a
                  password.
                </p>
              </div>

              {/* MetaMask Connect */}
              <div>
                {!isInstalled ? (
                  <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
                        <Wallet className="h-8 w-8 text-orange-500" />
                      </div>
                      <CardTitle className="text-[#EBEBEB]">
                        MetaMask Not Detected
                      </CardTitle>
                      <CardDescription className="text-[#EBEBEB]/70">
                        Install MetaMask to connect your wallet and access all
                        features
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={() => {
                          window.open(
                            "https://metamask.io/download/",
                            "_blank"
                          );
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Install MetaMask
                      </Button>
                      <p className="text-center text-xs text-[#EBEBEB]/50">
                        After installation, refresh this page to connect your
                        wallet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                            <Wallet className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <CardTitle className="text-[#EBEBEB]">
                              MetaMask Wallet
                            </CardTitle>
                            <CardDescription className="text-[#EBEBEB]/70">
                              {isConnected
                                ? "Connected"
                                : "Connect your MetaMask wallet"}
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
                      {error && (
                        <Alert className="border-red-400/20 bg-red-400/10">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-400">
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {!isConnected ? (
                        <Button
                          onClick={handleConnect}
                          disabled={isConnecting}
                          className="w-full"
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Wallet className="mr-2 h-4 w-4" />
                              Connect MetaMask
                            </>
                          )}
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={copyAddress}
                                >
                                  {copied ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                              <p className="font-mono text-sm text-[#EBEBEB] break-all">
                                {user.wallet.address}
                              </p>
                            </div>

                            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                              <div className="mb-2 text-sm font-medium text-[#EBEBEB]/70">
                                Balance
                              </div>
                              <p className="text-lg font-semibold text-[#EBEBEB]">
                                {Number(user.wallet.balance).toFixed(6)} KRK
                              </p>
                            </div>

                            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                              <div className="mb-2 text-sm font-medium text-[#EBEBEB]/70">
                                Network
                              </div>
                              {/* <p className="text-sm text-[#EBEBEB]">
                                                {wallet.chainId === "0x1"
                                                  ? "Ethereum Mainnet"
                                                  : `Chain ID: ${wallet.chainId}`}
                                              </p> */}
                            </div>

                            <Separator className="bg-[#EBEBEB]/10" />

                            <Button
                              variant="outline"
                              // onClick={disconnectWallet}
                              className="w-full border-[#EBEBEB]/20 bg-transparent"
                            >
                              Disconnect Wallet
                            </Button>
                          </motion.div>
                        )
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {connectedWallet && (
                <Button
                  // onClick={handleMetaMaskLogin}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
                >
                  {isSubmitting ? "Signing in..." : "Sign In with MetaMask"}
                </Button>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#EBEBEB]/70">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/register"
              className="font-medium text-[#EBEBEB] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </MainSection>
  );
}

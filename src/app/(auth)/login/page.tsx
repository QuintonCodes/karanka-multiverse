"use client";

import { ArrowLeft, Loader2, Mail, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signMessage } from "wagmi/actions";

import { getWalletNonce, verifyWalletLogin } from "@/app/actions/metamask";
import { MetaMaskConnect } from "@/components/metamask-connect";
import { Button } from "@/components/ui/button";
import { MainSection } from "@/components/ui/main-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { useWalletConnection } from "@/hooks/use-wallet-connection";
import { config } from "@/lib/wagmi";
import LoginForm from "./login-form";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();
  const { isConnected, address } = useWalletConnection();

  async function handleMetaMaskLogin() {
    if (!isConnected || !address) {
      toast.error("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      setIsLoading(true);

      const nonceResponse = await getWalletNonce(address);
      if (!nonceResponse.success || !nonceResponse.nonce) {
        toast.error(nonceResponse.error || "Failed to get nonce.");
        return;
      }

      let signature: string;
      try {
        signature = await signMessage(config, { message: nonceResponse.nonce });
      } catch (error) {
        console.error("Signature error:", error);
        toast.error("Message signing was cancelled.");
        return;
      }

      const result = await verifyWalletLogin(address, signature);
      if (!result.success) {
        toast.error(result.error || "MetaMask login failed.");
        return;
      }

      setUser(result.user);

      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error) {
      console.error("MetaMask login error:", error);
      toast.error("MetaMask login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MainSection className="min-h-screen flex items-center justify-center px-4 py-32">
      <Button
        className="absolute left-4 top-4 text-[#EBEBEB] hover:text-[#EBEBEB] hover:bg-transparent hover:scale-110"
        variant="ghost"
        size="icon"
        aria-label="Go back"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="size-5" />
        </Link>
      </Button>

      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-[#EBEBEB]/10 bg-transparent backdrop-blur-[1px] p-8 hover:shadow-lg hover:shadow-[#EBEBEB]/20 hover:scale-101 transition-all duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#EBEBEB]">Welcome Back</h1>
            <p className="mt-2 text-[#EBEBEB]/70">Login to your account</p>
          </div>

          <Tabs defaultValue="email">
            <TabsList className="grid w-full grid-cols-2 bg-[#121C2B]/50">
              <TabsTrigger
                value="email"
                className="flex items-center space-x-2 text-[#EBEBEB] data-[state=active]:text-foreground"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="metamask"
                className="flex items-center space-x-2 text-[#EBEBEB] data-[state=active]:text-foreground"
              >
                <Wallet className="h-4 w-4" />
                <span>MetaMask</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6 mt-6">
              <LoginForm />
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
                  Connect your MetaMask wallet to login securely without a
                  password.
                </p>
              </div>

              {/* MetaMask Connect */}
              <MetaMaskConnect showBalance={true} />

              <Button
                onClick={handleMetaMaskLogin}
                disabled={!isConnected || isLoading}
                className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Login with MetaMask
                  </>
                )}
              </Button>
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

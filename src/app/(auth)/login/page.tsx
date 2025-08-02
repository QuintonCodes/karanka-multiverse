"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Mail, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { loginUser } from "@/app/actions/auth";
import { MetaMaskConnect } from "@/components/metamask-connect";
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
import { useMetaMaskStore } from "@/lib/stores/metamask-store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuth();
  const { isConnected } = useMetaMaskStore();

  // TODO: 1. Add forget password functionality

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await loginUser(formData);

      if (result.error) {
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              loginForm.setError(field as keyof LoginFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          });

          toast.error("Please correct the highlighted fields.");
        } else {
          toast.error("Login failed", {
            description: result.error || "An unexpected error occurred.",
          });
        }
        return;
      }

      setUser(result.user);

      toast.success("Welcome back!", {
        description: "You have been successfully logged in.",
      });

      loginForm.reset();
      router.push(searchParams.get("redirect") || "/");
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
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
                <form
                  onSubmit={loginForm.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={loginForm.control}
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
                    control={loginForm.control}
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
                    disabled={loginForm.formState.isSubmitting}
                    className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                  >
                    {loginForm.formState.isSubmitting
                      ? "Logging in..."
                      : "Login"}
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
                  Connect your MetaMask wallet to login securely without a
                  password.
                </p>
              </div>

              {/* MetaMask Connect */}
              <MetaMaskConnect />

              {isConnected && (
                <Button
                  // onClick={handleMetaMaskLogin}
                  // disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
                >
                  {loginForm.formState.isSubmitting
                    ? "Logging in..."
                    : "Login with MetaMask"}
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

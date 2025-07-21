"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { registerUser } from "@/app/actions/auth";
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

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const connectedWallet = false;

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formData.append(key, value.toString());
        }
      });

      const result = await registerUser(formData);

      if (result.error) {
        toast.error("Registration failed", {
          description: result.error || "Please try registering again.",
        });
        return;
      }

      toast.success("Registration successful!", {
        description: "Your account has been created successfully.",
      });

      registerForm.reset();
      router.push("/login");
    } catch (error) {
      toast.error("Error during registration", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <MainSection className="flex items-center justify-center px-4 py-32">
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
            <h1 className="text-2xl font-bold text-[#EBEBEB]">
              Create Account
            </h1>
            <p className="mt-2 text-[#EBEBEB]/70">
              Join the Karanka Multiverse
            </p>
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
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
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

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              {...field}
                              className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
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
                    disabled={registerForm.formState.isSubmitting}
                    className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                  >
                    {registerForm.formState.isSubmitting
                      ? "Creating account..."
                      : "Create Account & Wallet"}
                  </Button>
                </form>
              </Form>

              <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                <h4 className="mb-2 text-sm font-medium text-[#EBEBEB]">
                  Email Registration Process:
                </h4>
                <ol className="space-y-1 text-xs text-[#EBEBEB]/70">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Create your account</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-[#EBEBEB]/50" />
                    <span>Verify your email address</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Wallet className="h-3 w-3 text-[#EBEBEB]/50" />
                    <span>Get your crypto wallet</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-[#EBEBEB]/50" />
                    <span>Start trading securely</span>
                  </li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="metamask" className="space-y-6 mt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Wallet className="h-6 w-6 text-orange-400" />
                  <h3 className="text-lg font-semibold text-[#EBEBEB]">
                    MetaMask Registration
                  </h3>
                </div>
                <p className="text-sm text-[#EBEBEB]/70">
                  Connect your MetaMask wallet to create an account instantly.
                  No email verification required.
                </p>
              </div>

              {/* MetaMask Connect */}
              <MetaMaskConnect />

              {connectedWallet && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-400/20 bg-green-400/10 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">
                        Wallet Connected
                      </span>
                    </div>
                    <p className="text-xs text-[#EBEBEB]/70">
                      Your MetaMask wallet is connected. Click below to complete
                      registration.
                    </p>
                  </div>

                  <Button
                    // onClick={handleMetaMaskRegistration}
                    disabled={registerForm.formState.isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
                  >
                    {registerForm.formState.isSubmitting
                      ? "Creating account..."
                      : "Complete Registration"}
                  </Button>
                </div>
              )}

              <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                <h4 className="mb-2 text-sm font-medium text-[#EBEBEB]">
                  MetaMask Benefits:
                </h4>
                <ul className="space-y-1 text-xs text-[#EBEBEB]/70">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Instant account creation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>No email verification needed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Enhanced security with wallet signatures</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Direct crypto asset management</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#EBEBEB]/70">Already have an account? </span>
            <Link
              href="/login"
              className="font-medium text-[#EBEBEB] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </MainSection>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { packages } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const tokenCheckoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),

  cardNumber: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
});

type TokenCheckoutFormValues = z.infer<typeof tokenCheckoutSchema>;

export default function TokenCheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package");
  const tokenPackage = useMemo(
    () => packages.find((pkg) => pkg.id === packageId) || null,
    [packageId]
  );

  const tokenCheckoutForm = useForm<TokenCheckoutFormValues>({
    resolver: zodResolver(tokenCheckoutSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
    },
  });

  if (!tokenPackage) {
    router.push("/tokens");
    return null;
  }

  async function onSubmit(data: TokenCheckoutFormValues) {
    try {
      // Simulate payment processing (replace with real API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Implement server action with payment

      console.log(data);

      toast.success(
        "Payment successful! Tokens have been added to your account."
      );
      router.push("/dashboard"); // or wherever you want to redirect
    } catch (error) {
      toast.error("Payment failed. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <MainSection>
      <section className="w-full mx-auto px-4 py-32">
        <div className="mb-6">
          <Link
            href="/tokens"
            className="mb-2 flex items-center text-sm text-[#EBEBEB]/70 hover:text-[#EBEBEB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Token Page
          </Link>
          <h1 className="text-3xl font-bold text-[#EBEBEB]">Checkout</h1>
          <p className="mt-2 text-[#EBEBEB]/70">
            Complete your purchase securely
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardHeader>
                <CardTitle className="text-[#EBEBEB]">
                  Billing Information
                </CardTitle>
                <CardDescription className="text-[#EBEBEB]/70">
                  Please provide your billing details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...tokenCheckoutForm}>
                  <form
                    onSubmit={tokenCheckoutForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={tokenCheckoutForm.control}
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
                        control={tokenCheckoutForm.control}
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
                      control={tokenCheckoutForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              {...field}
                              className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={tokenCheckoutForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St"
                              {...field}
                              className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={tokenCheckoutForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cape Town"
                                {...field}
                                className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={tokenCheckoutForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="8001"
                                {...field}
                                className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="bg-[#EBEBEB]/10" />

                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-[#EBEBEB]">
                        Card Details
                      </h3>

                      <FormField
                        control={tokenCheckoutForm.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Name as it appears on card"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={tokenCheckoutForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={tokenCheckoutForm.control}
                          name="expiryMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Month</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem
                                      key={i + 1}
                                      value={String(i + 1).padStart(2, "0")}
                                    >
                                      {String(i + 1).padStart(2, "0")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={tokenCheckoutForm.control}
                          name="expiryYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="YYYY" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return (
                                      <SelectItem
                                        key={year}
                                        value={String(year)}
                                      >
                                        {year}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={tokenCheckoutForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123"
                                  maxLength={4}
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={tokenCheckoutForm.formState.isSubmitting}
                      className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                    >
                      {tokenCheckoutForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Complete Purchase
                        </>
                      )}
                    </Button>

                    <div className="text-center text-xs text-[#EBEBEB]/50">
                      <Shield className="inline h-3 w-3 mr-1" />
                      Your payment is secured by PayFast&apos;s
                      industry-standard encryption
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-[#EBEBEB]/10 bg-[#11120E] sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#EBEBEB]">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Package Details */}
                <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-[#EBEBEB]">
                        {tokenPackage.name}
                      </div>
                      <div className="text-sm text-[#EBEBEB]/70">
                        {tokenPackage.description}
                      </div>
                    </div>
                    {tokenPackage.popular && (
                      <Badge
                        variant="outline"
                        className="border-[#EBEBEB]/20 bg-[#EBEBEB]/10 text-[#EBEBEB]"
                      >
                        Popular
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#EBEBEB]/70">Tokens</span>
                      <span className="font-medium text-[#EBEBEB]">
                        {tokenPackage.tokens}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#EBEBEB]/70">Price (USD)</span>
                      <span className="font-medium text-[#EBEBEB]">
                        ${tokenPackage.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#EBEBEB]/70">Price (ZAR)</span>
                      <span className="font-medium text-[#EBEBEB]">
                        {formatPrice(tokenPackage.zarPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#EBEBEB]/10" />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-[#EBEBEB]">Total (USD)</span>
                    <span className="text-[#EBEBEB]">
                      ${tokenPackage.price}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-[#EBEBEB]">Total (ZAR)</span>
                    <span className="text-[#EBEBEB]">
                      {formatPrice(tokenPackage.zarPrice)}
                    </span>
                  </div>
                  <div className="text-right text-sm text-[#EBEBEB]/70">
                    {tokenPackage.tokens} tokens • $
                    {(tokenPackage.price / tokenPackage.tokens).toFixed(3)} per
                    token
                  </div>
                </div>

                {/* Security Features */}
                <Card className="border-[#EBEBEB]/10 bg-[#121C2B]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-[#EBEBEB]">
                        Secure Payment
                      </span>
                    </div>
                    <ul className="text-xs text-[#EBEBEB]/70 space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>SSL encrypted transactions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>PCI DSS compliant</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Multiple payment methods</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Current Balance */}
                {user && (
                  <Card className="border-[#EBEBEB]/10 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-[#EBEBEB]">
                            Current Balance
                          </span>
                        </div>
                        <span className="font-semibold text-[#EBEBEB]">
                          {Number(user.wallet?.balance || 0)} tokens
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-[#EBEBEB]/70">
                        After purchase:{" "}
                        {Number(user.wallet?.balance || 0) +
                          tokenPackage.tokens}{" "}
                        tokens
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainSection>
  );
}

"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  Shield,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { useCart } from "@/context/cart-provider";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  paymentMethod: z.enum(["payfast", "tokens"]),

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

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const checkoutForm = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "payfast",

      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = checkoutForm;

  const totalTokens = items.reduce((sum, item) => sum + item.tokens, 0);
  const hasInsufficientTokens =
    (Number(user?.wallet?.balance) || 0) < totalTokens;

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  async function onSubmit(data: CheckoutFormValues) {
    // TODO: Implement functionality later
    console.log(data);
  }

  return (
    <MainSection>
      <section className="w-full mx-auto px-4 py-32">
        <div className="mb-6">
          <Link
            href="/cart"
            className="mb-2 flex items-center text-sm text-[#EBEBEB]/70 hover:text-[#EBEBEB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-[#EBEBEB]">Checkout</h1>
          <p className="mt-2 text-[#EBEBEB]/70">
            Complete your purchase securely
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6">
              <h2 className="mb-6 text-xl font-semibold text-[#EBEBEB]">
                Billing Information
              </h2>

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
                  <Form {...checkoutForm}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={control}
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
                          control={control}
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
                        control={control}
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
                        control={control}
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
                          control={control}
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
                          control={control}
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
                        <h3 className="text-lg font-medium text-[#EBEBEB]">
                          Payment Method
                        </h3>

                        <FormField
                          control={control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-4"
                                >
                                  <div className="flex items-center space-x-2 rounded-lg border border-[#EBEBEB]/20 p-4">
                                    <RadioGroupItem
                                      value="payfast"
                                      id="payfast"
                                    />
                                    <label
                                      htmlFor="payfast"
                                      className="flex flex-1 items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <CreditCard className="h-5 w-5" />
                                        <div>
                                          <div className="font-medium">
                                            PayFast Payment
                                          </div>
                                          <div className="text-sm text-[#EBEBEB]/70">
                                            Secure payment with credit card,
                                            debit card, or EFT
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Shield className="h-4 w-4 text-green-400" />
                                        <span className="text-xs text-green-400">
                                          Secure
                                        </span>
                                      </div>
                                    </label>
                                  </div>

                                  <div
                                    className={`flex items-center space-x-2 rounded-lg border p-4 ${
                                      hasInsufficientTokens
                                        ? "border-red-400/20 bg-red-400/5"
                                        : "border-[#EBEBEB]/20"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      value="tokens"
                                      id="tokens"
                                      disabled={hasInsufficientTokens}
                                    />
                                    <label
                                      htmlFor="tokens"
                                      className="flex flex-1 items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <Wallet className="h-5 w-5" />
                                        <div>
                                          <div className="font-medium">
                                            Pay with Tokens
                                          </div>
                                          <div className="text-sm text-[#EBEBEB]/70">
                                            Use your token balance (
                                            {Number(user?.wallet?.balance) || 0}{" "}
                                            available)
                                          </div>
                                          {hasInsufficientTokens && (
                                            <div className="text-sm text-red-400">
                                              Insufficient balance. Need{" "}
                                              {totalTokens} tokens.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                      >
                        {isSubmitting ? (
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
          </div>

          <div className="space-y-4">
            <Card className="border-[#EBEBEB]/10 bg-[#11120E] sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#EBEBEB]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <div className="font-medium text-[#EBEBEB]">
                          {item.name}
                        </div>
                        <div className="text-sm text-[#EBEBEB]/70">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#EBEBEB]">
                          ${item.price}
                        </div>
                        <div className="text-sm text-[#EBEBEB]/70">
                          {item.tokens} Tokens
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#EBEBEB]/10" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#EBEBEB]/70">Subtotal</span>
                    <span className="text-[#EBEBEB]">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#EBEBEB]/70">ZAR Equivalent</span>
                    <span className="text-[#EBEBEB]">
                      {formatPrice(getTotalPrice() * 18.5)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#EBEBEB]/70">Tokens</span>
                    <span className="text-[#EBEBEB]">{totalTokens}</span>
                  </div>
                  <Separator className="bg-[#EBEBEB]/10" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-[#EBEBEB]">Total</span>
                    <div className="text-right">
                      <div className="text-[#EBEBEB]">
                        ${getTotalPrice().toFixed(2)}
                      </div>
                      <div className="text-sm text-[#EBEBEB]/70">
                        {formatPrice(getTotalPrice() * 18.5)}
                      </div>
                    </div>
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
              </CardContent>
            </Card>

            <Card className="border-[#EBEBEB]/10 bg-[#11120E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#EBEBEB]">
                  <CreditCard className="h-5 w-5" />
                  <span>Card Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...checkoutForm}>
                  <FormField
                    control={checkoutForm.control}
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
                    control={checkoutForm.control}
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
                              const value = e.target.value.replace(/\D/g, "");
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
                      control={checkoutForm.control}
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
                      control={checkoutForm.control}
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
                                  <SelectItem key={year} value={String(year)}>
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
                      control={checkoutForm.control}
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
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainSection>
  );
}

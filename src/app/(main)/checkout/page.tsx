"use client";

import {
  ArrowLeft,
  CheckCircle,
  Shield,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { EmptyCard } from "@/components/empty-card";
import CheckoutForm from "@/components/forms/checkout-form";
import OrderSummary from "@/components/order-summary";
import TokenSummary from "@/components/token-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MainSection } from "@/components/ui/main-section";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { useCart } from "@/context/cart-provider";
import { packages } from "@/lib/products";
import { calculateZarPrice, formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice } = useCart();

  const packageId = searchParams.get("package");
  const tokenPackage = packages.find((pkg) => pkg.id === packageId) || null;

  const checkoutType: "cart" | "tokens" =
    items.length > 0 ? "cart" : tokenPackage ? "tokens" : "cart";

  if (!tokenPackage && items.length === 0) {
    return (
      <MainSection className="mx-auto px-4 py-32 flex items-center justify-center">
        <EmptyCard
          title="Your cart is empty"
          description="Looks like you don't have anything to checkout yet."
        />
      </MainSection>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainSection className="mx-auto px-4 py-32 flex items-center justify-center">
        <EmptyCard
          title="Login required"
          description="Please login or register to continue to checkout."
          showAuthActions
        />
      </MainSection>
    );
  }

  // Totals
  const totalTokens =
    checkoutType === "tokens"
      ? tokenPackage?.tokens || 0
      : items.reduce((sum, item) => sum + item.tokens, 0);

  const totalPrice =
    checkoutType === "tokens" ? tokenPackage?.price || 0 : getTotalPrice();

  const totalZarPrice =
    checkoutType === "tokens"
      ? tokenPackage?.zarPrice || 0
      : calculateZarPrice(getTotalPrice());

  // Back link
  const backHref = checkoutType === "tokens" ? "/tokens" : "/cart";
  const backText = checkoutType === "tokens" ? "Tokens" : "Cart";

  return (
    <MainSection className="mx-auto px-4 py-32">
      <section>
        <div className="mb-6">
          <Link
            href={backHref}
            className="mb-2 flex items-center text-sm text-[#EBEBEB]/70 hover:text-[#EBEBEB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {backText}
          </Link>
          <h1 className="text-3xl font-bold text-[#EBEBEB]">
            {checkoutType === "tokens" ? "Complete Token Purchase" : "Checkout"}
          </h1>
          <p className="mt-2 text-[#EBEBEB]/70">
            {checkoutType === "tokens"
              ? "Secure checkout for your token package"
              : "Complete your purchase securely"}
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
                <CheckoutForm
                  user={user}
                  items={items}
                  checkoutType={checkoutType}
                  tokenPackage={tokenPackage}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-[#EBEBEB]/10 bg-[#11120E] sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#EBEBEB]">
                  {checkoutType === "tokens" ? (
                    <>
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span>Token Package</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 text-blue-400" />
                      <span>Order Summary</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {checkoutType === "tokens" && tokenPackage ? (
                  <TokenSummary tokenPackage={tokenPackage} />
                ) : (
                  <OrderSummary
                    items={items}
                    totalPrice={totalPrice}
                    totalZarPrice={totalZarPrice}
                    totalTokens={totalTokens}
                  />
                )}

                <Separator className="bg-[#EBEBEB]/10" />

                {/* Totals */}
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-[#EBEBEB]">Total</span>
                  <div className="text-right">
                    <div className="text-[#EBEBEB]">
                      {formatPrice(totalPrice, "USD")}
                    </div>
                    <div className="text-sm text-[#EBEBEB]/70">
                      {formatPrice(totalZarPrice)}
                    </div>
                    {checkoutType === "tokens" && (
                      <div className="text-sm text-[#EBEBEB]/70">
                        {tokenPackage?.tokens} tokens •{" "}
                        {formatPrice(
                          (tokenPackage?.price || 0) /
                            (tokenPackage?.tokens || 0),
                          "USD"
                        )}{" "}
                        per token
                      </div>
                    )}
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
          </div>
        </div>
      </section>
    </MainSection>
  );
}

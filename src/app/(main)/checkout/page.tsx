"use client";

import {
  ArrowLeft,
  CheckCircle,
  Shield,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import CheckoutForm from "@/components/forms/checkout-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainSection from "@/components/ui/main-section";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { CartItem, useCart } from "@/context/cart-provider";
import { packages } from "@/lib/products";
import { calculateZarPrice, formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice } = useCart();

  const packageId = searchParams.get("package");
  const tokenPackage = useMemo(
    () => packages.find((pkg) => pkg.id === packageId) || null,
    [packageId]
  );
  const [checkoutType, setCheckoutType] = useState<"cart" | "tokens">(
    tokenPackage ? "tokens" : "cart"
  );

  useEffect(() => {
    if (items.length > 0) {
      setCheckoutType("cart");
    }
  }, [items.length]);

  useEffect(() => {
    if (!tokenPackage && items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, tokenPackage, router]);

  // Totals
  const totalTokens = useMemo(
    () => items.reduce((sum, item) => sum + item.tokens, 0),
    [items]
  );
  const totalPrice = useMemo(
    () =>
      checkoutType === "tokens"
        ? formatPrice(tokenPackage?.price || 0, "USD")
        : formatPrice(getTotalPrice(), "USD"),
    [checkoutType, tokenPackage, getTotalPrice]
  );
  const totalZarPrice = useMemo(
    () =>
      checkoutType === "tokens"
        ? formatPrice(tokenPackage?.zarPrice || 0)
        : formatPrice(calculateZarPrice(getTotalPrice())),
    [checkoutType, tokenPackage, getTotalPrice]
  );

  // if (items.length === 0) {
  //   router.push("/cart");
  //   return null;
  // }

  if (!isAuthenticated || (!tokenPackage && items.length === 0)) {
    return null;
  }

  return (
    <MainSection className="mx-auto px-4 py-32">
      <section>
        <div className="mb-6">
          <Link
            href={checkoutType === "tokens" ? "/tokens" : "/cart"}
            className="mb-2 flex items-center text-sm text-[#EBEBEB]/70 hover:text-[#EBEBEB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {checkoutType === "tokens" ? "Tokens" : "Cart"}
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
                  <>
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
                            {formatPrice(tokenPackage.price, "USD")}
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
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <OrderItem key={item.id} item={item} />
                      ))}
                    </div>

                    <Separator className="bg-[#EBEBEB]/10" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#EBEBEB]/70">Subtotal</span>
                        <span className="text-[#EBEBEB]">
                          {formatPrice(getTotalPrice(), "USD")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#EBEBEB]/70">
                          ZAR Equivalent
                        </span>
                        <span className="text-[#EBEBEB]">
                          {formatPrice(calculateZarPrice(getTotalPrice()))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#EBEBEB]/70">Tokens</span>
                        <span className="text-[#EBEBEB]">{totalTokens}</span>
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-[#EBEBEB]/10" />

                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-[#EBEBEB]">Total</span>
                  <div className="text-right">
                    <div className="text-[#EBEBEB]">{totalPrice}</div>
                    <div className="text-sm text-[#EBEBEB]/70">
                      {totalZarPrice}
                    </div>
                    {checkoutType === "tokens" && (
                      <div className="text-sm text-[#EBEBEB]/70">
                        {tokenPackage?.tokens} tokens • $
                        {(
                          (tokenPackage?.price || 0) /
                          (tokenPackage?.tokens || 0)
                        ).toFixed(3)}{" "}
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

function OrderItem({ item }: { item: CartItem }) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="font-medium text-[#EBEBEB]">{item.name}</div>
        <div className="text-sm text-[#EBEBEB]/70">Qty: {item.quantity}</div>
      </div>
      <div className="text-right">
        <div className="font-medium text-[#EBEBEB]">
          {formatPrice(item.price, "USD")}
        </div>
        <div className="text-sm text-[#EBEBEB]/70">{item.tokens} Tokens</div>
      </div>
    </div>
  );
}

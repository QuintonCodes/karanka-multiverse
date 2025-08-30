"use client";

import { ArrowLeft, CheckCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import TokenCheckoutForm from "@/components/forms/token-checkout-form";
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
import { packages } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export default function TokenCheckoutPage() {
  const searchParams = useSearchParams();

  const { user } = useAuth();

  const packageId = searchParams.get("package");
  const tokenPackage = useMemo(
    () => packages.find((pkg) => pkg.id === packageId) || null,
    [packageId]
  );

  if (!tokenPackage) {
    return null;
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
                <TokenCheckoutForm user={user} />
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

                <Separator className="bg-[#EBEBEB]/10" />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-[#EBEBEB]">Total (USD)</span>
                    <span className="text-[#EBEBEB]">
                      {formatPrice(tokenPackage.price, "USD")}
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

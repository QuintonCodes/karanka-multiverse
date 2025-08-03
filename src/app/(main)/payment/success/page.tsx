"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { handlePayFastReturn } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import MainSection from "@/components/ui/main-section";
import { useAuth } from "@/context/auth-provider";
import { formatPrice } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [paymentDetails, setPaymentDetails] = useState<{
    success: boolean;
    paymentId?: string;
    amount?: number;
    message?: string;
    error?: string;
  }>({
    success: false,
    error: undefined,
    paymentId: "",
    amount: 0,
    message: "",
  });
  const { updateUser } = useAuth();

  useEffect(() => {
    const processPayment = async () => {
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (Object.keys(params).length > 0) {
        const result = await handlePayFastReturn(params);

        if (result.success) {
          setPaymentStatus("success");
          setPaymentDetails(result);

          // If it's a token purchase, add tokens to user account
          const customStr1 = params.custom_str1;
          if (customStr1 === "token_purchase") {
            const tokens = Number.parseInt(params.custom_int1 || "0");
            if (tokens > 0) {
              updateUser({
                wallet: {
                  balance: new Prisma.Decimal(tokens),
                  address: "",
                  id: "",
                  isVerified: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  userId: "",
                  value: new Prisma.Decimal(0),
                  chain: "",
                },
              });
            }
          }

          // Add completed transaction
          // addTransaction({
          //   userId: params.custom_str2 || "unknown",
          //   type: customStr1 === "token_purchase" ? "token_purchase" : "purchase",
          //   amount: Number.parseFloat(params.amount_gross || "0") / 18.5, // Convert ZAR back to USD
          //   zarAmount: Number.parseFloat(params.amount_gross || "0"),
          //   tokens: customStr1 === "token_purchase" ? Number.parseInt(params.custom_int1 || "0") : undefined,
          //   description: `Payment completed - ${params.item_name}`,
          //   status: "completed",
          //   paymentMethod: "payfast",
          // })
        } else {
          setPaymentStatus("error");
        }
      } else {
        setPaymentStatus("error");
      }
    };

    processPayment();
  }, [searchParams, updateUser]);

  return (
    <MainSection>
      <section className="w-full mx-auto px-4 py-32">
        <div className="mx-auto max-w-md text-center">
          {paymentStatus === "loading" && (
            <div>
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#EBEBEB] border-t-transparent mx-auto"></div>
              <h1 className="text-2xl font-bold text-[#EBEBEB] mb-4">
                Processing Payment...
              </h1>
              <p className="text-[#EBEBEB]/70">
                Please wait while we confirm your payment.
              </p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div>
              <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-400" />
              <h1 className="text-3xl font-bold text-[#EBEBEB] mb-4">
                Payment Successful!
              </h1>
              <p className="text-[#EBEBEB]/70 mb-6">
                Your payment has been processed successfully. Thank you for your
                purchase!
              </p>

              {paymentDetails && (
                <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6 mb-6 text-left">
                  <h3 className="font-semibold text-[#EBEBEB] mb-4">
                    Payment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#EBEBEB]/70">Payment ID:</span>
                      <span className="text-[#EBEBEB]">
                        {paymentDetails.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#EBEBEB]/70">Amount:</span>
                      <span className="text-[#EBEBEB]">
                        {formatPrice(paymentDetails.amount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                  asChild
                >
                  <Link href="/account">View Account</Link>
                </Button>
              </div>
            </div>
          )}

          {paymentStatus === "error" && (
            <div>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-2xl text-red-400">✕</span>
              </div>
              <h1 className="text-3xl font-bold text-[#EBEBEB] mb-4">
                Payment Failed
              </h1>
              <p className="text-[#EBEBEB]/70 mb-6">
                There was an issue processing your payment. Please try again or
                contact support.
              </p>

              <div className="space-y-4">
                <Button
                  className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                  asChild
                >
                  <Link href="/cart">Return to Cart</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-[#EBEBEB] border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
                  asChild
                >
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainSection>
  );
}

"use client";

import axios from "axios";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { MainSection } from "@/components/ui/main-section";
import { useAuth } from "@/context/auth-provider";
import { formatPrice } from "@/lib/utils";

type PaymentDetails = {
  id: string;
  amount: number;
  status: "pending" | "confirmed" | "failed" | "expired" | "refunded";
  productType: "onceOff" | "subscription" | "tokenPackage" | "unavailable";
  productName: string;
  productTokens?: number;
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  const transactionId = searchParams.get("txn") || "";
  const { updateUser } = useAuth();

  useEffect(() => {
    async function processPayment() {
      if (!transactionId) {
        setPaymentStatus("error");
        return;
      }

      try {
        const response = await axios.get(`/api/payments/${transactionId}`);
        if (response.status !== 200) {
          setPaymentStatus("error");
          return;
        }

        const data = response.data;

        if (!data) {
          setPaymentStatus("error");
          return;
        }

        setPaymentDetails(data);

        if (data.payment.status === "confirmed") {
          setPaymentStatus("success");

          // If tokens purchased, update user wallet locally
          if (
            data.payment.productType === "tokenPackage" &&
            data.payment.productTokens &&
            data.payment.productTokens > 0
          ) {
            updateUser((prev) => ({
              ...prev,
              wallet: {
                ...prev.wallet!,
                balance:
                  (Number(prev.wallet?.balance) || 0) +
                  data.payment.productTokens!,
              },
            }));
          }
        } else {
          setPaymentStatus("error");
        }
      } catch (error) {
        console.error("Error fetching payment:", error);
        setPaymentStatus("error");
      }
    }

    processPayment();
  }, [searchParams, transactionId, updateUser]);

  return (
    <MainSection className="mx-auto px-4 py-32">
      <div className="max-w-md text-center">
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
                    <span className="text-[#EBEBEB]/70">Transaction ID:</span>
                    <span className="text-[#EBEBEB]">{transactionId}</span>
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
                <Link href="/">
                  Go to Home
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
    </MainSection>
  );
}

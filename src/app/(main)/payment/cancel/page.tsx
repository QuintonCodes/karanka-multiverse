import { ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MainSection } from "@/components/ui/main-section";

export default function PaymentCancelPage() {
  return (
    <MainSection>
      <section className="w-full mx-auto px-4 py-32">
        <div className="mx-auto max-w-md text-center">
          <XCircle className="mx-auto mb-6 h-16 w-16 text-yellow-400" />
          <h1 className="text-3xl font-bold text-[#EBEBEB] mb-4">
            Payment Cancelled
          </h1>
          <p className="text-[#EBEBEB]/70 mb-6">
            Your payment was cancelled. No charges have been made to your
            account.
          </p>

          <div className="space-y-4">
            <Button
              className="w-full border border-[#EBEBEB]/20 bg-linear-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
              asChild
            >
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Cart
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full text-[#EBEBEB] border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
              asChild
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainSection>
  );
}

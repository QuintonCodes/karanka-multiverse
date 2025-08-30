"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { UserType } from "@/context/auth-provider";
import {
  TokenCheckoutFormValues,
  tokenCheckoutSchema,
} from "@/lib/schemas/checkout";
import BillingDetailsFields from "../billing-details-fields";
import { CardDetailsFields } from "../card-details-fields";

export default function TokenCheckoutForm({ user }: { user: UserType | null }) {
  const router = useRouter();

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
    <Form {...tokenCheckoutForm}>
      <form
        onSubmit={tokenCheckoutForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <BillingDetailsFields />

        <Separator className="bg-[#EBEBEB]/10" />

        <div className="space-y-4">
          <h3 className="text-base font-medium text-[#EBEBEB]">Card Details</h3>

          <CardDetailsFields />
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
          Your payment is secured by PayFast&apos;s industry-standard encryption
        </div>
      </form>
    </Form>
  );
}

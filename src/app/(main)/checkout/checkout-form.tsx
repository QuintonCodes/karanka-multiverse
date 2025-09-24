"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, CreditCard, Loader2, Shield, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { checkoutCart, checkoutTokenPackage } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuth, UserType } from "@/context/auth-provider";
import { CartItem, useCart } from "@/context/cart-provider";
import { Package } from "@/lib/products";
import { CheckoutFormValues, checkoutSchema } from "@/lib/schemas/checkout";
import BillingDetailsFields from "../../../components/billing-details-fields";

type CheckoutFormProps = {
  user: UserType | null;
  items: CartItem[];
  checkoutType: "cart" | "tokens";
  tokenPackage: Package | null;
};

export default function CheckoutForm({
  user,
  items,
  checkoutType,
  tokenPackage,
}: CheckoutFormProps) {
  const { updateUser } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  const totalTokens = items.reduce((sum, item) => sum + item.tokens, 0);
  const hasInsufficientTokens =
    (Number(user?.wallet?.balance) || 0) < totalTokens;

  const checkoutForm = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      paymentMethod: "debitCard",
    },
  });

  const { control, formState } = checkoutForm;

  async function onSubmit(data: CheckoutFormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      let result;
      if (checkoutType === "cart") {
        result = await checkoutCart(formData, items);
      } else if (checkoutType === "tokens") {
        result = await checkoutTokenPackage(formData, tokenPackage);
      }
      if (result?.error) {
        if (result.details) {
          toast.error(
            checkoutType === "cart"
              ? "Cart Checkout Failed"
              : "Token Purchase Failed",
            {
              description: "Validation failed.",
            }
          );
        } else {
          toast.error(
            checkoutType === "cart"
              ? "Cart Checkout Failed"
              : "Token Purchase Failed",
            {
              description: result.error,
            }
          );
        }
        return;
      }

      // Success toast
      toast.success(
        checkoutType === "cart"
          ? "Checkout successful!"
          : "Token purchase successful!",
        {
          description:
            checkoutType === "cart"
              ? "Your order has been placed successfully."
              : "Your token package has been purchased successfully.",
        }
      );

      updateUser(data);

      if (checkoutType === "cart") {
        clearCart();
      }

      checkoutForm.reset();

      // Redirect to PayFast or confirmation page
      if (result?.redirectUrl) {
        router.push(result.redirectUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Client error in checkout form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...checkoutForm}>
      <form
        onSubmit={checkoutForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <BillingDetailsFields />

        {checkoutType === "cart" && (
          <>
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
                        className="space-y-4 text-[#EBEBEB]"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border border-[#EBEBEB]/20 p-4">
                          <RadioGroupItem value="debitCard" id="debitCard" />
                          <label
                            htmlFor="debitCard"
                            className="flex flex-1 items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-5 w-5" />
                              <div>
                                <div className="font-medium">
                                  PayFast Payment
                                </div>
                                <div className="text-sm text-[#EBEBEB]/70">
                                  Secure payment with credit card, debit card,
                                  or EFT
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
                            value="tokenPurchase"
                            id="tokenPurchase"
                            disabled={hasInsufficientTokens}
                          />
                          <label
                            htmlFor="tokenPurchase"
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
                                    Insufficient balance. Need {totalTokens}{" "}
                                    tokens.
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
          </>
        )}

        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
        >
          {formState.isSubmitting ? (
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

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { verifyEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/context/auth-provider";
import { VerifyForm, verifySchema } from "@/lib/schemas/auth";

export default function VerifyEmailForm({
  expiresAt,
  timeRemaining,
}: {
  expiresAt: Date | null;
  timeRemaining: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const { setUser } = useAuth();

  const isExpired = timeRemaining === 0 && expiresAt !== null;

  const verifyForm = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailFromUrl,
      code: "",
    },
  });

  async function onSubmit(data: VerifyForm) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("code", data.code);

    try {
      const result = await verifyEmail(formData);

      if (result.error) {
        if (result.details) {
          toast.error("Please correct the highlighted fields.");
        } else {
          toast.error("Verification failed", {
            description: result.error,
          });
        }
        return;
      }

      setUser(result.user);

      toast.success("Email verified successfully. You are now logged in.");
      verifyForm.reset();
      router.push("/");
    } catch (error) {
      console.error("Client error in verify email form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...verifyForm}>
      <form onSubmit={verifyForm.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={verifyForm.control}
          name="code"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center justify-center">
                Verification Code
              </FormLabel>
              <FormControl>
                <div className="flex items-center justify-center">
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={verifyForm.formState.isSubmitting || isExpired}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={verifyForm.formState.isSubmitting || isExpired}
          className="w-full border border-[#EBEBEB]/20 bg-linear-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
        >
          {verifyForm.formState.isSubmitting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Email
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

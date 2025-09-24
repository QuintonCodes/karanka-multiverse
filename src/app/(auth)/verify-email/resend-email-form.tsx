"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resendVerificationCode } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { resendSchema, type ResendForm } from "@/lib/schemas/auth";

export default function ResendEmailForm({
  startResendCooldown,
  startExpiry,
}: {
  startResendCooldown: (ms: number) => void;
  startExpiry: (ms: number) => void;
}) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const resendForm = useForm<ResendForm>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: emailFromUrl,
    },
  });

  async function handleResendCode() {
    const email = resendForm.getValues("email");
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    try {
      const result = await resendVerificationCode(formData);

      if (result.error) {
        if (result.details) {
          toast.error("Please correct the email field.");
        } else {
          toast.error("Resend Failed", {
            description: result.error,
          });
        }
        return;
      }

      startExpiry(15 * 60 * 1000);
      startResendCooldown(30 * 1000);

      toast.success("Verification code has been sent!");
    } catch (error) {
      console.error("Client error in resend email form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...resendForm}>
      <form
        onSubmit={resendForm.handleSubmit(handleResendCode)}
        className="space-y-2"
      >
        <Button
          type="submit"
          variant="outline"
          disabled={resendForm.formState.isSubmitting}
          className="w-full text-[#EBEBEB] border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
        >
          {resendForm.formState.isSubmitting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Resend Verification Email
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

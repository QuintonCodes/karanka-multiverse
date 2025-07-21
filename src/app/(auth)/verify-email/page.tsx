"use client";

import { resendVerificationCode, verifyEmail } from "@/app/actions/auth";
import MainSection from "@/components/ui/main-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Clock, Mail, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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
import { useVerificationTimers } from "@/hooks/use-verification-timers";

const verifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits"),
});

const resendSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type VerifyForm = z.infer<typeof verifySchema>;
type ResendForm = z.infer<typeof resendSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const { setUser } = useAuth();

  const {
    expiresAt,
    timeRemaining,
    resendCooldown,
    startResendCooldown,
    startExpiry,
  } = useVerificationTimers(null, 0);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const verifyForm = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailFromUrl,
      code: "",
    },
  });

  const resendForm = useForm<ResendForm>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: emailFromUrl,
    },
  });

  async function onSubmit(values: VerifyForm) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("code", values.code);

    const result = await verifyEmail(formData);

    if (result.error) {
      toast.error("Verification failed", {
        description: result.error || "Please try verifying again",
      });
      return;
    }

    setUser(result.user);

    toast.success("Email verified successfully. You are now logged in.");
    verifyForm.reset();
    router.push("/");
  }

  async function handleResendCode() {
    const email = verifyForm.getValues("email");
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    const result = await resendVerificationCode(formData);

    if (result.error) {
      toast.error("Resend Failed", {
        description: result.error,
      });
      return;
    }

    startExpiry(15 * 60 * 1000);
    startResendCooldown(30 * 1000);

    toast.success("Verification code has been sent!");
  }

  const isExpired = timeRemaining === 0 && expiresAt !== null;

  return (
    <MainSection className="px-4 py-32 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-[#EBEBEB]/10 p-8 bg-transparent backdrop-blur-[1px] hover:shadow-lg hover:shadow-[#EBEBEB]/20 hover:scale-101 transition-all duration-300">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#121C2B]/50">
              <Mail className="h-8 w-8 text-[#EBEBEB]/70" />
            </div>
            <h1 className="text-2xl font-bold text-[#EBEBEB]">
              Verify Your Email
            </h1>
            <p className="mt-2 text-[#EBEBEB]/70">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="font-medium text-[#EBEBEB]">{emailFromUrl}</p>
          </div>

          <div className="space-y-6">
            {/* Timer Display */}
            {expiresAt && !isExpired && (
              <div className="flex items-center justify-center space-x-2 text-sm text-[#EBEBEB]/70">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeRemaining)}</span>
              </div>
            )}

            {isExpired && (
              <div className="flex items-center justify-center space-x-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Verification code has expired</span>
              </div>
            )}

            <Form {...verifyForm}>
              <form
                onSubmit={verifyForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                            disabled={
                              verifyForm.formState.isSubmitting || isExpired
                            }
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
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
                  className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
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

            {/* Resend Section */}
            <div className="space-y-4 border-t border-[#EBEBEB]/10 pt-6">
              <div className="text-center text-sm text-[#EBEBEB]/70">
                Didn&apos;t receive the code?
              </div>

              {resendCooldown > 0 ? (
                <div className="text-center text-sm text-[#EBEBEB]/50">
                  Resend available in {formatTime(resendCooldown)}
                </div>
              ) : (
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
              )}
            </div>

            {/* Help Text */}
            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4 text-center">
              <p className="text-xs text-[#EBEBEB]/70">
                Check your spam folder if you don&apos;t see the email.
                <br />
                The verification code is valid for 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </MainSection>
  );
}

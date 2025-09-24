"use client";

import { AlertCircle, Clock, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";

import { MainSection } from "@/components/ui/main-section";
import { useVerificationTimers } from "@/hooks/use-verification-timers";
import { formatResendTime } from "@/lib/utils";
import ResendEmailForm from "./resend-email-form";
import VerifyEmailForm from "./verify-email-form";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const {
    expiresAt,
    timeRemaining,
    resendCooldown,
    startResendCooldown,
    startExpiry,
  } = useVerificationTimers(null, 0);

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
                <span>Code expires in {formatResendTime(timeRemaining)}</span>
              </div>
            )}

            {isExpired && (
              <div className="flex items-center justify-center space-x-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Verification code has expired</span>
              </div>
            )}

            <VerifyEmailForm
              expiresAt={expiresAt}
              timeRemaining={timeRemaining}
            />

            {/* Resend Section */}
            <div className="space-y-4 border-t border-[#EBEBEB]/10 pt-6">
              <div className="text-center text-sm text-[#EBEBEB]/70">
                Didn&apos;t receive the code?
              </div>

              {resendCooldown > 0 ? (
                <div className="text-center text-sm text-[#EBEBEB]/50">
                  Resend available in {formatResendTime(resendCooldown)}
                </div>
              ) : (
                <ResendEmailForm
                  startResendCooldown={startResendCooldown}
                  startExpiry={startExpiry}
                />
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

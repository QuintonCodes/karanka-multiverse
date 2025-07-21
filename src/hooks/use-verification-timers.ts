import { useEffect, useState } from "react";

export function useVerificationTimers(
  initialExpiresAt: Date | null,
  initialCooldown = 0
) {
  const [expiresAt, setExpiresAt] = useState<Date | null>(initialExpiresAt);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(initialCooldown);

  // Expiry timer
  useEffect(() => {
    if (!expiresAt) return;
    setTimeRemaining(Math.max(0, expiresAt.getTime() - Date.now()));
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt.getTime() - now);
      setTimeRemaining(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const startResendCooldown = (ms: number) => setResendCooldown(ms);
  const startExpiry = (ms: number) => setExpiresAt(new Date(Date.now() + ms));

  return {
    expiresAt,
    timeRemaining,
    resendCooldown,
    setExpiresAt,
    startResendCooldown,
    startExpiry,
  };
}

import { notFound } from "next/navigation";

import { MainSection } from "@/components/ui/main-section";
import { db } from "@/lib/db";
import { buildPayFastData } from "@/lib/payfast";
import PayFastForm from "./payfast-form";

export default async function RedirectCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ txn?: string }>;
}) {
  const { txn: transactionId } = await searchParams;
  if (!transactionId) return notFound();

  const payment = await db.payment.findUnique({
    where: { transactionReference: transactionId },
    include: {
      items: true,
      user: true,
      subscription: true,
    },
  });

  if (!payment || !payment.user) return notFound();

  // Determine if this specific payment is meant to be a subscription
  const isSubscription = payment.productType === "subscription";

  // Build PayFast data
  const payfastDataRaw = buildPayFastData({
    data: {
      firstName: payment.user.firstName || "",
      lastName: payment.user.lastName || "",
      email: payment.user.email,
      amount: Number(payment.amount).toFixed(2),
      name: payment.productName || "Cart Purchase",
      description: payment.productName || "Cart Purchase",
    },
    transactionId,
    isSubscription,
    subscriptionDetails: isSubscription
      ? {
          recurringAmount: Number(payment.amount).toFixed(2),
          frequency: 3, // PayFast frequency: 3 = Monthly
          cycles: 0, // 0 = indefinite billing cycles
        }
      : undefined,
  });

  if (!payfastDataRaw) return notFound();

  const payfastData: Record<string, string> = Object.fromEntries(
    Object.entries(payfastDataRaw).map(([key, value]) => [
      key,
      value !== undefined && value !== null ? String(value) : "",
    ]),
  );

  return (
    <MainSection className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="max-w-md w-full rounded-lg border bg-card p-6 shadow">
        <h1 className="text-xl font-semibold mb-4">
          Redirecting to PayFast...
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          You will be redirected shortly. If not, click the button below.
        </p>
        <PayFastForm payfastData={payfastData} />
      </div>
    </MainSection>
  );
}

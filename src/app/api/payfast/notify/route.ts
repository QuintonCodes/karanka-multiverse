import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { validatePayment } from "@/lib/payfast";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Validate the payment
    const isValid = await validatePayment(data);

    if (!isValid) {
      console.error("PayFast payment validation failed");
      return new NextResponse("Invalid", { status: 400 });
    }

    // Payment is valid - process it
    const transactionId = data.m_payment_id;
    const amount = Number(data.amount_gross || data.amount || "0");
    const paymentStatus = data.payment_status;
    const payfastMethod = data.payment_method;

    const methodMap: Record<string, "debitCard" | "creditCard" | "eft"> = {
      dc: "debitCard",
      cc: "creditCard",
      eft: "eft",
    };
    const mappedMethod = methodMap[payfastMethod];

    const paymentRecord = await db.payment.update({
      where: { transactionReference: transactionId },
      data: {
        status: paymentStatus === "COMPLETE" ? "confirmed" : "failed",
        amount,
        paymentMethod: mappedMethod,
      },
    });

    if (paymentStatus === "COMPLETE") {
      // Payment completed successfully
      if (paymentRecord.productType === "tokenPackage") {
        await db.wallet.update({
          where: { userId: paymentRecord.userId },
          data: { balance: { increment: paymentRecord.productTokens ?? 0 } },
        });
      }

      if (paymentRecord.productType === "subscription") {
        await db.subscription.updateMany({
          where: {
            userId: paymentRecord.userId,
            productId: paymentRecord.productId ?? "",
          },
          data: {
            status: "active",
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast ITN processing error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

// PayFast also sends GET requests to validate the notify URL
export async function GET() {
  return new NextResponse("PayFast Notify URL Active", { status: 200 });
}

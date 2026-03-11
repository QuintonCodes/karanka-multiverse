import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    // Find the payment using the transactionReference we created before sending to PayFast
    const payment = await db.payment.findUnique({
      where: {
        transactionReference: transactionId,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: payment.id,
      amount: Number(payment.amount),
      status: payment.status,
      productType: payment.productType,
      productName: payment.productName,
      productTokens: Number(payment.productTokens),
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

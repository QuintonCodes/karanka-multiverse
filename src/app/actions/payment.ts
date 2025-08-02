"use server";

import { payFastService } from "@/lib/payfast";
import { z } from "zod";

const paymentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  amount: z.number().positive(),
  itemName: z.string().min(1),
  itemDescription: z.string().optional(),
  paymentId: z.string().min(1),
  customData: z.record(z.string()).optional(),
});

const tokenPurchaseSchema = z.object({
  packageId: z.string().min(1, "Package ID is required"),
  packageName: z.string().min(1, "Package name is required"),
  tokens: z.number().positive("Token amount must be positive"),
  price: z.number().positive("Price must be positive"),
  zarPrice: z.number().positive("ZAR price must be positive"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  paymentMethod: z.enum(["payfast", "tokens"]),
});

export async function createPayFastPayment(
  data: z.infer<typeof paymentSchema>
) {
  try {
    const validatedData = paymentSchema.parse(data);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID || "",
      merchant_key: process.env.PAYFAST_MERCHANT_KEY || "",
      return_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      notify_url: `${baseUrl}/api/payfast/notify`,
      name_first: validatedData.firstName,
      name_last: validatedData.lastName,
      email_address: validatedData.email,
      m_payment_id: validatedData.paymentId,
      amount: validatedData.amount.toFixed(2),
      item_name: validatedData.itemName,
      item_description: validatedData.itemDescription || "",
      custom_str1: validatedData.customData?.type || "",
      custom_str2: validatedData.customData?.userId || "",
      custom_str3: validatedData.customData?.items || "",
    };

    const paymentWithSignature =
      payFastService.generatePaymentData(paymentData);
    const paymentUrl = payFastService.getPaymentUrl();

    // Create form data for redirect
    const formData = new FormData();
    Object.entries(paymentWithSignature).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return {
      success: true,
      paymentUrl,
      paymentData: paymentWithSignature,
    };
  } catch (error) {
    console.error("PayFast payment creation error:", error);
    return {
      success: false,
      error: "Failed to create payment",
    };
  }
}

export async function handlePayFastReturn(
  searchParams: Record<string, string>
) {
  try {
    const isValid = await payFastService.validatePayment(searchParams);

    if (isValid) {
      // Payment successful - update database, send emails, etc.
      const paymentId = searchParams.m_payment_id;
      const amount = Number.parseFloat(searchParams.amount_gross || "0");

      // Here you would typically:
      // 1. Update payment status in database
      // 2. Add tokens to user account
      // 3. Send confirmation email
      // 4. Log transaction

      return {
        success: true,
        paymentId,
        amount,
        message: "Payment completed successfully",
      };
    } else {
      return {
        success: false,
        error: "Payment validation failed",
      };
    }
  } catch (error) {
    console.error("PayFast return handling error:", error);
    return {
      success: false,
      error: "Payment processing error",
    };
  }
}

export async function processTokenPurchase(formData: FormData) {
  try {
    const data = {
      packageId: formData.get("packageId") as string,
      packageName: formData.get("packageName") as string,
      tokens: Number(formData.get("tokens")),
      price: Number(formData.get("price")),
      zarPrice: Number(formData.get("zarPrice")),
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
      paymentMethod: formData.get("paymentMethod") as "payfast" | "tokens",
    };

    const validatedData = tokenPurchaseSchema.parse(data);

    if (validatedData.paymentMethod === "tokens") {
      // Process token payment
      console.log("Processing token payment:", validatedData);

      // In a real app, you would:
      // 1. Verify user has sufficient tokens
      // 2. Deduct tokens from user balance
      // 3. Add purchased tokens to balance
      // 4. Create transaction record

      return {
        success: true,
        message: "Token purchase successful!",
        redirect: "/dashboard",
      };
    } else {
      // Process PayFast payment
      const paymentData = payFastService.generatePaymentData({
        merchant_id: process.env.PAYFAST_MERCHANT_ID!,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
        amount: validatedData.zarPrice.toFixed(2),
        item_name: `${validatedData.packageName} - ${validatedData.tokens} Tokens`,
        item_description: `Purchase of ${validatedData.tokens} tokens`,
        name_first: validatedData.firstName,
        name_last: validatedData.lastName,
        email_address: validatedData.email,
        m_payment_id: `trans-${1}`, // Change later
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payfast/notify`,
        custom_str1: validatedData.packageId,
        custom_str2: validatedData.tokens.toString(),
      });

      return {
        success: true,
        paymentData,
        paymentUrl:
          process.env.NODE_ENV === "production"
            ? "https://www.payfast.co.za/eng/process"
            : "https://sandbox.payfast.co.za/eng/process",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors.reduce(
          (acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
          },
          {} as Record<string, string>
        ),
      };
    }

    return {
      success: false,
      message: "Payment processing failed. Please try again.",
    };
  }
}

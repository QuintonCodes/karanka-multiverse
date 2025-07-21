"use server"

import { z } from "zod"
import { payFastService } from "@/lib/payfast"

const paymentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  amount: z.number().positive(),
  itemName: z.string().min(1),
  itemDescription: z.string().optional(),
  paymentId: z.string().min(1),
  customData: z.record(z.string()).optional(),
})

export async function createPayFastPayment(data: z.infer<typeof paymentSchema>) {
  try {
    const validatedData = paymentSchema.parse(data)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID || "10000100",
      merchant_key: process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a",
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
    }

    const paymentWithSignature = payFastService.generatePaymentData(paymentData)
    const paymentUrl = payFastService.getPaymentUrl()

    // Create form data for redirect
    const formData = new FormData()
    Object.entries(paymentWithSignature).forEach(([key, value]) => {
      formData.append(key, value)
    })

    return {
      success: true,
      paymentUrl,
      paymentData: paymentWithSignature,
    }
  } catch (error) {
    console.error("PayFast payment creation error:", error)
    return {
      success: false,
      error: "Failed to create payment",
    }
  }
}

export async function handlePayFastReturn(searchParams: Record<string, string>) {
  try {
    const isValid = await payFastService.validatePayment(searchParams)

    if (isValid) {
      // Payment successful - update database, send emails, etc.
      const paymentId = searchParams.m_payment_id
      const amount = Number.parseFloat(searchParams.amount_gross || "0")

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
      }
    } else {
      return {
        success: false,
        error: "Payment validation failed",
      }
    }
  } catch (error) {
    console.error("PayFast return handling error:", error)
    return {
      success: false,
      error: "Payment processing error",
    }
  }
}

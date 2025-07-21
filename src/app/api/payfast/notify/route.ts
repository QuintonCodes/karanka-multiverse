import { type NextRequest, NextResponse } from "next/server"
import { payFastService } from "@/lib/payfast"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const data: Record<string, string> = {}

    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    console.log("PayFast ITN received:", data)

    // Validate the payment
    const isValid = await payFastService.validatePayment(data)

    if (isValid) {
      // Payment is valid - process it
      const paymentId = data.m_payment_id
      const amount = Number.parseFloat(data.amount_gross || "0")
      const paymentStatus = data.payment_status
      const userId = data.custom_str2
      const paymentType = data.custom_str1

      console.log("Valid PayFast payment:", {
        paymentId,
        amount,
        paymentStatus,
        userId,
        paymentType,
      })

      // Here you would typically:
      // 1. Update payment status in your database
      // 2. Add tokens to user account if it's a token purchase
      // 3. Update order status if it's a product purchase
      // 4. Send confirmation emails
      // 5. Log the transaction

      if (paymentStatus === "COMPLETE") {
        // Payment completed successfully
        if (paymentType === "token_purchase") {
          // Add tokens to user account
          // const tokens = parseInt(data.custom_int1 || "0")
          // await addTokensToUser(userId, tokens)
        } else if (paymentType === "product_purchase") {
          // Update order status
          // await updateOrderStatus(paymentId, "completed")
        }
      }

      return new NextResponse("OK", { status: 200 })
    } else {
      console.error("Invalid PayFast payment notification")
      return new NextResponse("Invalid", { status: 400 })
    }
  } catch (error) {
    console.error("PayFast ITN processing error:", error)
    return new NextResponse("Error", { status: 500 })
  }
}

// PayFast also sends GET requests to validate the notify URL
export async function GET() {
  return new NextResponse("PayFast Notify URL Active", { status: 200 })
}

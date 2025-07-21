import axios from "axios";
import crypto from "crypto";

export type PayFastConfig = {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  sandbox: boolean;
};

export type PaymentData = {
  firstName: string;
  lastName: string;
  email: string;
  amount: string;
  address: string;
  city: string;
  postalCode: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
};

export type PayFastResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
  transactionId?: string;
};

export type PayFastPaymentData = {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
};

export class PayFastService {
  private config: PayFastConfig;

  constructor(config: PayFastConfig) {
    this.config = config;
  }

  private generateSignature(data: Record<string, string>): string {
    // Create parameter string
    const paramString = Object.keys(data)
      .filter((key) => key !== "signature")
      .sort()
      .map(
        (key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`
      )
      .join("&");

    // Add passphrase if provided
    const stringToHash = this.config.passphrase
      ? `${paramString}&passphrase=${encodeURIComponent(
          this.config.passphrase
        )}`
      : paramString;

    // Generate MD5 hash
    return crypto.createHash("md5").update(stringToHash).digest("hex");
  }

  private isValidCardNumber(cardNumber: string): boolean {
    // Luhn algorithm implementation
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 && cardNumber.length >= 13 && cardNumber.length <= 19;
  }

  generatePaymentData(
    paymentData: PayFastPaymentData
  ): PayFastPaymentData & { signature: string } {
    const dataWithSignature = {
      ...paymentData,
      signature: this.generateSignature(paymentData),
    };

    return dataWithSignature;
  }

  validateSignature(data: Record<string, string>): boolean {
    const receivedSignature = data.signature;
    const calculatedSignature = this.generateSignature(data);
    return receivedSignature === calculatedSignature;
  }

  getPaymentUrl(): string {
    return this.config.sandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";
  }

  async validatePayment(data: Record<string, string>): Promise<boolean> {
    try {
      // Validate signature
      if (!this.validateSignature(data)) {
        console.error("PayFast signature validation failed");
        return false;
      }

      // Validate payment status
      const validUrl = this.config.sandbox
        ? "https://sandbox.payfast.co.za/eng/query/validate"
        : "https://www.payfast.co.za/eng/query/validate";

      const response = await axios.post(
        validUrl,
        new URLSearchParams(data).toString()
      );

      // const response = await fetch(validUrl, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body: new URLSearchParams(data).toString(),
      // });

      const result = await response.data;
      return result;
    } catch (error) {
      console.error("PayFast validation error:", error);
      return false;
    }
  }

  async validateCardDetails(
    data: PaymentData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const cardNumber = data.cardNumber.replace(/\s/g, "");
      if (!this.isValidCardNumber(cardNumber)) {
        return { success: false, error: "Invalid card number format" };
      }

      // Check expiry date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const expiryYear = Number.parseInt(data.expiryYear);
      const expiryMonth = Number.parseInt(data.expiryMonth);

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        return { success: false, error: "Card has expired" };
      }

      // CVV validation
      if (data.cvv.length < 3 || data.cvv.length > 4) {
        return { success: false, error: "Invalid CVV" };
      }

      return { success: true };
    } catch (error) {
      console.error("Card validation error", error);
      return { success: false, error: "Card validation failed" };
    }
  }

  async createPayFastPayment(
    data: PaymentData,
    transactionId: string
  ): Promise<PayFastResponse> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const paymentData = this.generatePaymentData({
        merchant_id: this.config.merchantId,
        merchant_key: this.config.merchantKey,
        return_url: `${baseUrl}/payment/success?transaction_id=${transactionId}`,
        cancel_url: `${baseUrl}/payment/cancel?transaction_id=${transactionId}`,
        notify_url: `${baseUrl}/api/payfast/notify`,
        name_first: data.firstName,
        name_last: data.lastName,
        email_address: data.email,
        m_payment_id: transactionId,
        amount: Number.parseFloat(data.amount).toFixed(2),
        item_name: "", // TODO: Change this later
        item_description: `Payment for ${data.firstName} ${data.lastName}`,
        custom_str1: transactionId,
        custom_str2: data.email,
        custom_str3: new Date().toISOString(),
      });

      const { signature, ...finalPaymentData } = paymentData;
      void signature;

      const response = await axios.post(
        this.getPaymentUrl(),
        new URLSearchParams(finalPaymentData).toString()
      );

      if (response.status !== 200) {
        throw new Error(
          `PayFast API error: ${response.status} ${response.statusText}`
        );
      }

      return {
        success: true,
        transactionId,
        data: await response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment creation failed",
      };
    }
  }
}

// Initialize PayFast service
export const payFastService = new PayFastService({
  merchantId: process.env.PAYFAST_MERCHANT_ID || "",
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || "",
  passphrase: process.env.PAYFAST_PASSPHRASE || "",
  sandbox: process.env.NODE_ENV !== "production",
});

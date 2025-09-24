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
  name: string;
  description: string;
};

export type PayFastResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
  transactionId?: string;
};

// Reviewed
export type PayFastPaymentData = {
  // Merchant details
  merchant_id: number;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;

  // Customer details
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;

  // Transaction details
  m_payment_id?: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;

  email_confirmation?: string;
  confirmation_address?: string;
  payment_method?: "dc" | "eft" | "cc";

  // Subscription fields
  subscription_type?: 1 | 2;
  billing_date?: string; // YYYY-MM-DD
  recurring_amount?: string;
  frequency?: 1 | 2 | 3 | 4 | 6 | 7;
  cycles?: number;
  subscription_notify_email?: string;
  subscription_notify_webhook?: string;
  subscription_notify_buyer?: string;

  // Tokenization / update card (for future use)
  token?: string;
  return_token?: string;
};

const config: PayFastConfig = {
  merchantId:
    process.env.NODE_ENV !== "production"
      ? process.env.PAYFAST_SANDBOX_MERCHANT_ID!
      : process.env.PAYFAST_MERCHANT_ID!,
  merchantKey:
    process.env.NODE_ENV !== "production"
      ? process.env.PAYFAST_SANDBOX_MERCHANT_KEY!
      : process.env.PAYFAST_MERCHANT_KEY!,
  passphrase: process.env.PAYFAST_PASSPHRASE!,
  sandbox: process.env.NODE_ENV !== "production",
};

function formatDateToPayFast(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getPayFastUrl() {
  return config.sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

export function generateSignature(data: Record<string, string>): string {
  // Create parameter string
  const paramString = Object.keys(data)
    .filter((key) => key !== "signature")
    .sort()
    .map(
      (key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`
    )
    .join("&");

  // Add passphrase if provided
  const stringToHash = config.passphrase
    ? `${paramString}&passphrase=${encodeURIComponent(config.passphrase)}`
    : paramString;

  // Generate MD5 hash
  return crypto.createHash("md5").update(stringToHash).digest("hex");
}

export function validateSignature(data: Record<string, string>): boolean {
  const receivedSignature = data.signature;
  const calculatedSignature = generateSignature(data);
  return receivedSignature === calculatedSignature;
}

export async function validatePayment(
  data: Record<string, string>
): Promise<boolean> {
  if (!validateSignature(data)) {
    console.error("PayFast signature validation failed");
    return false;
  }

  const validUrl = config.sandbox
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";

  const response = await axios.post(
    validUrl,
    new URLSearchParams(data).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return String(response.data).trim() === "VALID";
}

export function buildPayFastData({
  data,
  transactionId,
  isSubscription,
  subscriptionDetails,
}: {
  data: PaymentData;
  transactionId: string;
  isSubscription?: boolean;
  subscriptionDetails?: {
    recurringAmount: string;
    frequency: number;
    cycles?: number;
    billingDate?: string;
  };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_BASE_URL
    : `https://${process.env.NEXT_PUBLIC_BASE_URL}`;

  const merchantId = Number(config.merchantId);

  let payFastData: PayFastPaymentData = {
    merchant_id: merchantId,
    merchant_key: config.merchantKey,
    return_url: `${baseUrl}/payment/success?txn=${transactionId}`,
    cancel_url: `${baseUrl}/payment/cancel?txn=${transactionId}`,
    notify_url: `${baseUrl}/api/payfast/notify`,

    name_first: data.firstName,
    name_last: data.lastName,
    email_address: data.email,

    m_payment_id: transactionId,
    amount: Number(data.amount).toFixed(2),
    item_name: data.name,
    item_description: data.description,
    custom_str1: transactionId,
    custom_str2: data.email,
    custom_str3: new Date().toISOString(),

    email_confirmation: "1",
    confirmation_address: data.email,
  };

  if (isSubscription && subscriptionDetails) {
    payFastData = {
      ...payFastData,
      subscription_type: 1,
      amount: Number(subscriptionDetails.recurringAmount).toFixed(2),
      recurring_amount: Number(subscriptionDetails.recurringAmount).toFixed(2),
      frequency: [1, 2, 3, 4, 6, 7].includes(subscriptionDetails.frequency)
        ? (subscriptionDetails.frequency as 1 | 2 | 3 | 4 | 6 | 7)
        : undefined,
      cycles: subscriptionDetails.cycles,
      billing_date: subscriptionDetails.billingDate
        ? formatDateToPayFast(new Date(subscriptionDetails.billingDate))
        : formatDateToPayFast(new Date()),
    };
  }

  // Convert all values to strings for signature generation
  const payFastDataString: Record<string, string> = Object.fromEntries(
    Object.entries(payFastData).map(([key, value]) => [
      key,
      value !== undefined && value !== null ? String(value) : "",
    ])
  );

  const signature = generateSignature(payFastDataString);

  return {
    ...payFastData,
    signature,
  };
}

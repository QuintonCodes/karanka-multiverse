"use server";

import crypto from "crypto";

import { CartItem } from "@/context/cart-provider";
import { db } from "@/lib/db";
import { buildPayFastData } from "@/lib/payfast";
import { Package } from "@/lib/products";
import { checkoutSchema } from "@/lib/schemas/checkout";

type ProductType = "subscription" | "onceOff" | "tokenPackage" | "unavailable";

function createTransactionId() {
  return crypto.randomUUID();
}

function validatedCheckoutForm(formData: FormData) {
  const data = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    paymentMethod: String(formData.get("paymentMethod") ?? "debitCard"),
  };
  return checkoutSchema.safeParse(data);
}

// Cart Checkout
export async function checkoutCart(formData: FormData, cartItems: CartItem[]) {
  const validatedData = validatedCheckoutForm(formData);

  if (!validatedData.success) {
    return {
      success: false,
      error: "Some of the form fields are invalid.",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  if (cartItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  const firstType =
    cartItems[0].selectedVariant?.isSubscription ?? cartItems[0].isSubscription;
  const mixedTypes = cartItems.some(
    (item) =>
      (item.selectedVariant?.isSubscription ?? item.isSubscription) !==
      firstType
  );

  if (mixedTypes) {
    return {
      success: false,
      error:
        "You cannot mix subscription and once-off items in a single checkout.",
    };
  }

  const product = cartItems[0];

  const isSubscription =
    product.selectedVariant?.isSubscription ?? product.isSubscription;

  try {
    const { firstName, lastName, email } = validatedData.data;
    const transactionId = createTransactionId();

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const paymentData = buildPayFastData({
      data: {
        firstName,
        lastName,
        email,
        amount: product.zarPrice.toFixed(2),
        name: isSubscription ? product.name : "Cart Purchase",
        description: isSubscription
          ? product.description || ""
          : `Purchase of ${cartItems.length} items`,
      },
      transactionId,
    });

    if (!paymentData) {
      return { success: false, error: "Failed to build payment data" };
    }

    const basePaymentData = {
      userId: user.id,
      amount: product.selectedVariant
        ? product.selectedVariant.zarPrice
        : (product.zarPrice ?? 0),
      transactionReference: transactionId,
      paymentDate: new Date(),

      productId: product.selectedVariant
        ? `${product.id}-${product.selectedVariant.id}`
        : product.id,
      productName: product.selectedVariant
        ? `${product.name} (${product.selectedVariant.name})`
        : product.name,
      productSlug: product.id,
      productType: (product.selectedVariant
        ? product.selectedVariant.isSubscription
          ? "subscription"
          : "onceOff"
        : product.isSubscription
          ? "subscription"
          : "onceOff") as ProductType,
      productTokens: product.selectedVariant
        ? product.selectedVariant.tokens
        : (product.tokens ?? 0),
      productPrice: product.selectedVariant
        ? product.selectedVariant.price
        : (product.price ?? 0),

      items: {
        create: {
          productId: product.selectedVariant
            ? `${product.id}-${product.selectedVariant.id}`
            : product.id,
        },
      },
    };

    const paymentRecord = await db.payment.create({
      data: isSubscription
        ? {
            ...basePaymentData,
            subscription: {
              create: {
                userId: user.id,
                startsAt: new Date(),
                endsAt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
                autoRenew: false,
                status: "active",

                productId: basePaymentData.productId,
                productName: basePaymentData.productName,
                productSlug: basePaymentData.productSlug,
                productType: basePaymentData.productType as ProductType,
                productTokens: basePaymentData.productTokens,
                productPrice: basePaymentData.productPrice,
              },
            },
          }
        : basePaymentData,
    });

    return {
      success: true,
      redirectUrl: `/checkout/redirect?txn=${transactionId}`,
      transactionId,
      paymentId: paymentRecord?.id,
    };
  } catch (error) {
    console.error("Checkout Error:", error);
    return {
      success: false,
      error: "Unexpected error during checking out cart.",
    };
  }
}

// Token Package checkout
export async function checkoutTokenPackage(
  formData: FormData,
  tokenPackage: Package | null
) {
  const validatedData = validatedCheckoutForm(formData);

  if (!validatedData.success) {
    return {
      success: false,
      error: "Some of the form fields are invalid.",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  if (!tokenPackage) {
    return { success: false, error: "Invalid token package" };
  }

  try {
    const { firstName, lastName, email } = validatedData.data;

    const transactionId = createTransactionId();

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const paymentData = buildPayFastData({
      data: {
        firstName,
        lastName,
        email,
        amount: tokenPackage.zarPrice.toFixed(2),
        name: `${tokenPackage.name} Token Package`,
        description: `Purchase of ${tokenPackage.tokens} KRKUNI tokens`,
      },
      transactionId,
    });

    if (!paymentData) {
      return { success: false, error: "Failed to build payment data" };
    }

    const paymentRecord = await db.payment.create({
      data: {
        userId: user.id,
        amount: tokenPackage.zarPrice,
        transactionReference: transactionId,
        paymentDate: new Date(),

        productId: tokenPackage.id,
        productName: tokenPackage.name,
        productSlug: tokenPackage.id,
        productType: "tokenPackage",
        productTokens: tokenPackage.tokens ?? 0,
        productPrice: tokenPackage.price,
      },
    });

    return {
      success: true,
      redirectUrl: `/checkout/redirect?txn=${transactionId}`,
      transactionId,
      paymentId: paymentRecord?.id,
    };
  } catch (error) {
    console.error("Token Package Checkout Error:", error);
    return {
      success: false,
      error: "Unexpected error during token package checkout.",
    };
  }
}

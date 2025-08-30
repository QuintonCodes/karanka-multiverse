import z from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  paymentMethod: z.enum(["payfast", "tokens"]),

  cardNumber: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// TODO: Derive the token schema from the checkout schema

export const tokenCheckoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),

  cardNumber: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
});

export type TokenCheckoutFormValues = z.infer<typeof tokenCheckoutSchema>;

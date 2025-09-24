import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .transform((val) => val.trim()),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .transform((val) => val.trim()),

    email: z
      .email("Please enter a valid email address")
      .transform((val) => val.trim().toLowerCase()),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .transform((data) => ({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  }));

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const verifySchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),

  code: z
    .string()
    .trim()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must only contain digits"),
});

export type VerifyForm = z.infer<typeof verifySchema>;

export const resendSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
});

export type ResendForm = z.infer<typeof resendSchema>;

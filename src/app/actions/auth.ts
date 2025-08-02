"use server";

import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/services/email-service";
import { z } from "zod";

const registerSchema = z
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
      .string()
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
  }));

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const verifySchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),

  code: z
    .string()
    .trim()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must only contain digits"),
});

const resendSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
});

async function generateAndStoreOtp(email: string): Promise<string> {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.otpCode.deleteMany({ where: { email } });

  await db.otpCode.create({
    data: {
      email,
      code: otpCode,
      expiresAt,
      user: {
        connect: { email: email },
      },
    },
  });

  return otpCode;
}

async function validateOtp(email: string, code: string): Promise<boolean> {
  const otp = await db.otpCode.findFirst({
    where: {
      email,
      code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) return false;

  await db.otpCode.delete({ where: { id: otp.id } });

  return true;
}

export async function registerUser(formData: FormData) {
  const data = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const validatedData = registerSchema.safeParse(data);

  if (!validatedData.success) {
    const { fieldErrors } = validatedData.error.flatten();
    return {
      error: "Some of the form fields are invalid.",
      details: fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedData.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        error:
          "An account with this email already exists. Please log in or use a different email.",
      };
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
      },
      include: {
        wallet: true,
        otpCodes: true,
      },
    });

    const otpCode = await generateAndStoreOtp(email);
    await sendVerificationEmail(email, otpCode, firstName);

    const { password: _password, ...safeUser } = user;
    void _password;

    return { success: true, user: safeUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error:
          "Invalid input data. Please check the form fields and try again.",
        details: error.flatten().fieldErrors,
      };
    }

    return {
      error:
        "Unexpected server error during registration. Please try again or contact support.",
    };
  }
}

export async function loginUser(formData: FormData) {
  const data = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    const { fieldErrors } = validatedData.error.flatten();
    return {
      error: "Validation failed.",
      details: fieldErrors,
    };
  }

  const { email, password } = validatedData.data;

  try {
    const user = await db.user.update({
      where: { email },
      data: { lastLogin: new Date() },
      include: {
        wallet: true,
        payments: true,
        transactions: true,
        subscriptions: true,
      },
    });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    if (!user.isVerified) {
      return { error: "Please verify your email before logging in" };
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    await createSession(user.id, user.email);

    const { password: _password, ...safeUser } = user;
    void _password;

    return { success: true, user: safeUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: "Validation failed.",
        details: error.flatten().fieldErrors,
      };
    }
    return {
      error:
        "Unexpected server error during login. Please try again or contact support.",
    };
  }
}

export async function verifyEmail(formData: FormData) {
  const data = {
    email: String(formData.get("email") ?? ""),
    code: String(formData.get("code") ?? ""),
  };

  const validatedData = verifySchema.safeParse(data);

  if (!validatedData.success) {
    const { fieldErrors } = validatedData.error.flatten();
    return {
      error: "Some of the form fields are invalid.",
      details: fieldErrors,
    };
  }

  const { email, code } = validatedData.data;

  try {
    const isValid = await validateOtp(email, code);
    if (!isValid) {
      return { error: "Invalid or expired verification code" };
    }

    const user = await db.user.update({
      where: { email },
      data: { isVerified: true, lastLogin: new Date() },
      include: {
        wallet: true,
        payments: true,
        transactions: true,
        subscriptions: true,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }

    // Create session for the user
    await createSession(user.id, user.email);

    // Exclude password from returned user object
    const { password, ...safeUser } = user;
    void password;

    return {
      success: true,
      user: safeUser,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Verification failed. Please try again." };
  }
}

export async function resendVerificationCode(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const validatedData = resendSchema.safeParse({ email });

  if (!validatedData.success) {
    const { fieldErrors } = validatedData.error.flatten();
    return {
      error: fieldErrors.email?.[0] ?? "Invalid email address",
    };
  }

  try {
    const user = await db.user.findUnique({
      where: { email: validatedData.data.email },
    });
    if (!user) {
      return { error: "User not found" };
    }

    if (user.isVerified) {
      return { error: "Email is already verified" };
    }

    // Generate new OTP
    const otpCode = await generateAndStoreOtp(email);
    await sendVerificationEmail(email, otpCode, user.firstName);

    return { success: true, message: "Verification code sent successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to resend verification code. Please try again." };
  }
}

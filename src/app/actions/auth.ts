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
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  try {
    const validatedData = registerSchema.parse(data);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await db.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        isVerified: false,
      },
      include: {
        wallet: true,
        otpCodes: true,
      },
    });

    const otpCode = await generateAndStoreOtp(validatedData.email);
    await sendVerificationEmail(
      validatedData.email,
      otpCode,
      validatedData.firstName
    );

    const { password, ...safeUser } = user;
    void password;

    return { success: true, user: safeUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Registration failed. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const validatedData = loginSchema.parse(data);

    const user = await db.user.update({
      where: { email: validatedData.email },
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

    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    await createSession(user.id, user.email);

    const { password, ...safeUser } = user;
    void password;

    return { success: true, user: safeUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Login failed. Please try again." };
  }
}

export async function verifyEmail(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    code: formData.get("code") as string,
  };

  try {
    const validatedData = verifySchema.parse(data);

    const isValid = await validateOtp(validatedData.email, validatedData.code);

    if (!isValid) {
      return { error: "Invalid or expired verification code" };
    }

    const user = await db.user.update({
      where: { email: validatedData.email },
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
  const email = formData.get("email") as string;

  try {
    const validatedData = verifySchema.parse({ email, code: "" });

    const user = await db.user.findUnique({
      where: { email: validatedData.email },
    });
    if (!user) {
      return { error: "User not found" };
    }

    if (user.isVerified) {
      return { error: "Email is already verified" };
    }

    // Remove any existing OTP for this email from the database
    await db.otpCode.deleteMany({ where: { email } });

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

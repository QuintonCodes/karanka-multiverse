"use server";

import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  loginSchema,
  registerSchema,
  resendSchema,
  verifySchema,
} from "@/lib/schemas/auth";
import { sendVerificationEmail } from "@/lib/services/email-service";

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
    return {
      success: false,
      error: "Some of the form fields are invalid.",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedData.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        success: false,
        error: "User already exists.",
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
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Failed registration. Please try again.",
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
    return {
      success: false,
      error: "Some of the form fields are invalid.",
      details: validatedData.error.flatten().fieldErrors,
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
      return {
        success: false,
        error: "Incorrect email or password.",
      };
    }

    if (!user.isVerified) {
      return {
        success: false,
        error: "Email not verified.",
      };
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: "Incorrect email or password.",
      };
    }

    await createSession(user.id, user.email);

    const { password: _password, ...safeUser } = user;
    void _password;

    return { success: true, user: safeUser };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Login failed. Please try again.",
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
    return {
      success: false,
      error: "Invalid verification data.",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  const { email, code } = validatedData.data;

  try {
    const isValid = await validateOtp(email, code);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid or expired verification code.",
      };
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
    console.error("Verification error:", error);
    return {
      success: false,
      error: "Verification failed. Please try again.",
    };
  }
}

export async function resendVerificationCode(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const validatedData = resendSchema.safeParse({ email });

  if (!validatedData.success) {
    return {
      success: false,
      error: "Invalid email address.",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await db.user.findUnique({
      where: { email: validatedData.data.email },
    });
    if (!user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        error: "Email is already verified",
      };
    }

    // Generate new OTP
    const otpCode = await generateAndStoreOtp(email);
    await sendVerificationEmail(email, otpCode, user.firstName);

    return { success: true, message: "Verification code sent successfully" };
  } catch (error) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      error: "Failed to resend verification code.",
    };
  }
}

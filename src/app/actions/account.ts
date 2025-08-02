"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { accountSchema, avatarSchema } from "@/lib/schemas/account";

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("avatar");

  const result = avatarSchema.safeParse({ avatar: file });

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    return {
      error: "Validation failed.",
      details: fieldErrors,
    };
  }

  const { avatar } = result.data;

  try {
    const session = await getSession();

    if (!session?.userId) {
      return { error: "User not authenticated" };
    }

    const imageBuffer = await avatar.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const user = await db.user.update({
      where: { id: session?.userId },
      data: { avatarUrl: `data:${avatar.type};base64,${base64Image}` },
      include: {
        wallet: true,
        payments: true,
        transactions: true,
        subscriptions: true,
      },
    });

    const { password, ...safeUser } = user;
    void password;

    return { success: true, user: safeUser };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return {
      error:
        "Unexpected server error while uploading avatar. Please try again later.",
    };
  }
}

export async function updateAccount(formData: FormData) {
  const data = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
  };

  const validatedData = accountSchema.safeParse(data);

  if (!validatedData.success) {
    const { fieldErrors } = validatedData.error.flatten();
    return {
      error: "Validation failed.",
      details: fieldErrors,
    };
  }

  const { firstName, lastName, email, address, city, postalCode } =
    validatedData.data;

  try {
    const session = await getSession();

    const user = await db.user.update({
      where: { id: session?.userId },
      data: {
        firstName,
        lastName,
        email,
        address,
        city,
        postalCode,
      },
      include: {
        wallet: true,
        payments: true,
        transactions: true,
        subscriptions: true,
      },
    });

    const { password, ...safeUser } = user;
    void password;

    return { success: true, user: safeUser };
  } catch (error) {
    console.error("Error updating account:", error);
    return {
      error:
        "Unexpected server error while updating account. Please try again later.",
    };
  }
}

import z from "zod";

export const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Please upload an image",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size exceeds 5MB limit",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Uploaded file is not an image",
    }),
});

export type AvatarFormValues = z.infer<typeof avatarSchema>;

export const accountSchema = z.object({
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
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .transform((val) => val.trim()),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .transform((val) => val.trim()),
  postalCode: z
    .string()
    .min(4, "Postal code must be at least 4 characters")
    .transform((val) => val.trim()),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

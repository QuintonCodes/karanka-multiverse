"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { uploadAvatar } from "@/app/actions/account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UserType } from "@/context/auth-provider";
import { AvatarFormValues, avatarSchema } from "@/lib/schemas/account";

export default function AvatarForm({
  user,
  updateUser,
}: {
  user: UserType | null;
  updateUser: (user?: Partial<UserType>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      avatar: undefined,
    },
  });

  async function onSubmit(data: AvatarFormValues) {
    const file = data.avatar;
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image must be less than ${maxSizeMB}MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await uploadAvatar(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Avatar uploaded successfully!");
      updateUser(result.user);
      avatarForm.reset();
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Unexpected error during upload. Please try again.");
    }
  }

  return (
    <Form {...avatarForm}>
      <form onSubmit={avatarForm.handleSubmit(onSubmit)}>
        <FormField
          control={avatarForm.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <div
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="size-20">
                      <AvatarImage
                        src={user?.avatarUrl || "/placeholder.svg"}
                        alt="User Avatar"
                        className="object-cover border border-[#EBEBEB]/20"
                      />
                      <AvatarFallback className="text-[#11120E]">
                        {user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        avatarForm.handleSubmit(onSubmit)();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!field.value) fileInputRef.current?.click();
                    }}
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#EBEBEB] text-[#11120E] hover:bg-[#EBEBEB]/90 transition-colors cursor-pointer"
                  >
                    {avatarForm.formState.isSubmitting ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-[#11120E] border-t-transparent" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

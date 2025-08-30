"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateAccount } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserType } from "@/context/auth-provider";
import { AccountFormValues, accountSchema } from "@/lib/schemas/account";

export default function ProfileForm({
  user,
  updateUser,
}: {
  user: UserType | null;
  updateUser: (user?: Partial<UserType>) => void;
}) {
  const userForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
    },
  });

  async function onSubmit(data: AccountFormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      const result = await updateAccount(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Account updated successfully!");
      updateUser(result.user);
      userForm.reset();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(
        "Unexpected server error while updating account. Please try again later."
      );
    }
  }

  return (
    <Form {...userForm}>
      <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={userForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#EBEBEB]">First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={userForm.formState.isSubmitting}
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={userForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#EBEBEB]">Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={userForm.formState.isSubmitting}
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={userForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#EBEBEB]">Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={userForm.formState.isSubmitting}
                  className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={userForm.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#EBEBEB]">Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={userForm.formState.isSubmitting}
                  placeholder="Enter your address"
                  className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={userForm.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#EBEBEB]">City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={userForm.formState.isSubmitting}
                    placeholder="Enter your city"
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={userForm.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#EBEBEB]">Postal Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={userForm.formState.isSubmitting}
                    placeholder="Enter postal code"
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={userForm.formState.isSubmitting}
          className="bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
        >
          {userForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}

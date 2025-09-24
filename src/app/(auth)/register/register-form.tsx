"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerUser } from "@/app/actions/auth";
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
import { RegisterFormValues, registerSchema } from "@/lib/schemas/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      const result = await registerUser(formData);

      if (result.error) {
        if (result.details) {
          toast.error("Please correct the highlighted fields.");
        } else {
          toast.error("Registration Failed", {
            description: result.error,
          });
        }
        return;
      }

      toast.success("Registration successful!", {
        description: "Your account has been created successfully.",
      });

      registerForm.reset();
      router.push("/verify-email?email=" + encodeURIComponent(data.email));
    } catch (error) {
      console.error("Client error in registration page:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={registerForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={registerForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...field}
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#EBEBEB]/70" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#EBEBEB]/70" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...field}
                    className="border-[#EBEBEB]/20 bg-[#121C2B]/30 focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-[#EBEBEB]/70" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#EBEBEB]/70" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={registerForm.formState.isSubmitting}
          className="w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
        >
          {registerForm.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

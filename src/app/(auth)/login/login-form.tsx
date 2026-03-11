"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginUser } from "@/app/actions/auth";
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
import { useAuth } from "@/context/auth-provider";
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuth();

  // TODO: 1. Add forget password functionality

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await loginUser(formData);

      if (result.error) {
        if (result.details) {
          toast.error("Validation failed.");
        } else {
          toast.error("Login failed", {
            description: result.error,
          });
        }
        return;
      }

      setUser(result.user);

      toast.success("Welcome back!", {
        description: "You have been successfully logged in.",
      });

      loginForm.reset();
      router.push(searchParams.get("redirect") || "/");
    } catch (error) {
      console.error("Client error in login page:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

        <Button
          type="submit"
          disabled={loginForm.formState.isSubmitting}
          className="w-full border border-[#EBEBEB]/20 bg-linear-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
        >
          {loginForm.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

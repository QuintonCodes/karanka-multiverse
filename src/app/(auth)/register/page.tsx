import { ArrowLeft, CheckCircle, Mail, Shield } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MainSection } from "@/components/ui/main-section";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <MainSection className="flex items-center justify-center px-4 py-32">
      <Button
        className="absolute left-4 top-4 text-[#EBEBEB] hover:text-[#EBEBEB] hover:bg-transparent hover:scale-110"
        variant="ghost"
        size="icon"
        aria-label="Go back"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="size-5" />
        </Link>
      </Button>

      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-[#EBEBEB]/10 bg-transparent backdrop-blur-[1px] p-8 hover:shadow-lg hover:shadow-[#EBEBEB]/20 hover:scale-101 transition-all duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#EBEBEB]">
              Create Account
            </h1>
            <p className="mt-2 text-[#EBEBEB]/70">
              Join the Karanka Multiverse
            </p>
          </div>

          <div className="space-y-6 mt-6">
            <RegisterForm />

            <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
              <h4 className="mb-2 text-sm font-medium text-[#EBEBEB]">
                Email Registration Process:
              </h4>
              <ol className="space-y-1 text-xs text-[#EBEBEB]/70">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span>Create your account</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 text-[#EBEBEB]/50" />
                  <span>Verify your email address</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="h-3 w-3 text-[#EBEBEB]/50" />
                  <span>Start buying trading signal</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#EBEBEB]/70">Already have an account? </span>
            <Link
              href="/login"
              className="font-medium text-[#EBEBEB] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </MainSection>
  );
}

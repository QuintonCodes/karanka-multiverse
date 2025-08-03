"use client";

import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainSection from "@/components/ui/main-section";

export default function NotFound() {
  return (
    <MainSection className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#EBEBEB]/10 bg-[#11120E]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBEBEB]/10">
            <Search className="h-8 w-8 text-[#EBEBEB]/50" />
          </div>
          <CardTitle className="text-[#EBEBEB]">Page Not Found</CardTitle>
          <CardDescription className="text-[#EBEBEB]/70">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-[#EBEBEB]/20 mb-2">404</div>
            <p className="text-sm text-[#EBEBEB]/60">
              This might be a broken link or the page may have been removed.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/" className="block">
              <Button className="w-full bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
            <h4 className="mb-2 font-medium text-[#EBEBEB]">Popular Pages</h4>
            <div className="space-y-1 text-sm">
              <Link
                href="/products"
                className="block text-[#EBEBEB]/70 hover:text-[#EBEBEB] transition-colors"
              >
                • Products & Services
              </Link>
              <Link
                href="/tokens"
                className="block text-[#EBEBEB]/70 hover:text-[#EBEBEB] transition-colors"
              >
                • Token Packages
              </Link>
              <Link
                href="/wallet"
                className="block text-[#EBEBEB]/70 hover:text-[#EBEBEB] transition-colors"
              >
                • Wallet Management
              </Link>
              <Link
                href="/dashboard"
                className="block text-[#EBEBEB]/70 hover:text-[#EBEBEB] transition-colors"
              >
                • Trading Dashboard
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainSection>
  );
}

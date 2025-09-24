"use client";

import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MainSection } from "@/components/ui/main-section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <MainSection className="flex items-center justify-center p-4 min-h-screen">
      <Card className="w-full max-w-md border-[#EBEBEB]/10 bg-[#11120E]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-[#EBEBEB]">
            Something went wrong!
          </CardTitle>
          <CardDescription className="text-[#EBEBEB]/70">
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <Alert className="border-red-400/20 bg-red-400/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400 text-sm">
                <strong>Development Error:</strong>
                <br />
                {error.message}
                {error.digest && (
                  <>
                    <br />
                    <strong>Error ID:</strong> {error.digest}
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="w-full border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-[#EBEBEB]/70">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-[#EBEBEB]/50">
            If this error continues, please contact our support team with the
            error details above.
          </div>
        </CardContent>
      </Card>
    </MainSection>
  );
}

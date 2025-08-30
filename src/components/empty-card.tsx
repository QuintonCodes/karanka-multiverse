"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type EmptyCardProps = {
  title: string;
  description?: string;
  showAuthActions?: boolean;
  className?: string;
};

export function EmptyCard({
  title,
  description,
  showAuthActions = false,
  className,
}: EmptyCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-md bg-gradient-to-b from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 text-center shadow-md",
        className
      )}
    >
      <CardContent className="p-8">
        <h2 className="text-xl font-bold text-[#EBEBEB] mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-[#EBEBEB]/60 mb-6">{description}</p>
        )}

        {showAuthActions && (
          <div className="flex justify-center space-x-4">
            <Button
              asChild
              size="sm"
              className="text-[#EBEBEB]/70 bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-[#EBEBEB]/70 border-[#EBEBEB]/20 hover:border-[#EBEBEB]/50 bg-transparent"
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Menu, ShoppingCart, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth-provider";
import { useCart } from "@/context/cart-provider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const routes = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/tokens", label: "Tokens" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { items } = useCart();

  /* TODO:
    1. Remove useEffect and enhance the backdrop feature
  */

  const krkBalance = user?.wallet?.balance;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-[#11120E]/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="w-full mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#EBEBEB]">Karanka</span>
          <span className="text-xl font-bold text-[#EBEBEB]/70">
            Multiverse
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {!user
            ? routes
                .filter((route) => route.href !== "/dashboard")
                .map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#EBEBEB]",
                      pathname === route.href
                        ? "text-[#EBEBEB]"
                        : "text-[#EBEBEB]/70"
                    )}
                  >
                    {route.label}
                  </Link>
                ))
            : routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#EBEBEB]",
                    pathname === route.href
                      ? "text-[#EBEBEB]"
                      : "text-[#EBEBEB]/70"
                  )}
                >
                  {route.label}
                </Link>
              ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-transparent transition-all"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EBEBEB] text-xs font-bold text-[#11120E]">
                  {items.length}
                </span>
              )}
            </Link>
          </Button>

          {user && (
            <Link href="/wallet">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#121C2B]/50 border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 transition-colors">
                <Wallet className="h-4 w-4 text-[#EBEBEB]/70" />
                <span className="text-sm font-medium text-[#EBEBEB]">
                  {krkBalance !== undefined ? krkBalance.toFixed(2) : 0}
                </span>
                <span className="text-xs text-[#EBEBEB]/70">KRK</span>
              </div>
            </Link>
          )}

          {!user && (
            <div className="hidden md:flex space-x-3">
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

          {user && (
            <Link href="/account">
              <div className="text-[#EBEBEB]/70 border border-[#EBEBEB]/20 rounded-lg flex items-center gap-3 p-1 px-3 hover:border-[#EBEBEB]/40 transition-colors">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user?.avatarUrl || "/placeholder.svg"}
                    alt="User Photo"
                  />
                </Avatar>
                <p className="text-sm font-bold">Kagiso</p>
              </div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#11120E]/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors hover:text-[#EBEBEB]",
                  pathname === route.href
                    ? "text-[#EBEBEB]"
                    : "text-[#EBEBEB]/70"
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex space-x-2 pt-2">
              <Link href="/login" className="w-full">
                <Button variant="ghost" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#EBEBEB]/20 hover:border-[#EBEBEB]/50 bg-transparent"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

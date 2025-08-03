"use client";

import { LogOut, Menu, ShoppingCart, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-provider";
import { useCart } from "@/context/cart-provider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const publicRoutes = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/tokens", label: "Tokens" },
];

const privateRoutes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallet", label: "Wallet" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout } = useAuth();
  const { items } = useCart();

  const krkBalance = user?.wallet?.balance.toFixed(2) ?? "0.00";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    await logout();

    toast.success("Logged out successfully");
    router.push("/");
  }

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
          {publicRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#EBEBEB]",
                pathname === route.href ? "text-[#EBEBEB]" : "text-[#EBEBEB]/70"
              )}
            >
              {route.label}
            </Link>
          ))}

          {user &&
            privateRoutes.map((route) => (
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

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-transparent"
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
                  {krkBalance}
                </span>
                <span className="text-xs text-[#EBEBEB]/70">KRKUNI</span>
              </div>
            </Link>
          )}

          {!user && (
            <div className="hidden md:flex space-x-2">
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
            <div className="flex items-center space-x-2">
              <Link href="/account">
                <div className="text-[#EBEBEB]/70 border border-[#EBEBEB]/20 rounded-lg flex items-center gap-3 p-1 px-3 hover:border-[#EBEBEB]/40 transition-colors">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.avatarUrl || "/placeholder.svg"}
                      alt="User Photo"
                      className="object-cover"
                    />
                  </Avatar>
                  <p className="text-sm font-bold hidden md:block">
                    {user.firstName}
                  </p>
                </div>
              </Link>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-transparent"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-transparent"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#11120E]/95 backdrop-blur-md p-4 border-0">
              <SheetTitle className="sr-only">Main menu</SheetTitle>
              <div className="p-4 border-b">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-[#EBEBEB]">
                      Karanka
                    </span>
                    <span className="text-xl font-bold text-[#EBEBEB]/70">
                      Multiverse
                    </span>
                  </Link>
                </SheetClose>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-5">
                  {publicRoutes.map((route) => (
                    <SheetClose asChild key={route.href}>
                      <Link
                        href={route.href}
                        className={cn(
                          "block py-2 text-sm font-medium transition-colors hover:text-[#EBEBEB]",
                          pathname === route.href
                            ? "text-[#EBEBEB]"
                            : "text-[#EBEBEB]/70"
                        )}
                      >
                        {route.label}
                      </Link>
                    </SheetClose>
                  ))}

                  {user &&
                    privateRoutes.map((route) => (
                      <SheetClose asChild key={route.href}>
                        <Link
                          href={route.href}
                          className={cn(
                            "block py-2 text-sm font-medium transition-colors hover:text-[#EBEBEB]",
                            pathname === route.href
                              ? "text-[#EBEBEB]"
                              : "text-[#EBEBEB]/70"
                          )}
                        >
                          {route.label}
                        </Link>
                      </SheetClose>
                    ))}
                </div>

                {!user && (
                  <div className="flex space-x-2 pt-4">
                    <SheetClose asChild>
                      <Link href="/login" className="flex-1">
                        <Button
                          size="sm"
                          className="text-[#EBEBEB]/70 bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40 w-full"
                        >
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register" className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#EBEBEB]/70 border-[#EBEBEB]/20 hover:border-[#EBEBEB]/50 bg-transparent w-full"
                        >
                          Register
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

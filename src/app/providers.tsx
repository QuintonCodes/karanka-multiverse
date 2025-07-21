"use client";

import AuthProvider from "@/context/auth-provider";
import CartProvider from "@/context/cart-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

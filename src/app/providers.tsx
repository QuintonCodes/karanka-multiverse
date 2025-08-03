"use client";

import AuthProvider, { useAuth } from "@/context/auth-provider";
import CartProvider from "@/context/cart-provider";
import Loading from "./loading";

function InternalProviders({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return <CartProvider>{children}</CartProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InternalProviders>{children}</InternalProviders>
    </AuthProvider>
  );
}

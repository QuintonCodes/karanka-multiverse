"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

import AuthProvider, { useAuth } from "@/context/auth-provider";
import CartProvider from "@/context/cart-provider";
import { config } from "@/lib/wagmi";
import Loading from "./loading";

function InternalProviders({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return <CartProvider>{children}</CartProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
          },
        },
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InternalProviders>{children}</InternalProviders>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

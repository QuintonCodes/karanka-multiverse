"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import AuthProvider, { useAuth } from "@/context/auth-provider";
import CartProvider from "@/context/cart-provider";
import { config } from "@/lib/wagmi";
import Loading from "./loading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: { networkMode: "offlineFirst" },
  },
});

function InternalProviders({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return <CartProvider>{children}</CartProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
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

import {
  Payment,
  Subscription,
  Transaction,
  User,
  Wallet,
} from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useSessionQuery } from "@/hooks/use-session";

export type UserType = Omit<User, "password"> & {
  payments: Payment[];
  transactions: Transaction[];
  wallet: Wallet | null;
  subscriptions: Subscription[];
};

type AuthStore = {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user?: UserType | null) => void;
  logout: () => Promise<void>;
  updateUser: (
    user?: Partial<UserType> | ((prev: UserType) => Partial<UserType>)
  ) => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<StoreApi<AuthStore> | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const [store] = useState(() =>
    createStore<AuthStore>()(
      persist<AuthStore>(
        (set, get) => ({
          user: null,
          isAuthenticated: false,
          isLoading: true,
          setUser: (user) => {
            set({
              user: user ?? null,
              isAuthenticated: !!user,
              isLoading: false,
            });
          },
          logout: async () => {
            try {
              await axios.post("/api/auth/logout");
            } finally {
              set({ user: null, isAuthenticated: false, isLoading: false });

              // Invalidate the session query so it re-fetches
              get().refreshSession();
            }
          },
          updateUser: (user) => {
            const currentUser = get().user;
            if (!currentUser) return;

            if (typeof user === "function") {
              const updatedUser = user(currentUser);
              set({ user: { ...currentUser, ...updatedUser } });
            } else {
              set({
                user: { ...currentUser, ...user },
              });
            }
          },
          refreshSession: async () => {
            await queryClient.invalidateQueries({ queryKey: ["session"] });
          },
        }),
        {
          name: "karanka-user-storage",
          storage: createJSONStorage(() => sessionStorage),
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
            setUser: state.setUser,
            logout: state.logout,
            updateUser: state.updateUser,
            refreshSession: state.refreshSession,
          }),
        }
      )
    )
  );
  const { data, isLoading, isSuccess } = useSessionQuery();

  useEffect(() => {
    if (isSuccess) {
      store.getState().setUser(data?.user ?? null);
    } else if (!isLoading && !data) {
      store.getState().setUser(null);
    }
  }, [data, isLoading, isSuccess, store]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const store = useContext(AuthContext);
  if (!store) throw new Error("useAuth must be used within an AuthProvider");
  return useStore(store);
}

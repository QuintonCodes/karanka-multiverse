import {
  Payment,
  Subscription,
  Transaction,
  User,
  Wallet,
} from "@prisma/client";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserType = Omit<User, "password"> & {
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
  updateUser: (user?: Partial<UserType>) => void;
};

type SessionResponse = {
  user: UserType | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<StoreApi<AuthStore> | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() =>
    createStore<AuthStore>()(
      persist(
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
            } catch {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
            set({ user: null, isAuthenticated: false, isLoading: false });
          },
          updateUser: (user) => {
            const currentUser = get().user;
            if (!currentUser) return;
            set({
              user: { ...currentUser, ...user } as UserType,
            });
          },
        }),
        {
          name: "karanka-user-storage",
          storage: createJSONStorage(() => sessionStorage),
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          }),
        }
      )
    )
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchSession() {
      try {
        const response = await axios.get<SessionResponse>("/api/auth/session");
        const data = response.data;
        if (isMounted) {
          store.getState().setUser(data.user);
        }
      } catch {
        if (isMounted) {
          store.getState().setUser(null);
        }
      }
    }

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [store]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const store = useContext(AuthContext);
  if (!store) throw new Error("useAuth must be used within an AuthProvider");
  return useStore(store);
}

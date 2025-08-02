import { Product } from "@/lib/products";
import { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

const CartContext = createContext<StoreApi<CartStore> | undefined>(undefined);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() =>
    createStore<CartStore>()(
      persist(
        (set, get) => ({
          items: [],
          addItem: (product: Product) => {
            const currentItems = get().items;
            const existingItem = currentItems.find(
              (item) => item.id === product.id
            );

            if (existingItem) {
              return; // Only allow one quantity per item
            }

            set({ items: [...currentItems, { ...product, quantity: 1 }] });
          },
          removeItem: (id: string) => {
            set({ items: get().items.filter((item) => item.id !== id) });
          },
          clearCart: () => set({ items: [] }),
          getTotalPrice: () => {
            return get().items.reduce((total, item) => {
              return total + item.price * item.quantity;
            }, 0);
          },
        }),
        {
          name: "karanka-cart",
        }
      )
    )
  );

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart() {
  const store = useContext(CartContext);
  if (!store) throw new Error("useCart must be used within a CartProvider");
  return useStore(store);
}

import { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";

import { Product, ProductVariant } from "@/lib/products";

export type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (id: string, variantId?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

const CartContext = createContext<StoreApi<CartStore> | undefined>(undefined);

function getItemType(product: Product, variant?: ProductVariant) {
  const isSubscription =
    (variant ? variant.isSubscription : product.isSubscription) ?? false;
  return isSubscription ? "subscription" : "once-off";
}

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
          addItem: (product, variant) => {
            const currentItems = get().items;

            const newItemType = getItemType(product, variant);

            if (currentItems.length > 0) {
              const cartType = getItemType(
                currentItems[0],
                currentItems[0].selectedVariant,
              );
              if (cartType !== newItemType) {
                return;
              }
            }

            const existingItem = currentItems.find(
              (item) =>
                item.id === product.id &&
                (!variant || item.selectedVariant?.id === variant.id),
            );

            if (existingItem) {
              return; // Only allow one quantity per item
            }

            set({
              items: [
                ...currentItems,
                {
                  ...product,
                  quantity: 1,
                  selectedVariant: variant,
                  price: variant ? variant.price : product.price,
                  zarPrice: variant ? variant.zarPrice : product.zarPrice,
                  tokens: variant ? variant.tokens : product.tokens,
                },
              ],
            });
          },
          removeItem: (id, variantId) => {
            set({
              items: get().items.filter((item) => {
                if (variantId) {
                  return !(
                    item.id === id && item.selectedVariant?.id === variantId
                  );
                }
                return item.id !== id && !item.selectedVariant;
              }),
            });
          },
          clearCart: () => set({ items: [] }),
          getTotalPrice: () => {
            return get().items.reduce((total, item) => {
              const price = item.selectedVariant
                ? item.selectedVariant.price
                : item.price;
              return total + price * item.quantity;
            }, 0);
          },
        }),
        {
          name: "karanka-cart",
        },
      ),
    ),
  );

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart() {
  const store = useContext(CartContext);
  if (!store) throw new Error("useCart must be used within a CartProvider");
  return useStore(store);
}

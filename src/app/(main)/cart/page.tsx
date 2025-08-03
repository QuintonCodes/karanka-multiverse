"use client";

import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import MainSection from "@/components/ui/main-section";
import { type CartItem, useCart } from "@/context/cart-provider";
import { calculateZarPrice, formatPrice, usdToZarRate } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, getTotalPrice, clearCart } = useCart();

  return (
    <MainSection>
      <section className="w-full mx-auto px-4 py-32">
        <h1 className="mb-8 text-3xl font-bold text-[#EBEBEB]">Your Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-12 text-center">
            <ShoppingCart className="mb-4 h-16 w-16 text-[#EBEBEB]/30" />
            <h2 className="mb-2 text-xl font-semibold text-[#EBEBEB]">
              Your cart is empty
            </h2>
            <p className="mb-6 text-[#EBEBEB]/70">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Button
              className="border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
              asChild
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] overflow-hidden">
                <div className="p-6">
                  <div className="mb-4 flex justify-between">
                    <h2 className="text-xl font-semibold text-[#EBEBEB]">
                      Cart Items
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-[#EBEBEB]/70"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  <div className="divide-y divide-[#EBEBEB]/10">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        removeItem={removeItem}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#EBEBEB]/10 bg-[#11120E] p-6">
              <h2 className="mb-4 text-xl font-semibold text-[#EBEBEB]">
                Order Summary
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between text-[#EBEBEB]/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotalPrice(), "USD")}</span>
                </div>
                <div className="flex justify-between text-[#EBEBEB]/70">
                  <span>ZAR Equivalent</span>
                  <span>
                    {formatPrice(
                      calculateZarPrice(getTotalPrice(), usdToZarRate)
                    )}
                  </span>
                </div>
              </div>

              <div className="my-4 border-t border-[#EBEBEB]/10 pt-4">
                <div className="flex justify-between font-semibold text-[#1E2E48]">
                  <span>Total</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="mt-1 text-right text-sm text-[#EBEBEB]/70">
                  {formatPrice(
                    calculateZarPrice(getTotalPrice(), usdToZarRate)
                  )}
                </div>
              </div>

              <Button
                className="mt-4 w-full border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
                asChild
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <div className="mt-4 text-center text-xs text-[#EBEBEB]/50">
                Payments are processed securely via PayFast
              </div>
            </div>
          </div>
        )}
      </section>
    </MainSection>
  );
}

function CartItem({
  item,
  removeItem,
}: {
  item: CartItem;
  removeItem: (id: string, variantId?: string) => void;
}) {
  const displayPrice = item.selectedVariant?.price || item.price;
  const displayTokens = item.selectedVariant?.tokens || item.tokens;
  const displayName =
    `${item.name} (${item.selectedVariant?.name})` || item.name;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-between py-4"
    >
      <div className="flex items-center">
        <div className="relative mr-4 h-12 w-12 rounded-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-[#EBEBEB]">{displayName}</h3>
          <div className="flex items-center space-x-2 text-sm text-[#EBEBEB]/70">
            <span>{formatPrice(displayPrice, "USD")}</span>
            <span>or {displayTokens} Tokens</span>
          </div>
          {item.selectedVariant && (
            <div className="text-xs text-[#EBEBEB]/50 mt-1">
              {item.selectedVariant.description}
            </div>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(item.id, item.selectedVariant?.id)}
        className="text-red-500 hover:text-red-600 hover:bg-transparent hover:scale-110"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}

"use client";

import { AlertTriangle, Check, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { useCart } from "@/context/cart-provider";
import { Product, ProductVariant } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product.variants ? product.variants[0] : undefined);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentZarPrice = selectedVariant
    ? selectedVariant.zarPrice
    : product.zarPrice;
  const currentTokens = selectedVariant
    ? selectedVariant.tokens
    : product.tokens;
  const currentDescription = selectedVariant
    ? selectedVariant.description
    : product.description;

  const isInCart = items.some((item) => item.id === product.id);

  function handleAddToCart() {
    if (!isInCart) {
      addItem(product, selectedVariant);
      const itemName = selectedVariant
        ? `${product.name} (${selectedVariant.name})`
        : product.name;
      toast.success(`${itemName} added to cart`);
    }
  }

  return (
    <motion.div
      className="group futuristic-border glow-effect rounded-xl bg-[#11120E] transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#EBEBEB]">{product.name}</h3>
          {(selectedVariant?.isSubscription ?? product.isSubscription) && (
            <Badge
              variant="outline"
              className="border-[#EBEBEB]/20 bg-[#121C2B]/50 text-[#EBEBEB]/70"
            >
              Subscription
            </Badge>
          )}
          {product.unavailable && (
            <Badge
              variant="outline"
              className="border-[#EBEBEB]/20 bg-[#121C2B]/50 text-[#EBEBEB]/70"
            >
              <AlertTriangle className="mr-1 h-3 w-3" />
              Unavailable
            </Badge>
          )}
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium text-[#EBEBEB]/80">
              Choose Option:
            </div>
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  disabled={isInCart && selectedVariant?.id !== variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selectedVariant?.id === variant.id
                      ? "border-[#EBEBEB]/40 bg-[#121C2B]/50"
                      : "border-[#EBEBEB]/10 bg-[#11120E] hover:border-[#EBEBEB]/20"
                  } ${isInCart && selectedVariant?.id !== variant.id ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#EBEBEB]">
                          {variant.name}
                        </span>
                        {selectedVariant?.id === variant.id && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <div className="text-sm text-[#EBEBEB]/70">
                        {variant.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#EBEBEB]">
                        {formatPrice(variant.price, "USD")}
                      </div>
                      <div className="text-xs text-[#EBEBEB]/70">
                        {variant.tokens} tokens
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mb-4 text-sm text-[#EBEBEB]/70">
          {selectedVariant ? currentDescription : product.description}
        </p>

        <div className="mb-4 flex items-center space-x-2">
          <div className="text-lg font-bold text-[#EBEBEB]">
            {formatPrice(currentPrice, "USD")}
          </div>
          <div className="text-sm text-[#EBEBEB]/70">
            or {currentTokens} KRKUNI Tokens
          </div>
        </div>

        <div className="text-xs text-[#EBEBEB]/50 mb-4">
          ZAR: {formatPrice(currentZarPrice)}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isInCart || product.unavailable}
          className={`w-full border border-[#EBEBEB]/20 ${
            isInCart
              ? "bg-[#EBEBEB]/10 text-[#EBEBEB]/50"
              : "bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
          }`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isInCart
            ? "Added to Cart"
            : product.unavailable
              ? "Currently Unavailable"
              : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
}

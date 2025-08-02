"use client";

import { AlertTriangle, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { useCart } from "@/context/cart-provider";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();

  const isInCart = items.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addItem(product);
      toast.success(`${product.name} added to cart`);
    }
  };

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
          {product.isSubscription && (
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

        <p className="mb-4 text-sm text-[#EBEBEB]/70">{product.description}</p>

        <div className="mb-4 flex items-center space-x-2">
          <div className="text-lg font-bold text-[#EBEBEB]">
            {formatPrice(product.price, "USD")}
          </div>
          <div className="text-sm text-[#EBEBEB]/70">
            or {product.tokens} KRKUNI Tokens
          </div>
        </div>

        <div className="text-xs text-[#EBEBEB]/50 mb-4">
          ZAR: {formatPrice(product.zarPrice)}
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

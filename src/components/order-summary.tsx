import { CartItem } from "@/context/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Separator } from "./ui/separator";

export default function OrderSummary({
  items,
  totalPrice,
  totalZarPrice,
  totalTokens,
}: {
  items: CartItem[];
  totalPrice: number;
  totalZarPrice: number;
  totalTokens: number;
}) {
  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <div className="font-medium text-[#EBEBEB]">
                {item.selectedVariant
                  ? `${item.name} (${item.selectedVariant?.name})`
                  : item.name}
              </div>
              <div className="text-sm text-[#EBEBEB]/70">
                Qty: {item.quantity}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-[#EBEBEB]">
                {formatPrice(item.price, "USD")}
              </div>
              <div className="text-sm text-[#EBEBEB]/70">
                {item.tokens} Tokens
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-[#EBEBEB]/10" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[#EBEBEB]/70">Subtotal</span>
          <span className="text-[#EBEBEB]">
            {formatPrice(totalPrice, "USD")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#EBEBEB]/70">ZAR Equivalent</span>
          <span className="text-[#EBEBEB]">{formatPrice(totalZarPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#EBEBEB]/70">Tokens</span>
          <span className="text-[#EBEBEB]">{totalTokens}</span>
        </div>
      </div>
    </>
  );
}

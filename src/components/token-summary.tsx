import { Package } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function TokenSummary({
  tokenPackage,
}: {
  tokenPackage: Package;
}) {
  return (
    <div className="rounded-lg border border-[#EBEBEB]/10 bg-[#121C2B]/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-medium text-[#EBEBEB]">{tokenPackage.name}</div>
          <div className="text-sm text-[#EBEBEB]/70">
            {tokenPackage.description}
          </div>
        </div>
        {tokenPackage.popular && (
          <Badge
            variant="outline"
            className="border-[#EBEBEB]/20 bg-[#EBEBEB]/10 text-[#EBEBEB]"
          >
            Popular
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#EBEBEB]/70">Tokens</span>
          <span className="font-medium text-[#EBEBEB]">
            {tokenPackage.tokens}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#EBEBEB]/70">Price (USD)</span>
          <span className="font-medium text-[#EBEBEB]">
            {formatPrice(tokenPackage.price, "USD")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#EBEBEB]/70">Price (ZAR)</span>
          <span className="font-medium text-[#EBEBEB]">
            {formatPrice(tokenPackage.zarPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

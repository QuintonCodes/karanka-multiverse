"use client";

import {
  ArrowRight,
  Check,
  Clock,
  Shield,
  ShoppingCart,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainSection from "@/components/ui/main-section";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { type Package, packages } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

type TokenStepProps = {
  step: string;
  icon: JSX.Element;
  title: string;
  description: string;
};

const tokenSteps: TokenStepProps[] = [
  {
    step: "1",
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Purchase Tokens",
    description:
      "Buy token packages using ZAR through PayFast secure payment gateway or existing tokens",
  },
  {
    step: "2",
    icon: <Target className="h-6 w-6" />,
    title: "Use for Services",
    description:
      "Spend tokens on trading bots, premium signals, lessons, and advanced trading tools",
  },
  {
    step: "3",
    icon: <Clock className="h-6 w-6" />,
    title: "Track Usage",
    description:
      "Monitor your token balance and transaction history in your account dashboard",
  },
];

export default function TokensPage() {
  const router = useRouter();

  const { user } = useAuth();

  function handlePurchase(tokenPackage: Package) {
    if (!user) {
      toast.error("Please log in to purchase tokens");
      return;
    }

    toast.success("Redirecting to checkout...");
    router.push(`/checkout?package=${tokenPackage.id}`);
  }

  return (
    <MainSection className="py-32 mx-auto px-4 ">
      <section className="space-y-12">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold text-[#EBEBEB]"
          >
            Token Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-[#EBEBEB]/70"
          >
            Purchase tokens to access our premium trading services and tools.
            Choose the package that best fits your trading needs.
          </motion.p>
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 inline-flex items-center space-x-2 rounded-full bg-[#121C2B]/50 px-4 py-2 border border-[#EBEBEB]/20"
            >
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-[#EBEBEB]">
                Current Balance: {Number(user.wallet?.balance || 0).toFixed(2)}{" "}
                tokens
              </span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {packages.map((pkg, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              key={pkg.id}
              transition={{ delay: index * 0.1 }}
            >
              <TokenPackageCard handlePurchase={handlePurchase} pkg={pkg} />
            </motion.div>
          ))}
        </div>

        {/* How Tokens Work Section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-[#EBEBEB]/10 bg-gradient-to-br from-[#121C2B]/50 to-[#11120E]/80">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#EBEBEB]">
                How Tokens Work
              </CardTitle>
              <CardDescription className="text-[#EBEBEB]/70">
                Simple steps to get started with your token purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {tokenSteps.map((item) => (
                  <TokenStep item={item} key={item.step} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-[#EBEBEB]/10 bg-gradient-to-r from-green-500/10 to-blue-500/10">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#EBEBEB]">
                Secure & Trusted
              </h3>
              <p className="mb-6 text-[#EBEBEB]/70">
                All transactions are secured with industry-standard encryption
                and processed through PayFast&apos;s secure payment gateway.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-[#EBEBEB]/60">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Instant Processing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </MainSection>
  );
}

function TokenPackageCard({
  pkg,
  handlePurchase,
}: {
  pkg: Package;
  handlePurchase: (pkg: Package) => void;
}) {
  return (
    <Card
      className={`relative h-full border transition-all duration-300 hover:border-[#EBEBEB]/40 hover:shadow-lg ${
        pkg.popular
          ? "border-[#EBEBEB]/30 bg-gradient-to-b from-[#121C2B]/80 to-[#11120E] ring-2 ring-[#EBEBEB]/20"
          : "border-[#EBEBEB]/10 bg-[#11120E]"
      }`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-[#EBEBEB] to-[#EBEBEB]/80 text-[#11120E] font-semibold px-4 py-1">
            <Star className="mr-1 h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Zap className="h-8 w-8 text-blue-400" />
        </div>
        <CardTitle className="text-2xl text-[#EBEBEB]">{pkg.name}</CardTitle>
        <CardDescription className="text-[#EBEBEB]/70">
          {pkg.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pricing */}
        <div className="text-center">
          <div className="mb-2">
            <span className="text-4xl font-bold text-[#EBEBEB]">
              {pkg.tokens}
            </span>
            <span className="ml-2 text-lg text-[#EBEBEB]/70">
              KRKUNI tokens
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#EBEBEB]">
              {formatPrice(pkg.price, "USD")}
            </div>
            <div className="text-sm text-[#EBEBEB]/70">
              {formatPrice(pkg.zarPrice)}
            </div>
            <div className="text-xs text-[#EBEBEB]/50">
              {formatPrice(pkg.price / pkg.tokens, "USD")} per token
            </div>
          </div>
        </div>

        <Separator className="bg-[#EBEBEB]/10" />

        {/* Features */}
        <ul className="space-y-3">
          {pkg.features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              className="flex items-start text-sm text-[#EBEBEB]/80"
            >
              <Check className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Purchase Button */}
        <Button
          onClick={() => handlePurchase(pkg)}
          className={`w-full transition-all ${
            pkg.popular
              ? "bg-gradient-to-r from-[#EBEBEB] to-[#EBEBEB]/90 text-[#11120E] hover:from-[#EBEBEB]/90 hover:to-[#EBEBEB]/80"
              : "border border-[#EBEBEB]/20 bg-gradient-to-r from-[#121C2B] to-[#11120E] hover:border-[#EBEBEB]/40"
          }`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase Package
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function TokenStep({ item }: { item: TokenStepProps }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#11120E] text-[#EBEBEB]">
          {item.icon}
        </div>
      </div>
      <div className="mb-2 text-2xl font-bold text-[#EBEBEB]">{item.step}</div>
      <h3 className="mb-2 font-semibold text-[#EBEBEB]">{item.title}</h3>
      <p className="text-sm text-[#EBEBEB]/70">{item.description}</p>
    </div>
  );
}

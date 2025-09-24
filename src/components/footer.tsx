"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#11120E] border-t border-[#EBEBEB]/10">
      <div className="w-full mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#EBEBEB]">Karanka</span>
              <span className="text-xl font-bold text-[#EBEBEB]/70">
                Multiverse
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#EBEBEB]/70">
              Empowering traders with cutting-edge cryptocurrency trading tools
              and educational resources.
            </p>
            <div className="flex space-x-2">
              <Badge
                variant="outline"
                className="border-[#EBEBEB]/20 text-[#EBEBEB]/70"
              >
                Trading Signals
              </Badge>
              <Badge
                variant="outline"
                className="border-[#EBEBEB]/20 text-[#EBEBEB]/70"
              >
                AI Powered
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#EBEBEB]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/tokens", label: "Token Packages" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/wallet", label: "Wallet" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EBEBEB]/70 transition-colors hover:text-[#EBEBEB]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#EBEBEB]">Support</h3>
            <ul className="space-y-2">
              {[
                { href: "#", label: "Help Center" },
                { href: "#", label: "Contact Us" },
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "FAQ" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EBEBEB]/70 transition-colors hover:text-[#EBEBEB]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#EBEBEB]">
              Stay Connected
            </h3>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-[#EBEBEB]/70">
                <Mail className="h-4 w-4" />
                <span>karankadigital@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-[#EBEBEB]/70">
                <Phone className="h-4 w-4" />
                <span>+27 69 786 2051</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-[#EBEBEB]/70">
                <MapPin className="h-4 w-4" />
                <span>Pretoria, South Africa</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm text-[#EBEBEB]/70">
                Subscribe to our newsletter
              </p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="border-[#EBEBEB]/20 bg-[#121C2B]/30 text-[#EBEBEB] focus-visible:border-[#EBEBEB]/40 focus-visible:ring-[#EBEBEB]/20"
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#121C2B] to-[#11120E] border border-[#EBEBEB]/20 hover:border-[#EBEBEB]/40"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-1">
              {[
                { icon: FaTwitter, href: "#", label: "Twitter" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaWhatsapp, href: "#", label: "Whatsapp" },
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-transparent transition-all"
                  asChild
                >
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#EBEBEB]/10" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-[#EBEBEB]/50">
            &copy; {new Date().getFullYear()} Karanka Multiverse. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-[#EBEBEB]/50">
            <span>AI powered Signals</span>
            <Separator orientation="vertical" className="h-4 bg-[#EBEBEB]/20" />
            <span>Secured by PayFast</span>
            <Separator orientation="vertical" className="h-4 bg-[#EBEBEB]/20" />
            <span>MetaMask Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

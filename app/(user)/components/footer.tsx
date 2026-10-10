"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Headphones,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Send,
  MapPin,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import FlazoLogo from "@/app/commonComponents/FlazoLogo";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success("Golden Discount Unlocked!", {
        description: "Use coupon code 'FLAZOGOLD' for instant ₹300 OFF on your first earbuds order.",
      });
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-white border-t border-amber-200/80 text-neutral-800">
      {/* Main Footer Links */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center group py-1" aria-label="Flazo Home">
              <FlazoLogo size="md" />
            </Link>
            
            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
              Flazo is redefining consumer sound through gold-standard acoustic drivers, precision active noise cancellation, and uncompromising luxury wearability.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-500 hover:text-white transition-all shadow-2xs"
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-500 hover:text-white transition-all shadow-2xs"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-500 hover:text-white transition-all shadow-2xs"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-500 hover:text-white transition-all shadow-2xs"
                aria-label="YouTube"
              >
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Registered Office */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              Company Registered Office
            </h4>
            <div className="text-xs text-neutral-600 leading-relaxed bg-amber-50/40 border border-amber-200/70 rounded-xl p-3.5 space-y-1">
              <p className="font-bold text-neutral-900">Flazo Pvt. Ltd.</p>
              <p>A-116, URBTECH TRADE CENTER, SECTOR-132,</p>
              <p>NOIDA, GAUTAM BUDDHA NAGAR,</p>
              <p>UTTAR PRADESH, 201304</p>
            </div>
          </div>

          {/* Column 3: Newsletter & Exclusive Codes */}
          <div className="md:col-span-2 lg:col-span-4 space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Join the Flazo Golden Club
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Subscribe for secret drop alerts and unlock an instant ₹300 coupon code.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address..."
                className="flex-1 px-4 py-2.5 rounded-full border border-amber-300 text-xs bg-amber-50/30 focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-neutral-800"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-bold text-xs hover:from-amber-500 hover:to-yellow-300 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>

            <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 flex-wrap">
              <span>Customer Care:</span>
              <strong className="text-neutral-900">care@flazo.in</strong>
              <span>•</span>
              <strong className="text-neutral-900">+91 9199859862</strong>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        {/* <div className="mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} Flazo Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Designed in Golden & White</span>
            <span>•</span>
            <span>Crafted for Audiophiles</span>
          </div>
        </div> */}

      </div>
    </footer>
  );
}

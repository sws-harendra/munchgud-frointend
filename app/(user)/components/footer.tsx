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
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";

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
      
      {/* Top Value Assurance Ribbon (boAt & Boult Style) */}
      <div className="bg-amber-50/70 border-b border-amber-100 py-8">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900">1-Year Warranty</h4>
                <p className="text-[11px] text-neutral-500">Doorstep instant swap</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900">Free Express Delivery</h4>
                <p className="text-[11px] text-neutral-500">Fast 48h India dispatch</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900">7 Days Return</h4>
                <p className="text-[11px] text-neutral-500">No hassle guarantee</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900">24K Gold Accents</h4>
                <p className="text-[11px] text-neutral-500">Luxury audio design</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 flex items-center justify-center text-neutral-950 font-black text-sm shadow-xs">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black tracking-widest text-neutral-950">
                FLAZO<span className="text-amber-500">.</span>
              </span>
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

          {/* Column 4: Newsletter & Exclusive Codes */}
          <div className="lg:col-span-6 space-y-4">
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

            <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <span>Customer Care:</span>
              <strong className="text-neutral-900">support@flazo.com</strong>
              <span>•</span>
              <strong className="text-neutral-900">1800-FLAZO-IN</strong>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} Flazo Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Designed in Golden & White</span>
            <span>•</span>
            <span>Crafted for Audiophiles</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

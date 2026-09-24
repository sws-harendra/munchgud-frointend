"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Volume2,
  Truck,
  Star,
  Play,
  X,
  Layers,
  ShoppingCart,
} from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { toast } from "sonner";

export default function FlazoBrandSpotlight() {
  const dispatch = useAppDispatch();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleSpotlightAddToCart = () => {
    setIsAdding(true);
    dispatch(
      addToCart({
        id: 200,
        name: "Flazo Nirvana Gold Pro X",
        price: 2499,
        imageUrl: "/images/spotlight-earbud.jpg",
        quantity: 1,
        paymentMethods: "Prepaid, COD Available",
      })
    );
    toast.success("Flazo Nirvana Gold Pro X added to your cart!");
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <section className="py-10 sm:py-16 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-10 space-y-10 relative z-10">
        
        {/* =========================================================================
            MASTERPIECE FLAGSHIP SHOWCASE CARD
           ========================================================================= */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF9] to-[#FCF8EE] border border-[#EBDCC0] shadow-[0_20px_50px_-15px_rgba(200,160,80,0.14)] overflow-hidden">
          
          {/* Decorative faint acoustic wave background overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E8D5B0_1px,transparent_1px)] [background-size:24px_24px]" 
          />

          <div className="p-6 sm:p-8 lg:p-11 relative z-10">
            
            {/* 1. TOP HEADER BAR: Rating & Fast Dispatch Badge (Aligned Right) */}
            <div className="flex items-center justify-end mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#EBDCC0] text-[#3D3425] text-xs font-semibold shadow-2xs">
                <div className="flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#E5A919] text-[#E5A919]" />
                  <span>4.9 / 5</span>
                </div>
                <span className="text-neutral-300">|</span>
                <div className="flex items-center gap-1.5 text-neutral-800 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Fast Express Dispatch</span>
                </div>
              </div>
            </div>

            {/* 2. MAIN 2-COLUMN GRID: Text / Specs / CTAs (Left) + 3D Gold Pedestal & Earbud (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* LEFT COLUMN: Headings, Specs, CTA Buttons */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
                
                {/* Overline & Main Title */}
                <div className="space-y-2">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
                    THE 2026 GOLD STANDARD
                  </p>

                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.12] text-[#1A1815] font-serif">
                    Flazo Nirvana{" "}
                    <span className="bg-gradient-to-r from-[#9E7324] via-[#D4AF37] to-[#B38328] bg-clip-text text-transparent italic">
                      Gold Pro X
                    </span>
                  </h2>

                  <h3 className="text-base sm:text-lg font-bold text-[#2A2723] leading-snug pt-1">
                    World&apos;s First Dual-Coaxial Earbuds with 50dB Hybrid ANC & Auracast™
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed max-w-xl">
                    Experience the pinnacle of Indian acoustic engineering. Built with 24K gold-plated acoustic diaphragm and military-grade dual-coaxial isolation.
                  </p>
                </div>

                {/* KEY HARDWARE SPECS STRIP (Horizontal with Dividers) */}
                <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 border-y border-[#EFE3C8] text-left">
                  {/* Spec 1 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                      <Volume2 className="w-4 h-4 text-[#C6922A]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">13mm Dual-Coaxial</div>
                      <div className="text-[11px] text-neutral-500">Precision Drivers</div>
                    </div>
                  </div>

                  <div className="hidden sm:block h-7 w-[1px] bg-[#E5D6BD]" />

                  {/* Spec 2 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#C6922A]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">Qualcomm® S3</div>
                      <div className="text-[11px] text-neutral-500">Next-Gen Chipset</div>
                    </div>
                  </div>

                  <div className="hidden sm:block h-7 w-[1px] bg-[#E5D6BD]" />

                  {/* Spec 3 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-[#C6922A]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">70H Monster Play</div>
                      <div className="text-[11px] text-neutral-500">All-Day Power</div>
                    </div>
                  </div>
                </div>

                {/* CTA ACTION BUTTONS */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {/* Primary CTA: Grab Yours Now */}
                  <button
                    onClick={handleSpotlightAddToCart}
                    disabled={isAdding}
                    className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#996515] via-[#B8860B] to-[#D4AF37] text-white font-bold text-sm shadow-md shadow-amber-800/20 hover:shadow-amber-700/35 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAdding ? "Adding..." : "Grab Yours Now"}</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>

                  {/* Secondary CTA: Watch Product Video */}
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/95 hover:bg-white border border-[#D8C7A5] text-[#2A2723] font-bold text-sm shadow-2xs hover:shadow-sm hover:border-[#B8860B] transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-[#2A2723] text-[#2A2723]" />
                    <span>Watch Product Video</span>
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: 3D Gold Pedestal with Floating Luxury Earbud Stage Visual */}
              <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
                <div className="relative w-full max-w-[560px] aspect-[534/437] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  {/* Masterpiece rendered visual of Earbud on 3D Gold Pedestal */}
                  <Image
                    src="/images/spotlight-earbud-stage-clean.png"
                    alt="Flazo Nirvana Gold Pro X on 3D Gold Pedestal Stage"
                    fill
                    priority
                    className="object-contain transform hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          VIDEO SHOWCASE MODAL
         ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-neutral-950 rounded-3xl overflow-hidden border border-amber-400/40 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Flazo Nirvana Gold Pro X — Official Cinematic Showcase
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src="/videos/test.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

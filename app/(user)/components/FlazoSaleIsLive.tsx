"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Info,
  ShoppingCart,
  Check,
  Flame,
  Zap,
  Timer,
} from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { toast } from "sonner";

interface SaleProduct {
  id: number;
  name: string;
  badge: string;
  badgeBg: string;
  image: string;
  featureBar: string;
  rating: number;
  price: number;
  originalPrice: number;
  discount: string;
  colors: string[];
  extraColorsCount?: number;
}

const saleProducts: SaleProduct[] = [
  {
    id: 201,
    name: "Flazo Nirvana Ion ANC",
    badge: "✨ Engraving Available",
    badgeBg: "bg-amber-950 text-amber-300",
    image: "/images/hero-earbuds.jpg",
    featureBar: "120 Hours Playback",
    rating: 4.9,
    price: 2399,
    originalPrice: 9990,
    discount: "76% off",
    colors: ["#FFFFFF", "#D4AF37", "#1A1A1A"],
    extraColorsCount: 2,
  },
  {
    id: 202,
    name: "Flazo Airdopes 181 Pro",
    badge: "🎁 Free Spotify",
    badgeBg: "bg-neutral-900 text-yellow-300",
    image: "/images/spotlight-earbud.jpg",
    featureBar: "100 Hours Playback",
    rating: 4.8,
    price: 1499,
    originalPrice: 4990,
    discount: "70% off",
    colors: ["#F5DE98", "#FFFFFF"],
    extraColorsCount: 2,
  },
  {
    id: 203,
    name: "Flazo Wave Fury Gold",
    badge: "🚀 Bestseller",
    badgeBg: "bg-neutral-950 text-white",
    image: "/images/watch-gold.jpg",
    featureBar: "BT Calling & AMOLED",
    rating: 4.9,
    price: 2299,
    originalPrice: 6999,
    discount: "67% off",
    colors: ["#E5C158", "#1A1A1A"],
    extraColorsCount: 3,
  },
  {
    id: 204,
    name: "Flazo Rockerz 110 Gold",
    badge: "🔥 New Launch",
    badgeBg: "bg-neutral-950 text-amber-300",
    image: "/images/neckband-gold.jpg",
    featureBar: "40 Hours Playback",
    rating: 4.8,
    price: 999,
    originalPrice: 2490,
    discount: "60% off",
    colors: ["#F5DE98", "#2D2D2D"],
    extraColorsCount: 1,
  },
  {
    id: 205,
    name: "Flazo BassPod Extreme",
    badge: "⚡ 35ms Beast™",
    badgeBg: "bg-amber-900 text-amber-300",
    image: "/images/lineup-showcase.jpg",
    featureBar: "13.4mm Titanium Bass",
    rating: 4.8,
    price: 1899,
    originalPrice: 4999,
    discount: "62% off",
    colors: ["#D4AF37", "#FFFFFF"],
    extraColorsCount: 2,
  },
  {
    id: 206,
    name: "Flazo Acoustic Labs Pro",
    badge: "✨ Studio Tuned",
    badgeBg: "bg-neutral-900 text-white",
    image: "/images/driver-tech.jpg",
    featureBar: "24K Gold Acoustic Diaphragm",
    rating: 4.9,
    price: 2499,
    originalPrice: 6999,
    discount: "64% off",
    colors: ["#F5DE98", "#FFFFFF"],
    extraColorsCount: 1,
  },
];

export default function FlazoSaleIsLive() {
  const dispatch = useAppDispatch();
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (product: SaleProduct) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        quantity: 1,
        paymentMethods: "Prepaid, COD",
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="py-12 bg-white border-b border-amber-100/70">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        
        {/* Top Trust & Value Assurance Strip (Exact boAt Style) */}
        <div className="bg-gradient-to-r from-amber-50/50 via-white to-amber-50/50 border border-amber-200/70 rounded-2xl p-4 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 items-center">
            
            {/* Warranty */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black text-neutral-950">12+3 Months</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-amber-600" />
                </div>
                <span className="text-xs text-neutral-500 font-medium">Warranty</span>
              </div>
            </div>

            {/* GST Billing */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-neutral-950">GST</div>
                <span className="text-xs text-neutral-500 font-medium">Billing</span>
              </div>
            </div>

            {/* Free Delivery */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Truck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-neutral-950">Free Express</div>
                <span className="text-xs text-neutral-500 font-medium">Delivery*</span>
              </div>
            </div>

            {/* 7-day Replacement */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-neutral-950">7-day</div>
                <span className="text-xs text-neutral-500 font-medium">Replacement</span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Flash Deal Urgency Countdown Bar (boAt Signature Conversion Booster) */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/40 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
              <Zap className="w-5 h-5 fill-amber-400 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-black tracking-wide text-white flex items-center gap-2">
                <span>FLASH SALE IS LIVE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-red-600 font-bold uppercase tracking-wider text-white animate-pulse">UP TO 76% OFF</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Extra ₹200 OFF on prepaid UPI orders • Apply coupon: <strong className="text-amber-300 font-black tracking-wider">FLAZO200</strong>
              </p>
            </div>
          </div>

          {/* Live Countdown Clock */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1 hidden sm:inline">Deal Ends In:</span>
            <div className="flex items-center gap-1.5 font-black text-xs text-neutral-950">
              <span className="bg-amber-400 px-2.5 py-1 rounded-md min-w-[32px] text-center shadow-xs">{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="bg-amber-400 px-2.5 py-1 rounded-md min-w-[32px] text-center shadow-xs">{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="bg-amber-400 px-2.5 py-1 rounded-md min-w-[32px] text-center shadow-xs">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>

        {/* Section Header: "Sale Is Live" + "View All" (Exact boAt Style) */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 flex items-center gap-2">
              <span>Trending</span>
              <span className="relative pb-1">
                Bestsellers
                <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-full" />
              </span>
              <Flame className="w-6 h-6 text-red-500 fill-red-500 animate-pulse ml-1" />
            </h2>
          </div>

          <a
            href="#flagship-series"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-800 hover:text-amber-600 transition-colors"
          >
            <span>View All</span>
            <div className="w-5 h-5 rounded-full border border-neutral-300 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </div>

        {/* 6 Product Cards Grid / Spacious Layout with card-lift */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
          {saleProducts.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => setActiveCardId(p.id)}
              onMouseLeave={() => setActiveCardId(null)}
              className="card-lift rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between group relative"
            >
              
              {/* Product Top: Image with Corner Tag */}
              <div className="relative w-full aspect-square bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center p-4 overflow-hidden">
                
                {/* boAt Style Top-Left Tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-sm shadow-xs ${p.badgeBg}`}>
                    {p.badge}
                  </span>
                </div>

                {/* Product Image */}
                <Image
                  src={p.image}
                  alt={p.name}
                  width={280}
                  height={280}
                  className="object-contain w-full h-full max-h-[160px] drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500"
                />

                {/* Quick Add Overlay on Hover */}
                {activeCardId === p.id && (
                  <button
                    onClick={() => handleQuickAdd(p)}
                    className="btn-shimmer absolute bottom-2.5 inset-x-2.5 py-2.5 rounded-xl bg-neutral-950 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl hover:bg-black transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>

              {/* Distinctive Yellow/Golden Feature Bar (Exact boAt signature design) */}
              <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-3 py-1.5 flex items-center justify-between text-neutral-950 font-bold text-[11px] sm:text-xs">
                <span className="truncate pr-1">{p.featureBar}</span>
                <span className="flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-sm text-[10px] shrink-0 font-black shadow-2xs">
                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  {p.rating}
                </span>
              </div>

              {/* Product Details & Price */}
              <div className="p-3.5 space-y-2.5 text-left bg-white flex-1 flex flex-col justify-between">
                
                <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-2 h-9 leading-snug">
                  {p.name}
                </h3>

                {/* Price & Color Preview Row */}
                <div className="flex items-end justify-between gap-1 pt-1 border-t border-neutral-100">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-black text-neutral-950">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-400 line-through font-medium">
                        ₹{p.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-extrabold text-emerald-600 block">
                        {p.discount}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-sm">
                        Save ₹{(p.originalPrice - p.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Circular Color Swatches Preview */}
                  <div className="flex items-center -space-x-1 shrink-0 pb-1">
                    {p.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    {p.extraColorsCount && (
                      <span className="text-[10px] text-neutral-500 font-bold pl-1.5">
                        +{p.extraColorsCount}
                      </span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>


      </div>
    </section>
  );
}

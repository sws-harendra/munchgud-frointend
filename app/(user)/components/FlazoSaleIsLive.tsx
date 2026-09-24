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
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { fetchActiveTrendingImages } from "@/app/lib/store/features/trendingImageSlice";
import { TrendingImageItem } from "@/app/sercices/user/trendingImage.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";

export default function FlazoSaleIsLive() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.trendingImages);
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 19 });

  useEffect(() => {
    dispatch(fetchActiveTrendingImages());
  }, [dispatch]);

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

  const handleQuickAdd = (product: TrendingImageItem) => {
    dispatch(
      addToCart({
        id: product.productId || product.id,
        name: product.name,
        price: product.price,
        imageUrl: getImageUrl(product.imageUrl),
        quantity: 1,
        paymentMethods: "Prepaid, COD",
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const parseColors = (colorsStr?: string): string[] => {
    if (!colorsStr) return ["#FFFFFF", "#D4AF37"];
    try {
      const parsed = JSON.parse(colorsStr);
      return Array.isArray(parsed) ? parsed : [colorsStr];
    } catch {
      return ["#FFFFFF", "#D4AF37"];
    }
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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
          {status === "loading" && items.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs p-4 space-y-3 animate-pulse"
                >
                  <div className="w-full aspect-square bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              ))
            : items.map((p) => {
                const colorList = parseColors(p.colors);
                const targetLink =
                  p.link ||
                  (p.productId ? `/products/${p.productId}` : "#bestsellers");

                return (
                  <div
                    key={p.id}
                    className="card-lift rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between group relative"
                  >
                    {/* Product Top: Image with Corner Tag */}
                    <div className="relative w-full aspect-square bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center p-4 overflow-hidden">
                      {/* boAt Style Top-Left Tag */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-sm shadow-xs ${p.badgeBg}`}
                        >
                          {p.badge}
                        </span>
                      </div>

                      {/* Product Image */}
                      <Link
                        href={targetLink}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={getImageUrl(p.imageUrl)}
                          alt={p.name}
                          className="object-contain w-full h-full max-h-[160px] drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    {/* Distinctive Yellow/Golden Feature Bar */}
                    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-3 py-1.5 flex items-center justify-between text-neutral-950 font-bold text-[11px] sm:text-xs">
                      <span className="truncate pr-1">{p.featureBar}</span>
                      <span className="flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-sm text-[10px] shrink-0 font-black shadow-2xs">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        {p.rating}
                      </span>
                    </div>

                    {/* Product Details & Price & Clean Bottom Add to Cart Button */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between text-left bg-white">
                      <div className="space-y-2">
                        <Link href={targetLink}>
                          <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-2 min-h-[36px] leading-snug">
                            {p.name}
                          </h3>
                        </Link>

                        {/* Price & Color Preview Row */}
                        <div className="flex items-end justify-between gap-1 pt-2 border-t border-neutral-100">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base sm:text-lg font-black text-neutral-950">
                                ₹{p.price.toLocaleString("en-IN")}
                              </span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="text-xs text-neutral-400 line-through font-medium">
                                  ₹{p.originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.discount && (
                                <span className="text-[11px] font-extrabold text-emerald-600 block">
                                  {p.discount}
                                </span>
                              )}
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-sm">
                                  Save ₹
                                  {(p.originalPrice - p.price).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Circular Color Swatches Preview */}
                          <div className="flex items-center -space-x-1 shrink-0 pb-1">
                            {colorList.map((c, idx) => (
                              <span
                                key={idx}
                                className="w-3 h-3 rounded-full border border-white shadow-2xs"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                            {p.extraColorsCount ? (
                              <span className="text-[10px] text-neutral-500 font-bold pl-1.5">
                                +{p.extraColorsCount}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Professional Bottom Add to Cart Button */}
                      <button
                        onClick={() => handleQuickAdd(p)}
                        className="w-full mt-3.5 py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-amber-400 text-amber-300 hover:text-neutral-950 border border-amber-400/40 hover:border-amber-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98] group/btn"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-400 group-hover/btn:text-neutral-950 transition-colors" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>


      </div>
    </section>
  );
}

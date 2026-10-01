"use client";
import React, { useState, useEffect } from "react";
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
  Flame,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { getTrendingProduct } from "@/app/lib/store/features/productSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";

const slugify = (text: string) =>
  (text || "product")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();

export default function FlazoSaleIsLive() {
  const dispatch = useAppDispatch();
  const { trendingProducts, status } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getTrendingProduct());
  }, [dispatch]);

  const productsList: any[] = Array.isArray(trendingProducts)
    ? trendingProducts
    : (trendingProducts as any)?.products &&
      Array.isArray((trendingProducts as any).products)
    ? (trendingProducts as any).products
    : [];

  const getProductImage = (p: any): string => {
    if (Array.isArray(p.images) && p.images.length > 0) {
      return getImageUrl(p.images[0]);
    }
    if (typeof p.images === "string" && p.images.trim()) {
      try {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return getImageUrl(parsed[0]);
        }
      } catch {
        return getImageUrl(p.images);
      }
    }
    if (p.imageUrl) return getImageUrl(p.imageUrl);
    return "/placeholder.png";
  };

  const handleQuickAdd = (product: any) => {
    const finalPrice = Number(product.discountPrice || product.price || 0);
    const finalImage = getProductImage(product);

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
        imageUrl: finalImage,
        quantity: 1,
        paymentMethods: product.paymentMethods || "Prepaid, COD",
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  // If not loading and no trending products selected by admin, hide section cleanly
  if (status !== "loading" && productsList.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-b border-amber-100/70">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {/* Top Trust & Value Assurance Strip (boAt Style) */}
        <div className="bg-gradient-to-r from-amber-50/50 via-white to-amber-50/50 border border-amber-200/70 rounded-2xl p-4 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 items-center">
            {/* Warranty */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black text-neutral-950">
                    12+3 Months
                  </span>
                  <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-amber-600" />
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  Warranty
                </span>
              </div>
            </div>

            {/* GST Billing */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-neutral-950">
                  GST
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  Billing
                </span>
              </div>
            </div>

            {/* Free Delivery */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Truck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-neutral-950">
                  Free Express
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  Delivery*
                </span>
              </div>
            </div>

            {/* 7-day Replacement */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-neutral-950">
                  7-day
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  Replacement
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
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

          <Link
            href="/products"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-800 hover:text-amber-600 transition-colors"
          >
            <span>View All</span>
            <div className="w-5 h-5 rounded-full border border-neutral-300 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
          {status === "loading" && productsList.length === 0
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
            : productsList.map((p) => {
                const targetLink = `/products/${slugify(p.name)}/${p.id}`;
                const price = Number(p.discountPrice || p.price || 0);
                const originalPrice = Number(p.originalPrice || 0);
                const discountPercent =
                  originalPrice > price
                    ? Math.round(((originalPrice - price) / originalPrice) * 100)
                    : 0;
                const imageSrc = getProductImage(p);

                // Badge tag
                const badgeText = Array.isArray(p.tags) && p.tags.length > 0
                  ? p.tags[0]
                  : typeof p.tags === "string" && p.tags
                  ? p.tags.split(",")[0]
                  : "🔥 Bestseller";

                return (
                  <div
                    key={p.id}
                    className="card-lift rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between group relative"
                  >
                    {/* Product Top: Image with Corner Tag */}
                    <div className="relative w-full aspect-square bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center p-4 overflow-hidden">
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-sm shadow-xs bg-neutral-950 text-white">
                          {badgeText}
                        </span>
                      </div>

                      {/* Product Image */}
                      <Link
                        href={targetLink}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={imageSrc}
                          alt={p.name}
                          className="object-contain w-full h-full max-h-[160px] drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    {/* Feature Bar */}
                    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-3 py-1.5 flex items-center justify-between text-neutral-950 font-bold text-[11px] sm:text-xs">
                      <span className="truncate pr-1">
                        {p.varientValue || p.Category?.name || "Official Bestseller"}
                      </span>
                      <span className="flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-sm text-[10px] shrink-0 font-black shadow-2xs">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        {p.ratings || "4.9"}
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

                        {/* Price Row */}
                        <div className="flex items-end justify-between gap-1 pt-2 border-t border-neutral-100">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base sm:text-lg font-black text-neutral-950">
                                ₹{price.toLocaleString("en-IN")}
                              </span>
                              {originalPrice > price && (
                                <span className="text-xs text-neutral-400 line-through font-medium">
                                  ₹{originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {discountPercent > 0 && (
                                <span className="text-[11px] font-extrabold text-amber-600 block">
                                  {discountPercent}% off
                                </span>
                              )}
                              {originalPrice > price && (
                                <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-sm">
                                  Save ₹
                                  {(originalPrice - price).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Add to Cart Button */}
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

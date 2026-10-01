"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Flame,
  Award,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchProducts,
  getTrendingProduct,
} from "@/app/lib/store/features/productSlice";
import { fetchCategories } from "@/app/lib/store/features/categorySlice";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";

const slugify = (text: string) =>
  (text || "product")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();

export default function FlazoBrandSpotlight() {
  const dispatch = useAppDispatch();
  const { products, trendingProducts, status } = useAppSelector(
    (state) => state.product
  );
  const { categories } = useAppSelector((state) => state.category);

  const [activeTab, setActiveTab] = useState<"all" | "trending" | "signature" | "new">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch initial data if not already present
  useEffect(() => {
    dispatch(fetchProducts({ limit: 12 }));
    dispatch(getTrendingProduct());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Extract products list safely
  const allProducts: any[] = useMemo(() => {
    const list: any[] = [];
    if (products?.products && Array.isArray(products.products)) {
      list.push(...products.products);
    } else if (Array.isArray(products)) {
      list.push(...products);
    }
    if (trendingProducts && Array.isArray(trendingProducts)) {
      trendingProducts.forEach((tp) => {
        if (!list.some((item) => item.id === tp.id)) {
          list.push(tp);
        }
      });
    }
    return list;
  }, [products, trendingProducts]);

  // Filter products based on selected tab
  const filteredProducts = useMemo(() => {
    if (allProducts.length === 0) return [];
    if (activeTab === "trending") {
      const trending = allProducts.filter((p) => p.trending_product);
      return trending.length > 0 ? trending : allProducts;
    }
    if (activeTab === "signature") {
      return allProducts.slice(0, 4);
    }
    if (activeTab === "new") {
      return [...allProducts].reverse();
    }
    return allProducts;
  }, [allProducts, activeTab]);

  // Reset selected index when tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeTab]);

  // Active spotlight product
  const currentProduct = filteredProducts[selectedIndex] || allProducts[0] || null;

  const getProductImage = (p: any): string => {
    if (!p) return "/images/lifestyle-model.jpg";
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
    return "/images/lifestyle-model.jpg";
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!product) return;
    setIsAdding(true);
    const finalPrice = Number(product.discountPrice || product.price || 1999);
    const finalImage = getProductImage(product);

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
        imageUrl: finalImage,
        quantity: 1,
        paymentMethods: product.paymentMethods || "Prepaid, COD Available",
      })
    );
    toast.success(`${product.name} added to your cart!`);
    setTimeout(() => setIsAdding(false), 500);
  };

  // Safe category list
  const categoryList: any[] = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.slice(0, 4);
    }
    return [
      { id: 1, name: "Original Art & Decor", count: "Curated" },
      { id: 2, name: "Modern Lifestyle", count: "Trending" },
      { id: 3, name: "Signature Editions", count: "Exclusive" },
      { id: 4, name: "Design Accents", count: "Limited" },
    ];
  }, [categories]);

  // Price calculations
  const price = currentProduct ? Number(currentProduct.discountPrice || currentProduct.price || 1999) : 1999;
  const originalPrice = currentProduct ? Number(currentProduct.originalPrice || 2499) : 2499;
  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const productLink = currentProduct
    ? `/products/${slugify(currentProduct.name)}/${currentProduct.id}`
    : "/earbuds";

  return (
    <section className="py-12 sm:py-16 bg-[#FCFBF8] border-b border-[#EFE8DC] relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-amber-100/30 via-amber-50/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10 relative z-10">
        
        {/* =========================================================================
            1. SECTION HEADER WITH INTERACTIVE FILTER PILLS (World-Class E-Commerce UX)
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-200/50 pb-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[#8C6D37] text-xs font-bold tracking-widest uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Curated Drops &amp; Collections</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1815] tracking-tight leading-tight">
              Designed for Living,{" "}
              <span className="bg-gradient-to-r from-[#9E7324] via-[#D4AF37] to-[#B38328] bg-clip-text text-transparent italic font-serif">
                Crafted for Distinction.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
              Discover iconic releases, handpicked limited drops, and everyday essentials engineered with an uncompromising commitment to quality.
            </p>
          </div>

          {/* Interactive Collection Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-white/90 hover:bg-white text-neutral-700 border border-neutral-200/80 hover:border-amber-300"
              }`}
            >
              All Curations
            </button>

            <button
              onClick={() => setActiveTab("trending")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "trending"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-white/90 hover:bg-white text-neutral-700 border border-neutral-200/80 hover:border-amber-300"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Now</span>
            </button>

            <button
              onClick={() => setActiveTab("signature")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "signature"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-white/90 hover:bg-white text-neutral-700 border border-neutral-200/80 hover:border-amber-300"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Signature Series</span>
            </button>

            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "new"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-white/90 hover:bg-white text-neutral-700 border border-neutral-200/80 hover:border-amber-300"
              }`}
            >
              New Drops
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. ARCHITECTURAL LUXURY BENTO GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* -----------------------------------------------------------------------
              BENTO CARD 1: DYNAMIC MASTERPIECE PRODUCT SPOTLIGHT (7 Cols)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-white via-[#FCFAF5] to-[#F9F5EA] border border-[#E8DCC4] shadow-[0_16px_40px_-15px_rgba(200,160,80,0.12)] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group">
            
            {/* Subtle luxury ambient texture */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#E8D5B0_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 space-y-6">
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 text-amber-300 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {currentProduct?.Category?.name || currentProduct?.tags?.[0] || "Curator's Spotlight"}
                </span>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-200/80 text-xs font-bold text-neutral-800 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{currentProduct?.ratings || "4.9"}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-500 font-medium">Verified Authentic</span>
                </div>
              </div>

              {/* Product Visual + Info 2-Column Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Product Image Area */}
                <div className="md:col-span-6 relative flex items-center justify-center">
                  <Link href={productLink} className="w-full">
                    <div className="relative w-full aspect-square max-h-[340px] rounded-2xl bg-gradient-to-b from-[#F5EFE6]/70 via-white to-[#F0E6D6]/70 border border-amber-100 flex items-center justify-center p-6 shadow-inner group/img overflow-hidden">
                      <img
                        src={getProductImage(currentProduct)}
                        alt={currentProduct?.name || "Curated Spotlight Product"}
                        className="w-full h-full object-contain max-h-[280px] drop-shadow-lg group-hover/img:scale-105 transition-transform duration-500"
                        loading="eager"
                      />
                      
                      {/* Hover Pill */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-950/90 text-white text-[11px] font-bold shadow-md">
                          <span>View Details</span>
                          <ArrowUpRight className="w-3 h-3 text-amber-300" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Product Copy & Specs */}
                <div className="md:col-span-6 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D37]">
                      {currentProduct?.varientValue || "Signature Series"}
                    </p>
                    <Link href={productLink}>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 leading-tight hover:text-amber-700 transition-colors line-clamp-2">
                        {currentProduct?.name || "Curated Modern Masterpiece"}
                      </h3>
                    </Link>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {currentProduct?.description ||
                      "Engineered to the highest standards with premium finishes, rigorous quality inspection, and timeless aesthetics made to complement any setting."}
                  </p>

                  {/* Price & Savings Pill */}
                  <div className="pt-2 border-t border-amber-200/50 flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-neutral-950">
                      ₹{price.toLocaleString("en-IN")}
                    </span>

                    {originalPrice > price && (
                      <span className="text-sm sm:text-base text-neutral-400 line-through font-medium">
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}

                    {discountPercent > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock & Assurance Strip */}
                  <div className="flex items-center gap-3 text-xs text-neutral-600 pt-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>In Stock</span>
                    </div>
                    <span className="text-neutral-300">•</span>
                    <span>Ready for 24h Dispatch</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <Link
                      href={productLink}
                      className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#996515] via-[#B8860B] to-[#D4AF37] text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Explore Piece</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={(e) => handleAddToCart(e, currentProduct)}
                      disabled={isAdding}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-neutral-950 text-neutral-900 hover:text-white border border-[#D8C7A5] hover:border-neutral-950 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all cursor-pointer group/cart"
                    >
                      <ShoppingCart className="w-4 h-4 text-amber-600 group-hover/cart:text-amber-400" />
                      <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Multi-Product Navigation Switcher Dots */}
            {filteredProducts.length > 1 && (
              <div className="relative z-10 pt-6 mt-6 border-t border-amber-200/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Spotlight {selectedIndex + 1} of {Math.min(filteredProducts.length, 6)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : Math.min(filteredProducts.length - 1, 5)
                      )
                    }
                    className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center text-neutral-700 hover:bg-amber-50 transition-colors cursor-pointer shadow-2xs"
                    title="Previous spotlight product"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2">
                    {filteredProducts.slice(0, 6).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          selectedIndex === idx ? "w-6 bg-[#B8860B]" : "w-2 bg-neutral-300 hover:bg-amber-300"
                        }`}
                        title={`Select product ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setSelectedIndex((prev) =>
                        prev < Math.min(filteredProducts.length - 1, 5) ? prev + 1 : 0
                      )
                    }
                    className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center text-neutral-700 hover:bg-amber-50 transition-colors cursor-pointer shadow-2xs"
                    title="Next spotlight product"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* -----------------------------------------------------------------------
              BENTO CARD 2: CURATED UNIVERSES & CATEGORY NAVIGATOR (5 Cols)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            
            {/* Top Sub-Card: Curated Collections Directory */}
            <div className="flex-1 rounded-[28px] sm:rounded-[32px] bg-white border border-[#E8DCC4] shadow-[0_12px_32px_-15px_rgba(200,160,80,0.10)] p-6 sm:p-7 flex flex-col justify-between text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center">
                    <Boxes className="w-4 h-4 text-[#B8860B]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-950 leading-tight">
                      Explore Universes
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Curated by category
                    </p>
                  </div>
                </div>

                <Link
                  href="/earbuds"
                  className="text-xs font-bold text-[#B8860B] hover:text-neutral-950 transition-colors flex items-center gap-1 group/all"
                >
                  <span>All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Dynamic Category List */}
              <div className="space-y-2.5">
                {categoryList.map((cat, idx) => (
                  <Link
                    key={cat.id || idx}
                    href="/earbuds"
                    className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 bg-[#FAF9F5]/70 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-neutral-900 group-hover/item:scale-105 transition-transform">
                        <span className="text-xs font-black text-[#8C6D37]">
                          0{idx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-neutral-900 group-hover/item:text-[#8C6D37] transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">
                          {cat.count ? `${cat.count} Series` : "Official Collection"}
                        </div>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 group-hover/item:border-amber-400 group-hover/item:bg-neutral-950 flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover/item:text-amber-300 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick Prompt */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Free Insured Pan-India Transit</span>
                <span className="font-bold text-neutral-800">Express 24h</span>
              </div>
            </div>

            {/* Bottom Sub-Card: The Brand Philosophy / Editorial Atelier */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#1C1A17] via-[#2A2620] to-[#171512] text-white p-6 sm:p-7 border border-[#3E382E] shadow-xl text-left relative overflow-hidden flex flex-col justify-between space-y-4">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  <Award className="w-3 h-3 text-amber-400" />
                  The Flazo Promise
                </span>

                <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                  Designed Without Compromise.
                </h4>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every product in our catalog undergoes rigorous multi-point verification before it reaches your hands.
                </p>
              </div>

              <div className="relative z-10 pt-2 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-[11px] text-neutral-400">
                  <span className="font-bold text-amber-300">100%</span> Inspected &amp; Tested
                </div>

                <Link
                  href="/earbuds"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            3. WORLD-CLASS 4-PILLAR BUYER ASSURANCE STRIP (Universal for ALL Products)
           ========================================================================= */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E8DCC4] p-5 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            
            {/* Pillar 1 */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                <ShieldCheck className="w-5 h-5 text-[#B8860B]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950">
                  Verified Authenticity
                </h4>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Hand-inspected multi-point quality check
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                <RotateCcw className="w-5 h-5 text-[#B8860B]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950">
                  7-Day Doorstep Exchange
                </h4>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Hassle-free replacement guarantee
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                <Truck className="w-5 h-5 text-[#B8860B]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950">
                  Insured Express Transit
                </h4>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Dispatched in 24h with live tracking
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                <Compass className="w-5 h-5 text-[#B8860B]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950">
                  Dedicated Concierge
                </h4>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Priority customer care support
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

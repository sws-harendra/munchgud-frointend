"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import {
  Heart,
  ShoppingCart,
  Star,
  LayoutGrid,
  List,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";
import Loader from "@/app/commonComponents/loader";

interface EarbudProduct {
  id: number;
  name: string;
  tagline: string;
  badge?: string;
  badgeType?: "bestseller" | "new" | "trending" | "top";
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: string;
  image: string;
  colors: { name: string; hex: string; image?: string }[];
}

const earbudCatalog: EarbudProduct[] = [
  {
    id: 301,
    name: "Flazo BassPod Extreme",
    tagline: "13.4mm Titanium Club Bass",
    badge: "🔥 Bestseller",
    badgeType: "bestseller",
    price: 1499,
    originalPrice: 2999,
    discount: "50% Off",
    rating: 4.8,
    reviews: "2.4K",
    image: "/images/real_earbud_product.png",
    colors: [
      { name: "Champagne Gold", hex: "#E7CCA0" },
      { name: "Midnight Ash", hex: "#333333" },
      { name: "Desert Sand", hex: "#D6C7A1" },
      { name: "Pale Ivory", hex: "#F5EFE0" },
    ],
  },
  {
    id: 302,
    name: "Flazo Nirvana HD",
    tagline: "13mm Dynamic Driver",
    badge: "🌱 New Launch",
    badgeType: "new",
    price: 1299,
    originalPrice: 2499,
    discount: "48% Off",
    rating: 4.7,
    reviews: "1.8K",
    image: "/images/spotlight-earbud.jpg",
    colors: [
      { name: "Obsidian Black", hex: "#1A1A1A" },
      { name: "Charcoal Slate", hex: "#3A3D40" },
      { name: "Emerald Green", hex: "#1B4D3E" },
    ],
  },
  {
    id: 303,
    name: "Flazo ZenPods",
    tagline: "ENx™ Noise Cancelling",
    badge: "⭐ Top Pick",
    badgeType: "top",
    price: 1199,
    originalPrice: 2199,
    discount: "45% Off",
    rating: 4.6,
    reviews: "956",
    image: "/images/hero-earbuds.jpg",
    colors: [
      { name: "Navy Blue", hex: "#1B2A4A" },
      { name: "Silver Frost", hex: "#C0C0C0" },
      { name: "Matte Black", hex: "#222222" },
    ],
  },
  {
    id: 304,
    name: "Flazo Aura",
    tagline: "40H Total Playback",
    badge: "⚡ Trending",
    badgeType: "trending",
    price: 999,
    originalPrice: 1999,
    discount: "50% Off",
    rating: 4.5,
    reviews: "1.2K",
    image: "/images/lineup-showcase.jpg",
    colors: [
      { name: "Lilac Mist", hex: "#C8B6E2" },
      { name: "Lavender", hex: "#9F88C7" },
      { name: "Royal Violet", hex: "#5C3A92" },
    ],
  },
  {
    id: 305,
    name: "Flazo Neo",
    tagline: "Low Latency Gaming Mode",
    badge: "⚡ Trending",
    badgeType: "trending",
    price: 1099,
    originalPrice: 1999,
    discount: "45% Off",
    rating: 4.4,
    reviews: "862",
    image: "/images/driver-tech.jpg",
    colors: [
      { name: "Sage Green", hex: "#587B6D" },
      { name: "Mint Frost", hex: "#A8DADC" },
    ],
  },
  {
    id: 306,
    name: "Flazo Core",
    tagline: "Balanced Sound Signature",
    badge: "🔥 Bestseller",
    badgeType: "bestseller",
    price: 899,
    originalPrice: 1499,
    discount: "40% Off",
    rating: 4.3,
    reviews: "620",
    image: "/images/spotlight-earbud-stage-clean.png",
    colors: [
      { name: "Pitch Black", hex: "#111111" },
      { name: "Stone Gray", hex: "#777777" },
    ],
  },
  {
    id: 307,
    name: "Flazo Air",
    tagline: "Lightweight & Comfortable",
    badge: "🌱 New Launch",
    badgeType: "new",
    price: 1399,
    originalPrice: 2499,
    discount: "44% Off",
    rating: 4.5,
    reviews: "1.1K",
    image: "/images/newsletter_flazo_earbud.png",
    colors: [
      { name: "Pearl White", hex: "#FFFFFF" },
      { name: "Gold Trim", hex: "#D4AF37" },
    ],
  },
  {
    id: 308,
    name: "Flazo Max",
    tagline: "60H Battery Life",
    badge: "⚡ Trending",
    badgeType: "trending",
    price: 1599,
    originalPrice: 2999,
    discount: "46% Off",
    rating: 4.6,
    reviews: "730",
    image: "/images/real_earbud_product.webp",
    colors: [
      { name: "Midnight Navy", hex: "#0F1E36" },
      { name: "Steel Blue", hex: "#2C3E50" },
    ],
  },
];

export default function EarbudsPage() {
  const dispatch = useAppDispatch();
  const { products: storeProducts, status } = useAppSelector(
    (state) => state.product
  );

  const [selectedColors, setSelectedColors] = useState<{ [key: number]: number }>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
    try {
      const stored = localStorage.getItem("flazo_wishlist");
      if (stored) setWishlist(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, [dispatch]);

  const toggleWishlist = (id: number, name: string) => {
    let updated: number[] = [];
    if (wishlist.includes(id)) {
      updated = wishlist.filter((item) => item !== id);
      toast.info(`Removed ${name} from Wishlist`);
    } else {
      updated = [...wishlist, id];
      toast.success(`Saved ${name} to Wishlist! ❤️`);
    }
    setWishlist(updated);
    try {
      localStorage.setItem("flazo_wishlist", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Combine backend products with catalog
  const products: EarbudProduct[] = useMemo(() => {
    const rawList: any[] = Array.isArray(storeProducts)
      ? storeProducts
      : (storeProducts as any)?.products || [];

    const earbudsFromDb = rawList.filter((p: any) => {
      const catName = p.Category?.name?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      const tags = Array.isArray(p.tags)
        ? p.tags.join(" ").toLowerCase()
        : (p.tags || "").toLowerCase();
      return (
        catName.includes("earbud") ||
        name.includes("earbud") ||
        name.includes("nirvana") ||
        name.includes("basspod") ||
        name.includes("zenpod") ||
        name.includes("aura") ||
        tags.includes("earbud")
      );
    });

    if (earbudsFromDb.length === 0) {
      return earbudCatalog;
    }

    // Merge backend products with template visuals
    const mappedDbProducts: EarbudProduct[] = earbudsFromDb.map((p: any, idx: number) => {
      const template = earbudCatalog[idx % earbudCatalog.length];
      const origPrice = parseFloat(p.originalPrice) || parseFloat(p.discountPrice) * 1.6;
      const salePrice = parseFloat(p.discountPrice) || template.price;
      const discountPct = Math.round(((origPrice - salePrice) / origPrice) * 100);

      let imgPath = template.image;
      if (p.images && p.images.length > 0) {
        const firstImg = p.images[0];
        if (
          typeof firstImg === "string" &&
          (firstImg.startsWith("http") || firstImg.startsWith("/"))
        ) {
          imgPath = firstImg;
        } else {
          imgPath = getImageUrl(firstImg);
        }
      }

      return {
        id: p.id,
        name: p.name,
        tagline: p.description
          ? p.description.replace(/<[^>]*>?/gm, "").slice(0, 60) + "..."
          : template.tagline,
        badge: p.trending_product ? "🔥 Bestseller" : template.badge,
        badgeType: p.trending_product ? "bestseller" : template.badgeType,
        price: salePrice,
        originalPrice: origPrice,
        discount: `${discountPct > 0 ? discountPct : 50}% Off`,
        rating: p.ratings || template.rating || 4.7,
        reviews: template.reviews || "1.5K",
        image: imgPath,
        colors: template.colors,
      };
    });

    // If DB products are fewer than 8, append templates for a rich grid
    if (mappedDbProducts.length < 8) {
      const remainingTemplates = earbudCatalog.slice(mappedDbProducts.length);
      return [...mappedDbProducts, ...remainingTemplates];
    }

    return mappedDbProducts;
  }, [storeProducts]);

  // Handle sorting
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "price-low") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "discount") {
      return list.sort(
        (a, b) =>
          parseInt(b.discount.replace(/\D/g, "")) -
          parseInt(a.discount.replace(/\D/g, ""))
      );
    }
    return list;
  }, [products, sortBy]);

  const handleAddToCart = (product: EarbudProduct) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.image,
        quantity: 1,
        paymentMethods: "Prepaid, COD Available",
      })
    );
    toast.success(`${product.name} added to cart! 🛒`);
  };

  if (status === "loading" && products.length === 0) {
    return <Loader text="Loading audio catalog..." />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 pb-20">
      
      {/* HEADER SECTION */}
      <section className="bg-white border-b border-neutral-200/70 pt-8 pb-6 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Flazo True Wireless Audio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Wireless Earbuds Collection
            </h1>
          </div>

          {/* Controls Bar: Total Count + Sort + Grid/List */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-wrap">
            <span className="text-sm font-semibold text-neutral-700">
              {sortedProducts.length} Products
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 hidden sm:inline font-medium">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 pl-3 pr-8 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Highest Discount</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-[#FFC220] text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List view"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-[#FFC220] text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8">
        
        {viewMode === "grid" ? (
          /* GRID VIEW - Exactly like Image 1 (4 columns) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const activeColorIndex = selectedColors[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden p-4"
                >
                  <div>
                    {/* Top Row: Badge & Wishlist Heart */}
                    <div className="flex items-center justify-between mb-2">
                      {product.badge ? (
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                            product.badgeType === "bestseller"
                              ? "bg-orange-50 text-orange-600 border border-orange-200/60"
                              : product.badgeType === "new"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : product.badgeType === "trending"
                              ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          {product.badge}
                        </span>
                      ) : (
                        <span />
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id, product.name);
                        }}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className="p-1 rounded-full text-neutral-400 hover:text-red-500 hover:scale-110 active:scale-90 transition-all cursor-pointer"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            isWishlisted ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Centered Product Image */}
                    <Link
                      href={`/products/${slugify(product.name)}/${product.id}`}
                      className="block relative w-full h-44 sm:h-48 my-1 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={240}
                        height={240}
                        className="object-contain max-h-40 w-auto group-hover:scale-108 transition-transform duration-500 drop-shadow-sm select-none"
                      />
                    </Link>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 my-2.5">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color.name}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedColors((prev) => ({
                              ...prev,
                              [product.id]: idx,
                            }));
                          }}
                          title={color.name}
                          style={{ backgroundColor: color.hex }}
                          className={`w-3.5 h-3.5 rounded-full border border-black/15 transition-all cursor-pointer ${
                            activeColorIndex === idx
                              ? "ring-2 ring-neutral-900 scale-110"
                              : "opacity-80 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Product Name */}
                    <Link
                      href={`/products/${slugify(product.name)}/${product.id}`}
                      className="block"
                    >
                      <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Short Tagline / Specs */}
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5 mb-2">
                      {product.tagline}
                    </p>

                    {/* Rating Row: Star 4.8 (2.4K) */}
                    <div className="flex items-center gap-1.5 text-xs mb-3">
                      <Star className="w-3.5 h-3.5 fill-[#FFC220] text-[#FFC220]" />
                      <span className="font-bold text-neutral-900">{product.rating}</span>
                      <span className="text-neutral-400">({product.reviews})</span>
                    </div>

                    {/* Price Row: ₹1,499  ₹2,999  50% Off */}
                    <div className="flex items-baseline gap-2 mb-3.5">
                      <span className="text-lg font-black text-neutral-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded">
                        {product.discount}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Yellow Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#FFC220] hover:bg-[#E5AC1C] active:scale-[0.98] text-neutral-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-2xs hover:shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-4">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const activeColorIndex = selectedColors[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 justify-between"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    {/* Image */}
                    <Link
                      href={`/products/${slugify(product.name)}/${product.id}`}
                      className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-neutral-50 rounded-xl p-2 flex items-center justify-center overflow-hidden"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={140}
                        height={140}
                        className="object-contain max-h-32 w-auto group-hover:scale-108 transition-transform duration-500 drop-shadow-xs"
                      />
                    </Link>

                    {/* Details */}
                    <div className="space-y-1.5 flex-1 text-left">
                      {product.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block ${
                            product.badgeType === "bestseller"
                              ? "bg-orange-50 text-orange-600 border border-orange-200/60"
                              : product.badgeType === "new"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-purple-50 text-purple-700 border border-purple-200/60"
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                      
                      <Link href={`/products/${slugify(product.name)}/${product.id}`}>
                        <h3 className="font-bold text-base sm:text-lg text-neutral-900 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-neutral-500">{product.tagline}</p>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-[#FFC220] text-[#FFC220]" />
                          <span className="font-bold text-neutral-900">{product.rating}</span>
                          <span className="text-neutral-400">({product.reviews})</span>
                        </div>

                        {/* Swatches */}
                        <div className="flex items-center gap-1.5 ml-3">
                          {product.colors.map((color, idx) => (
                            <button
                              key={color.name}
                              onClick={() =>
                                setSelectedColors((prev) => ({
                                  ...prev,
                                  [product.id]: idx,
                                }))
                              }
                              style={{ backgroundColor: color.hex }}
                              className={`w-3 h-3 rounded-full border border-black/15 ${
                                activeColorIndex === idx
                                  ? "ring-2 ring-neutral-900 scale-110"
                                  : "opacity-80"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="text-left sm:text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-neutral-900">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-neutral-400 line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded mt-0.5 inline-block">
                        {product.discount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id, product.name)}
                        className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#FFC220] hover:bg-[#E5AC1C] active:scale-[0.98] text-neutral-950 font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-2xs hover:shadow-sm transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import {
  Sparkles,
  Shield,
  Zap,
  Volume2,
  ShoppingCart,
  Star,
  CheckCircle2,
  Headphones,
  RotateCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";

interface EarbudProduct {
  id: number;
  name: string;
  tagline: string;
  category: "anc" | "bass" | "sports" | "audiophile";
  badge: string;
  badgeColor: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: string;
  image: string;
  specs: {
    driver: string;
    anc: string;
    battery: string;
    latency: string;
    waterproof: string;
  };
  features: string[];
  colors: { name: string; hex: string }[];
}

const earbudCatalog: EarbudProduct[] = [
  {
    id: 1,
    name: "Flazo Nirvana High Definition",
    tagline: "13mm Dynamic Speaker Driver with 100H Total Battery & 8H Single Charge",
    category: "anc",
    badge: "FLAGSHIP MASTERPIECE",
    badgeColor: "bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-black",
    price: 1999,
    originalPrice: 4999,
    discount: "60% OFF",
    rating: 4.9,
    reviews: "48,290",
    image: "/images/real_earbud_product.png?v=2",
    specs: {
      driver: "13mm Dynamic Speaker",
      anc: "High Definition Sound",
      battery: "100H Monster Play",
      latency: "10-15m Range (BT 5.3)",
      waterproof: "IPX5 Splashproof",
    },
    features: [
      "24K Gold-Plated Diaphragm",
      "Auracast™ Audio Sharing",
      "ASAP™ Charge (10m = 10h)",
      "Quad-Mic AI Clear Calls",
    ],
    colors: [
      { name: "Champagne Gold", hex: "#E8C872" },
      { name: "Obsidian Black", hex: "#1F1F1F" },
      { name: "Pearl Titanium", hex: "#F3F3F3" },
    ],
  },
  {
    id: 302,
    name: "Flazo BassPod Extreme",
    tagline: "13.4mm Titanium Club Bass with Dedicated Sub-Bass Chamber",
    category: "bass",
    badge: "BASS HEAD CHOICE",
    badgeColor: "bg-neutral-900 text-amber-400 border border-amber-400/40",
    price: 1899,
    originalPrice: 4999,
    discount: "62% OFF",
    rating: 4.9,
    reviews: "32,450",
    image: "/images/lineup-showcase.jpg",
    specs: {
      driver: "13.4mm Titanium Club",
      anc: "35dB Active Noise Cut",
      battery: "60H Battery Life",
      latency: "30ms HyperSync",
      waterproof: "IPX6 Water Resistant",
    },
    features: [
      "BoomBass™ Acoustic Waveguide",
      "Dual Device Multipoint Pair",
      "Touch Volume & Track Control",
      "Signature Gold Accent Rings",
    ],
    colors: [
      { name: "Midnight Gold", hex: "#1A1917" },
      { name: "Desert Dune", hex: "#D6C7A1" },
    ],
  },
  {
    id: 303,
    name: "Flazo Aerobeat Ultralight",
    tagline: "3.6g Featherweight Ergonomic Buds with IPX7 Complete Sweatproof",
    category: "sports",
    badge: "WORKOUT CHAMPION",
    badgeColor: "bg-emerald-600 text-white font-black",
    price: 1499,
    originalPrice: 3999,
    discount: "62% OFF",
    rating: 4.8,
    reviews: "21,180",
    image: "/images/hero-earbuds.jpg",
    specs: {
      driver: "11mm Graphene High-Excursion",
      anc: "Passive Ergonomic Seal",
      battery: "50H Playtime",
      latency: "45ms Low-Lag",
      waterproof: "IPX7 Submersion Proof",
    },
    features: [
      "Never-Fall Ear Wing Stabilizers",
      "SweatGuard™ Hydrophobic Coating",
      "Smart Touch Sensor Controls",
      "Pocket-Sized Pebble Case",
    ],
    colors: [
      { name: "Alpine White & Gold", hex: "#FFFFFF" },
      { name: "Stealth Slate", hex: "#3A3D40" },
    ],
  },
  {
    id: 304,
    name: "Flazo Acoustic Labs Pro",
    tagline: "Audiophile Grade 24K Gold Diaphragm Architecture with LDAC™",
    category: "audiophile",
    badge: "AUDIOPHILE REFERENCE",
    badgeColor: "bg-purple-900 text-amber-300 border border-purple-400",
    price: 2999,
    originalPrice: 7999,
    discount: "62% OFF",
    rating: 5.0,
    reviews: "12,940",
    image: "/images/driver-tech.jpg",
    specs: {
      driver: "Dual-Driver Dynamic + BA",
      anc: "52dB Smart Adaptive ANC",
      battery: "65H High-Res Play",
      latency: "40ms Hi-Res Mode",
      waterproof: "IPX5 Splashproof",
    },
    features: [
      "Hi-Res Audio Wireless Certified",
      "LDAC™ 990kbps 24-bit/96kHz",
      "Personalized Hearing Test App",
      "Real Polished Brass Chamber",
    ],
    colors: [
      { name: "Royal Gold & Walnut", hex: "#4A3525" },
      { name: "Frosted Ceramic Gold", hex: "#EAE6DF" },
    ],
  },
];

export default function EarbudsPage() {
  const dispatch = useAppDispatch();
  const { products: storeProducts, status } = useAppSelector(
    (state) => state.product
  );

  const [selectedColors, setSelectedColors] = useState<{ [key: number]: number }>({
    301: 0,
    302: 0,
    303: 0,
    304: 0,
  });

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  // Combine backend products with rich catalog templates
  const dynamicProducts: EarbudProduct[] = useMemo(() => {
    const rawList: any[] = Array.isArray(storeProducts)
      ? storeProducts
      : (storeProducts as any)?.products || [];

    // Filter products related to Earbuds
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
        name.includes("aerobeat") ||
        tags.includes("earbud")
      );
    });

    if (earbudsFromDb.length === 0) {
      return earbudCatalog;
    }

    return earbudsFromDb.map((p: any, idx: number) => {
      const template = earbudCatalog[idx % earbudCatalog.length];

      const origPrice =
        parseFloat(p.originalPrice) || parseFloat(p.discountPrice) * 1.5;
      const salePrice = parseFloat(p.discountPrice) || template.price;
      const discountPct = Math.round(
        ((origPrice - salePrice) / origPrice) * 100
      );

      // Parse tags
      let parsedTags: string[] = [];
      if (Array.isArray(p.tags)) parsedTags = p.tags;
      else if (typeof p.tags === "string") {
        try {
          parsedTags = JSON.parse(p.tags);
        } catch {
          parsedTags = p.tags.split(",").map((t: string) => t.trim());
        }
      }

      // Determine category
      let category: "anc" | "bass" | "sports" | "audiophile" = "anc";
      const tagsStr =
        parsedTags.join(" ").toLowerCase() + " " + p.name.toLowerCase();
      if (tagsStr.includes("bass")) category = "bass";
      else if (
        tagsStr.includes("sport") ||
        tagsStr.includes("sweat") ||
        tagsStr.includes("ipx7")
      )
        category = "sports";
      else if (
        tagsStr.includes("audio") ||
        tagsStr.includes("ldac") ||
        tagsStr.includes("hi-res")
      )
        category = "audiophile";

      // Image
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
          ? p.description.replace(/<[^>]*>?/gm, "").slice(0, 110) + "..."
          : template.tagline,
        category: category,
        badge: p.trending_product ? "🔥 BESTSELLER" : template.badge,
        badgeColor: p.trending_product
          ? "bg-neutral-900 text-amber-400 border border-amber-400/40"
          : template.badgeColor,
        price: salePrice,
        originalPrice: origPrice,
        discount: `${discountPct > 0 ? discountPct : 60}% OFF`,
        rating: p.ratings || template.rating || 4.9,
        reviews: template.reviews || "24,800+",
        image: imgPath,
        specs: template.specs,
        features:
          parsedTags.length >= 3 ? parsedTags.slice(0, 4) : template.features,
        colors: template.colors,
      };
    });
  }, [storeProducts]);

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
    toast.success(`${product.name} added to your bag!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900">
      
      {/* 1. LUXURY PAGE HERO */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 border-b border-amber-100/80 overflow-hidden bg-gradient-to-b from-white via-[#FCF8EE] to-[#FAF8F5]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCF5E6] border border-[#F1D8A2] text-[#A66E18] text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C8942E]" />
            <span>FLAZO OFFICIAL EARBUDS CATALOG 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#1A1815] leading-tight">
            Hear Beyond <span className="bg-gradient-to-r from-[#9E7324] via-[#D4AF37] to-[#B38328] bg-clip-text text-transparent italic">Ordinary.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5C564E] max-w-2xl mx-auto leading-relaxed">
            Every pair of Flazo wireless earbuds is custom-tuned with titanium drivers, 50dB Hybrid ANC, and 24K gold acoustic trim for an unmatched acoustic journey.
          </p>
        </div>
      </section>

      {/* 2. CATALOG GRID */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {dynamicProducts.map((earbud) => (
            <div
              key={earbud.id}
              className="group rounded-3xl bg-white border border-[#E8DCC4] hover:border-[#D4AF37] shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Product Card Top Banner */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${earbud.badgeColor}`}>
                    {earbud.badge}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1815] bg-[#FDF9F0] px-3 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{earbud.rating}</span>
                    <span className="text-neutral-400 font-normal">({earbud.reviews})</span>
                  </div>
                </div>

                {/* Earbud Image & Color Preview */}
                <div className="relative w-full aspect-16/10 rounded-2xl bg-gradient-to-b from-[#FCFBF8] to-[#F5EFE0] border border-[#EFE5D0] flex items-center justify-center p-6 overflow-hidden">
                  <Link
                    href={`/products/${slugify(earbud.name)}/${earbud.id}`}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <Image
                      src={earbud.image}
                      alt={earbud.name}
                      width={320}
                      height={320}
                      className="object-contain max-h-[220px] w-auto group-hover:scale-108 transition-transform duration-700 drop-shadow-lg"
                    />
                  </Link>
                  
                  {/* Floating Color Swatches */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-amber-200 shadow-2xs z-10">
                    <span className="text-[10px] font-bold text-neutral-500 mr-1">Shades:</span>
                    {earbud.colors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedColors((prev) => ({ ...prev, [earbud.id]: idx }));
                        }}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-4 h-4 rounded-full border border-black/20 transition-transform ${
                          selectedColors[earbud.id] === idx
                            ? "ring-2 ring-amber-500 scale-125"
                            : "opacity-75 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Earbud Title & Tagline */}
                <div className="space-y-1.5 text-left">
                  <Link href={`/products/${slugify(earbud.name)}/${earbud.id}`} className="block group/link">
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1815] group-hover/link:text-amber-700 transition-colors">
                      {earbud.name}
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-sm text-[#665E50] leading-relaxed">
                    {earbud.tagline}
                  </p>
                </div>

                {/* Core Specs Micro Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-left">
                  <div className="bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EDE0C8]">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700">
                      <Volume2 className="w-3.5 h-3.5 text-[#C6922A]" />
                      <span className="truncate">{earbud.specs.driver}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Drivers</div>
                  </div>

                  <div className="bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EDE0C8]">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700">
                      <Shield className="w-3.5 h-3.5 text-[#C6922A]" />
                      <span className="truncate">{earbud.specs.anc}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Acoustic Shield</div>
                  </div>

                  <div className="bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EDE0C8]">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700">
                      <Zap className="w-3.5 h-3.5 text-[#C6922A]" />
                      <span className="truncate">{earbud.specs.battery}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Battery Reserve</div>
                  </div>
                </div>

                {/* Feature Bullet Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-left">
                  {earbud.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-1.5 text-xs text-[#4F473A]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Price & Checkout Footer */}
              <div className="p-6 sm:p-8 pt-4 bg-[#FBF9F4] border-t border-[#EFE3C8] flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#1A1815]">
                      ₹{earbud.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{earbud.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {earbud.discount}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Includes taxes & Free 48-Hour Doorstep Delivery
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(earbud)}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#996515] via-[#B8860B] to-[#D4AF37] text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-800/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 3. ASSURANCE STRIP */}
      <section className="bg-white border-t border-amber-100 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <Shield className="w-6 h-6 text-[#C6922A] mx-auto mb-2" />
            <div className="font-bold text-sm text-neutral-900">1-Year Flazo Swap</div>
            <div className="text-xs text-neutral-500">Doorstep replacement guarantee</div>
          </div>
          <div className="space-y-1">
            <Zap className="w-6 h-6 text-[#C6922A] mx-auto mb-2" />
            <div className="font-bold text-sm text-neutral-900">Express Delivery</div>
            <div className="text-xs text-neutral-500">Free 48h dispatch across India</div>
          </div>
          <div className="space-y-1">
            <Sparkles className="w-6 h-6 text-[#C6922A] mx-auto mb-2" />
            <div className="font-bold text-sm text-neutral-900">24K Acoustic Gold</div>
            <div className="text-xs text-neutral-500">Certified acoustic diaphragm</div>
          </div>
          <div className="space-y-1">
            <Headphones className="w-6 h-6 text-[#C6922A] mx-auto mb-2" />
            <div className="font-bold text-sm text-neutral-900">Acoustic Concierge</div>
            <div className="text-xs text-neutral-500">Audiophile audio support desk</div>
          </div>
        </div>
      </section>

    </div>
  );
}

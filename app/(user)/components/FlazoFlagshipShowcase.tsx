"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Zap,
  Volume2,
  Gamepad2,
  ShoppingCart,
  Check,
  Star,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { toast } from "sonner";

interface EarbudModel {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewsCount: string;
  image: string;
  specs: {
    battery: string;
    driver: string;
    anc: string;
    latency: string;
    waterproof: string;
  };
  features: string[];
  colors: { name: string; hex: string }[];
}

const flagshipModels: EarbudModel[] = [
  {
    id: "flazo-nirvana-pro",
    name: "Flazo Nirvana Gold Pro",
    badge: "FLAGSHIP BESTSELLER",
    tagline: "50dB Hybrid ANC with Qi Wireless Charging and 24K Gold Trim Accents",
    price: 2499,
    originalPrice: 6999,
    discount: "64% OFF",
    rating: 4.9,
    reviewsCount: "48,290",
    image: "/images/hero-earbuds.jpg",
    specs: {
      battery: "70 Hours Total",
      driver: "13mm Titanium Bass",
      anc: "50dB Hybrid ANC",
      latency: "35ms Beast™ Mode",
      waterproof: "IPX7 Sweat & Water",
    },
    features: [
      "Custom Tuned 13mm BoomBass™ Drivers",
      "Quad-Mic AI Environmental Noise Cancellation",
      "ASAP™ Charge (10 mins = 120 mins playback)",
      "Dual Device Instant Pairing (BT 5.3)",
    ],
    colors: [
      { name: "Pearl White & Royal Gold", hex: "#F5DE98" },
      { name: "Champagne Mist", hex: "#E5C158" },
      { name: "Onyx Midnight Gold", hex: "#B8860B" },
    ],
  },
  {
    id: "flazo-basspod-extreme",
    name: "Flazo BassPod Extreme",
    badge: "DEEP BASS BEAST",
    tagline: "Massive 13.4mm Titanium Diaphragm Tuned for Bass Lovers",
    price: 1899,
    originalPrice: 4999,
    discount: "62% OFF",
    rating: 4.8,
    reviewsCount: "34,120",
    image: "/images/lineup-showcase.jpg",
    specs: {
      battery: "65 Hours Total",
      driver: "13.4mm BassBoom™",
      anc: "ENC Voice Calling",
      latency: "38ms Ultra Sync",
      waterproof: "IPX5 Splashproof",
    },
    features: [
      "Ultra-Thumping Club Bass Profile",
      "Dynamic Golden Touch Control Stem",
      "Gaming Low-Latency Beast™ Mode",
      "Fast Type-C Hyper Charging",
    ],
    colors: [
      { name: "Pure White & Gold", hex: "#F8F6F0" },
      { name: "Brushed Champagne", hex: "#DFB75A" },
    ],
  },
  {
    id: "flazo-aerobeat-ultralight",
    name: "Flazo Aerobeat Ultralight",
    badge: "FEATHERWEIGHT SPORT",
    tagline: "3.6g Ultra-Comfort Ergonomic In-Ear Fit with IPX7 Gym Protection",
    price: 1499,
    originalPrice: 3999,
    discount: "62% OFF",
    rating: 4.8,
    reviewsCount: "22,400",
    image: "/images/hero-earbuds.jpg",
    specs: {
      battery: "50 Hours Total",
      driver: "11mm Dynamic",
      anc: "Passive Noise Seal",
      latency: "45ms Low Lag",
      waterproof: "IPX7 Complete Gym Seal",
    },
    features: [
      "Ergonomic 45° Angle Snug Ear Grip",
      "Sweat, Rain & Dust Resistant Shield",
      "High-Fidelity AAC & SBC Codec Support",
      "One-Touch Voice Assistant Siri/Google",
    ],
    colors: [
      { name: "Pearl White", hex: "#FFFFFF" },
      { name: "Golden Aura", hex: "#D4AF37" },
    ],
  },
];

export default function FlazoFlagshipShowcase() {
  const [selectedModel, setSelectedModel] = useState<EarbudModel>(flagshipModels[0]);
  const [selectedColor, setSelectedColor] = useState<string>(flagshipModels[0].colors[0].name);
  const dispatch = useAppDispatch();

  const handleAddToCart = (model: EarbudModel) => {
    dispatch(
      addToCart({
        id: model.id === "flazo-nirvana-pro" ? 101 : model.id === "flazo-basspod-extreme" ? 102 : 103,
        name: `${model.name} (${selectedColor})`,
        price: model.price,
        imageUrl: model.image,
        quantity: 1,
        paymentMethods: "Prepaid, COD",
      })
    );
  };


  return (
    <section id="flagship-series" className="py-16 md:py-24 bg-gradient-to-b from-white via-amber-50/20 to-white border-b border-amber-100/80">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">

        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-200/60 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Flazo Signature Earbuds Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight">
              MEET THE <span className="gold-gradient-text">FLAGSHIPS</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base max-w-xl">
              No bloated clutter. Three precision-engineered earbuds tailored for audiophiles, bass heads, and athletes.
            </p>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-amber-100/50 rounded-2xl border border-amber-200/60">
            {flagshipModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  setSelectedColor(model.colors[0].name);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedModel.id === model.id
                    ? "bg-white text-neutral-950 shadow-sm border border-amber-300"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                }`}
              >
                {model.name.replace("Flazo ", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Flagship Showcase Panel */}
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Visual Showcase with Floating Physics */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              <div className="relative w-full aspect-4/3 rounded-2xl bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 p-6 flex items-center justify-center border border-amber-100 shadow-inner overflow-hidden">
                {/* Sonic ripple behind featured earbuds */}
                <div className="absolute inset-10 rounded-full border border-amber-300/40 animate-sonic-ripple-1 pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl bg-radial from-amber-400/15 via-transparent to-transparent animate-pulse-glow pointer-events-none" />

                <div className="animate-float-slow w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    width={640}
                    height={480}
                    className="object-contain max-h-[340px] w-auto drop-shadow-2xl transform hover:scale-108 transition-transform duration-700"
                  />
                </div>

                <div className="absolute top-4 left-4 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs tracking-wider animate-pulse">
                  {selectedModel.badge}
                </div>
              </div>

              {/* Color Shade Selector with smooth scale & active ring */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-600">Color:</span>
                <div className="flex items-center gap-2">
                  {selectedModel.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-xs scale-105"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:scale-102"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-amber-400"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Model Specs, Audio Perks & Purchase */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Title & Rating */}
              <div>
                <div className="flex items-center gap-2 mb-1 text-amber-600">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-800">{selectedModel.rating}</span>
                  <span className="text-xs text-neutral-400">({selectedModel.reviewsCount} reviews)</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-950">
                  {selectedModel.name}
                </h3>
                <p className="text-neutral-600 text-sm mt-1">
                  {selectedModel.tagline}
                </p>
              </div>

              {/* Pricing Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-neutral-950">₹{selectedModel.price.toLocaleString("en-IN")}</span>
                    <span className="text-sm text-neutral-400 line-through font-semibold">₹{selectedModel.originalPrice.toLocaleString("en-IN")}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-extrabold animate-pulse">{selectedModel.discount}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">Inclusive of all taxes & free express shipping</span>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-lg">
                    <Flame className="w-3 h-3 text-amber-600 fill-amber-500 animate-pulse" />
                    <span>In High Demand</span>
                  </div>
                </div>
              </div>

              {/* 4 Key Spec Metrics (Interactive Hover Lift) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-center hover:-translate-y-1 hover:border-amber-400 hover:shadow-xs transition-all duration-300 cursor-default group">
                  <Zap className="w-4 h-4 text-amber-600 mx-auto mb-1 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  <div className="text-xs font-black text-neutral-900">{selectedModel.specs.battery}</div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Battery</div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-center hover:-translate-y-1 hover:border-amber-400 hover:shadow-xs transition-all duration-300 cursor-default group">
                  <Volume2 className="w-4 h-4 text-amber-600 mx-auto mb-1 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  <div className="text-xs font-black text-neutral-900">{selectedModel.specs.driver}</div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Acoustics</div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-center hover:-translate-y-1 hover:border-amber-400 hover:shadow-xs transition-all duration-300 cursor-default group">
                  <Shield className="w-4 h-4 text-amber-600 mx-auto mb-1 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  <div className="text-xs font-black text-neutral-900">{selectedModel.specs.anc}</div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Noise Cut</div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-center hover:-translate-y-1 hover:border-amber-400 hover:shadow-xs transition-all duration-300 cursor-default group">
                  <Gamepad2 className="w-4 h-4 text-amber-600 mx-auto mb-1 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  <div className="text-xs font-black text-neutral-900">{selectedModel.specs.latency}</div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Gaming</div>
                </div>
              </div>

              {/* Audio Features List */}
              <div className="space-y-2 pt-1">
                {selectedModel.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons with Shimmer & Lift */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAddToCart(selectedModel)}
                  className="btn-shimmer flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-black text-sm tracking-wide text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-500 hover:to-yellow-400 shadow-md shadow-amber-500/20 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD TO CART • ₹{selectedModel.price.toLocaleString("en-IN")}</span>
                </button>

                <Link
                  href="/cart"
                  onClick={() => handleAddToCart(selectedModel)}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full font-bold text-sm text-neutral-900 bg-amber-50 border border-amber-300 hover:bg-amber-100/70 hover:shadow-sm transition-all text-center hover:-translate-y-0.5"
                >
                  <span>Buy Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

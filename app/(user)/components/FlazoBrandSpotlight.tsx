"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  Truck,
  Check,
  Star,
  Flame,
  ShoppingCart,
  Radio,
  Gamepad2,
  Clock,
  RotateCcw,
  Shield,
  Layers,
} from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { toast } from "sonner";

type AudioMode = "anc" | "spatial" | "beast";
type ColorShade = "gold" | "black" | "white";

export default function FlazoBrandSpotlight() {
  const dispatch = useAppDispatch();
  const [selectedMode, setSelectedMode] = useState<AudioMode>("anc");
  const [selectedShade, setSelectedShade] = useState<ColorShade>("gold");
  const [isAdding, setIsAdding] = useState(false);

  const modeData = {
    anc: {
      label: "50dB Hybrid ANC",
      tag: "Active Noise Isolation",
      icon: ShieldCheck,
      desc: "Dual inverse mics cancel 99.8% background noise up to 4,000Hz frequency.",
      spec: "48,000 Samples/sec Processing",
    },
    spatial: {
      label: "360° Spatial Audio",
      tag: "Dolby Atmos™ Stage",
      icon: Radio,
      desc: "Proprietary acoustic chamber delivers theater-grade 3D soundstage with head-tracking.",
      spec: "7.1.4 Virtual Sound Field",
    },
    beast: {
      label: "35ms Beast™ Mode",
      tag: "Ultra-Low Latency",
      icon: Gamepad2,
      desc: "Instant audio-visual synchronization eliminates perceptible lag for competitive gaming.",
      spec: "Sub-35ms Bluetooth 5.4 Sync",
    },
  };

  const shadeData = {
    gold: {
      name: "Champagne Gold & Ivory",
      hex: "#E8C872",
      bgStyle: "from-amber-200 to-yellow-400",
    },
    black: {
      name: "Obsidian Stealth & Gold",
      hex: "#1F1F1F",
      bgStyle: "from-neutral-800 to-neutral-950",
    },
    white: {
      name: "Pearl Titanium & Gold",
      hex: "#FFFFFF",
      bgStyle: "from-neutral-100 to-neutral-300",
    },
  };

  const subSpotlights = [
    {
      id: 201,
      badge: "Best Seller",
      badgeColor: "bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950",
      series: "Flazo BassPod Extreme",
      title: "13.4mm Titanium Club Bass & 35ms Beast™ Gaming",
      price: 1899,
      originalPrice: 4999,
      discount: "62% OFF",
      rating: 4.9,
      reviews: "14.8K",
      image: "/images/lineup-showcase.jpg",
      link: "#flagship-series",
    },
    {
      id: 202,
      badge: "Gym Ready",
      badgeColor: "bg-emerald-500 text-white",
      series: "Flazo Aerobeat Ultralight",
      title: "3.6g Featherweight Fit with IPX7 Complete Sweatproof",
      price: 1499,
      originalPrice: 3999,
      discount: "62% OFF",
      rating: 4.8,
      reviews: "11.2K",
      image: "/images/hero-earbuds.jpg",
      link: "#flagship-series",
    },
    {
      id: 203,
      badge: "Acoustic Lab Edition",
      badgeColor: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
      series: "Flazo Acoustic Labs Pro",
      title: "Exploded 24K Gold Titanium Dual-Diaphragm Architecture",
      price: 2499,
      originalPrice: 6999,
      discount: "64% OFF",
      rating: 5.0,
      reviews: "8.6K",
      image: "/images/driver-tech.jpg",
      link: "#acoustic-tech",
    },
  ];

  const handleSpotlightAddToCart = () => {
    setIsAdding(true);
    dispatch(
      addToCart({
        id: 200,
        name: `Flazo Nirvana Gold Pro X (${shadeData[selectedShade].name})`,
        price: 2499,
        imageUrl: "/images/spotlight-earbud.jpg",
        quantity: 1,
        paymentMethods: "Prepaid, COD Available",
      })
    );
    toast.success("Flazo Nirvana Gold Pro X added to your cart!");
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleSubCardAddToCart = (card: (typeof subSpotlights)[0]) => {
    dispatch(
      addToCart({
        id: card.id,
        name: card.series,
        price: card.price,
        imageUrl: card.image,
        quantity: 1,
        paymentMethods: "Prepaid, COD Available",
      })
    );
    toast.success(`${card.series} added to your cart!`);
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-amber-50/30 to-white border-b border-amber-100/80">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        
        {/* Main Section Header with Luxury Badges & Trust Points */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 font-extrabold text-[11px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Official Flazo Flagship Store • Limited Launch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">
              Flazo India – Signature Sound with Express Doorstep Delivery
            </h2>
            <p className="text-sm text-neutral-600 max-w-2xl">
              Experience the pinnacle of Indian acoustic engineering. Built with 24K gold-plated acoustic diaphragm and military-grade dual-coaxial isolation.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-700 bg-white px-4 py-2 rounded-2xl border border-amber-200/80 shadow-2xs self-start md:self-end">
            <div className="flex items-center gap-1 text-amber-500 font-black">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9 / 5</span>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1.5 text-neutral-800">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Fast Express Dispatch</span>
            </div>
          </div>
        </div>

        {/* Big Spotlight Masterpiece Card (Ultra-Luxury Obsidian & Champagne Gold Theme) */}
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#0c0c0e] via-[#141310] to-[#080809] border border-amber-500/30 shadow-2xl hover:border-amber-400/60 transition-all duration-500 overflow-hidden group">
          
          {/* Ambient Warm Golden Radial Glow Behind Product */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top-Left Corner Launch Offer Badge */}
          <div className="absolute top-0 left-0 z-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-br-3xl shadow-lg tracking-wide">
              <Flame className="w-4 h-4 text-neutral-950 fill-neutral-950 animate-bounce" />
              <span>FLAGSHIP LAUNCH • 64% OFF</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-14 pt-14 sm:pt-16">
            
            {/* Left Column: Interactive Product Story & Controls */}
            <div className="lg:col-span-6 space-y-6 text-left z-10">
              
              {/* Product Subtitle & Title */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>The 2026 Gold Standard</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15]">
                  Flazo Nirvana Gold Pro X
                </h3>
                <p className="text-base sm:text-lg font-bold text-neutral-300">
                  World&apos;s First Dual-Coaxial Earbuds with 50dB Hybrid ANC & Auracast™
                </p>
              </div>

              {/* Interactive Audio Mode Switcher (ANC / Spatial / Beast) */}
              <div className="space-y-3 bg-neutral-900/80 backdrop-blur-md p-4 rounded-2xl border border-amber-500/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider">
                    Interactive Acoustic Simulation:
                  </span>
                  
                  {/* Dynamic Equalizer Visualizer */}
                  <div className="flex items-end gap-1 h-5 px-2">
                    <span className="w-1 bg-amber-400 rounded-full animate-eq-1" />
                    <span className="w-1 bg-amber-300 rounded-full animate-eq-2" />
                    <span className="w-1 bg-yellow-400 rounded-full animate-eq-3" />
                    <span className="w-1 bg-amber-500 rounded-full animate-eq-4" />
                    <span className="w-1 bg-amber-300 rounded-full animate-eq-5" />
                  </div>
                </div>

                {/* Mode Selector Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {(["anc", "spatial", "beast"] as AudioMode[]).map((mode) => {
                    const info = modeData[mode];
                    const Icon = info.icon;
                    const isActive = selectedMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setSelectedMode(mode)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-b from-amber-400/20 to-amber-500/10 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10 scale-102"
                            : "bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-white hover:border-neutral-500"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                        <span className="truncate">{info.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Mode Explanatory Strip */}
                <div className="flex items-start gap-2 pt-1 text-xs text-neutral-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-300">{modeData[selectedMode].tag}: </span>
                    <span>{modeData[selectedMode].desc}</span>
                  </div>
                </div>
              </div>

              {/* Hardware Specs Micro Badges */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-neutral-200">
                <div className="flex items-center gap-1.5 bg-neutral-900/90 px-3 py-2 rounded-xl border border-neutral-800">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">13mm Dual-Coaxial</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-900/90 px-3 py-2 rounded-xl border border-neutral-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Qualcomm® S3</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-900/90 px-3 py-2 rounded-xl border border-neutral-800">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">70H Monster Play</span>
                </div>
              </div>

              {/* Color Shade Selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-neutral-400">Finish:</span>
                <div className="flex items-center gap-2">
                  {(["gold", "black", "white"] as ColorShade[]).map((shade) => {
                    const isSelected = selectedShade === shade;
                    return (
                      <button
                        key={shade}
                        onClick={() => setSelectedShade(shade)}
                        aria-label={shadeData[shade].name}
                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-400/15 border-amber-400 text-amber-300 ring-2 ring-amber-400/30"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border border-black/40 bg-gradient-to-tr ${shadeData[shade].bgStyle}`}
                        />
                        <span className="text-[11px]">{shadeData[shade].name.split("&")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Limited Stock Urgency Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Special Launch Batch: 88% Claimed
                  </span>
                  <span className="text-neutral-400 font-bold">Only 18 units left at ₹2,499</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 w-[88%] rounded-full animate-pulse" />
                </div>
              </div>

              {/* Pricing & High-Conversion CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    ₹2,499
                  </span>
                  <span className="text-base text-neutral-500 line-through font-bold">
                    ₹6,999
                  </span>
                  <span className="text-xs font-black text-amber-950 bg-gradient-to-r from-amber-400 to-yellow-300 px-2.5 py-1 rounded-md shadow-xs">
                    SAVE 64%
                  </span>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSpotlightAddToCart}
                    disabled={isAdding}
                    className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs sm:text-sm tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isAdding ? "ADDING..." : "ADD TO BAG"}</span>
                  </button>

                  <a
                    href="#acoustic-tech"
                    className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-bold text-xs sm:text-sm transition-all"
                  >
                    <span>3D TECH</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </a>
                </div>

              </div>

              {/* Bottom Assurance Micro-Strip */}
              <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-neutral-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  Free Express Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  1-Year Doorstep Swap Warranty
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  Cash on Delivery Available
                </span>
              </div>

            </div>

            {/* Right Side: Floating High-End Earbud Visual Stage with Sonic Ripples & Floating Spec Badges */}
            <div className="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] flex items-center justify-center">
                
                {/* Sonic Acoustic Concentric Ripple Rings */}
                <div className="absolute inset-4 sm:inset-6 rounded-full border-2 border-amber-400/40 animate-sonic-ripple-1 pointer-events-none" />
                <div className="absolute inset-4 sm:inset-6 rounded-full border-2 border-amber-400/40 animate-sonic-ripple-2 pointer-events-none" />
                <div className="absolute inset-4 sm:inset-6 rounded-full border-2 border-amber-400/40 animate-sonic-ripple-3 pointer-events-none" />

                {/* Rotating Soft Conic Amber Backdrop */}
                <div className="absolute inset-6 sm:inset-10 rounded-full bg-gradient-to-tr from-amber-500/20 via-neutral-900 to-amber-400/10 shadow-inner border border-amber-400/20 animate-spin-slow pointer-events-none" />

                {/* Floating High-Res Masterpiece Earbud Image */}
                <div className="relative z-10 w-full h-full p-4 sm:p-6 flex items-center justify-center animate-float-slow">
                  <Image
                    src="/images/spotlight-earbud.jpg"
                    alt="Flazo Nirvana Gold Pro X Single Floating Spotlight"
                    width={480}
                    height={480}
                    priority
                    className="object-contain max-h-[300px] sm:max-h-[380px] w-auto drop-shadow-[0_20px_40px_rgba(212,175,55,0.35)] transform hover:scale-108 transition-transform duration-700 rounded-3xl"
                  />
                </div>

                {/* Floating Frosted Glass Spec Badges Orbiting the Product (Desktop) */}
                <div className="hidden sm:flex absolute -top-2 right-4 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-amber-400/40 text-white text-xs font-bold shadow-xl animate-float-fast">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>13mm Coaxial Diaphragm</span>
                </div>

                <div className="hidden sm:flex absolute top-1/2 -left-4 -translate-y-1/2 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-amber-400/40 text-white text-xs font-bold shadow-xl animate-float-slow">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>50dB Dual-Mic ANC</span>
                </div>

                <div className="hidden sm:flex absolute -bottom-2 right-6 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-amber-400/40 text-white text-xs font-bold shadow-xl animate-float-fast">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>ASAP™ 10m = 10h Charge</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 3 Companion Spotlight Category Tiles (Redesigned with Luxury Finish & Quick Add) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {subSpotlights.map((card) => (
            <div
              key={card.id}
              className="card-lift relative rounded-2xl bg-white border border-neutral-200/90 hover:border-amber-400 p-5 pt-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              {/* Corner Badge */}
              <div className="absolute top-0 left-0">
                <span className={`inline-block font-black text-[10px] px-3.5 py-1.5 rounded-br-xl rounded-tl-2xl shadow-2xs tracking-wider uppercase ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              {/* Top Rating Pill */}
              <div className="absolute top-3 right-4 flex items-center gap-1 text-[11px] font-black text-neutral-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{card.rating}</span>
                <span className="text-neutral-400 font-normal">({card.reviews})</span>
              </div>

              {/* Card Image with Hover Zoom */}
              <div className="relative w-full aspect-4/3 rounded-xl bg-gradient-to-b from-neutral-50 to-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-100 mb-4 group-hover:border-amber-200 transition-colors">
                <Image
                  src={card.image}
                  alt={card.series}
                  width={340}
                  height={240}
                  className="object-contain max-h-[160px] w-auto drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="space-y-3 text-left">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  {card.series}
                </span>
                <h4 className="text-base font-black text-neutral-950 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {card.title}
                </h4>

                {/* Price and Instant Add to Bag */}
                <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-neutral-950">₹{card.price}</span>
                      <span className="text-xs text-neutral-400 line-through">₹{card.originalPrice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      {card.discount}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSubCardAddToCart(card)}
                    className="btn-shimmer inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-neutral-950 font-black text-xs transition-all shadow-sm hover:scale-105 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>QUICK ADD</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Volume2, Truck } from "lucide-react";

export default function FlazoBrandSpotlight() {
  const subSpotlights = [
    {
      id: "flazo-basspod",
      badge: "Best Seller",
      badgeColor: "bg-amber-400 text-neutral-950",
      series: "Flazo BassPod Extreme",
      title: "13.4mm Titanium Club Bass & 35ms Beast™ Mode",
      price: "₹1,899",
      originalPrice: "₹4,999",
      image: "/images/lineup-showcase.jpg",
      link: "#flagship-series",
    },
    {
      id: "flazo-aerobeat",
      badge: "Hot Deal",
      badgeColor: "bg-amber-400 text-neutral-950",
      series: "Flazo Aerobeat Ultralight",
      title: "3.6g Featherweight Fit with IPX7 Gym Protection",
      price: "₹1,499",
      originalPrice: "₹3,999",
      image: "/images/hero-earbuds.jpg",
      link: "#flagship-series",
    },
    {
      id: "flazo-acoustic-lab",
      badge: "Studio Edition",
      badgeColor: "bg-neutral-900 text-amber-300",
      series: "Flazo Acoustic Labs Pro",
      title: "Exploded 24K Gold-Plated Titanium Architecture",
      price: "₹2,499",
      originalPrice: "₹6,999",
      image: "/images/driver-tech.jpg",
      link: "#acoustic-tech",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-amber-100/80">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">

        
        {/* Main Section Header (EarFun Europe Style) */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-widest">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Official Flazo Flagship Store</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">
            Flazo India – Premium Audio with Fast Express Delivery
          </h2>
        </div>

        {/* Big Spotlight Banner Card (Exact EarFun Architecture) */}
        <div className="relative rounded-3xl sm:rounded-[32px] bg-gradient-to-r from-slate-100 via-stone-50 to-amber-50/60 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          
          {/* Top-Left Corner Brand-New Badge (Exact EarFun Style) */}
          <div className="absolute top-0 left-0 z-20">
            <span className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2 rounded-br-2xl shadow-sm tracking-wide">
              Brand-New
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-14 pt-12 sm:pt-14">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-5 text-left z-10">
              
              {/* Product Subtitle */}
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-extrabold text-neutral-500 tracking-wider uppercase">
                  Flazo Nirvana Gold Pro X
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight leading-[1.2]">
                  World&apos;s First Dual-Coaxial Earbuds with 50dB Hybrid ANC and Auracast™
                </h3>
              </div>

              {/* Quick Specs Highlight Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-700 pt-1">
                <span className="flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-sm transition-all cursor-default">
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  13mm Titanium Diaphragm
                </span>
                <span className="flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-sm transition-all cursor-default">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Qualcomm® Active Noise Cut
                </span>
                <span className="flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-sm transition-all cursor-default">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  70H Battery Playback
                </span>
              </div>

              {/* Price & View More Button */}
              <div className="pt-3 flex flex-wrap items-center gap-5">
                <a
                  href="#flagship-series"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-300 text-neutral-950 font-black text-xs sm:text-sm tracking-wider shadow-md hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-1 cursor-pointer"
                >
                  <span>VIEW MORE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-neutral-950">₹2,499</span>
                  <span className="text-sm text-neutral-400 line-through font-bold">₹6,999</span>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md animate-pulse">
                    64% OFF
                  </span>
                </div>
              </div>

            </div>

            {/* Right Side: Circular Backdrop Spotlight with Sonic Ripples & Floating Earbud */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center">
                
                {/* Sonic Acoustic Ripples */}
                <div className="absolute inset-10 rounded-full border-2 border-amber-400/40 animate-sonic-ripple-1 pointer-events-none" />
                <div className="absolute inset-10 rounded-full border-2 border-amber-400/40 animate-sonic-ripple-2 pointer-events-none" />
                <div className="absolute inset-10 rounded-full border-2 border-amber-400/40 animate-sonic-ripple-3 pointer-events-none" />

                {/* Rotating Soft Conic Golden Backdrop */}
                <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-br from-amber-200/70 via-slate-100 to-amber-100/60 shadow-inner border border-amber-200/60 animate-spin-slow pointer-events-none" />

                {/* Floating High-Res Earbud Product Visual */}
                <div className="relative z-10 w-full h-full p-6 flex items-center justify-center animate-float-slow">
                  <Image
                    src="/images/spotlight-earbud.jpg"
                    alt="Flazo Nirvana Gold Pro Single Spotlight"
                    width={480}
                    height={480}
                    priority
                    className="object-contain max-h-[320px] sm:max-h-[380px] w-auto drop-shadow-2xl transform hover:scale-108 transition-transform duration-700 rounded-3xl"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 3 Companion Spotlight Category Tiles (With card-lift & micro-interactions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {subSpotlights.map((card) => (
            <div
              key={card.id}
              className="card-lift relative rounded-2xl bg-neutral-50/70 border border-neutral-200/80 p-5 pt-8 flex flex-col justify-between hover:bg-white hover:border-amber-400 shadow-xs group"
            >
              {/* Corner Badge */}
              <div className="absolute top-0 left-0">
                <span className={`inline-block font-black text-[10px] px-3.5 py-1 rounded-br-xl rounded-tl-2xl shadow-2xs ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              {/* Card Image with Hover Zoom */}
              <div className="relative w-full aspect-4/3 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-neutral-100 mb-4 group-hover:border-amber-200 transition-colors">
                <Image
                  src={card.image}
                  alt={card.series}
                  width={340}
                  height={240}
                  className="object-contain max-h-[160px] w-auto drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="space-y-2 text-left">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  {card.series}
                </span>
                <h4 className="text-base font-black text-neutral-950 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {card.title}
                </h4>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-neutral-950">{card.price}</span>
                    <span className="text-xs text-neutral-400 line-through">{card.originalPrice}</span>
                  </div>

                  <a
                    href={card.link}
                    className="btn-shimmer px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs transition-all shadow-2xs hover:scale-105"
                  >
                    VIEW MORE
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

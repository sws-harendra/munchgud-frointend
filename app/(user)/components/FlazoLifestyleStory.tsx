"use client";
import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Truck, Headphones, Award } from "lucide-react";
import { FadeIn, HoverCard, Stagger, StaggerItem } from "@/app/commonComponents/motion";

export default function FlazoLifestyleStory() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-amber-50/30 to-white border-b border-amber-100/80">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">

        {/* Lifestyle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Lifestyle Photography Showcase */}
          <FadeIn direction="right" distance={30} className="lg:col-span-6 relative flex justify-center">
            <div className="absolute -inset-4 bg-radial from-amber-400/20 via-transparent to-transparent blur-2xl pointer-events-none" />
            <div className="relative w-full max-w-[480px] mx-auto rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-2xl bg-neutral-950 group">
              <Image
                src="/images/boombass-lifestyle.png"
                alt="Flazo Luxury Earbuds"
                width={426}
                height={612}
                className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </FadeIn>

          {/* Right: The Flazo Story & Guarantees */}
          <FadeIn direction="left" distance={30} delay={0.1} className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>The Flazo Manifesto</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              WEAR THE GOLD. <br />
              <span className="gold-gradient-text">HEAR THE SOUL.</span>
            </h2>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              We started Flazo with an uncompromising vision: why should consumer earbuds look like dull, disposable grey plastic? Audio is personal. It should feel like high-end Swiss horology, coated in gleaming champagne gold, accompanied by acoustic dynamics that send chills down your spine.
            </p>

            {/* 3 Pillars of Flazo Promise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <HoverCard yOffset={-4} scale={1.01} className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-2xs space-y-1.5 group cursor-default">
                <ShieldCheck className="w-5 h-5 text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h4 className="text-xs font-black text-neutral-900 group-hover:text-amber-800 transition-colors">1-Year Warranty & Service</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  If you experience any technical issues or manufacturing defects within 365 days, we will repair or service your earbuds to ensure they work perfectly.
                </p>
              </HoverCard>

              <HoverCard yOffset={-4} scale={1.01} className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-2xs space-y-1.5 group cursor-default">
                <Truck className="w-5 h-5 text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h4 className="text-xs font-black text-neutral-900 group-hover:text-amber-800 transition-colors">Express Shipping</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Delivered within 2 to 5 business days. Dispatched in armored luxury packaging across 19,000+ pin codes in India with free COD.
                </p>
              </HoverCard>
            </div>

            {/* Press & Recognitions */}
            <div className="pt-4 border-t border-amber-100">
              <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold block mb-3">
                Featured & Praised In
              </span>
              <div className="flex flex-wrap items-center gap-6 text-neutral-400 font-black text-sm tracking-wider">
                <span className="hover:text-amber-600 transition-colors">ROLLING STONE</span>
                <span className="hover:text-amber-600 transition-colors">TECHRADAR</span>
                <span className="hover:text-amber-600 transition-colors">GQ INDIA</span>
                <span className="hover:text-amber-600 transition-colors">FORBES ASIA</span>
              </div>
            </div>

          </FadeIn>

        </div>

      </div>
    </section>
  );
}

"use client";
import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Truck, Headphones, Award } from "lucide-react";

export default function FlazoLifestyleStory() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-amber-50/30 to-white border-b border-amber-100/80">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">

        
        {/* Lifestyle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Lifestyle Photography with Floating Quote */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-4 bg-radial from-amber-400/20 via-transparent to-transparent blur-2xl animate-pulse-glow pointer-events-none" />
            <div className="relative aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-2xl bg-amber-50 group">
              <Image
                src="/images/lifestyle-model.jpg"
                alt="Flazo Luxury Earbuds Lifestyle"
                width={700}
                height={700}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Quote Badge */}
              <div className="animate-float-fast absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-amber-300 shadow-2xl">
                <p className="text-xs font-semibold text-neutral-800 italic">
                  &ldquo;Flazo isn’t just an audio wearable. It’s jewelry that punches through with chest-rattling bass.&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-900">GQ Style & Tech 2025</span>
                  <div className="flex gap-0.5 text-amber-500 text-xs">★★★★★</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Flazo Story & Guarantees */}
          <div className="lg:col-span-6 space-y-6 text-left">
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
              <div className="card-lift p-4 rounded-2xl bg-white border border-amber-200/70 shadow-2xs space-y-1.5 group cursor-default">
                <ShieldCheck className="w-5 h-5 text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h4 className="text-xs font-black text-neutral-900 group-hover:text-amber-800 transition-colors">1-Year Hassle-Free Swap</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  No service center loops. If anything goes wrong, we send a brand new pair to your doorstep.
                </p>
              </div>

              <div className="card-lift p-4 rounded-2xl bg-white border border-amber-200/70 shadow-2xs space-y-1.5 group cursor-default">
                <Truck className="w-5 h-5 text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h4 className="text-xs font-black text-neutral-900 group-hover:text-amber-800 transition-colors">Express 48H Shipping</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Dispatched in armored luxury packaging across 19,000+ pin codes in India with free COD.
                </p>
              </div>
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

          </div>

        </div>

      </div>
    </section>
  );
}

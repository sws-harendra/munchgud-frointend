"use client";
import React from "react";
import Link from "next/link";
import { brandName } from "@/app/contants";
import { Headphones, ShieldCheck, Sparkles, Zap, Award, CheckCircle2 } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero Section */}
      <section className="relative bg-neutral-950 text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Flazo Heritage</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Redefining Sound with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Acoustic Gold</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {brandName} is dedicated to crafting audiophile-grade wireless earbuds and luxury sound gear. By fusing titanium driver precision with 24K gold accents and 50dB active noise cancellation, we deliver audio as pure as intended.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              Explore Lineup
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
              Our Vision
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 leading-tight">
              Where Engineering Meets Acoustic Elegance
            </h2>

            <p className="text-neutral-600 leading-relaxed">
              At {brandName}, our obsession begins with acoustic clarity. We believe that premium audio should not be reserved only for professional sound studios. We set out to engineer flagship wireless earbuds that combine studio-grade fidelity, industry-leading active noise cancellation, and ergonomic all-day luxury.
            </p>

            <p className="text-neutral-600 leading-relaxed">
              Every driver is custom tuned with custom titanium dynamic diaphragms, delivering punchy sub-bass, crystal-clear vocal staging, and distortion-free highs. Built for audiophiles, daily commuters, and creators alike.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-neutral-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Custom 13mm BoomBass™ Titanium Drivers</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span>50dB Hybrid Active Noise Cancellation (ANC)</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Doorstep 1-Year Comprehensive Replacement Warranty</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-neutral-50 p-8 sm:p-10 rounded-3xl border border-amber-200/70 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-neutral-900">
              Our Promise to You
            </h3>

            <p className="text-neutral-600 leading-relaxed">
              To deliver high-fidelity audio equipment with unmatched customer care. When you choose {brandName}, you join a community that never settles for muffled sound or cheap construction.
            </p>

            <div className="border-t border-amber-200/50 pt-6 grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white shadow-xs">
                <div className="text-2xl font-black text-amber-600">50dB</div>
                <div className="text-xs text-neutral-500 mt-1">Hybrid ANC</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-xs">
                <div className="text-2xl font-black text-amber-600">70 Hours</div>
                <div className="text-xs text-neutral-500 mt-1">Total Playtime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-50 py-20 border-t border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-neutral-900">
            Why Choose {brandName}
          </h2>
          <p className="text-neutral-500 mt-3 max-w-xl mx-auto text-sm">
            Experience the three pillars that set Flazo audio apart from ordinary earbuds.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="bg-white rounded-2xl p-8 shadow-xs border border-neutral-200/70 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Signature Gold Acoustics
              </h3>
              <p className="text-neutral-600 text-sm mt-3 leading-relaxed">
                Precision-engineered titanium dynamic diaphragms optimized for deep bass response and studio vocal clarity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xs border border-neutral-200/70 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Ultra-Low Latency & Fast Charge
              </h3>
              <p className="text-neutral-600 text-sm mt-3 leading-relaxed">
                40ms Beast Mode™ latency for pro gaming and streaming, paired with 10-minute ASAP charge delivering 10 hours playtime.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xs border border-neutral-200/70 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                1-Year Doorstep Warranty
              </h3>
              <p className="text-neutral-600 text-sm mt-3 leading-relaxed">
                Hassle-free direct doorstep pickup and instant replacement support across 19,000+ pin codes in India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Volume2,
  Mic,
  Activity,
  Sparkles,
  Radio,
  Layers,
  BatteryCharging,
} from "lucide-react";

export default function FlazoTechAcoustics() {
  const [viewMode, setViewMode] = useState<"video" | "blueprint">("video");

  return (
    <section id="acoustic-tech" className="py-16 md:py-24 bg-white border-b border-amber-100/80 relative">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">

        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Acoustic Engineering By Flazo Labs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight">
            ENGINEERED INSIDE OUT FOR <span className="gold-gradient-text">PURE AUDIOPHILE BASS</span>
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg">
            Watch the precision deconstruction video from the assembled earbud into all 12 acoustic internal layers.
          </p>
        </div>

        {/* 3D Exploded View & Engineering Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Exploded 3D Visual Rendering & Video Player */}
          <div className="lg:col-span-7 bg-gradient-to-tr from-amber-50/50 via-white to-amber-100/30 p-4 sm:p-8 rounded-3xl border border-amber-200/80 shadow-lg relative group">
            
            {/* View Mode Toggle (Video vs Blueprint) */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-amber-100/60 p-1 rounded-xl border border-amber-200">
                <button
                  onClick={() => setViewMode("video")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "video"
                      ? "bg-neutral-950 text-amber-300 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <span>▶ 3D Breakdown Video</span>
                </button>
                <button
                  onClick={() => setViewMode("blueprint")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "blueprint"
                      ? "bg-neutral-950 text-amber-300 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <span>📐 12-Part Blueprint</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-amber-700 bg-amber-200/50 px-2.5 py-1 rounded-full">
                {viewMode === "video" ? "10s Deconstruction Loop" : "Architectural Schema"}
              </span>
            </div>

            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-neutral-900 shadow-inner flex items-center justify-center">
              {viewMode === "video" ? (
                <video
                  src="/videos/flazo-earbud-breakdown.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-contain"
                  poster="/images/driver-tech.jpg"
                >
                  {/* Fallback animated WebP for browsers that don't autoplay video */}
                  <Image
                    src="/videos/flazo-earbud-breakdown.webp"
                    alt="Flazo Earbud Deconstruction Animation"
                    width={800}
                    height={600}
                    unoptimized
                    className="object-contain w-full h-full"
                  />
                </video>
              ) : (
                <Image
                  src="/images/driver-tech.jpg"
                  alt="Flazo 13mm Titanium Acoustic Driver Tech"
                  width={800}
                  height={600}
                  className="object-contain w-full h-full transform group-hover:scale-102 transition-transform duration-700 bg-white"
                />
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-600 font-medium px-2">
              <span className="flex items-center gap-1.5 text-neutral-800 font-bold">
                <Layers className="w-4 h-4 text-amber-600" />
                Multi-Layered Resin Chassis
              </span>
              <span className="flex items-center gap-1.5 text-neutral-800 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                24K Gold-Plated Charging Terminals
              </span>
              <span className="flex items-center gap-1.5 text-neutral-800 font-bold">
                <BatteryCharging className="w-4 h-4 text-amber-600" />
                High-Density Li-Po Acoustic Cell
              </span>
            </div>
          </div>


          {/* Key Audio Pillars (Boult / boAt Style Callouts) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="card-lift p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-400 cursor-default group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-neutral-950 shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-950 group-hover:text-amber-700 transition-colors">13mm Titanium Diaphragms</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Unlike standard 10mm plastic drivers in cheap earbuds, Flazo’s aerospace-grade titanium diaphragm moves 40% more air, giving you deep sub-bass without mud.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-lift p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-400 cursor-default group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-neutral-950 shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-950 group-hover:text-amber-700 transition-colors">Quad-Mic AI ENC Voice</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Four precision MEMS microphones powered by Flazo AI neural noise cancellation filter out 98% of ambient honks, wind, and cafe noise so callers hear only you.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-lift p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-400 cursor-default group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-neutral-950 shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-950 group-hover:text-amber-700 transition-colors">35ms Beast™ Gaming Latency</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Triple-tap the earbud to engage ultra-low sync mode. Hear footsteps and gunshots in BGMI or Call of Duty with zero perceptible audio delay.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

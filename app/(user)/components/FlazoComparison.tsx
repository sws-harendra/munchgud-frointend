"use client";
import React from "react";
import { Check, X, Sparkles, Award } from "lucide-react";

export default function FlazoComparison() {
  const comparisonData = [
    {
      feature: "Acoustic Drivers",
      flazo: "13mm Custom Titanium BoomBass™",
      ordinary: "10mm Generic Plastic Driver",
      advantage: true,
    },
    {
      feature: "Noise Cancellation",
      flazo: "50dB Hybrid Dual-Mic ANC",
      ordinary: "Passive or weak ~20dB cut",
      advantage: true,
    },
    {
      feature: "Total Playtime",
      flazo: "70 Hours + ASAP™ Hyper Charge",
      ordinary: "20 - 28 Hours, Slow Charging",
      advantage: true,
    },
    {
      feature: "Gaming Sync Latency",
      flazo: "35ms Beast™ Ultra-Low Lag",
      ordinary: "180ms - 220ms notice lag",
      advantage: true,
    },
    {
      feature: "Calling Clarity",
      flazo: "Quad-Mic ENC with AI Voice Isolator",
      ordinary: "Dual mic with wind distortion",
      advantage: true,
    },
    {
      feature: "Water & Sweat Rating",
      flazo: "IPX7 Complete Workout Waterproofing",
      ordinary: "Basic IPX4 or no rating",
      advantage: true,
    },
    {
      feature: "Replacement Warranty",
      flazo: "1-Year Doorstep Replacement",
      ordinary: "Carry-in service center wait",
      advantage: true,
    },
  ];

  return (
    <section id="why-flazo" className="py-16 md:py-24 bg-white border-b border-amber-100/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>The Flazo Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            WHY SETTLE FOR LESS WHEN YOU CAN <span className="gold-gradient-text">HAVE GOLD</span>?
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto">
            See how Flazo flagship acoustic engineering outperforms typical wireless earbuds in real-world everyday performance.
          </p>
        </div>

        {/* Comparison Table */}
        {/* Comparison Table with card-lift & Row Interactions */}
        <div className="card-lift overflow-hidden rounded-3xl border border-amber-200 shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-100 bg-amber-50/50">
                  <th className="py-5 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Feature & Specs
                  </th>
                  <th className="py-5 px-6 text-sm font-black text-amber-900 bg-amber-100/70 border-x border-amber-200">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>FLAZO GOLD SERIES</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Ordinary Market Buds
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-amber-50/60 transition-colors group cursor-default"
                  >
                    <td className="py-4 px-6 font-semibold text-neutral-800 group-hover:text-amber-900 transition-colors">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-bold text-neutral-950 bg-amber-50/40 border-x border-amber-200/80 group-hover:bg-amber-100/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-115 group-hover:rotate-6 transition-transform">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-amber-950">{row.flazo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="text-xs sm:text-sm">{row.ordinary}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";
import React from "react";
import { Sparkles, Zap, Shield, Volume2, Gamepad2, Droplets, Truck, Award } from "lucide-react";

export default function FlazoMarqueeTicker() {
  const tickerItems = [
    { icon: Volume2, text: "13MM TITANIUM BOOMBASS™", highlight: true },
    { icon: Shield, text: "50DB HYBRID ACTIVE NOISE CANCELLATION", highlight: false },
    { icon: Zap, text: "70 HOURS MONSTER PLAYTIME", highlight: true },
    { icon: Gamepad2, text: "35MS BEAST™ GAMING LATENCY", highlight: false },
    { icon: Droplets, text: "IPX7 WORKOUT WATERPROOFING", highlight: true },
    { icon: Zap, text: "ASAP™ CHARGE: 10 MINS = 120 MINS", highlight: false },
    { icon: Award, text: "1-YEAR DOORSTEP REPLACEMENT", highlight: true },
    { icon: Truck, text: "FREE EXPRESS 48H DISPATCH", highlight: false },
    { icon: Sparkles, text: "24K GOLD TRIM LUXURY AESTHETICS", highlight: true },
  ];

  return (
    <div className="w-full bg-neutral-950 border-y border-amber-500/30 overflow-hidden py-3.5 select-none relative z-20">
      {/* Golden gradient fade masks on left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

      {/* Infinite Seamless Scrolling Marquee Track */}
      <div className="animate-marquee flex items-center gap-8">
        {/* Set 1 */}
        {tickerItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`a-${idx}`}
              className="flex items-center gap-2.5 text-xs sm:text-sm font-black tracking-widest uppercase shrink-0 transition-transform hover:scale-105 cursor-default"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className={item.highlight ? "gold-gradient-text" : "text-white"}>
                {item.text}
              </span>
              <span className="text-amber-400/60 font-bold ml-4">✦</span>
            </div>
          );
        })}

        {/* Set 2 (Duplicate for seamless loop) */}
        {tickerItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`b-${idx}`}
              className="flex items-center gap-2.5 text-xs sm:text-sm font-black tracking-widest uppercase shrink-0 transition-transform hover:scale-105 cursor-default"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className={item.highlight ? "gold-gradient-text" : "text-white"}>
                {item.text}
              </span>
              <span className="text-amber-400/60 font-bold ml-4">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

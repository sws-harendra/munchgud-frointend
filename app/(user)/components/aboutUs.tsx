import { brandName } from "@/app/contants";
import React from "react";
import Link from "next/link";
import { Headphones, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="relative py-20 px-6 lg:px-20 overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 -z-10 pointer-events-none"></div>

      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Acoustic Excellence</span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-black text-neutral-900 tracking-tight">
          About <span className="text-amber-600">{brandName}</span>
        </h2>
        <p className="mt-4 text-neutral-600 text-base lg:text-lg max-w-2xl mx-auto">
          Crafting luxury wireless earbuds with 50dB Hybrid ANC and signature gold acoustics.
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-sm shadow-xs">
            Precision Audio • 50dB Hybrid ANC • 70H Playtime
          </div>

          <h3 className="text-2xl lg:text-3xl font-black text-neutral-900 leading-snug">
            Elevating your listening experience with studio-grade clarity.
          </h3>

          <p className="text-neutral-600 text-base leading-relaxed">
            At <span className="font-semibold text-neutral-950">{brandName}</span>, we believe sound should be both immersive and uncompromising. Our journey started with a singular vision: to bring studio-grade acoustic performance, active noise cancellation, and luxury design to everyday wireless audio.
          </p>

          <p className="text-neutral-600 text-base leading-relaxed">
            Engineered with custom 13mm BoomBass™ titanium drivers and intelligent quad-mic ENC for crystal-clear calls, every Flazo device is backed by our signature 1 Year warranty and service.
          </p>

          <Link
            href="/earbuds"
            className="mt-4 inline-block px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Explore Earbuds Lineup
          </Link>
        </div>

        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 lg:p-10 rounded-3xl text-white shadow-xl border border-amber-500/20 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Headphones className="w-6 h-6" />
          </div>
          <h4 className="text-2xl font-black text-white">Why Flazo Audio?</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>50dB Hybrid Active Noise Cancellation</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>13mm Titanium BoomBass™ Dynamic Drivers</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>70 Hours Total Playback & 10 Min Fast Charge</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>1 Year warranty and service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

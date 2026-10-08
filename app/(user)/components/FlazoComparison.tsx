"use client";
import React from "react";
import { Award } from "lucide-react";

export default function FlazoComparison() {
  const comparisonRows = [
    {
      id: "1",
      number: "1.",
      title: "Acoustic Drivers",
      flazo: (
        <div className="font-bold text-[#0369a1] text-sm sm:text-base leading-snug">
          13mm Custom Dynamic BoomBass™ Drivers
        </div>
      ),
      ordinary: "5-6mm Generic Small Drivers",
    },
    {
      id: "2",
      number: "2.",
      title: "Ultimate Playtime",
      flazo: (
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>
              <strong className="font-bold text-slate-950">Total Playtime:</strong> Up to 100 Hours (with case, depends on volume)
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>
              <strong className="font-bold text-slate-950">Single Charge:</strong> Max 8 Hours (at moderate volume)
            </div>
          </li>
        </ul>
      ),
      ordinary: "20-28 Hours, Slow Charging",
    },
    {
      id: "3",
      number: "3.",
      title: "Connectivity & Pairing",
      flazo: (
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>
              <strong className="font-bold text-slate-950">Wireless Version 5.4</strong>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>Instant Auto Pairing &amp; Auto Power On/Off</div>
          </li>
        </ul>
      ),
      ordinary: "Older BT version with audio drops",
    },
    {
      id: "4",
      number: "4.",
      title: "Premium Controls",
      flazo: (
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>
              <strong className="font-bold text-slate-950">Smart Touch Controls &amp; IPX5 Water Resistance</strong>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>Single Tap: Play/Pause, Answer/Hang Up</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>Double Tap: Previous/Next Track, Reject Call</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>Triple Tap: Volume Up/Down</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>4 Taps: Game Mode | Long Press: Voice Assistant</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>6 Taps: Factory Reset</div>
          </li>
        </ul>
      ),
      ordinary: "Basic IPX4 / Simple press operations",
    },
    {
      id: "5",
      number: "5.",
      title: "Smart Indicators",
      flazo: (
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>
              <strong className="font-bold text-slate-950">Dual Light Status</strong>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>Buds: Pulsing white light</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>Case: Flashing red (charging), Solid red (full)</div>
          </li>
        </ul>
      ),
      ordinary: "Slow conventional charging indicators",
    },
    {
      id: "6",
      number: "6.",
      title: "Warranty & Support",
      flazo: (
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>1-Year Warranty and Service</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0369a1] font-bold text-base leading-none select-none mt-0.5">•</span>
            <div>7-Day Replacement Policy</div>
          </li>
        </ul>
      ),
      ordinary: "7-Day Limited Replacement",
    },
  ];

  return (
    <section id="why-flazo" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
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

        {/* Comparison Table Exactly Matching Screenshot */}
        <div className="overflow-hidden rounded-2xl border border-[#cbd5e1]/70 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#cbd5e1]">
                  <th className="w-[26%] py-4 px-6 text-xs sm:text-sm font-extrabold text-[#334155] uppercase tracking-wider bg-[#edf2f7]">
                    FEATURE &amp; SPECS
                  </th>
                  <th className="w-[44%] py-4 px-6 text-xs sm:text-sm font-extrabold text-[#0369a1] uppercase tracking-wider bg-[#e2f0fd] border-x border-[#cbd5e1]/50">
                    FLAZO
                  </th>
                  <th className="w-[30%] py-4 px-6 text-xs sm:text-sm font-extrabold text-[#334155] uppercase tracking-wider bg-[#edf2f7]">
                    ORDINARY MARKET BUDS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-sm">
                {comparisonRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Feature & Specs Column */}
                    <td className="py-5 px-6 font-bold text-slate-900 align-top">
                      <div className="flex items-start gap-1">
                        <span>{row.number}</span>
                        <span>{row.title}</span>
                      </div>
                    </td>

                    {/* Flazo Highlighted Column */}
                    <td className="py-5 px-6 bg-[#f4f9fd] border-x border-[#e2e8f0]/80 align-top">
                      {row.flazo}
                    </td>

                    {/* Ordinary Market Buds Column */}
                    <td className="py-5 px-6 text-slate-700 align-top font-normal text-xs sm:text-sm leading-relaxed">
                      {row.ordinary}
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

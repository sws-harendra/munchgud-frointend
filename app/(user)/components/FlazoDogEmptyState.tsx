"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, ShoppingBag, Sparkles } from "lucide-react";

interface FlazoDogEmptyStateProps {
  onRefresh?: () => void;
  title?: string;
  subtitle?: string;
  tab?: string;
}

export default function FlazoDogEmptyState({
  onRefresh,
  title,
  subtitle,
  tab,
}: FlazoDogEmptyStateProps) {
  const displayTitle =
    title ||
    (tab && tab !== "all"
      ? `No ${tab.toUpperCase()} Products Found`
      : "No Products Added Yet");

  const displaySubtitle =
    subtitle ||
    "Our sound curators haven't added any products to this catalog yet. Stay tuned, fresh drops are coming soon!";

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 sm:py-8 px-4 text-center select-none">
      <style jsx>{`
        @keyframes dogTailWag {
          0%, 100% {
            transform: rotate(-16deg);
          }
          50% {
            transform: rotate(20deg);
          }
        }
        @keyframes dogHeadBob {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(1.5deg);
          }
        }
        @keyframes dogEarLeft {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-5deg);
          }
        }
        @keyframes dogEarRight {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        @keyframes dogEyeBlink {
          0%, 88%, 100% {
            transform: scaleY(1);
          }
          94% {
            transform: scaleY(0.1);
          }
        }
        @keyframes musicNoteFloat1 {
          0% {
            transform: translate(0, 0) scale(0.7);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(-14px, -32px) scale(1.1);
            opacity: 0;
          }
        }
        @keyframes musicNoteFloat2 {
          0% {
            transform: translate(0, 0) scale(0.7);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(16px, -36px) scale(1.15);
            opacity: 0;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.04);
          }
        }
        .animate-tail {
          transform-origin: 142px 148px;
          animation: dogTailWag 0.9s ease-in-out infinite;
        }
        .animate-head {
          transform-origin: 100px 95px;
          animation: dogHeadBob 2.6s ease-in-out infinite;
        }
        .animate-ear-left {
          transform-origin: 60px 65px;
          animation: dogEarLeft 2.2s ease-in-out infinite;
        }
        .animate-ear-right {
          transform-origin: 140px 65px;
          animation: dogEarRight 2.2s ease-in-out infinite;
        }
        .animate-eye {
          transform-origin: center;
          animation: dogEyeBlink 3.8s infinite;
        }
        .animate-note-1 {
          animation: musicNoteFloat1 2.8s ease-out infinite;
        }
        .animate-note-2 {
          animation: musicNoteFloat2 3.2s ease-out 1.2s infinite;
        }
        .animate-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Dog Illustration Container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Soft Golden Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/30 via-yellow-200/20 to-transparent rounded-full blur-2xl animate-glow pointer-events-none" />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xl overflow-visible"
        >
          {/* Floor Shadow */}
          <ellipse
            cx="100"
            cy="176"
            rx="56"
            ry="9"
            fill="#EADCC7"
            opacity="0.75"
          />

          {/* Animated Tail */}
          <g className="animate-tail">
            <path
              d="M 132 142 C 158 135 174 116 168 100 C 163 90 152 98 152 108 C 152 122 138 138 128 146 Z"
              fill="#D98A36"
            />
            {/* White Tail Tip */}
            <path
              d="M 166 102 C 168 100 171 106 168 112 C 163 118 156 122 153 115 C 153 108 162 98 166 102 Z"
              fill="#FFF4E6"
            />
          </g>

          {/* Dog Body */}
          <path
            d="M 72 120 C 70 105 82 95 100 95 C 118 95 130 105 128 120 C 132 138 136 162 124 168 C 112 172 88 172 76 168 C 64 162 68 138 72 120 Z"
            fill="#EFA351"
          />

          {/* White Chest Patch */}
          <path
            d="M 88 118 C 94 116 106 116 112 118 C 116 130 114 148 100 154 C 86 148 84 130 88 118 Z"
            fill="#FFF6ED"
          />

          {/* Front Paws */}
          {/* Left Paw */}
          <g>
            <ellipse cx="82" cy="168" rx="10" ry="6" fill="#FFF6ED" />
            <path d="M 78 166 L 78 170 M 82 166 L 82 170" stroke="#E2CCA8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Right Paw */}
          <g>
            <ellipse cx="118" cy="168" rx="10" ry="6" fill="#FFF6ED" />
            <path d="M 114 166 L 114 170 M 118 166 L 118 170" stroke="#E2CCA8" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Animated Head Group */}
          <g className="animate-head">
            {/* Head Base */}
            <circle cx="100" cy="85" r="38" fill="#F4AC5B" />

            {/* Left Ear */}
            <g className="animate-ear-left">
              <path
                d="M 72 65 C 52 70 42 98 50 116 C 54 124 64 120 68 110 C 72 98 76 80 75 66 Z"
                fill="#C97426"
              />
            </g>

            {/* Right Ear */}
            <g className="animate-ear-right">
              <path
                d="M 128 65 C 148 70 158 98 150 116 C 146 124 136 120 132 110 C 128 98 124 80 125 66 Z"
                fill="#C97426"
              />
            </g>

            {/* Snout Muzzle */}
            <ellipse cx="100" cy="95" rx="18" ry="14" fill="#FFF6ED" />

            {/* Nose */}
            <ellipse cx="100" cy="88" rx="6" ry="4.5" fill="#26170E" />
            <ellipse cx="98" cy="86.5" rx="1.8" ry="1" fill="#FFFFFF" opacity="0.8" />

            {/* Mouth / Smile */}
            <path
              d="M 94 95 Q 100 100 106 95"
              fill="none"
              stroke="#26170E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Tiny Pink Tongue */}
            <path
              d="M 98 98 C 98 103 102 103 102 98 Z"
              fill="#FF758F"
            />

            {/* Cute Blush Cheeks */}
            <ellipse cx="76" cy="94" rx="5" ry="3" fill="#FF8FA3" opacity="0.45" />
            <ellipse cx="124" cy="94" rx="5" ry="3" fill="#FF8FA3" opacity="0.45" />

            {/* Eyes (Animated Blinking) */}
            <g className="animate-eye">
              {/* Left Eye */}
              <ellipse cx="84" cy="80" rx="5" ry="6.5" fill="#20150E" />
              <circle cx="82" cy="78" r="2.2" fill="#FFFFFF" />
              <circle cx="85.5" cy="82.5" r="1" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="116" cy="80" rx="5" ry="6.5" fill="#20150E" />
              <circle cx="114" cy="78" r="2.2" fill="#FFFFFF" />
              <circle cx="117.5" cy="82.5" r="1" fill="#FFFFFF" />
            </g>

            {/* Eyebrows (Cute dots) */}
            <ellipse cx="83" cy="70" rx="2" ry="1.2" fill="#D07A2A" />
            <ellipse cx="117" cy="70" rx="2" ry="1.2" fill="#D07A2A" />

            {/* ===================================================
                FLAZO GOLD LUXURY HEADPHONES OVER THE DOG'S HEAD
               =================================================== */}
            {/* Headband arch */}
            <path
              d="M 64 68 C 64 42 136 42 136 68"
              fill="none"
              stroke="#1A1815"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Headband Gold Accent Stripe */}
            <path
              d="M 76 52 C 86 47 114 47 124 52"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left Headphone Earcup */}
            <g>
              {/* Outer Cushion */}
              <rect
                x="56"
                y="64"
                width="13"
                height="24"
                rx="6.5"
                fill="#1A1815"
              />
              {/* Gold Outer Cap */}
              <rect
                x="54"
                y="67"
                width="6"
                height="18"
                rx="3"
                fill="#D4AF37"
              />
              <circle cx="57" cy="76" r="1.5" fill="#FFF2B2" />
            </g>

            {/* Right Headphone Earcup */}
            <g>
              {/* Outer Cushion */}
              <rect
                x="131"
                y="64"
                width="13"
                height="24"
                rx="6.5"
                fill="#1A1815"
              />
              {/* Gold Outer Cap */}
              <rect
                x="140"
                y="67"
                width="6"
                height="18"
                rx="3"
                fill="#D4AF37"
              />
              <circle cx="143" cy="76" r="1.5" fill="#FFF2B2" />
            </g>
          </g>

          {/* Floating Musical Notes (Floating up) */}
          <g className="animate-note-1 pointer-events-none" opacity="0">
            <path
              d="M 50 56 L 50 44 L 62 41 L 62 53 M 50 50 L 62 47"
              stroke="#D4AF37"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="47" cy="56" r="3" fill="#D4AF37" />
            <circle cx="59" cy="53" r="3" fill="#D4AF37" />
          </g>

          <g className="animate-note-2 pointer-events-none" opacity="0">
            <path
              d="M 148 50 L 148 40 L 157 37 L 157 47 M 148 45 L 157 42"
              stroke="#B8860B"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="145" cy="50" r="2.8" fill="#B8860B" />
            <circle cx="154" cy="47" r="2.8" fill="#B8860B" />
          </g>
        </svg>
      </div>

      {/* Text Copy & Status */}
      <div className="space-y-2 mt-3 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#8C6D37] text-[11px] font-black uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B] animate-spin" style={{ animationDuration: "6s" }} />
          <span>Curator Drop In Progress</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
          {displayTitle}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {displaySubtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check For Updates</span>
          </button>
        )}

        <Link
          href="/earbuds"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-amber-50 text-neutral-900 border border-neutral-300 hover:border-amber-400 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          <span>Browse All Earbuds</span>
        </Link>
      </div>
    </div>
  );
}

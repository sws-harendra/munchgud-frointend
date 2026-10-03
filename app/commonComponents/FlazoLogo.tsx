"use client";
import React, { useId } from "react";

interface FlazoLogoProps {
  /** Size presets: xs (~24px high), sm (~32px), md (~44px, default), lg (~60px), xl (~80px) */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Optional custom className */
  className?: string;
  /** Whether to show the AUDIO subtitle (default true) */
  showAudio?: boolean;
  /** Alignment: "left" (default) or "center" */
  align?: "left" | "center";
}

export default function FlazoLogo({
  size = "md",
  className = "",
  showAudio = true,
  align = "left",
}: FlazoLogoProps) {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, "");

  // Size height mappings
  const heightClasses = {
    xs: "h-6",
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
    xl: "h-20",
  }[size];

  return (
    <div
      className={`inline-flex items-center ${
        align === "center" ? "justify-center text-center" : "justify-start"
      } select-none ${className}`}
    >
      <svg
        viewBox={showAudio ? "0 0 250 88" : "0 0 250 62"}
        className={`${heightClasses} w-auto transition-transform duration-200 group-hover:scale-102`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
        role="img"
        aria-label="FLAZO AUDIO"
      >
        <defs>
          {/* Metallic 3D Gold Gradient for Face */}
          <linearGradient id={`${id}-goldFace`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="14%" stopColor="#FDE68A" />
            <stop offset="38%" stopColor="#D9A844" />
            <stop offset="52%" stopColor="#FDF0AE" />
            <stop offset="72%" stopColor="#C69231" />
            <stop offset="88%" stopColor="#9E6B18" />
            <stop offset="100%" stopColor="#6E4405" />
          </linearGradient>

          {/* Luxury Metallic Light Stroke / Bevel */}
          <linearGradient id={`${id}-goldStroke`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#B47D1C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#452702" stopOpacity="0.95" />
          </linearGradient>

          {/* 3D Depth & Bottom Bevel Shadow Filter */}
          <filter id={`${id}-gold3D`} x="-20%" y="-20%" width="140%" height="140%">
            {/* Top metallic crisp edge shadow */}
            <feDropShadow
              dx="0"
              dy="1.2"
              stdDeviation="0.4"
              floodColor="#3D2504"
              floodOpacity="0.75"
            />
            {/* Deep 3D bottom bevel */}
            <feDropShadow
              dx="0"
              dy="2.4"
              stdDeviation="1.2"
              floodColor="#231401"
              floodOpacity="0.55"
            />
            {/* Ambient soft glow */}
            <feDropShadow
              dx="0"
              dy="4.5"
              stdDeviation="3"
              floodColor="#000000"
              floodOpacity="0.2"
            />
          </filter>
        </defs>

        <g filter={`url(#${id}-gold3D)`}>
          {/* Main Brand Wordmark: FLAZO */}
          <text
            x="125"
            y="50"
            textAnchor="middle"
            fill={`url(#${id}-goldFace)`}
            stroke={`url(#${id}-goldStroke)`}
            strokeWidth="0.8"
            paintOrder="stroke fill"
            style={{
              fontFamily:
                "'Outfit', 'Montserrat', 'Inter', system-ui, -apple-system, sans-serif",
              fontSize: "52px",
              fontWeight: 900,
              letterSpacing: "4px",
            }}
          >
            FLAZO
          </text>

          {/* Subtitle: AUDIO */}
          {showAudio && (
            <text
              x="125"
              y="78"
              textAnchor="middle"
              fill={`url(#${id}-goldFace)`}
              stroke={`url(#${id}-goldStroke)`}
              strokeWidth="0.4"
              paintOrder="stroke fill"
              style={{
                fontFamily:
                  "'Outfit', 'Montserrat', 'Inter', system-ui, -apple-system, sans-serif",
                fontSize: "16px",
                fontWeight: 800,
                letterSpacing: "8px",
              }}
            >
              AUDIO
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}

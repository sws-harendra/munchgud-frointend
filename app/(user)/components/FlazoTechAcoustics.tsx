"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  Mic,
  Activity,
  Radio,
  Layers,
  Sparkles,
  BatteryCharging,
  Play,
  Pause,
  RotateCcw,
  Crosshair,
} from "lucide-react";

interface Hotspot {
  id: string;
  name: string;
  category: string;
  desc: string;
  x: number; // percentage
  y: number; // percentage
  stageIndex: number;
}

const BLUEPRINT_HOTSPOTS: Hotspot[] = [
  {
    id: "diaphragm",
    name: "13mm Titanium Diaphragm",
    category: "Acoustic Transducer",
    desc: "Aerospace-grade titanium dome engineered for 40% increased air displacement and 18Hz deep sub-bass response without harmonic distortion.",
    x: 46,
    y: 49,
    stageIndex: 1,
  },
  {
    id: "chipset",
    name: "Custom BT 5.3 SoC Board",
    category: "Micro-Electronics",
    desc: "Multi-layered gold-plated circuit board integrating ultra-low power Bluetooth 5.3 RF architecture and Beast™ 35ms gaming processor.",
    x: 42,
    y: 68,
    stageIndex: 3,
  },
  {
    id: "chamber",
    name: "Precision Acoustic Chamber",
    category: "Resonance Control",
    desc: "CAD-optimized back cavity with tuned dampening ports preventing standing soundwaves and delivering crystalline stereo separation.",
    x: 61,
    y: 36,
    stageIndex: 2,
  },
  {
    id: "housing",
    name: "Monocoque Primary Housing",
    category: "Structural Ergonomics",
    desc: "Ultra-lightweight 4.2g ergonomic outer casing finished with a metallic champagne trim and IPX5 splash-resistant acoustic vents.",
    x: 38,
    y: 26,
    stageIndex: 0,
  },
  {
    id: "eartip",
    name: "Memory Foam Acoustic Tip",
    category: "Passive Isolation",
    desc: "Medical-grade contour foam creating a hermetic seal against ear canal irregularities for up to -28dB passive noise attenuation.",
    x: 22,
    y: 57,
    stageIndex: 0,
  },
  {
    id: "output_grille",
    name: "Visual Output Grille",
    category: "Acoustic Dispersion",
    desc: "Precision-etched laser micro-perforations in champagne gold alloy, protecting delicate drivers while maintaining 0.1dB sound transparency.",
    x: 82,
    y: 43,
    stageIndex: 1,
  },
];

const STAGES = [
  {
    id: "overview",
    number: "01",
    label: "Monocoque Body",
    timeFraction: 0.05,
    title: "Aerospace Resin Chassis & Comfort Fit",
    metric: "4.2g Ultra-Light • IPX5 Sealed",
  },
  {
    id: "driver",
    number: "02",
    label: "13mm Titanium Driver",
    timeFraction: 0.40,
    title: "13mm Titanium Acoustic Diaphragm",
    metric: "40% Higher Velocity • 18Hz Deep Bass",
  },
  {
    id: "chamber",
    number: "03",
    label: "Acoustic Chamber & AI ENC",
    timeFraction: 0.70,
    title: "Tuning Port & Quad MEMS Noise Filters",
    metric: "-50dB AI Noise Suppression • Clear Calls",
  },
  {
    id: "chipset",
    number: "04",
    label: "Full 3D Deconstruction",
    timeFraction: 0.98,
    title: "Gold-Plated PCB & BT 5.3 Beast™ SoC",
    metric: "35ms Low Latency • 50Hr Battery Circuit",
  },
];

export default function FlazoTechAcoustics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Playback & Scrubbing State
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [isAutoLooping, setIsAutoLooping] = useState<boolean>(false);
  const [showBlueprints, setShowBlueprints] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeStage, setActiveStage] = useState<number>(0);

  // Animation Refs
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isUserScrubbingRef = useRef<boolean>(false);
  const autoLoopDirRef = useRef<number>(1);

  // Handle Video Metadata Loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDur = videoRef.current.duration || 10;
      setDuration(vidDur);
      // Seek to initial frame
      videoRef.current.currentTime = 0.01;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. SCROLL LISTENER & PROGRESS COMPUTATION
  // ─────────────────────────────────────────────────────────────
  const updateScrollProgress = useCallback(() => {
    if (isAutoLooping || isUserScrubbingRef.current) return;
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollableDistance = rect.height - windowHeight;

    if (totalScrollableDistance <= 0) return;

    // How far the top of the section has scrolled past the top of the viewport
    const scrolledDistance = -rect.top;
    const rawProgress = scrolledDistance / totalScrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    targetProgressRef.current = clampedProgress;
  }, [isAutoLooping]);

  useEffect(() => {
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  // ─────────────────────────────────────────────────────────────
  // 2. 60FPS LERP LOOP FOR BUTTERY SMOOTH VIDEO SCRUBBING
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loop = () => {
      const vid = videoRef.current;
      const vidDuration = duration || 10;

      if (isAutoLooping) {
        // Auto continuous deconstruction loop (smooth back and forth)
        currentProgressRef.current += autoLoopDirRef.current * 0.0025;
        if (currentProgressRef.current >= 1) {
          currentProgressRef.current = 1;
          autoLoopDirRef.current = -1;
        } else if (currentProgressRef.current <= 0) {
          currentProgressRef.current = 0;
          autoLoopDirRef.current = 1;
        }
        targetProgressRef.current = currentProgressRef.current;
      } else {
        // Lerp toward target progress for award-winning Apple-smooth scrubbing
        const diff = targetProgressRef.current - currentProgressRef.current;
        currentProgressRef.current += diff * 0.18;
      }

      const p = Math.max(0, Math.min(1, currentProgressRef.current));
      setScrollProgress(p);

      // Map progress to stage index
      let stg = 0;
      if (p >= 0.78) stg = 3;
      else if (p >= 0.52) stg = 2;
      else if (p >= 0.22) stg = 1;
      setActiveStage(stg);

      // Scrub Video
      if (vid && vid.readyState >= 1) {
        const targetTime = p * vidDuration;
        if (Math.abs(vid.currentTime - targetTime) > 0.02) {
          vid.currentTime = targetTime;
          setCurrentTime(targetTime);
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [duration, isAutoLooping]);

  // ─────────────────────────────────────────────────────────────
  // 3. JUMP TO STAGE (SMOOTH SCROLL OR DIRECT SCRUB)
  // ─────────────────────────────────────────────────────────────
  const jumpToStage = (stageIndex: number) => {
    setIsAutoLooping(false);
    const targetFraction = STAGES[stageIndex].timeFraction;
    targetProgressRef.current = targetFraction;

    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;
      const targetScrollTop = window.scrollY + rect.top + targetFraction * totalScrollableDistance;

      window.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
  };

  // Reset to Assembled
  const handleReset = () => {
    setIsAutoLooping(false);
    jumpToStage(0);
  };

  // Toggle Auto Loop
  const toggleAutoLoop = () => {
    setIsAutoLooping((prev) => !prev);
  };

  return (
    <section
      id="acoustic-tech"
      ref={sectionRef}
      className="relative min-h-[240vh] md:min-h-[280vh] bg-gradient-to-b from-[#FAF8F5] via-white to-[#FDFBF7] border-b border-[#E8DFC8] text-neutral-900 select-none"
    >
      {/* Sticky Viewport Container */}
      <div
        ref={stickyRef}
        className="sticky top-14 sm:top-16 z-20 w-full min-h-[90vh] flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto"
      >
        {/* ─────────────────────────────────────────────────────────────
            HEADER WITH TELEMETRY & STAGE INDICATOR
           ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-amber-200/60">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#9E6B20] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              <Radio className="w-3.5 h-3.5 text-[#C99726] animate-pulse" />
              <span>Acoustic Engineering • 3D Hardware Deconstruction</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-neutral-900 tracking-tight">
              ENGINEERED INSIDE OUT FOR <span className="gold-gradient-text">PURE AUDIOPHILE BASS</span>
            </h2>
          </div>

          {/* Real-time Telemetry Status Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>STAGE {STAGES[activeStage].number}:</span>
              <span className="text-[#9E6B20]">{STAGES[activeStage].label}</span>
            </div>
            <div className="w-px h-4 bg-neutral-200" />
            <span className="text-[11px] font-mono font-semibold text-neutral-500">
              ⏱ {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
            <div className="w-px h-4 bg-neutral-200" />
            <span className="text-[11px] font-mono font-semibold text-neutral-500">
              SCRUB: {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN 3D VIEWPORT & HARDWARE CARDS GRID
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-3 my-auto">
          
          {/* LEFT (Col 7 / 8): Award-Winning 3D Scroll Video Player */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center relative">
            
            {/* Main Stage Frame */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F2EFE9] via-[#ECE7DF] to-[#E5DFC4] border border-amber-300/60 shadow-[0_20px_60px_rgba(180,140,40,0.15)] flex items-center justify-center group">
              
              {/* Corner Engineering Crosshairs */}
              <Crosshair className="absolute top-4 left-4 w-4 h-4 text-amber-600/40 pointer-events-none" />
              <Crosshair className="absolute top-4 right-4 w-4 h-4 text-amber-600/40 pointer-events-none" />
              <Crosshair className="absolute bottom-4 left-4 w-4 h-4 text-amber-600/40 pointer-events-none" />
              <Crosshair className="absolute bottom-4 right-4 w-4 h-4 text-amber-600/40 pointer-events-none" />

              {/* HTML5 Video Element (Scrubbed on Scroll) */}
              <video
                ref={videoRef}
                src="/videos/iska_pura_video_bnao_break_dow.mp4"
                playsInline
                muted
                preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                poster="/images/earbud_breakdown_poster.jpg"
                className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300"
              />

              {/* Dynamic Blueprint Hotspots Overlay */}
              {showBlueprints && scrollProgress > 0.25 && (
                <div className="absolute inset-0 pointer-events-auto">
                  {BLUEPRINT_HOTSPOTS.map((hotspot) => {
                    const isVisibleForStage = hotspot.stageIndex <= activeStage;
                    if (!isVisibleForStage) return null;

                    return (
                      <button
                        key={hotspot.id}
                        onClick={() => setSelectedHotspot(selectedHotspot?.id === hotspot.id ? null : hotspot)}
                        style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer focus:outline-none z-20"
                        title={hotspot.name}
                      >
                        <span className="relative flex items-center justify-center">
                          {/* Pulsing ring */}
                          <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-amber-400 opacity-60" />
                          {/* Inner pin button */}
                          <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 border-2 border-[#D4A017] text-white text-[10px] font-mono font-bold shadow-lg group-hover/pin:scale-125 transition-transform">
                            +
                          </span>
                        </span>

                        {/* Floating Micro Label */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/pin:flex flex-col items-center pointer-events-none whitespace-nowrap z-30">
                          <span className="px-2.5 py-1 rounded-lg bg-neutral-950/90 text-white text-[10px] font-mono font-bold border border-amber-400/40 shadow-xl backdrop-blur-sm">
                            {hotspot.name}
                          </span>
                          <span className="w-1.5 h-1.5 bg-neutral-950 rotate-45 -mt-0.5 border-r border-b border-amber-400/40" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Hotspot Inspection Modal / Card */}
              {selectedHotspot && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm bg-neutral-950/95 text-white p-4 rounded-2xl border border-amber-400/60 shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                        {selectedHotspot.category}
                      </span>
                      <h4 className="text-sm font-serif font-black text-white mt-0.5">
                        {selectedHotspot.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedHotspot(null)}
                      className="text-neutral-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-md hover:bg-neutral-800"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed font-sans">
                    {selectedHotspot.desc}
                  </p>
                </div>
              )}

              {/* Top View Mode Buttons (Matching User UI Exactly) */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 bg-neutral-950/80 p-1 rounded-xl border border-amber-400/40 backdrop-blur-md pointer-events-auto shadow-md">
                  <button
                    onClick={() => {
                      setShowBlueprints(false);
                      setIsAutoLooping(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      !showBlueprints
                        ? "bg-amber-400 text-neutral-950 shadow-xs"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>3D Breakdown</span>
                  </button>

                  <button
                    onClick={() => setShowBlueprints(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      showBlueprints
                        ? "bg-amber-400 text-neutral-950 shadow-xs"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>12-Part Blueprint</span>
                  </button>
                </div>

                {/* Controls Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleReset}
                    className="pointer-events-auto px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-neutral-950/80 text-neutral-300 border border-amber-400/30 hover:bg-neutral-900 hover:text-white backdrop-blur-md shadow-md cursor-pointer"
                    title="Reset to Assembled Earbud"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  {/* Auto Loop Toggle */}
                  <button
                    onClick={toggleAutoLoop}
                    className={`pointer-events-auto px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md shadow-md cursor-pointer border ${
                      isAutoLooping
                        ? "bg-amber-500 text-white border-amber-400 shadow-amber-500/30"
                        : "bg-neutral-950/80 text-amber-300 border-amber-400/30 hover:bg-neutral-900"
                    }`}
                    title="Auto-play continuous 3D loop"
                  >
                    {isAutoLooping ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isAutoLooping ? "Pause Loop" : "10s Deconstruction Loop"}</span>
                  </button>
                </div>
              </div>

              {/* Scroll To Deconstruct Floating Prompt */}
              {scrollProgress < 0.08 && !isAutoLooping && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-950/85 text-amber-300 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border border-amber-400/40 shadow-xl backdrop-blur-md animate-bounce pointer-events-none flex items-center gap-2">
                  <span>Scroll to Deconstruct</span>
                  <span className="text-amber-400">↓</span>
                </div>
              )}

            </div>

            {/* ─────────────────────────────────────────────────────────────
                TIMELINE SCRUBBER & STAGE SELECTORS
               ───────────────────────────────────────────────────────────── */}
            <div className="mt-3.5 space-y-2 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-amber-200/80 shadow-xs">
              
              {/* Progress Slider Track */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={scrollProgress}
                  onChange={(e) => {
                    setIsAutoLooping(false);
                    const val = parseFloat(e.target.value);
                    targetProgressRef.current = val;
                  }}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#9E6B20] focus:outline-none"
                />
              </div>

              {/* Stage Milestone Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {STAGES.map((stg, idx) => {
                  const isActive = activeStage === idx;
                  return (
                    <button
                      key={stg.id}
                      onClick={() => jumpToStage(idx)}
                      className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border-[#9E6B20] shadow-xs"
                          : "bg-neutral-50/70 hover:bg-amber-50/50 border-neutral-200/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold ${isActive ? "text-[#9E6B20]" : "text-neutral-400"}`}>
                          {stg.number}
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#9E6B20]" />}
                      </div>
                      <p className={`text-[11px] font-bold line-clamp-1 mt-0.5 ${isActive ? "text-neutral-950 font-black" : "text-neutral-600"}`}>
                        {stg.label}
                      </p>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>


          {/* RIGHT (Col 5 / 4): Dynamic Highlighting Audio Pillars */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-3.5">
            
            {/* Card 1: 13mm Titanium Diaphragm */}
            <div
              onClick={() => jumpToStage(1)}
              className={`p-5 rounded-2xl transition-all duration-300 border cursor-pointer relative group ${
                activeStage === 1
                  ? "bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border-[#C99726] shadow-lg ring-2 ring-amber-400/20 scale-[1.02]"
                  : "bg-white/90 hover:bg-amber-50/30 border-amber-200/70 shadow-xs hover:border-amber-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                    activeStage === 1
                      ? "bg-gradient-to-br from-[#9E6B20] to-[#D4A017] text-white shadow-amber-500/30"
                      : "bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950"
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-black transition-colors ${activeStage === 1 ? "text-[#9E6B20]" : "text-neutral-950"}`}>
                      13mm Titanium Diaphragms
                    </h3>
                    {activeStage === 1 && (
                      <span className="text-[10px] font-mono font-bold bg-[#9E6B20] text-white px-2 py-0.5 rounded-full">
                        ACTIVE IN 3D
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Unlike standard 10mm plastic drivers in cheap earbuds, Flazo&apos;s aerospace-grade titanium diaphragm moves 40% more air, giving you deep sub-bass without mud.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Quad-Mic AI ENC Voice */}
            <div
              onClick={() => jumpToStage(2)}
              className={`p-5 rounded-2xl transition-all duration-300 border cursor-pointer relative group ${
                activeStage === 2
                  ? "bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border-[#C99726] shadow-lg ring-2 ring-amber-400/20 scale-[1.02]"
                  : "bg-white/90 hover:bg-amber-50/30 border-amber-200/70 shadow-xs hover:border-amber-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                    activeStage === 2
                      ? "bg-gradient-to-br from-[#9E6B20] to-[#D4A017] text-white shadow-amber-500/30"
                      : "bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950"
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-black transition-colors ${activeStage === 2 ? "text-[#9E6B20]" : "text-neutral-950"}`}>
                      Quad-Mic AI ENC Voice
                    </h3>
                    {activeStage === 2 && (
                      <span className="text-[10px] font-mono font-bold bg-[#9E6B20] text-white px-2 py-0.5 rounded-full">
                        ACTIVE IN 3D
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Four precision MEMS microphones powered by Flazo AI neural noise cancellation filter out 98% of ambient honks, wind, and cafe noise so callers hear only you.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: 35ms Beast™ Gaming Latency */}
            <div
              onClick={() => jumpToStage(3)}
              className={`p-5 rounded-2xl transition-all duration-300 border cursor-pointer relative group ${
                activeStage === 3
                  ? "bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border-[#C99726] shadow-lg ring-2 ring-amber-400/20 scale-[1.02]"
                  : "bg-white/90 hover:bg-amber-50/30 border-amber-200/70 shadow-xs hover:border-amber-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                    activeStage === 3
                      ? "bg-gradient-to-br from-[#9E6B20] to-[#D4A017] text-white shadow-amber-500/30"
                      : "bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950"
                  }`}
                >
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-black transition-colors ${activeStage === 3 ? "text-[#9E6B20]" : "text-neutral-950"}`}>
                      35ms Beast™ Gaming Latency
                    </h3>
                    {activeStage === 3 && (
                      <span className="text-[10px] font-mono font-bold bg-[#9E6B20] text-white px-2 py-0.5 rounded-full">
                        ACTIVE IN 3D
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Triple-tap the earbud to engage ultra-low sync mode. Hear footsteps and gunshots in BGMI or Call of Duty with zero perceptible audio delay.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Hardware Guarantee Strip */}
            <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-medium px-1">
              <span className="flex items-center gap-1.5 font-bold text-neutral-800">
                <Layers className="w-3.5 h-3.5 text-[#9E6B20]" />
                12-Layer Resin Chassis
              </span>
              <span className="flex items-center gap-1.5 font-bold text-neutral-800">
                <Sparkles className="w-3.5 h-3.5 text-[#9E6B20]" />
                24K Gold Contacts
              </span>
              <span className="flex items-center gap-1.5 font-bold text-neutral-800">
                <BatteryCharging className="w-3.5 h-3.5 text-[#9E6B20]" />
                50Hr Li-Po Cell
              </span>
            </div>

          </div>

        </div>

        {/* Bottom subtle guidance hint */}
        <div className="text-center pt-2">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Designed in Bangalore • Acoustic Testing by Flazo Sound Lab • 1-Year Doorstep Replacement
          </span>
        </div>

      </div>
    </section>
  );
}

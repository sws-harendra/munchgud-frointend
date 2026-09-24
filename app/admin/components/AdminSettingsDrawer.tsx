"use client";

import React, { useState } from "react";
import {
  X,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Palette,
  Type,
  Layout,
  Sliders,
  Sparkles,
  Check,
  Pipette,
  CheckCircle2,
  Maximize,
  HelpCircle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  useAdminTheme,
  ThemeMode,
  SidebarStyle,
  SidebarActiveStyle,
  FontSizeScale,
  AVAILABLE_FONTS,
  SIDEBAR_COLOR_PRESETS,
  ACCENT_COLOR_PRESETS,
} from "../context/AdminThemeContext";

export default function AdminSettingsDrawer() {
  const {
    settings,
    resolvedTheme,
    isCustomizerOpen,
    closeCustomizer,
    updateSetting,
    resetToDefaults,
    activeFont,
  } = useAdminTheme();

  const [activeTab, setActiveTab] = useState<
    "theme" | "sidebar" | "typography" | "layout"
  >("theme");
  const [customColorInput, setCustomColorInput] = useState(
    settings.sidebarColor
  );
  const [customAccentInput, setCustomAccentInput] = useState(
    settings.accentColor
  );

  if (!isCustomizerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* Semi-transparent Backdrop with Blur */}
      <div
        onClick={closeCustomizer}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl flex flex-col border-l transition-transform duration-300 ${
            resolvedTheme === "dark"
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          {/* DRAWER HEADER */}
          <div
            className={`p-5 border-b flex items-center justify-between shrink-0 ${
              resolvedTheme === "dark" ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
                style={{
                  backgroundColor: `${settings.accentColor}25`,
                  color: settings.accentColor,
                }}
              >
                <SlidersHorizontal size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">
                  Admin Appearance
                </h2>
                <p className="text-xs text-slate-400">
                  Theme, Sidebar, Typography & Styles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaults}
                className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  resolvedTheme === "dark"
                    ? "hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                    : "hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                }`}
                title="Reset all settings to default"
              >
                <RotateCcw size={15} />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={closeCustomizer}
                className={`p-2 rounded-lg transition cursor-pointer ${
                  resolvedTheme === "dark"
                    ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                    : "hover:bg-slate-100 text-slate-500 hover:text-black"
                }`}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div
            className={`flex items-center border-b px-4 gap-2 text-xs font-semibold shrink-0 ${
              resolvedTheme === "dark"
                ? "border-slate-800 bg-slate-950/40"
                : "border-slate-100 bg-slate-50/70"
            }`}
          >
            <button
              onClick={() => setActiveTab("theme")}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === "theme"
                  ? "border-current font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
              style={{
                color: activeTab === "theme" ? settings.accentColor : undefined,
              }}
            >
              <Sun size={15} />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab("sidebar")}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === "sidebar"
                  ? "border-current font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
              style={{
                color:
                  activeTab === "sidebar" ? settings.accentColor : undefined,
              }}
            >
              <Palette size={15} />
              <span>Sidebar</span>
            </button>

            <button
              onClick={() => setActiveTab("typography")}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === "typography"
                  ? "border-current font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
              style={{
                color:
                  activeTab === "typography" ? settings.accentColor : undefined,
              }}
            >
              <Type size={15} />
              <span>Fonts</span>
            </button>

            <button
              onClick={() => setActiveTab("layout")}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === "layout"
                  ? "border-current font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
              style={{
                color:
                  activeTab === "layout" ? settings.accentColor : undefined,
              }}
            >
              <Sliders size={15} />
              <span>Layout</span>
            </button>
          </div>

          {/* DRAWER CONTENT (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* ======================================================== */}
            {/* TAB 1: THEME & ACCENT */}
            {/* ======================================================== */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                {/* 1. Theme Mode (Dark / Light / System) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Color Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      {
                        mode: "light" as ThemeMode,
                        label: "Light",
                        icon: Sun,
                        desc: "Clean & Bright",
                      },
                      {
                        mode: "dark" as ThemeMode,
                        label: "Dark",
                        icon: Moon,
                        desc: "Sleek Midnight",
                      },
                      {
                        mode: "system" as ThemeMode,
                        label: "System",
                        icon: Laptop,
                        desc: "Auto OS Sync",
                      },
                    ].map((item) => {
                      const isSelected = settings.themeMode === item.mode;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.mode}
                          onClick={() => updateSetting("themeMode", item.mode)}
                          className={`p-3 rounded-xl border text-center transition cursor-pointer relative flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? "border-amber-400 bg-amber-400/10 shadow-sm"
                              : resolvedTheme === "dark"
                              ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                          style={
                            isSelected
                              ? {
                                  borderColor: settings.accentColor,
                                  backgroundColor: `${settings.accentColor}15`,
                                }
                              : {}
                          }
                        >
                          <Icon
                            size={20}
                            style={{
                              color: isSelected ? settings.accentColor : undefined,
                            }}
                          />
                          <span className="text-xs font-bold block">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {item.desc}
                          </span>
                          {isSelected && (
                            <span
                              className="absolute top-2 right-2 w-2 h-2 rounded-full"
                              style={{ backgroundColor: settings.accentColor }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Brand Accent Colors */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Brand Accent Color
                    </label>
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      {settings.accentColor}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {ACCENT_COLOR_PRESETS.map((item) => {
                      const isSelected = settings.accentColor.toLowerCase() === item.hex.toLowerCase();
                      return (
                        <button
                          key={item.id}
                          onClick={() => updateSetting("accentColor", item.hex)}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-offset-slate-900 border-white/40"
                              : resolvedTheme === "dark"
                              ? "border-slate-800 hover:border-slate-700"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: item.hex }}
                          >
                            {isSelected && <Check size={14} className="text-black font-black" />}
                          </div>
                          <span className="text-[11px] font-medium text-center truncate max-w-[65px]">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Accent Color Picker */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      resolvedTheme === "dark"
                        ? "border-slate-800 bg-slate-800/30"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Pipette size={15} className="text-slate-400" />
                      <span className="text-xs font-medium">Custom Accent Picker</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customAccentInput}
                        onChange={(e) => {
                          setCustomAccentInput(e.target.value);
                          updateSetting("accentColor", e.target.value);
                        }}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customAccentInput}
                        onChange={(e) => {
                          setCustomAccentInput(e.target.value);
                          if (e.target.value.startsWith("#") && e.target.value.length === 7) {
                            updateSetting("accentColor", e.target.value);
                          }
                        }}
                        className={`w-20 text-xs font-mono px-2 py-1 rounded border uppercase text-center ${
                          resolvedTheme === "dark"
                            ? "bg-slate-900 border-slate-700 text-slate-200"
                            : "bg-white border-slate-300 text-slate-800"
                        }`}
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Live Preview Card */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Live UI Preview
                  </label>
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      resolvedTheme === "dark"
                        ? "bg-slate-950/80 border-slate-800"
                        : "bg-slate-100/90 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Accent Highlight Card</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${settings.accentColor}25`,
                          color: settings.accentColor,
                        }}
                      >
                        Active Badge
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Buttons, links, stats, and sidebar indicators automatically synchronize with this color.
                    </p>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-transform active:scale-95"
                      style={{
                        backgroundColor: settings.accentColor,
                        color: "#000000",
                      }}
                    >
                      Sample Primary Action
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: SIDEBAR COLOR & CUSTOMIZATION */}
            {/* ======================================================== */}
            {activeTab === "sidebar" && (
              <div className="space-y-6">
                {/* 1. Sidebar Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sidebar Color Presets
                    </label>
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      {settings.isSidebarGradient ? "Gradient" : settings.sidebarColor}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {SIDEBAR_COLOR_PRESETS.map((preset) => {
                      const isSelected =
                        preset.isGradient
                          ? settings.isSidebarGradient
                          : !settings.isSidebarGradient &&
                            settings.sidebarColor.toLowerCase() === preset.color.toLowerCase();

                      return (
                        <button
                          key={preset.id}
                          onClick={() => {
                            if (preset.isGradient && preset.gradient) {
                              updateSetting("isSidebarGradient", true);
                              updateSetting("sidebarGradient", preset.gradient);
                            } else {
                              updateSetting("isSidebarGradient", false);
                              updateSetting("sidebarColor", preset.color);
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer relative group flex flex-col justify-between h-20 ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-offset-slate-900 border-white/60"
                              : resolvedTheme === "dark"
                              ? "border-slate-800 hover:border-slate-700"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          style={{
                            background: preset.gradient || preset.color,
                            color: preset.textColor || "#ffffff",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold line-clamp-1">
                              {preset.name}
                            </span>
                            {isSelected && (
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: settings.accentColor }}
                              >
                                <Check size={10} className="text-black font-bold" />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-mono opacity-60">
                            {preset.isGradient ? "Gradient" : preset.color}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Custom Sidebar Color Picker */}
                <div
                  className={`p-3 rounded-xl border space-y-2.5 ${
                    resolvedTheme === "dark"
                      ? "border-slate-800 bg-slate-800/30"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <label className="text-xs font-bold block">
                    Custom Sidebar Color Picker
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColorInput}
                      onChange={(e) => {
                        setCustomColorInput(e.target.value);
                        updateSetting("isSidebarGradient", false);
                        updateSetting("sidebarColor", e.target.value);
                      }}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={customColorInput}
                        onChange={(e) => {
                          setCustomColorInput(e.target.value);
                          if (e.target.value.startsWith("#") && e.target.value.length === 7) {
                            updateSetting("isSidebarGradient", false);
                            updateSetting("sidebarColor", e.target.value);
                          }
                        }}
                        className={`w-full text-xs font-mono px-3 py-1.5 rounded-lg border uppercase ${
                          resolvedTheme === "dark"
                            ? "bg-slate-900 border-slate-700 text-slate-200"
                            : "bg-white border-slate-300 text-slate-800"
                        }`}
                        placeholder="#0f172a"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Sidebar Active Item Indicator Style */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Active Link Indicator Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "pill" as SidebarActiveStyle, label: "Rounded Pill", desc: "Full highlighted card" },
                      { id: "border" as SidebarActiveStyle, label: "Left Accent Stripe", desc: "Bold vertical line" },
                      { id: "glow" as SidebarActiveStyle, label: "Glow Outline", desc: "Border glow ring" },
                      { id: "minimal" as SidebarActiveStyle, label: "Minimal Tint", desc: "Subtle clean tint" },
                    ].map((style) => {
                      const isSelected = settings.sidebarActiveStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => updateSetting("sidebarActiveStyle", style.id)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                            isSelected
                              ? "border-amber-400 bg-amber-400/10"
                              : resolvedTheme === "dark"
                              ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                          style={
                            isSelected
                              ? {
                                  borderColor: settings.accentColor,
                                  backgroundColor: `${settings.accentColor}15`,
                                }
                              : {}
                          }
                        >
                          <span className="text-xs font-bold block">{style.label}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{style.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: TYPOGRAPHY / FONTS */}
            {/* ======================================================== */}
            {activeTab === "typography" && (
              <div className="space-y-6">
                {/* 1. Font Family Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Font Family
                    </label>
                    <span className="text-[11px] font-bold text-amber-400">
                      {activeFont.name}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {AVAILABLE_FONTS.map((font) => {
                      const isSelected = settings.fontFamilyId === font.id;
                      return (
                        <button
                          key={font.id}
                          onClick={() => updateSetting("fontFamilyId", font.id)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? "border-amber-400 bg-amber-400/10 shadow-xs"
                              : resolvedTheme === "dark"
                              ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                          style={{
                            fontFamily: font.family,
                            borderColor: isSelected ? settings.accentColor : undefined,
                            backgroundColor: isSelected ? `${settings.accentColor}15` : undefined,
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{font.name}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-sans">
                                {font.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Flazo Wireless Earbuds - Rs. 2,499 (70H Playtime)
                            </p>
                          </div>
                          {isSelected && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2"
                              style={{ backgroundColor: settings.accentColor }}
                            >
                              <Check size={12} className="text-black font-bold" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Font Size Scaling */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Font Size & Density
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "compact" as FontSizeScale, label: "Compact", scale: "92%", desc: "Dense data view" },
                      { id: "normal" as FontSizeScale, label: "Default", scale: "100%", desc: "Standard view" },
                      { id: "comfortable" as FontSizeScale, label: "Comfortable", scale: "108%", desc: "Large & relaxed" },
                    ].map((item) => {
                      const isSelected = settings.fontSizeScale === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => updateSetting("fontSizeScale", item.id)}
                          className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                            isSelected
                              ? "border-amber-400 bg-amber-400/10"
                              : resolvedTheme === "dark"
                              ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                          style={
                            isSelected
                              ? {
                                  borderColor: settings.accentColor,
                                  backgroundColor: `${settings.accentColor}15`,
                                }
                              : {}
                          }
                        >
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{item.scale}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: LAYOUT & EXTRAS */}
            {/* ======================================================== */}
            {activeTab === "layout" && (
              <div className="space-y-6">
                {/* 1. Sidebar Initial State */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    resolvedTheme === "dark"
                      ? "border-slate-800 bg-slate-800/30"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Compact Collapsed Sidebar</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Keep sidebar icon-only by default for maximum screen width
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sidebarCollapsed}
                    onChange={(e) => updateSetting("sidebarCollapsed", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-amber-500"
                  />
                </div>

                {/* 2. Glassmorphism Blurs */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    resolvedTheme === "dark"
                      ? "border-slate-800 bg-slate-800/30"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">Frosted Glass (Backdrop Blur)</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Enable translucent glass effect on TopBar & modal overlays
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.glassmorphism}
                    onChange={(e) => updateSetting("glassmorphism", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-amber-500"
                  />
                </div>

                {/* 3. Reset All Settings Action */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    resolvedTheme === "dark"
                      ? "border-rose-950/40 bg-rose-950/10 text-rose-200"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-rose-400" />
                    <span className="text-xs font-bold">Restore Factory Defaults</span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    Revert all colors, fonts, sidebar settings, and themes back to factory defaults.
                  </p>
                  <button
                    onClick={resetToDefaults}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer"
                  >
                    Reset Everything
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DRAWER FOOTER */}
          <div
            className={`p-4 border-t flex items-center justify-between text-xs shrink-0 ${
              resolvedTheme === "dark"
                ? "border-slate-800 bg-slate-950/60 text-slate-400"
                : "border-slate-100 bg-slate-50 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Auto-saved to device</span>
            </div>
            <button
              onClick={closeCustomizer}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs cursor-pointer"
              style={{ backgroundColor: settings.accentColor, color: "#000000" }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

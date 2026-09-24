"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Maximize2,
  Minimize2,
  ExternalLink,
  Clock,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useAdminTheme } from "../context/AdminThemeContext";

// Friendly path names mapper for breadcrumb
const PATH_MAP: Record<string, string> = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/dashboard/products": "Products Catalog",
  "/admin/dashboard/orders": "Orders Management",
  "/admin/dashboard/users": "User Accounts",
  "/admin/dashboard/video-management": "Video Showcase",
  "/admin/dashboard/banner-management": "Promotional Banners",
  "/admin/dashboard/hero-images": "Hero Slides",
  "/admin/dashboard/trending-images": "Trending Visuals",
  "/admin/dashboard/section-control": "Homepage Sections",
  "/admin/dashboard/category": "Categories",
  "/admin/dashboard/instagram": "Instagram Feeds",
  "/admin/dashboard/service-area": "Delivery & Service Areas",
  "/admin/dashboard/staticpages": "Content Pages",
  "/admin/dashboard/media-coverage": "Press & Media",
  "/admin/dashboard/blogs": "Blog Articles",
  "/admin/dashboard/community": "Flazo Community Hub",
  "/admin/dashboard/testimonials": "Customer Reviews",
  "/admin/dashboard/socialmedia": "Social Links",
  "/admin/dashboard/varient": "Product Variants",
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const {
    settings,
    resolvedTheme,
    updateSetting,
    openCustomizer,
    isCustomizerOpen,
    isSidebarDark,
  } = useAdminTheme();

  const [currentTime, setCurrentTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Real-time ticking clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Quick theme cycle
  const cycleTheme = () => {
    if (settings.themeMode === "light") {
      updateSetting("themeMode", "dark");
    } else if (settings.themeMode === "dark") {
      updateSetting("themeMode", "system");
    } else {
      updateSetting("themeMode", "light");
    }
  };

  const currentPageTitle = PATH_MAP[pathname] || "Admin Console";

  return (
    <header
      className={`h-16 px-4 md:px-6 flex items-center justify-between border-b shrink-0 transition-all select-none z-20 ${
        resolvedTheme === "dark"
          ? "bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md"
          : "bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md shadow-xs"
      }`}
    >
      {/* LEFT: Collapse Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          onClick={() =>
            updateSetting("sidebarCollapsed", !settings.sidebarCollapsed)
          }
          className={`p-2 rounded-xl transition cursor-pointer ${
            resolvedTheme === "dark"
              ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
          }`}
          title={settings.sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label="Toggle Sidebar"
        >
          {settings.sidebarCollapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </button>

        {/* Breadcrumb Info */}
        <div className="flex items-center gap-2 text-xs md:text-sm min-w-0">
          <span className="text-slate-400 hidden sm:inline">Admin</span>
          <ChevronRight size={14} className="text-slate-400 hidden sm:inline" />
          <span
            className="font-bold truncate max-w-[200px] md:max-w-xs"
            style={{ color: settings.accentColor }}
          >
            {currentPageTitle}
          </span>
        </div>

        {/* View Live Storefront Button */}
        <Link
          href="/"
          target="_blank"
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
            resolvedTheme === "dark"
              ? "border-slate-700/80 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
          title="Open live customer storefront in new tab"
        >
          <ExternalLink size={12} />
          <span>Live Store</span>
        </Link>
      </div>

      {/* CENTER: Live Date & Time clock */}
      <div
        className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
          resolvedTheme === "dark"
            ? "bg-slate-950/60 border-slate-800 text-slate-400"
            : "bg-slate-100/80 border-slate-200 text-slate-600"
        }`}
      >
        <Clock size={13} className="text-amber-400 animate-pulse" />
        <span>{currentTime || "Loading clock..."}</span>
      </div>

      {/* RIGHT: Quick Controls & Theme Customizer Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Theme Mode Toggle (Sun / Moon / System) */}
        <button
          onClick={cycleTheme}
          className={`p-2 rounded-xl transition cursor-pointer relative group ${
            resolvedTheme === "dark"
              ? "hover:bg-slate-800 text-slate-300 hover:text-amber-400"
              : "hover:bg-slate-100 text-slate-600 hover:text-amber-600"
          }`}
          title={`Theme: ${settings.themeMode.toUpperCase()} (Click to change)`}
          aria-label="Cycle theme mode"
        >
          {settings.themeMode === "light" && <Sun size={18} className="text-amber-500" />}
          {settings.themeMode === "dark" && <Moon size={18} className="text-indigo-400" />}
          {settings.themeMode === "system" && <Laptop size={18} className="text-cyan-400" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className={`hidden sm:flex p-2 rounded-xl transition cursor-pointer ${
            resolvedTheme === "dark"
              ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
          }`}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        {/* MAIN SETTINGS & CUSTOMIZATION TRIGGER BUTTON */}
        <button
          onClick={openCustomizer}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 cursor-pointer shadow-sm relative group overflow-hidden border ${
            isCustomizerOpen
              ? "ring-2 ring-amber-400"
              : ""
          }`}
          style={{
            borderColor: `${settings.accentColor}55`,
            backgroundColor:
              resolvedTheme === "dark" ? "rgba(15, 23, 42, 0.85)" : "#ffffff",
          }}
          title="Open Theme & Appearance Customizer"
        >
          {/* Subtle glow background */}
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: settings.accentColor }}
          />

          {/* Animated Settings Icon */}
          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="transition-transform duration-500 group-hover:rotate-90"
              style={{ color: settings.accentColor }}
            />
          </div>

          <span
            className="font-bold hidden sm:inline"
            style={{ color: settings.accentColor }}
          >
            Customize
          </span>

          {/* Small pulse beacon */}
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: settings.accentColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: settings.accentColor }}
            />
          </span>
        </button>

        {/* Admin Profile Mini Avatar */}
        <div
          className={`flex items-center gap-2 pl-2 sm:pl-3 border-l ${
            resolvedTheme === "dark" ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-xs"
            style={{
              backgroundColor: settings.accentColor,
              color: "#000000",
            }}
          >
            AD
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <p className="text-xs font-bold truncate">Admin</p>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

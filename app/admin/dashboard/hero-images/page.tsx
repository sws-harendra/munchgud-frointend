"use strict";
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchAllHeroImagesAdmin,
  toggleHeroImageStatus,
  deleteHeroImage,
  reorderHeroImages,
} from "@/app/lib/store/features/heroImageSlice";
import { HeroImageItem } from "@/app/sercices/user/heroImage.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import SidebarForm from "../../components/SidebarForm";
import HeroImageForm from "../../components/heroImageForm";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Image as ImageIcon,
  Play,
  Pause,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";

export default function AdminHeroImagesPage() {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { items, stats, status } = useAppSelector(
    (state) => state.heroImages
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const [isPreviewAutoPlaying, setIsPreviewAutoPlaying] = useState(true);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<HeroImageItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Quick zoom modal
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllHeroImagesAdmin());
  }, [dispatch]);

  // Active slides for the interactive simulator
  const activeSlides = useMemo(() => {
    return items.filter((s) => s.isActive);
  }, [items]);

  // Auto-play the simulator carousel
  useEffect(() => {
    if (!isPreviewAutoPlaying || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setPreviewSlideIdx((prev) => (prev + 1) % activeSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPreviewAutoPlaying, activeSlides.length]);

  // Filtered Items for Display Table
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (filterStatus === "active") return item.isActive;
        if (filterStatus === "inactive") return !item.isActive;
        return true;
      })
      .filter((item) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.link?.toLowerCase().includes(q)
        );
      });
  }, [items, filterStatus, searchTerm]);

  const handleToggleStatus = async (item: HeroImageItem) => {
    try {
      await dispatch(toggleHeroImageStatus(item.id)).unwrap();
      toast.success(
        `Slide #${item.displayOrder} is now ${
          item.isActive ? "Hidden" : "Live in Carousel"
        }!`
      );
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id: number, title?: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this hero slide${
          title ? ` ("${title}")` : ""
        }?`
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteHeroImage(id)).unwrap();
      toast.success("Hero slide deleted successfully.");
    } catch {
      toast.error("Failed to delete slide.");
    }
  };

  const handleMoveOrder = async (item: HeroImageItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];

    const payload = [
      { id: item.id, displayOrder: targetItem.displayOrder },
      { id: targetItem.id, displayOrder: item.displayOrder },
    ];

    try {
      await dispatch(reorderHeroImages(payload)).unwrap();
      toast.success("Slide order updated!");
    } catch {
      toast.error("Failed to reorder slides.");
    }
  };

  const handleEditClick = (item: HeroImageItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setEditingItem(null);
    setIsEditOpen(false);
    dispatch(fetchAllHeroImagesAdmin());
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-200 ${
      isDarkMode ? "bg-black text-zinc-100" : "bg-slate-50/60 text-slate-800"
    }`}>
      {/* 1. Header Section */}
      <div className={`rounded-3xl p-6 border flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white shadow-xl shadow-black/60"
          : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
      }`}>
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-amber-500/25">
              <ImageIcon className="w-6 h-6 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Hero Section Images
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Slider Studio
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                Dynamic sliding carousel banners displayed on the homepage hero section
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => dispatch(fetchAllHeroImagesAdmin())}
            title="Refresh Data"
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white"
            }`}
          >
            <RefreshCw
              size={18}
              className={status === "loading" ? "animate-spin" : ""}
            />
          </button>

          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
              showLivePreview
                ? isDarkMode
                  ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                  : "bg-amber-50 border-amber-300 text-amber-900 shadow-sm"
                : isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Eye size={16} className={showLivePreview ? "text-amber-400" : ""} />
            {showLivePreview ? "Hide Live Simulator" : "Show Live Simulator"}
          </button>

          {/* Add Slide Trigger */}
          <SidebarForm
            title="Upload Hero Slide Banner"
            trigger={
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer">
                <Plus size={18} />
                <span>Add Hero Image</span>
              </button>
            }
          >
            <HeroImageForm
              onSuccess={() => {
                dispatch(fetchAllHeroImagesAdmin());
              }}
            />
          </SidebarForm>
        </div>
      </div>

      {/* 2. Interactive Live Store Slider Simulation Card */}
      {showLivePreview && activeSlides.length > 0 && (
        <div className={`rounded-3xl p-6 border shadow-2xl relative overflow-hidden transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-neutral-950 border-neutral-800 text-white"
        }`}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Live Store Hero Simulator
              </span>
              <span className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-neutral-400"}`}>
                ({activeSlides.length} active slides rotating on homepage)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewAutoPlaying(!isPreviewAutoPlaying)}
                className={`p-1.5 rounded-xl text-xs flex items-center gap-1.5 px-3 transition cursor-pointer border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {isPreviewAutoPlaying ? (
                  <>
                    <Pause size={12} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Auto-Rotate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actual Simulator Slider Frame */}
          <div className="relative aspect-[16/7] md:aspect-[21/8] w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-black">
            {activeSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  previewSlideIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={getImageUrl(slide.imageUrl)}
                  alt={slide.title || "Banner"}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-xl z-20">
                  <span className="text-amber-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-1">
                    Slide #{slide.displayOrder} • Priority Active
                  </span>
                  <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-serif font-black leading-tight drop-shadow-md">
                    {slide.title || "Flagship Acoustic Series"}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-neutral-300 text-xs sm:text-sm drop-shadow line-clamp-1 mt-1">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.link && (
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold shadow hover:bg-amber-300 transition w-fit"
                    >
                      {slide.ctaText || "Explore"}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Controls */}
            <button
              onClick={() =>
                setPreviewSlideIdx((prev) =>
                  prev === 0 ? activeSlides.length - 1 : prev - 1
                )
              }
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setPreviewSlideIdx((prev) => (prev + 1) % activeSlides.length)
              }
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPreviewSlideIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    previewSlideIdx === i
                      ? "w-6 bg-amber-400 shadow-sm shadow-amber-400/50"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. KPI Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Slides */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
              Total Hero Images
            </p>
            <p className={`text-3xl font-extrabold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {stats.total || items.length}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Managed assets in DB</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isDarkMode ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-indigo-50 text-indigo-600"
          }`}>
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Active Slides */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Live in Carousel
            </p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">
              {stats.active}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Visible on homepage</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Inactive Drafts */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Inactive / Drafts
            </p>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">
              {stats.inactive}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Paused from homepage</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* With Links */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Linked Slides
            </p>
            <p className={`text-3xl font-extrabold mt-1 ${isDarkMode ? "text-purple-400" : "text-purple-700"}`}>
              {items.filter((i) => i.link).length}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Interactive clickable</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <ExternalLink className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. Controls, Search & Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl p-4 border transition-colors ${
        isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-200/80 shadow-sm"
      }`}>
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search slides by title, subtitle, or link..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition ${
              isDarkMode
                ? "bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
                : "bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>

        {/* Status Filters */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-gray-100 border-gray-200"
        }`}>
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === "all"
                ? isDarkMode ? "bg-amber-400 text-zinc-950 shadow-sm" : "bg-white text-gray-900 shadow-sm"
                : isDarkMode ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === "active"
                ? "bg-emerald-600 text-white shadow-sm"
                : isDarkMode ? "text-zinc-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-700"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilterStatus("inactive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === "inactive"
                ? isDarkMode ? "bg-zinc-800 text-white shadow-sm" : "bg-amber-600 text-white shadow-sm"
                : isDarkMode ? "text-zinc-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-700"
            }`}
          >
            Drafts ({stats.inactive})
          </button>
        </div>
      </div>

      {/* 5. Hero Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === filteredItems.length - 1;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
                isDarkMode
                  ? item.isActive
                    ? "bg-zinc-950 border-zinc-800 shadow-lg shadow-black/40 hover:border-amber-400/40"
                    : "border-dashed border-zinc-800 bg-zinc-950/60 opacity-80"
                  : item.isActive
                  ? "bg-white border-slate-200/90 shadow-sm"
                  : "border-dashed border-gray-300 bg-gray-50/50 opacity-80"
              }`}
            >
              <div>
                {/* Image Banner Header with Badges */}
                <div className="relative aspect-[16/8] overflow-hidden bg-neutral-950 group">
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.title || "Slide Image"}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-amber-400/40 text-xs font-bold font-mono">
                      #{item.displayOrder}
                    </span>
                    {item.isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800/90 backdrop-blur-md text-zinc-300 text-[11px] font-semibold">
                        Draft Hidden
                      </span>
                    )}
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={() => setZoomImageUrl(getImageUrl(item.imageUrl))}
                    title="Zoom Banner"
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Eye size={14} />
                  </button>

                  {/* CTA Tag */}
                  {item.ctaText && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-zinc-950 text-[11px] font-black">
                        CTA: {item.ctaText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2.5 text-left">
                  <h3 className={`font-bold text-base line-clamp-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {item.title || "Untitled Hero Slide"}
                  </h3>
                  {item.subtitle && (
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                      {item.subtitle}
                    </p>
                  )}

                  {/* Destination Link */}
                  {item.link && (
                    <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-mono truncate border ${
                      isDarkMode
                        ? "bg-zinc-900/80 border-zinc-800 text-amber-400"
                        : "bg-indigo-50/70 border-indigo-100 text-indigo-600"
                    }`}>
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{item.link}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className={`p-5 pt-0 border-t mt-2 space-y-3 ${
                isDarkMode ? "border-zinc-800/80" : "border-gray-100"
              }`}>
                <div className="flex items-center justify-between pt-3">
                  {/* Live Visibility Switch */}
                  <div
                    onClick={() => handleToggleStatus(item)}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-300 ${
                        item.isActive ? "bg-emerald-500" : isDarkMode ? "bg-zinc-800" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                          item.isActive ? "translate-x-4" : ""
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      isDarkMode ? "text-zinc-400 group-hover:text-white" : "text-gray-600 group-hover:text-gray-900"
                    }`}>
                      {item.isActive ? "Live" : "Paused"}
                    </span>
                  </div>

                  {/* Reorder Up / Down buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(item, "up")}
                      disabled={isFirst}
                      title="Move slide earlier in rotation"
                      className={`p-1.5 rounded-lg border transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                        isDarkMode
                          ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(item, "down")}
                      disabled={isLast}
                      title="Move slide later in rotation"
                      className={`p-1.5 rounded-lg border transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                        isDarkMode
                          ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                        : "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100"
                    }`}
                  >
                    <Edit size={13} />
                    Edit Details
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className={`flex items-center justify-center p-2 rounded-xl transition cursor-pointer border ${
                      isDarkMode
                        ? "bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-950/40"
                        : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                    }`}
                    title="Delete slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Empty State */}
      {filteredItems.length === 0 && status !== "loading" && (
        <div className={`rounded-3xl p-12 text-center border border-dashed max-w-lg mx-auto ${
          isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-300"
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No Hero Slide Images Found
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
            {searchTerm
              ? `No slides match "${searchTerm}". Try resetting your search filter.`
              : "Upload your first high-resolution hero banner to power the homepage sliding showcase."}
          </p>
          <SidebarForm
            title="Upload Hero Slide Banner"
            trigger={
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold shadow text-sm cursor-pointer">
                <Plus size={16} />
                <span>Upload Hero Banner Image</span>
              </button>
            }
          >
            <HeroImageForm
              onSuccess={() => dispatch(fetchAllHeroImagesAdmin())}
            />
          </SidebarForm>
        </div>
      )}

      {/* 7. Edit Drawer Sidebar */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsEditOpen(false)}
          />
          <div className={`ml-auto w-full sm:w-[680px] lg:w-[780px] h-full shadow-2xl flex flex-col z-10 animate-slide-in border-l transition-colors ${
            isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}>
            {/* Header */}
            <div className={`flex justify-between items-center px-6 py-4 border-b ${
              isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-neutral-900 text-white border-gray-100"
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                <h2 className="text-base font-bold">Edit Hero Slide Asset</h2>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  isDarkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-900" : "text-gray-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <div className={`flex-1 overflow-y-auto p-6 ${isDarkMode ? "bg-black" : "bg-white"}`}>
              <HeroImageForm
                editingItem={editingItem}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomImageUrl(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setZoomImageUrl(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1 text-sm cursor-pointer"
            >
              <X size={18} /> Close
            </button>
            <img
              src={zoomImageUrl}
              alt="Zoomed Banner"
              className="w-full h-auto rounded-2xl shadow-2xl object-contain border border-zinc-800"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.25s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

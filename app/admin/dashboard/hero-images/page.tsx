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

export default function AdminHeroImagesPage() {
  const dispatch = useAppDispatch();
  const { items, stats, status } = useAppSelector(
    (state) => state.heroImages
  );

  const [editingItem, setEditingItem] = useState<HeroImageItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const [isPreviewAutoPlaying, setIsPreviewAutoPlaying] = useState(true);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllHeroImagesAdmin());
  }, [dispatch]);

  // Active slides for the live simulator preview
  const activeSlides = useMemo(() => {
    return items.filter((item) => item.isActive);
  }, [items]);

  // Auto-play the live simulation
  useEffect(() => {
    if (!isPreviewAutoPlaying || activeSlides.length === 0) return;
    const interval = setInterval(() => {
      setPreviewSlideIdx((prev) => (prev + 1) % activeSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPreviewAutoPlaying, activeSlides.length]);

  // Keep preview index bounded
  useEffect(() => {
    if (previewSlideIdx >= activeSlides.length && activeSlides.length > 0) {
      setPreviewSlideIdx(0);
    }
  }, [activeSlides.length, previewSlideIdx]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.subtitle &&
          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.link &&
          item.link.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
          ? item.isActive
          : !item.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, filterStatus]);

  // Handle Quick Status Toggle
  const handleToggleStatus = async (item: HeroImageItem) => {
    try {
      await dispatch(toggleHeroImageStatus(item.id)).unwrap();
      toast.success(
        `Slide #${item.displayOrder} is now ${
          !item.isActive ? "Visible (Active)" : "Hidden (Draft)"
        }`
      );
    } catch {
      toast.error("Failed to update slide status.");
    }
  };

  // Handle Delete
  const handleDelete = (id: number, title?: string | null) => {
    if (
      confirm(
        `Are you sure you want to delete this hero slide "${
          title || "Hero Slide"
        }"? This cannot be undone.`
      )
    ) {
      dispatch(deleteHeroImage(id))
        .unwrap()
        .then(() => toast.success("Hero slide deleted successfully"))
        .catch(() => toast.error("Failed to delete slide"));
    }
  };

  // Handle Reorder Up / Down
  const handleMoveOrder = async (item: HeroImageItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];

    // Swap their displayOrder
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
  };

  return (
    <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Hero Section Images
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Dynamic sliding carousel banners displayed on the homepage hero
                section
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => dispatch(fetchAllHeroImagesAdmin())}
            title="Refresh Data"
            className="p-3 rounded-2xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <RefreshCw
              size={18}
              className={status === "loading" ? "animate-spin" : ""}
            />
          </button>

          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
              showLivePreview
                ? "bg-amber-50 border-amber-300 text-amber-900 shadow-sm"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Eye size={16} className={showLivePreview ? "text-amber-600" : ""} />
            {showLivePreview ? "Hide Live Simulator" : "Show Live Simulator"}
          </button>

          {/* Add Slide Trigger */}
          <SidebarForm
            title="Upload Hero Slide Banner"
            trigger={
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950 to-neutral-900 text-amber-400 border border-amber-400/40 hover:border-amber-400 font-semibold shadow-lg shadow-amber-500/15 hover:shadow-amber-500/30 transition-all text-sm cursor-pointer">
                <Plus size={18} />
                Add Hero Image
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
        <div className="bg-neutral-950 rounded-3xl p-6 border border-neutral-800 text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Live Store Hero Simulator
              </span>
              <span className="text-xs text-neutral-400">
                ({activeSlides.length} active slides rotating on homepage)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewAutoPlaying(!isPreviewAutoPlaying)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs flex items-center gap-1.5 px-2.5 transition cursor-pointer"
              >
                {isPreviewAutoPlaying ? (
                  <>
                    <Pause size={12} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Auto Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panoramic Screen Simulator */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[21/9] bg-neutral-900 border border-neutral-800 shadow-inner group">
            {activeSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  previewSlideIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={getImageUrl(slide.imageUrl)}
                  alt={slide.altText || slide.title || "Slide"}
                  className="w-full h-full object-cover object-center"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/30 pointer-events-none" />

                {/* Slide Details Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-20">
                  <div className="max-w-xl">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 text-xs font-medium mb-1.5 border border-amber-400/30">
                      Slide #{slide.displayOrder}
                    </span>
                    {slide.title && (
                      <h3 className="text-white text-base sm:text-xl font-bold drop-shadow-md line-clamp-1">
                        {slide.title}
                      </h3>
                    )}
                    {slide.subtitle && (
                      <p className="text-neutral-300 text-xs sm:text-sm drop-shadow line-clamp-1 mt-0.5">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>

                  {slide.link && (
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold shadow hover:bg-amber-300 transition"
                    >
                      {slide.ctaText || "Explore"}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Previous / Next Simulation controls */}
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

            {/* Bottom Indicator Dots */}
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
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Hero Images
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              {stats.total || items.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Managed assets in DB</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Active Slides */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Live in Carousel
            </p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">
              {stats.active}
            </p>
            <p className="text-xs text-gray-400 mt-1">Visible on homepage</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Inactive Drafts */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Inactive / Drafts
            </p>
            <p className="text-3xl font-extrabold text-amber-700 mt-1">
              {stats.inactive}
            </p>
            <p className="text-xs text-gray-400 mt-1">Paused from homepage</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* With Links */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Linked Slides
            </p>
            <p className="text-3xl font-extrabold text-purple-700 mt-1">
              {items.filter((i) => i.link).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Interactive clickable</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ExternalLink className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. Controls, Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search slides by title, subtitle, or link..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-gray-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === "active"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-emerald-700"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilterStatus("inactive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === "inactive"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-gray-600 hover:text-amber-700"
            }`}
          >
            Drafts ({stats.inactive})
          </button>
        </div>
      </div>

      {/* 5. Loading State */}
      {status === "loading" && items.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-5 border border-gray-200 animate-pulse space-y-4"
            >
              <div className="w-full aspect-[16/8] bg-gray-200 rounded-2xl" />
              <div className="h-5 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* 6. Hero Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === filteredItems.length - 1;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
                item.isActive
                  ? "border-slate-200/90 shadow-sm"
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

                  {/* Gradient shadow on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-bold font-mono">
                      #{item.displayOrder}
                    </span>
                    {item.isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-semibold">
                        Draft Hidden
                      </span>
                    )}
                  </div>

                  {/* Top Right Quick Zoom Button */}
                  <button
                    onClick={() => setZoomImageUrl(getImageUrl(item.imageUrl))}
                    title="Zoom Banner"
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Eye size={14} />
                  </button>

                  {/* Bottom Image Sub-info */}
                  {item.ctaText && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold">
                        CTA: {item.ctaText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                      {item.title || "Untitled Hero Slide"}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Destination Link */}
                  {item.link && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50/70 px-3 py-1.5 rounded-xl font-mono truncate">
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{item.link}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-gray-100 mt-2 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  {/* Live Visibility Switch */}
                  <div
                    onClick={() => handleToggleStatus(item)}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-300 ${
                        item.isActive ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                          item.isActive ? "translate-x-4" : ""
                        }`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                      {item.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  {/* Reorder Up / Down buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(item, "up")}
                      disabled={isFirst}
                      title="Move slide earlier in rotation"
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(item, "down")}
                      disabled={isLast}
                      title="Move slide later in rotation"
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition cursor-pointer"
                  >
                    <Edit size={13} />
                    Edit Details
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
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

      {/* 7. Empty State */}
      {filteredItems.length === 0 && status !== "loading" && (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Hero Slide Images Found
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchTerm
              ? `No slides match "${searchTerm}". Try resetting your search filter.`
              : "Upload your first high-resolution hero banner to power the homepage sliding showcase."}
          </p>
          <SidebarForm
            title="Upload Hero Slide Banner"
            trigger={
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 text-amber-400 border border-amber-400 font-semibold shadow text-sm cursor-pointer">
                <Plus size={16} />
                Upload Hero Banner Image
              </button>
            }
          >
            <HeroImageForm
              onSuccess={() => dispatch(fetchAllHeroImagesAdmin())}
            />
          </SidebarForm>
        </div>
      )}

      {/* 8. Edit Drawer Sidebar (Manual controlled modal) */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="ml-auto w-full sm:w-[580px] h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-neutral-900 text-white">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold">Edit Hero Slide Asset</h2>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <HeroImageForm
                editingItem={editingItem}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. Zoom Modal */}
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
              className="w-full h-auto rounded-2xl shadow-2xl object-contain border border-white/10"
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

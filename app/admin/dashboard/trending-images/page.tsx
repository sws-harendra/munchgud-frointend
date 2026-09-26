"use strict";
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchAllTrendingImagesAdmin,
  toggleTrendingImageStatus,
  deleteTrendingImage,
  reorderTrendingImages,
} from "@/app/lib/store/features/trendingImageSlice";
import { TrendingImageItem } from "@/app/sercices/user/trendingImage.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import SidebarForm from "../../components/SidebarForm";
import TrendingImageForm from "../../components/trendingImageForm";
import {
  Flame,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
  Layers,
  Search,
  ShoppingCart,
  Star,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  Tag,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";

export default function AdminTrendingImagesPage() {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { items, status, error } = useAppSelector(
    (state) => state.trendingImages
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [editingItem, setEditingItem] = useState<TrendingImageItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  useEffect(() => {
    dispatch(fetchAllTrendingImagesAdmin());
  }, [dispatch]);

  // Handle active vs inactive count
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((item) => item.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [items]);

  // Filtered Items for Display
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (filterMode === "active") return item.isActive;
        if (filterMode === "inactive") return !item.isActive;
        return true;
      })
      .filter((item) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          item.name?.toLowerCase().includes(q) ||
          item.badge?.toLowerCase().includes(q) ||
          item.featureBar?.toLowerCase().includes(q)
        );
      });
  }, [items, filterMode, searchTerm]);

  // Active items for simulator
  const activeItems = useMemo(() => {
    return items.filter((item) => item.isActive);
  }, [items]);

  const handleToggleStatus = async (id: number) => {
    try {
      await dispatch(toggleTrendingImageStatus(id)).unwrap();
      toast.success("Status updated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await dispatch(deleteTrendingImage(id)).unwrap();
      toast.success("Card deleted successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete card");
    }
  };

  const handleMoveOrder = async (item: TrendingImageItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];
    try {
      await dispatch(
        reorderTrendingImages([
          { id: item.id, displayOrder: targetItem.displayOrder },
          { id: targetItem.id, displayOrder: item.displayOrder },
        ])
      ).unwrap();
      toast.success("Order rearranged!");
    } catch (e: any) {
      toast.error("Failed to rearrange order");
    }
  };

  const handleEditClick = (item: TrendingImageItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    dispatch(fetchAllTrendingImagesAdmin());
  };

  const parseColors = (colorsStr?: string): string[] => {
    if (!colorsStr) return ["#FFFFFF", "#D4AF37"];
    try {
      const parsed = JSON.parse(colorsStr);
      return Array.isArray(parsed) ? parsed : [colorsStr];
    } catch {
      return ["#FFFFFF", "#D4AF37"];
    }
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/25">
              <Flame className="w-6 h-6 fill-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Trending Bestsellers Section
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Homepage Sync
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                Every card on the homepage "Trending Bestsellers" section is dynamically managed from here
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => dispatch(fetchAllTrendingImagesAdmin())}
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
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition cursor-pointer ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Eye size={16} />
            <span>{showLivePreview ? "Hide Simulator" : "Show Simulator"}</span>
          </button>

          {/* Add New Trending Card Trigger */}
          <SidebarForm
            title="Add New Trending Bestseller Card"
            trigger={
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer">
                <Plus size={18} />
                <span>Add Trending Card</span>
              </button>
            }
          >
            <TrendingImageForm
              onSuccess={() => {
                dispatch(fetchAllTrendingImagesAdmin());
              }}
            />
          </SidebarForm>
        </div>
      </div>

      {/* 2. KPI Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active on Storefront */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Live on Storefront
            </p>
            <p className="text-3xl font-extrabold mt-1 text-emerald-400">
              {stats.active}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Visible to buyers</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Cards */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Total Cards
            </p>
            <p className="text-3xl font-extrabold mt-1 text-amber-400">
              {stats.total}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>In management list</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
        </div>

        {/* Inactive / Drafts */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
              Drafts / Inactive
            </p>
            <p className={`text-3xl font-extrabold mt-1 ${isDarkMode ? "text-zinc-300" : "text-gray-700"}`}>
              {stats.inactive}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Hidden from storefront</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isDarkMode ? "bg-zinc-900 text-zinc-400 border border-zinc-800" : "bg-gray-100 text-gray-600"
          }`}>
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Storefront Link */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200/80 text-gray-900"
        }`}>
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Storefront Preview
            </p>
            <p className={`text-sm font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Trending Bestsellers
            </p>
            <a
              href="/#bestsellers"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline mt-1 font-semibold"
            >
              <span>View Live Website</span>
              <ExternalLink size={12} />
            </a>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <ExternalLink className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Interactive Storefront Simulator Strip */}
      {showLivePreview && (
        <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border-amber-500/30 text-white"
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={16} className="fill-amber-400" />
                Live Storefront Section Simulator
              </h2>
            </div>
            <span className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-neutral-400"}`}>
              Showing {activeItems.length} active items as they appear on the homepage
            </span>
          </div>

          {activeItems.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No active cards to preview. Activate at least one card below.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
              {activeItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-neutral-200 text-neutral-950 flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-neutral-50 flex items-center justify-center p-2.5">
                    <span
                      className={`absolute top-2 left-2 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm shadow-xs ${item.badgeBg}`}
                    >
                      {item.badge}
                    </span>
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-full h-full object-contain max-h-[100px]"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-2 py-0.5 flex items-center justify-between text-neutral-950 font-bold text-[9px]">
                    <span className="truncate pr-1">{item.featureBar}</span>
                    <span className="flex items-center gap-0.5 bg-white/90 px-1 py-0.2 rounded-sm text-[8px] font-black">
                      <Star className="w-2 h-2 fill-amber-500 text-amber-500" />
                      {item.rating}
                    </span>
                  </div>

                  <div className="p-2 space-y-1 bg-white text-left">
                    <h4 className="font-extrabold text-[11px] text-neutral-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-black text-neutral-950">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[9px] text-neutral-400 line-through">
                          ₹{item.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Search & Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl p-4 border transition-colors ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800"
          : "bg-white border-slate-200/80 shadow-sm"
      }`}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cards by name, badge, or feature..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition ${
              isDarkMode
                ? "bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
                : "bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-gray-100 border-gray-200"
        }`}>
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === "all"
                ? isDarkMode ? "bg-amber-400 text-zinc-950 shadow-sm" : "bg-white text-gray-900 shadow-sm"
                : isDarkMode ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterMode("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === "active"
                ? "bg-emerald-600 text-white shadow-sm"
                : isDarkMode ? "text-zinc-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-700"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilterMode("inactive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterMode === "inactive"
                ? isDarkMode ? "bg-zinc-800 text-white shadow-sm" : "bg-gray-800 text-white shadow-sm"
                : isDarkMode ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Inactive ({stats.inactive})
          </button>
        </div>
      </div>

      {/* 5. Trending Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => {
          const colorList = parseColors(item.colors);

          return (
            <div
              key={item.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800 shadow-lg shadow-black/40 hover:border-amber-400/40"
                  : "bg-white border-slate-200/90 shadow-sm hover:shadow-xl"
              }`}
            >
              <div>
                {/* Product Card Top Image & Badges */}
                <div className={`relative aspect-square flex items-center justify-center p-4 overflow-hidden border-b ${
                  isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-neutral-50 border-gray-100"
                }`}>
                  {/* Badge */}
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs z-10 ${item.badgeBg}`}
                  >
                    {item.badge}
                  </span>

                  {/* Active Indicator */}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold z-10 flex items-center gap-1 ${
                      item.isActive
                        ? isDarkMode
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : isDarkMode
                        ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        : "bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isActive ? "bg-emerald-400" : "bg-zinc-400"
                      }`}
                    />
                    {item.isActive ? "Active" : "Hidden"}
                  </span>

                  {/* Product Image */}
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-contain max-h-[160px] drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Feature Bar */}
                <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-3 py-1.5 flex items-center justify-between text-neutral-950 font-bold text-xs">
                  <span className="truncate pr-1">{item.featureBar}</span>
                  <span className="flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-sm text-[10px] font-black">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    {item.rating}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 text-left">
                  <h3 className={`font-extrabold text-sm line-clamp-2 leading-snug ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {item.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className={`text-lg font-black ${isDarkMode ? "text-amber-400" : "text-gray-900"}`}>
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    {item.originalPrice && (
                      <span className={`text-xs line-through ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                        ₹{item.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Discount & Colors */}
                  <div className={`flex items-center justify-between pt-1 border-t ${
                    isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                  }`}>
                    <span className="text-xs font-bold text-emerald-400">
                      {item.discount || "Best Deal"}
                    </span>
                    <div className="flex items-center -space-x-1">
                      {colorList.map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-black/30 shadow-2xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className={`p-4 pt-0 border-t mt-2 space-y-2 ${
                isDarkMode ? "border-zinc-800/80" : "border-gray-100"
              }`}>
                <div className="flex items-center justify-between pt-2">
                  {/* Status Toggle Switch */}
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition cursor-pointer ${
                      item.isActive
                        ? isDarkMode
                          ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/60 hover:bg-emerald-950/60"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : isDarkMode
                        ? "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.isActive ? "● Turn Off" : "○ Turn On"}
                  </button>

                  {/* Move Up / Down */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(item, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                      className={`p-1.5 rounded-lg border transition disabled:opacity-30 cursor-pointer ${
                        isDarkMode
                          ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(item, "down")}
                      disabled={idx === filteredItems.length - 1}
                      title="Move Down"
                      className={`p-1.5 rounded-lg border transition disabled:opacity-30 cursor-pointer ${
                        isDarkMode
                          ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleEditClick(item)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isDarkMode
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isDarkMode
                        ? "bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/40"
                        : "bg-red-50 hover:bg-red-100 text-red-600"
                    }`}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Empty State */}
      {filteredItems.length === 0 && (
        <div className={`rounded-3xl p-12 text-center border border-dashed max-w-lg mx-auto ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800"
            : "bg-white border-gray-300"
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Flame className="w-8 h-8 fill-amber-400" />
          </div>
          <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No Trending Cards Found
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
            Click the "Add Trending Card" button above to upload a new bestseller card.
          </p>
        </div>
      )}

      {/* 7. Edit Item Drawer / Modal */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
          <div className={`w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l transition-colors ${
            isDarkMode
              ? "bg-black border-zinc-800 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}>
            <div>
              <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
                isDarkMode ? "border-zinc-800" : "border-gray-100"
              }`}>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Edit Trending Card
                  </h2>
                  <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                    Updating card #{editingItem.id} ({editingItem.name})
                  </p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <TrendingImageForm
                editingItem={editingItem}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

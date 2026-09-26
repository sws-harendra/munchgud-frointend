"use strict";
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  createTrendingImage,
  updateTrendingImage,
} from "@/app/lib/store/features/trendingImageSlice";
import { TrendingImageItem } from "@/app/sercices/user/trendingImage.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  UploadCloud,
  X,
  Flame,
  Star,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  DollarSign,
  Plus,
  Palette,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/app/types/product.types";
import { useAdminTheme } from "../context/AdminThemeContext";

interface TrendingImageFormProps {
  editingItem?: TrendingImageItem | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const BADGE_PRESETS = [
  "🔥 Bestseller",
  "✨ Engraving Available",
  "🚀 New Launch",
  "⚡ 35ms Beast™",
  "🎁 Free Spotify",
  "🌟 Top Rated",
  "💎 Signature Gold",
];

const BADGE_BG_PRESETS = [
  { label: "Dark Black", class: "bg-neutral-950 text-white" },
  { label: "Signature Gold", class: "bg-amber-950 text-amber-300" },
  { label: "Yellow Flash", class: "bg-neutral-900 text-yellow-300" },
  { label: "Crimson Red", class: "bg-red-600 text-white" },
  { label: "Amber Glow", class: "bg-amber-900 text-amber-300" },
];

export default function TrendingImageForm({
  editingItem,
  onSuccess,
  onCancel,
}: TrendingImageFormProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  // Catalog products for optional quick auto-fill
  const { products } = useAppSelector((state) => state.product);
  const catalogProducts: Product[] = React.useMemo(() => {
    if (Array.isArray(products)) return products;
    if (products && Array.isArray((products as any).products)) return (products as any).products;
    if (products && Array.isArray((products as any).data)) return (products as any).data;
    return [];
  }, [products]);

  const [name, setName] = useState("");
  const [badge, setBadge] = useState("🔥 Bestseller");
  const [badgeBg, setBadgeBg] = useState("bg-neutral-950 text-white");
  const [featureBar, setFeatureBar] = useState("120 Hours Playback");
  const [rating, setRating] = useState<number>(4.9);
  const [price, setPrice] = useState<number | string>(2399);
  const [originalPrice, setOriginalPrice] = useState<number | string>(9990);
  const [discount, setDiscount] = useState("76% off");
  const [colors, setColors] = useState<string[]>(["#FFFFFF", "#D4AF37", "#1A1A1A"]);
  const [newColorHex, setNewColorHex] = useState("#D4AF37");
  const [link, setLink] = useState("#bestsellers");
  const [productId, setProductId] = useState<number | null>(null);
  const [displayOrder, setDisplayOrder] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setBadge(editingItem.badge || "🔥 Bestseller");
      setBadgeBg(editingItem.badgeBg || "bg-neutral-950 text-white");
      setFeatureBar(editingItem.featureBar || "");
      setRating(editingItem.rating || 4.9);
      setPrice(editingItem.price || 0);
      setOriginalPrice(editingItem.originalPrice || 0);
      setDiscount(editingItem.discount || "");
      setLink(editingItem.link || "#bestsellers");
      setProductId(editingItem.productId || null);
      setDisplayOrder(editingItem.displayOrder ?? 1);
      setIsActive(editingItem.isActive ?? true);
      setPreviewUrl(getImageUrl(editingItem.imageUrl));

      try {
        const parsed = JSON.parse(editingItem.colors);
        if (Array.isArray(parsed)) setColors(parsed);
      } catch {
        setColors(["#FFFFFF", "#D4AF37", "#1A1A1A"]);
      }
    } else {
      setName("");
      setBadge("🔥 Bestseller");
      setBadgeBg("bg-neutral-950 text-white");
      setFeatureBar("120 Hours Playback");
      setRating(4.9);
      setPrice(1999);
      setOriginalPrice(4999);
      setDiscount("60% off");
      setColors(["#FFFFFF", "#D4AF37", "#1A1A1A"]);
      setLink("#bestsellers");
      setProductId(null);
      setDisplayOrder(1);
      setIsActive(true);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [editingItem]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updatePriceAndDiscount = (newP: number, newOrig: number) => {
    setPrice(newP);
    setOriginalPrice(newOrig);
    if (newOrig > newP && newOrig > 0) {
      const pct = Math.round(((newOrig - newP) / newOrig) * 100);
      setDiscount(`${pct}% off`);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB.");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSelectCatalogProduct = (pId: string) => {
    if (!pId) {
      setProductId(null);
      return;
    }
    const found = catalogProducts.find((p) => String(p.id) === pId);
    if (found) {
      setProductId(found.id);
      setName(found.name);
      const pr = Number(found.discountPrice || found.originalPrice || 1999);
      const orig = Number(found.originalPrice || pr);
      updatePriceAndDiscount(pr, orig);
      setLink(`/products/${found.id}`);
      if (found.images && found.images[0]) {
        setPreviewUrl(getImageUrl(found.images[0]));
      }
    }
  };

  const handleAddColor = () => {
    if (!colors.includes(newColorHex)) {
      setColors([...colors, newColorHex]);
    }
  };

  const handleRemoveColor = (hex: string) => {
    setColors(colors.filter((c) => c !== hex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a card title/product name.");
      return;
    }

    if (!selectedFile && !editingItem) {
      toast.error("Please upload a showcase image for this card.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("badge", badge);
      formData.append("badgeBg", badgeBg);
      formData.append("featureBar", featureBar);
      formData.append("rating", String(rating));
      formData.append("price", String(price));
      formData.append("originalPrice", String(originalPrice));
      formData.append("discount", discount);
      formData.append("colors", JSON.stringify(colors));
      formData.append("link", link);
      if (productId) formData.append("productId", String(productId));
      formData.append("displayOrder", String(displayOrder));
      formData.append("isActive", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editingItem) {
        await dispatch(
          updateTrendingImage({ id: editingItem.id, data: formData })
        ).unwrap();
        toast.success("✅ Trending card updated successfully!");
      } else {
        await dispatch(createTrendingImage(formData)).unwrap();
        toast.success("✅ Trending card added to homepage showcase!");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(`❌ Failed: ${error?.message || error || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* 1. Live Real-time Card Simulator */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 shadow-xl shadow-black/60"
          : "bg-slate-900 border-slate-800 text-white shadow-lg"
      }`}>
        <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span className="flex items-center gap-1.5">
            <Eye size={14} />
            Live Card Preview
          </span>
          <span className="text-[10px] text-zinc-500 font-normal">
            Updates in real-time
          </span>
        </div>

        {/* Center Card */}
        <div className="mx-auto w-[220px] rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-white flex flex-col">
          {/* Card Top Area with Badge & Image */}
          <div className="relative aspect-[4/4.5] bg-[#F7F6F3] p-3 flex flex-col justify-between items-center overflow-hidden">
            {/* Top Ribbon */}
            <div className="w-full flex items-center justify-between z-10">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${badgeBg}`}
              >
                {badge}
              </span>
            </div>

            {/* Product Image */}
            <div className="relative w-full h-full flex items-center justify-center p-2">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={name || "Preview"}
                  className="max-h-[120px] max-w-[140px] object-contain drop-shadow-md transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400 gap-1">
                  <UploadCloud size={32} className="stroke-[1.5]" />
                  <span className="text-[10px] font-medium">No Image</span>
                </div>
              )}
            </div>

            {/* Yellow Feature Bar */}
            {featureBar && (
              <div className="w-[calc(100%+1.5rem)] -mx-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black px-2.5 py-1 text-[10px] font-bold flex items-center justify-between shadow-xs z-10">
                <span className="truncate pr-1">{featureBar}</span>
                <span className="flex items-center gap-0.5 shrink-0 bg-white/90 px-1 py-0.2 rounded text-[9px]">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  {rating}
                </span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-3 space-y-1.5 bg-white text-left">
            <h4 className="font-serif font-black text-xs text-neutral-900 line-clamp-1">
              {name || "Product Name Here"}
            </h4>

            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-neutral-950">
                ₹{Number(price || 0).toLocaleString("en-IN")}
              </span>
              {Number(originalPrice || 0) > Number(price || 0) && (
                <span className="text-[10px] text-neutral-400 line-through">
                  ₹{Number(originalPrice || 0).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-neutral-100">
              <span className="text-[10px] font-black text-emerald-600">
                {discount || "Special Offer"}
              </span>
              <div className="flex items-center -space-x-1">
                {colors.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Optional Quick Autofill from Catalog Products */}
      {catalogProducts.length > 0 && !editingItem && (
        <div className={`rounded-2xl p-4 space-y-2 border transition-all ${
          isDarkMode
            ? "bg-zinc-900/80 border-zinc-800"
            : "bg-amber-50/80 border-amber-200/80"
        }`}>
          <label className={`text-xs font-bold flex items-center gap-1.5 ${
            isDarkMode ? "text-amber-400" : "text-amber-950"
          }`}>
            <Package size={14} className="text-amber-500" />
            Quick Import From Catalog (Optional)
          </label>
          <select
            value={productId || ""}
            onChange={(e) => handleSelectCatalogProduct(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none cursor-pointer transition ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-700 text-white focus:border-amber-400"
                : "bg-white border-amber-300 text-slate-900 focus:ring-2 focus:ring-amber-500"
            }`}
          >
            <option value="">-- Or enter custom details manually below --</option>
            {catalogProducts.map((p) => (
              <option key={p.id} value={p.id} className={isDarkMode ? "bg-zinc-900 text-white" : ""}>
                {p.name} (₹{p.discountPrice || p.originalPrice})
              </option>
            ))}
          </select>
          <p className={`text-[11px] ${isDarkMode ? "text-zinc-400" : "text-amber-800"}`}>
            Selecting a product auto-fills the name, prices, and image URL.
          </p>
        </div>
      )}

      {/* 3. Product Name / Title */}
      <div className="space-y-1.5">
        <label className={`text-xs font-bold flex items-center justify-between ${
          isDarkMode ? "text-zinc-200" : "text-gray-800"
        }`}>
          <span>Card Title / Product Name *</span>
          <span className={`text-[11px] font-normal ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>Required</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Flazo Nirvana Ion ANC"
          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border outline-none transition ${
            isDarkMode
              ? "bg-zinc-900/90 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
          }`}
          required
        />
      </div>

      {/* 4. Product Image Upload */}
      <div className="space-y-1.5">
        <label className={`text-xs font-bold flex items-center justify-between ${
          isDarkMode ? "text-zinc-200" : "text-gray-800"
        }`}>
          <span>Product Showcase Image *</span>
          <span className={`text-[11px] font-normal ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
            PNG / WebP transparent recommended
          </span>
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-amber-400 bg-amber-400/10"
              : previewUrl
              ? isDarkMode
                ? "border-emerald-500/50 bg-emerald-950/20"
                : "border-emerald-300 bg-emerald-50/20"
              : isDarkMode
              ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-amber-400/50"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {previewUrl ? (
            <div className="flex items-center justify-center gap-3">
              <img
                src={previewUrl}
                alt="Selected"
                className={`w-16 h-16 object-contain rounded-xl p-1 border shadow-sm ${
                  isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
                }`}
              />
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Image Attached
                </p>
                <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Click or drag here to change image
                </p>
              </div>
            </div>
          ) : (
            <div className="py-2 space-y-1">
              <UploadCloud className="w-8 h-8 mx-auto text-amber-500" />
              <p className={`text-xs font-semibold ${isDarkMode ? "text-zinc-200" : "text-gray-700"}`}>
                Click to browse or drop product image
              </p>
              <p className={`text-[11px] ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                PNG, WebP, JPG up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Badge & Badge Theme */}
      <div className="space-y-2">
        <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
          Top Badge Tag & Styling
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="e.g. 🔥 Bestseller"
            className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs font-semibold border outline-none ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>

        {/* Badge Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {BADGE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBadge(p)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition cursor-pointer ${
                badge === p
                  ? "bg-amber-400 text-black border-amber-400 font-bold"
                  : isDarkMode
                  ? "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Badge Colors */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className={`text-[11px] font-semibold ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>Theme:</span>
          {BADGE_BG_PRESETS.map((bg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBadgeBg(bg.class)}
              className={`text-[10px] px-2 py-0.5 rounded font-black uppercase transition cursor-pointer border ${bg.class} ${
                badgeBg === bg.class
                  ? "ring-2 ring-amber-400 scale-105"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Signature Feature Bar */}
      <div className="space-y-1.5">
        <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
          Feature Bar Headline
        </label>
        <input
          type="text"
          value={featureBar}
          onChange={(e) => setFeatureBar(e.target.value)}
          placeholder="e.g. 120 Hours Playback / BT Calling & AMOLED"
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border outline-none ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
              : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
          }`}
        />
      </div>

      {/* 7. Pricing & Discount Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
            Selling Price (₹) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) =>
              updatePriceAndDiscount(Number(e.target.value), Number(originalPrice))
            }
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border outline-none ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-amber-400 focus:border-amber-400"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
            }`}
            required
          />
        </div>

        <div className="space-y-1">
          <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
            Original MRP (₹)
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) =>
              updatePriceAndDiscount(Number(price), Number(e.target.value))
            }
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border outline-none ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-amber-400"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>

        <div className="space-y-1">
          <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
            Discount Tag
          </label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="e.g. 76% off"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-400 border outline-none ${
              isDarkMode
                ? "bg-emerald-950/20 border-emerald-900/60 focus:border-emerald-500"
                : "bg-gray-50 border-gray-200 text-emerald-600 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>
      </div>

      {/* 8. Rating & Color Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rating */}
        <div className="space-y-1.5">
          <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
            Rating (1.0 to 5.0)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className={`w-24 px-3.5 py-2.5 rounded-xl text-xs font-bold border outline-none ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
              }`}
            />
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className={`text-xs font-bold ml-1 ${isDarkMode ? "text-zinc-300" : "text-gray-700"}`}>
                / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Color Dots */}
        <div className="space-y-1.5">
          <label className={`text-xs font-bold flex items-center gap-1.5 ${
            isDarkMode ? "text-zinc-200" : "text-gray-800"
          }`}>
            <Palette size={14} className="text-amber-500" />
            Color Swatches Dots
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {colors.map((hex, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] shadow-2xs ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-700 text-zinc-200"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/30"
                  style={{ backgroundColor: hex }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColor(hex)}
                  className="text-zinc-400 hover:text-red-400"
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              title="Pick color"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isDarkMode
                  ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                  : "text-amber-700 bg-amber-100 hover:bg-amber-200"
              }`}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* 9. Target Link & Display Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
            Target Link
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="#bestsellers or /products/12"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>

        <div className="space-y-1">
          <label className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
            Display Order
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border outline-none ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-amber-500"
            }`}
          />
        </div>
      </div>

      {/* 10. Active Status Toggle */}
      <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-zinc-900/60 border-zinc-800"
          : "bg-gray-50 border-gray-200"
      }`}>
        <div>
          <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Active on Storefront
          </p>
          <p className={`text-[11px] ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
            Show this card in the homepage Trending Bestsellers section
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
            isActive ? "bg-amber-500" : isDarkMode ? "bg-zinc-800" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              isActive ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* 11. Action Buttons */}
      <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
        isDarkMode ? "border-zinc-800" : "border-gray-200"
      }`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isDarkMode
                ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                : "border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <span>Saving...</span>
          ) : (
            <>
              <CheckCircle2 size={15} />
              <span>{editingItem ? "Update Trending Card" : "Create Trending Card"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

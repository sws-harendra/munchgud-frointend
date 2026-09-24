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

const DEFAULT_COLOR_SWATCHES = ["#FFFFFF", "#D4AF37", "#1A1A1A", "#E5C158", "#2D2D2D"];

export default function TrendingImageForm({
  editingItem,
  onSuccess,
  onCancel,
}: TrendingImageFormProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Parse colors
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

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Auto-calculate discount percentage when price or originalPrice changes
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
      toast.error("Product title/name is required.");
      return;
    }

    if (!selectedFile && !editingItem?.imageUrl && !previewUrl) {
      toast.error("Please upload a product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("badge", badge.trim());
      formData.append("badgeBg", badgeBg);
      formData.append("featureBar", featureBar.trim());
      formData.append("rating", String(rating));
      formData.append("price", String(price));
      formData.append("originalPrice", String(originalPrice));
      formData.append("discount", discount.trim());
      formData.append("colors", JSON.stringify(colors));
      formData.append("link", link.trim() || "#bestsellers");
      if (productId) formData.append("productId", String(productId));
      formData.append("displayOrder", String(displayOrder));
      formData.append("isActive", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (editingItem?.imageUrl) {
        formData.append("imageUrl", editingItem.imageUrl);
      } else if (previewUrl) {
        formData.append("imageUrl", previewUrl);
      }

      if (editingItem) {
        await dispatch(
          updateTrendingImage({ id: editingItem.id, formData })
        ).unwrap();
        toast.success("Trending item updated successfully!");
      } else {
        await dispatch(createTrendingImage(formData)).unwrap();
        toast.success("Trending item created successfully!");
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save trending item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-900 pb-12">
      {/* 1. Live Interactive Card Simulator */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white space-y-2">
        <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Eye size={14} /> Live Card Preview
          </span>
          <span className="text-[10px] text-gray-400 font-normal">
            Updates in real-time
          </span>
        </div>

        {/* boAt Simulator Card Preview */}
        <div className="max-w-[220px] mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 text-neutral-950 select-none">
          {/* Top Tag & Image */}
          <div className="relative aspect-square bg-neutral-50 flex items-center justify-center p-3 overflow-hidden">
            <span
              className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm shadow-xs ${badgeBg}`}
            >
              {badge || "Trending"}
            </span>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain max-h-[120px] drop-shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300">
                <UploadCloud size={28} />
                <span className="text-[10px] mt-1 font-medium">No Image</span>
              </div>
            )}
          </div>

          {/* Yellow Feature Bar */}
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-2.5 py-1 flex items-center justify-between text-neutral-950 font-bold text-[10px]">
            <span className="truncate pr-1">{featureBar || "Sound Feature"}</span>
            <span className="flex items-center gap-0.5 bg-white/90 px-1 py-0.5 rounded-sm text-[9px] shrink-0 font-black">
              <Star className="w-2 h-2 fill-amber-500 text-amber-500" />
              {rating}
            </span>
          </div>

          {/* Card Body */}
          <div className="p-2.5 space-y-1.5 bg-white text-left">
            <h4 className="font-extrabold text-xs text-neutral-900 line-clamp-1">
              {name || "Product Name Here"}
            </h4>

            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-neutral-950">
                ₹{Number(price || 0).toLocaleString("en-IN")}
              </span>
              {Number(originalPrice || 0) > Number(price || 0) && (
                <span className="text-[10px] text-neutral-400 line-through">
                  ₹{Number(originalPrice || 0).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
              <span className="text-[10px] font-black text-emerald-600">
                {discount || "Special Offer"}
              </span>
              <div className="flex items-center -space-x-1">
                {colors.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white"
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
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5">
          <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <Package size={14} className="text-amber-700" />
            Quick Import From Catalog (Optional)
          </label>
          <select
            value={productId || ""}
            onChange={(e) => handleSelectCatalogProduct(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
          >
            <option value="">-- Or enter custom details manually below --</option>
            {catalogProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.discountPrice || p.originalPrice})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-amber-800">
            Selecting a product auto-fills the name, prices, and image URL.
          </p>
        </div>
      )}

      {/* 3. Product Name / Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-800 flex items-center justify-between">
          <span>Card Title / Product Name *</span>
          <span className="text-[11px] text-gray-400 font-normal">Required</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Flazo Nirvana Ion ANC"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition"
          required
        />
      </div>

      {/* 4. Product Image Upload */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-800 flex items-center justify-between">
          <span>Product Showcase Image *</span>
          <span className="text-[11px] text-gray-400 font-normal">PNG / WebP with transparent background recommended</span>
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
              ? "border-amber-500 bg-amber-50/50"
              : previewUrl
              ? "border-emerald-300 bg-emerald-50/20"
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
                className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-gray-200 shadow-sm"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Image Attached
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Click or drag here to change image
                </p>
              </div>
            </div>
          ) : (
            <div className="py-2 space-y-1">
              <UploadCloud className="w-8 h-8 mx-auto text-amber-500" />
              <p className="text-xs font-semibold text-gray-700">
                Click to browse or drop product image
              </p>
              <p className="text-[11px] text-gray-400">PNG, WebP, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Badge & Badge Theme */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-800">
          Top Badge Tag & Styling
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="e.g. 🔥 Bestseller"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
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
                  ? "bg-neutral-900 text-amber-400 border-neutral-900"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Badge Colors */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-500">Theme:</span>
          {BADGE_BG_PRESETS.map((bg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBadgeBg(bg.class)}
              className={`text-[10px] px-2 py-0.5 rounded font-black uppercase transition cursor-pointer border ${bg.class} ${
                badgeBg === bg.class
                  ? "ring-2 ring-amber-500 scale-105"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Signature Yellow Feature Bar */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-800">
          Yellow Feature Bar Headline
        </label>
        <input
          type="text"
          value={featureBar}
          onChange={(e) => setFeatureBar(e.target.value)}
          placeholder="e.g. 120 Hours Playback / BT Calling & AMOLED"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>

      {/* 7. Pricing & Discount Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-800">Selling Price (₹) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) =>
              updatePriceAndDiscount(Number(e.target.value), Number(originalPrice))
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-800">Original MRP (₹)</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) =>
              updatePriceAndDiscount(Number(price), Number(e.target.value))
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-800">Discount Tag</label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="e.g. 76% off"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-emerald-600 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* 8. Rating & Color Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rating */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">Rating (1.0 to 5.0)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-700 ml-1">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Color Dots */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Palette size={14} className="text-amber-600" />
            Color Swatches Dots
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {colors.map((hex, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 text-[10px] bg-white shadow-2xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: hex }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColor(hex)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0"
              title="Pick color"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* 9. Target Link & Display Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-800">Target Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="#flagship-series or /products/12"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-800">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* 10. Active Status Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
        <div>
          <p className="text-xs font-bold text-gray-900">Active on Storefront</p>
          <p className="text-[11px] text-gray-500">
            Show this card in the homepage Trending Bestsellers section
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
            isActive ? "bg-amber-500" : "bg-gray-300"
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
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neutral-900 via-amber-950 to-neutral-900 hover:from-neutral-950 hover:to-neutral-950 text-amber-400 font-bold border border-amber-400/40 text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
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

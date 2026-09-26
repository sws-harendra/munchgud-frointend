"use strict";
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createHeroImage,
  updateHeroImage,
} from "@/app/lib/store/features/heroImageSlice";
import { HeroImageItem } from "@/app/sercices/user/heroImage.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  UploadCloud,
  X,
  Sparkles,
  Link as LinkIcon,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminTheme } from "../context/AdminThemeContext";

interface HeroImageFormProps {
  editingItem?: HeroImageItem | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function HeroImageForm({
  editingItem,
  onSuccess,
  onCancel,
}: HeroImageFormProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("#flagship-series");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title || "");
      setSubtitle(editingItem.subtitle || "");
      setLink(editingItem.link || "#flagship-series");
      setCtaText(editingItem.ctaText || "");
      setAltText(editingItem.altText || "");
      setDisplayOrder(editingItem.displayOrder ?? 1);
      setIsActive(editingItem.isActive ?? true);
      setPreviewUrl(getImageUrl(editingItem.imageUrl));
    } else {
      setTitle("");
      setSubtitle("");
      setLink("#flagship-series");
      setCtaText("Shop Now");
      setAltText("");
      setDisplayOrder(1);
      setIsActive(true);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [editingItem]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP).");
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem && !selectedFile) {
      toast.error("Please select a hero banner image to upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("link", link);
      formData.append("ctaText", ctaText);
      formData.append("altText", altText || title || "Flazo Hero Slide");
      formData.append("displayOrder", String(displayOrder));
      formData.append("isActive", String(isActive));

      if (editingItem) {
        await dispatch(
          updateHeroImage({ id: editingItem.id, formData })
        ).unwrap();
        toast.success("Hero slide image updated successfully! 🎉");
      } else {
        await dispatch(createHeroImage(formData)).unwrap();
        toast.success("New hero slide image uploaded and published! 🚀");
      }

      onSuccess();
    } catch (err: any) {
      toast.error(
        err || "Failed to save hero slide image. Please check backend logs."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-6 text-left">
      {/* Visual Header Indicator */}
      <div className={`rounded-2xl p-4 flex items-start gap-3 border transition-colors ${
        isDarkMode
          ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
          : "bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-amber-200/50 text-neutral-700"
      }`}>
        <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="text-xs">
          <p className={`font-bold mb-0.5 ${isDarkMode ? "text-amber-400" : "text-neutral-900"}`}>
            Homepage Hero Sliding Carousel Asset
          </p>
          <p className={`leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-neutral-600"}`}>
            Images uploaded here will be streamed live into the flagship hero slider
            on the main landing page. Recommended format:{" "}
            <span className="font-mono font-bold text-amber-400">
              1920×800px (16:9 / 21:9)
            </span>{" "}
            for full-bleed cinematic rendering.
          </p>
        </div>
      </div>

      {/* 1. Image Upload Section */}
      <div className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? "text-zinc-200" : "text-gray-800"
        }`}>
          Hero Banner Image <span className="text-red-500">*</span>
        </label>

        {previewUrl ? (
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-950 aspect-[16/7] group shadow-inner">
            <img
              src={previewUrl}
              alt="Slide Preview"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-xs font-bold truncate">
                {title || "Slide Image Preview"}
              </p>
              <p className="text-white/70 text-[11px]">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • ${selectedFile.name}`
                  : "Current Banner Image"}
              </p>
            </div>

            {/* Replace Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-3 right-3 bg-black/80 hover:bg-black text-amber-400 border border-amber-400/30 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md backdrop-blur flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileImage size={14} className="text-amber-400" />
              Change Image
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-amber-400 bg-amber-400/10 scale-[0.99]"
                : isDarkMode
                ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-amber-400/50"
                : "border-gray-300 hover:border-amber-500 hover:bg-neutral-50/70"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm ${
              isDarkMode ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-amber-100 text-amber-600"
            }`}>
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className={`text-sm font-semibold ${isDarkMode ? "text-zinc-200" : "text-neutral-800"}`}>
              Drag & drop hero banner image here, or{" "}
              <span className="text-amber-400 underline underline-offset-2">
                browse files
              </span>
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-zinc-500" : "text-neutral-500"}`}>
              Supports WebP, PNG, JPG (Ultra HD panoramic banners, max 10MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* 2. Slide Title / Heading */}
      <div className="space-y-1.5">
        <label className={`block text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? "text-zinc-200" : "text-gray-800"
        }`}>
          Slide Title / Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Flazo Luxury True Wireless Earbuds Flagship Trinity"
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500"
          }`}
        />
        <p className={`text-[11px] ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}>
          Used for slide identification and accessibility.
        </p>
      </div>

      {/* 3. Subtitle / Tagline */}
      <div className="space-y-1.5">
        <label className={`block text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? "text-zinc-200" : "text-gray-800"
        }`}>
          Subtitle / Tagline (Optional)
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="e.g. 13mm BoomBass™ Titanium Drivers with 50dB Hybrid ANC"
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500"
          }`}
        />
      </div>

      {/* 4. Link & CTA Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={`block text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? "text-zinc-200" : "text-gray-800"
          }`}>
            Target Destination Link
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. #flagship-series or /products"
              className={`w-full pl-10 pr-3 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-amber-500"
              }`}
            />
          </div>
          {/* Quick link presets */}
          <div className="flex gap-1.5 flex-wrap pt-1">
            {["#flagship-series", "/products", "/earbuds", "/categories"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setLink(preset)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-amber-400/40"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={`block text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? "text-zinc-200" : "text-gray-800"
          }`}>
            CTA Button Text (Optional)
          </label>
          <div className="relative">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Shop Flagship"
              className={`w-full pl-10 pr-3 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-amber-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* 5. SEO Alt Text */}
      <div className="space-y-1.5">
        <label className={`block text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? "text-zinc-200" : "text-gray-800"
        }`}>
          SEO Alt Description
        </label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Descriptive image text for Google SEO and screen readers"
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
              : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-amber-500"
          }`}
        />
      </div>

      {/* 6. Display Order & Active Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className={`block text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? "text-zinc-200" : "text-gray-800"
          }`}>
            Display Sequence / Order
          </label>
          <input
            type="number"
            min="1"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none transition-all font-mono ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-amber-500"
            }`}
          />
          <p className={`text-[11px] ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}>
            Slide #1 is shown first, followed by #2, #3, etc.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className={`block text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? "text-zinc-200" : "text-gray-800"
          }`}>
            Visibility in Slider
          </label>
          <div
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
              isActive
                ? isDarkMode
                  ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-400"
                  : "bg-emerald-50 border-emerald-300 text-emerald-800"
                : isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                : "bg-gray-50 border-gray-300 text-gray-600"
            }`}
          >
            <span className="text-xs font-bold flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                }`}
              />
              {isActive ? "Active (Live on Website)" : "Inactive (Draft Hidden)"}
            </span>
            <div
              className={`w-10 h-5 flex items-center rounded-full p-0.5 duration-300 cursor-pointer ${
                isActive ? "bg-emerald-500" : isDarkMode ? "bg-zinc-800" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isActive ? "translate-x-5" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Action Buttons */}
      <div className={`flex gap-3 pt-4 border-t ${
        isDarkMode ? "border-zinc-800" : "border-gray-100"
      }`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 border rounded-xl font-bold transition-colors text-xs cursor-pointer ${
              isDarkMode
                ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              <span>Saving Assets...</span>
            </>
          ) : editingItem ? (
            <span>Update Hero Slide</span>
          ) : (
            <span>Upload & Publish Slide</span>
          )}
        </button>
      </div>
    </form>
  );
}

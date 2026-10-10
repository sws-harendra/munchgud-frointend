"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { updateProduct, fetchProductsforadmin } from "@/app/lib/store/features/productSlice";
import { toast } from "sonner";
import Link from "next/link";
import {
  ImagePlus,
  Upload,
  X,
  Package,
  Tag,
  IndianRupee,
  Archive,
  Video,
  Sparkles,
  Percent,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Plus,
  ArrowRight,
} from "lucide-react";
import { categoryService } from "@/app/sercices/category.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { isImageFile, isVideoFile } from "@/app/utils/getMediaType";
import RichTextEditor from "@/app/commonComponents/RichTextEditor";
import { useAdminTheme } from "../context/AdminThemeContext";

interface Category {
  id: number;
  name: string;
}

interface EditProductProps {
  productId: number;
  onSuccess?: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ productId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();
  const { products } = useAppSelector((state) => state.product);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    trendingProduct: false,
    paymentMethods: "both",
    varientValue: "",
  });

  // Media states
  const [newMedia, setNewMedia] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<string[]>([]);
  const [removedMedia, setRemovedMedia] = useState<string[]>([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);

  // Platform Links (Amazon, Flipkart, etc.)
  interface PlatformLinkItem {
    name: string;
    url: string;
    badge?: string;
  }
  const [platformLinks, setPlatformLinks] = useState<PlatformLinkItem[]>([]);
  const [newPlatformName, setNewPlatformName] = useState("Amazon");
  const [newPlatformUrl, setNewPlatformUrl] = useState("");
  const [newPlatformBadge, setNewPlatformBadge] = useState("");

  const handleAddPlatformLink = () => {
    if (!newPlatformUrl.trim()) {
      toast.error("Please enter a valid product URL");
      return;
    }
    if (!newPlatformName.trim()) {
      toast.error("Please enter a platform name");
      return;
    }

    let cleanUrl = newPlatformUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    setPlatformLinks((prev) => [
      ...prev,
      {
        name: newPlatformName.trim(),
        url: cleanUrl,
        badge: newPlatformBadge.trim() || undefined,
      },
    ]);

    setNewPlatformUrl("");
    setNewPlatformBadge("");
    toast.success(`${newPlatformName} link added!`);
  };

  const handleRemovePlatformLink = (index: number) => {
    setPlatformLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Load product data
  useEffect(() => {
    const product = products?.products?.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name || "",
        varientValue: product.varientValue || "",
        description: product.description || "",
        categoryId: product.categoryId ? String(product.categoryId) : "",
        tags: Array.isArray(product.tags)
          ? product.tags.join(",")
          : product.tags || "",
        originalPrice: product.originalPrice ? String(product.originalPrice) : "",
        discountPrice: product.discountPrice ? String(product.discountPrice) : "",
        stock: product.stock !== undefined ? String(product.stock) : "",
        trendingProduct: !!product.trending_product,
        paymentMethods: product.paymentMethods || "both",
      });

      // Set existing media (both images and videos)
      let mediaArray: string[] = [];
      const rawImages: unknown = product.images;
      if (Array.isArray(rawImages)) {
        mediaArray = rawImages;
      } else if (typeof rawImages === "string") {
        try {
          const parsed = JSON.parse(rawImages);
          mediaArray = Array.isArray(parsed) ? parsed : [];
        } catch {
          if (rawImages.trim()) {
            mediaArray = rawImages.split(",").map((item: string) => item.trim());
          }
        }
      }
      setExistingMedia(mediaArray);
      setRemovedMedia([]);
      setNewMedia([]);
      setNewMediaPreviews([]);

      // Initialize platform links
      let initialLinks: PlatformLinkItem[] = [];
      const rawLinks: unknown = product.platformLinks;
      if (Array.isArray(rawLinks)) {
        initialLinks = rawLinks as PlatformLinkItem[];
      } else if (typeof rawLinks === "string") {
        try {
          initialLinks = JSON.parse(rawLinks);
        } catch {
          initialLinks = [];
        }
      }
      setPlatformLinks(initialLinks);
    }
  }, [productId, products]);

  // Pricing calculations
  const priceStats = useMemo(() => {
    const original = parseFloat(formData.originalPrice) || 0;
    const sale = parseFloat(formData.discountPrice) || 0;
    if (original > 0 && sale > 0 && original > sale) {
      const discountPercent = Math.round(((original - sale) / original) * 100);
      const savings = original - sale;
      return { discountPercent, savings };
    }
    return { discountPercent: 0, savings: 0 };
  }, [formData.originalPrice, formData.discountPrice]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewMedia((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => {
        const type = file.type.startsWith("video/") ? ("video" as const) : ("image" as const);
        const previewUrl = type === "image" ? URL.createObjectURL(file) : "";
        return { url: previewUrl, type };
      });
      setNewMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveExistingMedia = (mediaPath: string, index: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    setRemovedMedia((prev) => [...prev, mediaPath]);
  };

  const handleRemoveNewMedia = (index: number) => {
    setNewMedia((prev) => prev.filter((_, i) => i !== index));
    const previewToRemove = newMediaPreviews[index];
    if (previewToRemove && previewToRemove.type === "image") {
      URL.revokeObjectURL(previewToRemove.url);
    }
    setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      newMediaPreviews.forEach((preview) => {
        if (preview.type === "image" && preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [newMediaPreviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("categoryId", formData.categoryId);
      data.append("tags", formData.tags);
      data.append("originalPrice", formData.originalPrice);
      data.append("discountPrice", formData.discountPrice);
      data.append("stock", formData.stock);
      data.append("trending_product", String(formData.trendingProduct));
      data.append("paymentMethods", formData.paymentMethods);
      data.append("varientValue", formData.varientValue);
      data.append("existingMedia", JSON.stringify(existingMedia));
      data.append("removedMedia", JSON.stringify(removedMedia));
      data.append("platformLinks", JSON.stringify(platformLinks));

      newMedia.forEach((file) => {
        data.append("media", file);
      });

      await dispatch(updateProduct({ id: String(productId), data })).unwrap();
      await dispatch(fetchProductsforadmin({ page: 1, limit: 10 }));
      toast.success("✅ Product updated successfully!");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(`❌ Failed: ${error?.message || error || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMedia = existingMedia.length + newMedia.length;

  const flattenCategoriesForDropdown = (cats: any[], level = 0): any[] => {
    let result: any[] = [];
    cats.forEach((cat) => {
      result.push({
        id: cat.id,
        name: cat.name,
        level: level,
        displayName: "  ".repeat(level) + (level > 0 ? "└ " : "") + cat.name,
      });
      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(
          flattenCategoriesForDropdown(cat.subcategories, level + 1),
        );
      }
    });
    return result;
  };

  const dropdownCategories = flattenCategoriesForDropdown(categories);

  return (
    <div className={`w-full transition-colors duration-200 ${isDark ? "bg-black text-white" : "bg-transparent text-gray-900"}`}>
      <div className="w-full">
        <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isDark 
            ? "bg-black border-zinc-800/80 shadow-none" 
            : "bg-white border-gray-100 shadow-sm"
        }`}>
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 space-y-7">
              {/* Quick Link to Manage Colors & Variants */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/25 text-white"
                  : "bg-amber-50 border-amber-200 text-slate-900"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-amber-500">
                      Product Colors & Variants (Amazon / Flipkart Style)
                    </div>
                    <div className={`text-[11px] ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                      Add more colors with separate gallery images, prices & stock.
                    </div>
                  </div>
                </div>
                <Link
                  href={`/admin/dashboard/varient?productId=${productId}`}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>Manage Variants</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-7 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="lg:col-span-2">
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Product Name *
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Flazo Nirvana Gold Pro X ANC Earbuds"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                          isDark
                            ? "bg-zinc-900/90 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                            : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Product Story & Highlights *
                    </label>
                    <RichTextEditor
                      placeholder="Describe audio architecture, acoustic performance, and key specs..."
                      className={`w-full rounded-xl border transition-all ${
                        isDark ? "border-zinc-800 bg-zinc-900/60" : "border-gray-200 bg-gray-50"
                      }`}
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                          : "bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"
                      }`}
                      required
                    >
                      <option value="">Select Category</option>
                      {dropdownCategories.map((cat) => (
                        <option key={cat.id} value={cat.id} className={isDark ? "bg-zinc-900 text-white" : ""}>
                          {cat.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variant */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Variant / Edition
                    </label>
                    <input
                      type="text"
                      name="varientValue"
                      placeholder="e.g. Signature Gold / 50Hr Playtime"
                      value={formData.varientValue}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:bg-white"
                      }`}
                    />
                  </div>

                  {/* Tags */}
                  <div className="lg:col-span-2">
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Search Tags (Comma separated)
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input
                        type="text"
                        name="tags"
                        placeholder="earbuds, anc, flazo, wireless, bluetooth 5.4, gaming"
                        value={formData.tags}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400"
                            : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-7 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Pricing & Stock Inventory
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Original Price */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      MRP (Original Price) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input
                        type="number"
                        name="originalPrice"
                        placeholder="4999"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Discount Price */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                      Sale Offer Price *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-500 w-4 h-4" />
                      <input
                        type="number"
                        name="discountPrice"
                        placeholder="1899"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold transition-all outline-none ${
                          isDark
                            ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-400 focus:border-emerald-500"
                            : "bg-emerald-50/70 border-emerald-200 text-emerald-700 focus:border-emerald-500 focus:bg-white"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Stock Units *
                    </label>
                    <div className="relative">
                      <Archive className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <input
                        type="number"
                        name="stock"
                        placeholder="100"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Savings Live Display */}
                {priceStats.discountPercent > 0 && (
                  <div className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-medium ${
                    isDark 
                      ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-300"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}>
                    <Percent className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Customer saves <strong className="font-bold">₹{priceStats.savings.toLocaleString("en-IN")}</strong> ({priceStats.discountPercent}% OFF)
                    </span>
                  </div>
                )}
              </div>

              {/* Media Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-7 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Product Media & Images
                  </h3>
                </div>

                {/* Upload Area */}
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group ${
                  isDark
                    ? "border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-900/40"
                    : "border-gray-200 hover:border-amber-500 hover:bg-amber-50/30"
                }`}>
                  <label className="flex flex-col items-center space-y-3 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl flex items-center justify-center text-zinc-950 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <ImagePlus className="w-7 h-7" />
                    </div>
                    <div>
                      <span className={`text-base font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                        Upload Additional Images / Video
                      </span>
                      <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                        PNG, JPG, WEBP, MP4 (recommended 800x800 or 1000x1000)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Media Preview Grid */}
                {(existingMedia.length > 0 || newMedia.length > 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                        Total Media Attached ({totalMedia})
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {/* Existing Media */}
                      {existingMedia.map((mediaPath, idx) => {
                        const isImage = isImageFile(mediaPath);
                        const isVideo = isVideoFile(mediaPath);

                        return (
                          <div
                            key={`existing-${idx}`}
                            className={`relative group aspect-square rounded-xl overflow-hidden border ${
                              isDark ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-gray-100"
                            }`}
                          >
                            {isImage ? (
                              <img
                                src={getImageUrl(mediaPath)}
                                alt={`Existing ${idx + 1}`}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : isVideo ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="w-8 h-8 text-zinc-400" />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                                File
                              </div>
                            )}
                            <div className="absolute top-1.5 left-1.5 bg-blue-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Current
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingMedia(mediaPath, idx)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow hover:bg-red-700 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {/* New Media */}
                      {newMediaPreviews.map((preview, idx) => (
                        <div
                          key={`new-${idx}`}
                          className={`relative group aspect-square rounded-xl overflow-hidden border ${
                            isDark ? "border-emerald-900/60 bg-zinc-900" : "border-emerald-200 bg-gray-100"
                          }`}
                        >
                          {preview.type === "image" ? (
                            <img
                              src={preview.url}
                              alt={`New ${idx + 1}`}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-8 h-8 text-emerald-400" />
                            </div>
                          )}
                          <div className="absolute top-1.5 left-1.5 bg-emerald-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewMedia(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow hover:bg-red-700 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status, Trending & Payment Options */}
              <div className={`p-5 rounded-2xl border space-y-5 ${
                isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Trending Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="trendingProduct"
                      checked={formData.trendingProduct}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trendingProduct: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-amber-500 rounded border-zinc-700 focus:ring-amber-400 cursor-pointer"
                    />
                    <div>
                      <span className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Mark as Trending Product
                      </span>
                      <p className={`text-xs ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                        Display this product dynamically in the Homepage "Trending Bestsellers" section
                      </p>
                    </div>
                  </label>

                  {/* Payment Mode */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Allowed Payment Methods
                    </label>
                    <select
                      name="paymentMethods"
                      value={formData.paymentMethods}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-400"
                          : "bg-white border-gray-200 text-gray-900 focus:border-amber-500"
                      }`}
                    >
                      <option value="both">Both COD & Online Payment</option>
                      <option value="online">Online Payment Only</option>
                      <option value="cod">Cash on Delivery (COD) Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* MULTI-PLATFORM MARKETPLACE LINKS (Amazon, Flipkart, etc.) */}
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark
                    ? "bg-zinc-900/60 border-zinc-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Sell on Other Marketplaces (Amazon, Flipkart, etc.)
                      </h4>
                      <p className={`text-xs ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                        Add direct purchase links to external platforms. Customers can buy on their favorite marketplace.
                      </p>
                    </div>
                  </div>
                  {platformLinks.length > 0 && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 self-start sm:self-auto">
                      {platformLinks.length} Platform{platformLinks.length > 1 ? "s" : ""} Added
                    </span>
                  )}
                </div>

                {/* Quick Platform Presets */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                    Quick Select Preset:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Amazon", "Flipkart", "Myntra", "Meesho", "JioMart", "Tata CLiQ", "Custom"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPlatformName(p === "Custom" ? "" : p)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border cursor-pointer ${
                          newPlatformName === p
                            ? "bg-amber-500 text-black border-amber-400 shadow-sm"
                            : isDark
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-3">
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amazon, Flipkart"
                      value={newPlatformName}
                      onChange={(e) => setNewPlatformName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                        isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                      Product Page URL / Link *
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.amazon.in/dp/..."
                      value={newPlatformUrl}
                      onChange={(e) => setNewPlatformUrl(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                        isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                      Badge / Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prime Delivery, Assured"
                      value={newPlatformBadge}
                      onChange={(e) => setNewPlatformBadge(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                        isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddPlatformLink}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                      title="Add Marketplace Link"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* List of Added Platform Links */}
                {platformLinks.length > 0 ? (
                  <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                    <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                      Configured Marketplace Links ({platformLinks.length}):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {platformLinks.map((link, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isDark
                              ? "bg-zinc-800/80 border-zinc-700 text-white"
                              : "bg-white border-slate-200 text-slate-900 shadow-2xs"
                          }`}
                        >
                          <div className="min-w-0 pr-2 space-y-0.5 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-amber-500">
                                {link.name}
                              </span>
                              {link.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-zinc-400 hover:text-amber-400 truncate flex items-center gap-1 max-w-[240px]"
                            >
                              <span className="truncate">{link.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePlatformLink(idx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remove link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs italic ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                    No marketplace links added yet. Add your Amazon, Flipkart, etc. product URLs above so customers can buy across platforms!
                  </p>
                )}
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className={`px-8 py-5 border-t flex items-center justify-end gap-3 ${
              isDark ? "bg-black/60 border-zinc-800" : "bg-gray-50 border-gray-100"
            }`}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <Upload className="w-5 h-5 text-zinc-950" />
                {isSubmitting ? "Updating Product..." : "Save & Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  createProduct,
  fetchProductsforadmin,
} from "@/app/lib/store/features/productSlice";
import { createTrendingImage } from "@/app/lib/store/features/trendingImageSlice";
import { toast } from "sonner";
import {
  ImagePlus,
  Upload,
  X,
  Package,
  Tag,
  Archive,
  TrendingUp,
  IndianRupee,
  Video,
  Sparkles,
  Volume2,
  Shield,
  Zap,
  Clock,
  Palette,
  CheckCircle2,
  Plus,
  Flame,
  Star,
  Info,
} from "lucide-react";
import { categoryService } from "@/app/sercices/category.service";
import { fetchArtists } from "@/app/lib/store/features/artistSlice";
import RichTextEditor from "@/app/commonComponents/RichTextEditor";
import { useAdminTheme } from "../context/AdminThemeContext";

interface Category {
  id: number;
  name: string;
}

interface MediaFile {
  file: File;
  type: "image" | "video";
  previewUrl: string;
}

const BADGE_OPTIONS = [
  "🔥 Bestseller",
  "✨ Flagship Masterpiece",
  "🚀 New Launch",
  "⚡ 35ms Beast™ Mode",
  "💎 Signature Gold Edition",
  "🌟 Top Rated 4.9★",
];

const PRESET_COLOR_SWATCHES = [
  { name: "Champagne Gold", hex: "#E8C872" },
  { name: "Obsidian Black", hex: "#1F1F1F" },
  { name: "Desert Dune", hex: "#D6C7A1" },
  { name: "Alpine White & Gold", hex: "#FFFFFF" },
  { name: "Royal Walnut Gold", hex: "#4A3525" },
  { name: "Midnight Stealth", hex: "#1A1917" },
];

const QUICK_FEATURE_SUGGESTIONS = [
  "24K Gold-Plated Diaphragm",
  "50dB Hybrid Active Noise Cancellation",
  "Auracast™ Audio Broadcasting",
  "ASAP™ Charge (10m charge = 10h play)",
  "Quad-Mic AI Clear Voice Technology",
  "BoomBass™ Acoustic Waveguide Chamber",
  "IPX7 Waterproof & SweatGuard™",
  "Multipoint Dual-Device Pairing",
];

const AddProducts = () => {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "100",
    trendingProduct: false,
    paymentMethods: "both",
    artistId: "",
    varientValue: "Champagne Gold Edition",
    badge: "🔥 Bestseller",
  });

  // Earbuds Tech Specifications
  const [specs, setSpecs] = useState({
    driver: "13mm Dual-Coaxial Titanium",
    anc: "50dB Hybrid ANC",
    battery: "70H Monster Play",
    latency: "35ms Beast™ Mode",
    waterproof: "IPX5 Splashproof",
  });

  // Additional Custom Tech Specifications (Dynamic Key-Value)
  const [customSpecs, setCustomSpecs] = useState<
    { label: string; value: string }[]
  >([]);
  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  const handleAddCustomSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) {
      toast.error("Please enter both Specification Name and Value");
      return;
    }
    setCustomSpecs([
      ...customSpecs,
      { label: newSpecLabel.trim(), value: newSpecValue.trim() },
    ]);
    setNewSpecLabel("");
    setNewSpecValue("");
  };

  const handleRemoveCustomSpec = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  // Dynamic Feature Bullets
  const [features, setFeatures] = useState<string[]>([
    "24K Gold-Plated Diaphragm",
    "Auracast™ Audio Sharing",
    "ASAP™ Charge (10m = 10h)",
    "Quad-Mic AI Clear Calls",
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState("");

  // Color Shades
  const [selectedColors, setSelectedColors] = useState<
    { name: string; hex: string }[]
  >([
    { name: "Champagne Gold", hex: "#E8C872" },
    { name: "Obsidian Black", hex: "#1F1F1F" },
  ]);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#2563EB");

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) {
      toast.error("Please enter a color name");
      return;
    }
    const trimmedName = customColorName.trim();
    if (
      selectedColors.some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      toast.error(`Color "${trimmedName}" is already added`);
      return;
    }
    setSelectedColors([
      ...selectedColors,
      { name: trimmedName, hex: customColorHex || "#2563EB" },
    ]);
    setCustomColorName("");
  };

  const handleRemoveColor = (indexToRemove: number) => {
    if (selectedColors.length <= 1) {
      toast.error("At least one color variant is recommended");
      return;
    }
    setSelectedColors(selectedColors.filter((_, i) => i !== indexToRemove));
  };

  // Sync with Homepage Trending Bestsellers Banner
  const [syncToTrendingImage, setSyncToTrendingImage] = useState(true);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const { artists, status } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchArtists());
  }, [dispatch, status]);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      const newFiles = Array.from(e.target.files);
      const newMediaFiles: MediaFile[] = newFiles.map((file) => {
        const type = file.type.startsWith("video/") ? "video" : "image";
        const previewUrl = type === "image" ? URL.createObjectURL(file) : "";
        return { file, type, previewUrl };
      });
      setMediaFiles([...mediaFiles, ...newMediaFiles]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    if (mediaFiles[index].previewUrl) {
      URL.revokeObjectURL(mediaFiles[index].previewUrl);
    }
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  // Add feature bullet
  const handleAddFeature = () => {
    if (newFeatureInput.trim() && !features.includes(newFeatureInput.trim())) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Add/remove color
  const handleToggleColor = (swatch: { name: string; hex: string }) => {
    if (selectedColors.some((c) => c.hex === swatch.hex)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c.hex !== swatch.hex));
      }
    } else {
      setSelectedColors([...selectedColors, swatch]);
    }
  };

  // Calculate live savings
  const savingsInfo = useMemo(() => {
    const orig = parseFloat(formData.originalPrice);
    const sale = parseFloat(formData.discountPrice);
    if (!isNaN(orig) && !isNaN(sale) && orig > sale && orig > 0) {
      const savedAmount = orig - sale;
      const percent = Math.round((savedAmount / orig) * 100);
      return { savedAmount, percent };
    }
    return null;
  }, [formData.originalPrice, formData.discountPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Resolve category: find existing category ID or pass categoryName
      let finalCategoryId = "";
      if (categoryInput.trim()) {
        const matchedCat = categories.find(
          (c) => c.name.toLowerCase() === categoryInput.trim().toLowerCase()
        );
        if (matchedCat) {
          finalCategoryId = String(matchedCat.id);
        }
      }
      // Build comprehensive tags list incorporating specs & features
      const existingTags = formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [];

      const comprehensiveTags = Array.from(
        new Set([
          "Earbuds",
          ...(formData.badge?.trim() ? [formData.badge.trim()] : []),
          ...(specs.driver ? [`Driver:${specs.driver}`] : []),
          ...(specs.anc ? [`ANC:${specs.anc}`] : []),
          ...(specs.battery ? [`Battery:${specs.battery}`] : []),
          ...(specs.latency ? [`Latency:${specs.latency}`] : []),
          ...(specs.waterproof ? [`Waterproof:${specs.waterproof}`] : []),
          ...customSpecs.map((s) => `${s.label}:${s.value}`),
          ...features,
          ...selectedColors.map((c) => c.name),
          ...existingTags,
        ])
      );

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (finalCategoryId) {
        data.append("categoryId", finalCategoryId);
      }
      if (categoryInput.trim()) {
        data.append("categoryName", categoryInput.trim());
      }
      data.append("tags", JSON.stringify(comprehensiveTags));
      data.append("originalPrice", formData.originalPrice);
      data.append("discountPrice", formData.discountPrice);
      data.append("stock", formData.stock);
      data.append("trending_product", String(formData.trendingProduct));
      data.append("varientValue", formData.varientValue);
      if (formData.artistId) data.append("artistId", formData.artistId);
      data.append("paymentMethods", formData.paymentMethods);

      // Append media files
      mediaFiles.forEach((media) => {
        data.append("media", media.file);
      });

      const res = await dispatch(createProduct(data)).unwrap();
      const createdProd = res?.product || res;
      toast.success("✅ Product added to catalog successfully!");

      // If user enabled sync to Homepage Trending Bestsellers:
      if (syncToTrendingImage && mediaFiles.length > 0) {
        try {
          const trendingFormData = new FormData();
          trendingFormData.append("name", formData.name);
          trendingFormData.append("badge", formData.badge || "🔥 Bestseller");
          trendingFormData.append("badgeBg", "bg-neutral-950 text-white");
          trendingFormData.append("featureBar", specs.battery || "70H Monster Play");
          trendingFormData.append("rating", "4.9");
          trendingFormData.append("price", String(formData.discountPrice));
          trendingFormData.append("originalPrice", String(formData.originalPrice));
          trendingFormData.append(
            "discount",
            savingsInfo ? `${savingsInfo.percent}% off` : "60% off"
          );
          trendingFormData.append(
            "colors",
            JSON.stringify(selectedColors.map((c) => c.hex))
          );
          trendingFormData.append("link", "/earbuds");
          if (createdProd?.id) {
            trendingFormData.append("productId", String(createdProd.id));
          }
          trendingFormData.append("image", mediaFiles[0].file);

          await dispatch(createTrendingImage(trendingFormData)).unwrap();
          toast.success("🌟 Also synced to Homepage Trending Bestsellers!");
        } catch (syncErr) {
          console.error("Failed to auto-sync to trending banner", syncErr);
        }
      }

      // Refresh admin products list
      dispatch(fetchProductsforadmin({ page: 1, limit: 10 }));

      // Reset form
      setFormData({
        name: "",
        description: "",
        categoryId: formData.categoryId,
        tags: "",
        originalPrice: "",
        discountPrice: "",
        stock: "100",
        trendingProduct: false,
        varientValue: "Champagne Gold Edition",
        paymentMethods: "both",
        artistId: "",
        badge: "🔥 Bestseller",
      });

      mediaFiles.forEach((media) => {
        if (media.previewUrl) URL.revokeObjectURL(media.previewUrl);
      });
      setMediaFiles([]);
    } catch (error: any) {
      toast.error(`❌ Failed: ${error?.message || error}`);
    }
  };

  return (
    <div
      className={`w-full transition-colors duration-200 ${
        isDark ? "bg-black text-zinc-100" : "bg-transparent text-slate-900"
      }`}
    >
      <div className="w-full">
        {/* Main Card */}
        <div
          className={`rounded-2xl border transition-colors ${
            isDark ? "bg-black border-zinc-800/80 shadow-none" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 space-y-7">
              {/* 1. BASIC INFORMATION */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-inherit">
                  <div className="w-2 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-bold tracking-tight">
                    Basic Product Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Product Name */}
                  <div className="lg:col-span-2">
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Product Title *
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Flazo Nirvana Gold Pro X Wireless Earbuds"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-zinc-300" : "text-slate-700"
                        }`}
                      >
                        Category <span className="text-zinc-500 font-normal lowercase">(optional)</span>
                      </label>
                      {categoryInput && (
                        <button
                          type="button"
                          onClick={() => setCategoryInput("")}
                          className="text-[11px] text-zinc-400 hover:text-red-400 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="category"
                        list="category-suggestions"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder="Type category (e.g. Earbuds, Smartwatch, Accessories)..."
                        className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                      <datalist id="category-suggestions">
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quick Category Suggestion Chips */}
                    {categories.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                          Suggestions:
                        </span>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategoryInput(cat.name)}
                            className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                              categoryInput.toLowerCase() === cat.name.toLowerCase()
                                ? isDark
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : "bg-amber-100 text-amber-900 border-amber-300"
                                : isDark
                                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Variant / Subtitle */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Edition / Variant Subtitle
                    </label>
                    <input
                      type="text"
                      name="varientValue"
                      placeholder="e.g. Champagne Gold Edition or 1 Unit"
                      value={formData.varientValue}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />
                  </div>

                  {/* Dynamic Badge Ribbon */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Flagship Badge Ribbon
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="badge"
                        list="badge-suggestions"
                        value={formData.badge}
                        onChange={handleChange}
                        placeholder="e.g. 🔥 Bestseller, ⚡ New Launch, 50% OFF..."
                        className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                      <datalist id="badge-suggestions">
                        {BADGE_OPTIONS.map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quick Badge Suggestion Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                        Suggestions:
                      </span>
                      {BADGE_OPTIONS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, badge: b }))
                          }
                          className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            formData.badge?.trim() === b
                              ? isDark
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                                : "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                              : isDark
                              ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                              : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Payment Methods
                    </label>
                    <select
                      name="paymentMethods"
                      value={formData.paymentMethods}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all cursor-pointer ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="both">Both COD & Online Payment</option>
                      <option value="online">Online Prepaid Only</option>
                      <option value="cod">Cash on Delivery (COD) Only</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Product Description & Story
                    </label>
                    <RichTextEditor
                      placeholder="Detail the acoustic signature, driver engineering, and luxury finish..."
                      className={`w-full rounded-xl border transition-all ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 2. PRICING & INVENTORY */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-inherit">
                  <div className="w-2 h-7 bg-emerald-500 rounded-full" />
                  <h3 className="text-lg font-bold tracking-tight">
                    Pricing & Stock Inventory
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Original MRP */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Original MRP (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input
                        type="number"
                        name="originalPrice"
                        placeholder="6999"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Sale Price */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Sale Price (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="number"
                        name="discountPrice"
                        placeholder="2499"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            : "bg-emerald-50/60 border-emerald-300 text-slate-900 placeholder:text-slate-400"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-zinc-300" : "text-slate-700"
                      }`}
                    >
                      Stock Quantity *
                    </label>
                    <div className="relative">
                      <Archive className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input
                        type="number"
                        name="stock"
                        placeholder="100"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Savings Live Calculator Banner */}
                {savingsInfo && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-400 animate-pulse" />
                    <span>
                      Live Discount Calculator: Customer gets{" "}
                      <strong className="underline">
                        {savingsInfo.percent}% OFF
                      </strong>{" "}
                      and saves ₹{savingsInfo.savedAmount.toLocaleString("en-IN")}.00
                      per unit.
                    </span>
                  </div>
                )}
              </div>

              {/* 3. EARBUDS AUDIO & TECH SPECIFICATIONS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-inherit">
                  <div className="w-2 h-7 bg-indigo-500 rounded-full" />
                  <h3 className="text-lg font-bold tracking-tight">
                    Technical Specifications & Features
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Driver Unit */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Driver Unit</span>
                    </label>
                    <input
                      type="text"
                      value={specs.driver}
                      onChange={(e) =>
                        setSpecs({ ...specs, driver: e.target.value })
                      }
                      placeholder="e.g. 13mm Dual-Coaxial"
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  {/* ANC */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-blue-500" />
                      <span>Noise Cancellation</span>
                    </label>
                    <input
                      type="text"
                      value={specs.anc}
                      onChange={(e) =>
                        setSpecs({ ...specs, anc: e.target.value })
                      }
                      placeholder="e.g. 50dB Hybrid ANC"
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  {/* Battery */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Battery Playtime</span>
                    </label>
                    <input
                      type="text"
                      value={specs.battery}
                      onChange={(e) =>
                        setSpecs({ ...specs, battery: e.target.value })
                      }
                      placeholder="e.g. 70H Monster Play"
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  {/* Latency */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      <span>Gaming Latency</span>
                    </label>
                    <input
                      type="text"
                      value={specs.latency}
                      onChange={(e) =>
                        setSpecs({ ...specs, latency: e.target.value })
                      }
                      placeholder="e.g. 35ms Beast™ Mode"
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  {/* Waterproof */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${
                        isDark ? "text-zinc-400" : "text-slate-600"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Waterproof Rating</span>
                    </label>
                    <input
                      type="text"
                      value={specs.waterproof}
                      onChange={(e) =>
                        setSpecs({ ...specs, waterproof: e.target.value })
                      }
                      placeholder="e.g. IPX5 Splashproof / IPX7"
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                </div>

                {/* Dynamically Added Custom Specifications */}
                {customSpecs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {customSpecs.map((cs, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border relative transition-colors ${
                          isDark
                            ? "bg-zinc-900/60 border-zinc-800 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider truncate">
                            {cs.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomSpec(idx)}
                            className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Remove specification"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs font-semibold truncate">{cs.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Tech Specification Box */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isDark
                      ? "bg-zinc-900/40 border-zinc-800"
                      : "bg-slate-50/70 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        isDark ? "text-zinc-200" : "text-slate-700"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-500" />
                      <span>Add Extra / Custom Tech Specification</span>
                    </p>
                    <span className="text-[11px] text-zinc-500">
                      Add any custom spec (e.g. Bluetooth, Weight, Warranty)
                    </span>
                  </div>

                  {/* Quick Preset Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Bluetooth", value: "v5.4 Ultra-Sync" },
                      { label: "Microphone", value: "Quad Mic with AI ENC" },
                      { label: "Fast Charging", value: "10 Mins = 10 Hours" },
                      { label: "Total Weight", value: "44g Case + 4.2g Buds" },
                      { label: "Charging Port", value: "Type-C High Speed" },
                      { label: "Warranty", value: "1 Year Replacement" },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewSpecLabel(preset.label);
                          setNewSpecValue(preset.value);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isDark
                            ? "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-400"
                            : "bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600"
                        }`}
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Input Row */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newSpecLabel}
                      onChange={(e) => setNewSpecLabel(e.target.value)}
                      placeholder="Spec Name (e.g. Bluetooth Version)"
                      className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                          : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Spec Value (e.g. 5.4 Dual Pairing)"
                      className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                          : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSpec}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spec</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. KEY FEATURE HIGHLIGHTS BUILDER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-7 bg-amber-500 rounded-full" />
                    <h3 className="text-lg font-bold tracking-tight">
                      Key Feature Highlights
                    </h3>
                  </div>
                  <span className="text-xs text-amber-500 font-medium">
                    {features.length} Features Added
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="hover:text-rose-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Feature Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type custom feature highlight & press Add..."
                    className={`flex-1 px-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                      isDark
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Quick suggestions chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-zinc-500 mr-1">
                    Quick suggestions:
                  </span>
                  {QUICK_FEATURE_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        if (!features.includes(sug))
                          setFeatures([...features, sug]);
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        features.includes(sug)
                          ? "opacity-40 cursor-default line-through"
                          : isDark
                          ? "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. COLOR SHADES / SWATCHES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-7 bg-pink-500 rounded-full" />
                    <h3 className="text-lg font-bold tracking-tight">
                      Color Variants & Swatches
                    </h3>
                  </div>
                  <span className="text-xs text-pink-500 font-medium">
                    {selectedColors.length} Colors Active
                  </span>
                </div>

                {/* Active Selected Colors (with Remove option) */}
                <div className="space-y-1.5">
                  <p
                    className={`text-xs font-semibold ${
                      isDark ? "text-zinc-400" : "text-slate-600"
                    }`}
                  >
                    Active Color Variants for this Product:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedColors.map((color, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white"
                            : "bg-white border-slate-200 text-slate-800 shadow-xs"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="hover:text-red-400 text-zinc-400 ml-0.5 p-0.5 rounded cursor-pointer"
                          title="Remove color"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add Custom Color Input Box */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isDark
                      ? "bg-zinc-900/40 border-zinc-800"
                      : "bg-slate-50/70 border-slate-200"
                  }`}
                >
                  <p
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isDark ? "text-zinc-200" : "text-slate-700"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 text-pink-500" />
                    <span>Type Custom Color Name & Pick Shade</span>
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    {/* Color Picker Swatch Input */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label
                        htmlFor="color-picker-input"
                        className="relative w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 shadow-inner cursor-pointer shrink-0"
                        title="Click to pick color shade"
                      >
                        <input
                          id="color-picker-input"
                          type="color"
                          value={customColorHex}
                          onChange={(e) => setCustomColorHex(e.target.value)}
                          className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
                        />
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: customColorHex }}
                        />
                      </label>
                      <span className="text-xs font-mono text-zinc-400 uppercase sm:hidden">
                        {customColorHex}
                      </span>
                    </div>

                    {/* Custom Color Name Input */}
                    <input
                      type="text"
                      value={customColorName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomColorName(val);
                        // Smart auto-hex detection
                        const lower = val.toLowerCase();
                        if (lower.includes("blue") || lower.includes("navy"))
                          setCustomColorHex("#2563EB");
                        else if (
                          lower.includes("red") ||
                          lower.includes("crimson")
                        )
                          setCustomColorHex("#DC2626");
                        else if (
                          lower.includes("green") ||
                          lower.includes("teal")
                        )
                          setCustomColorHex("#059669");
                        else if (
                          lower.includes("black") ||
                          lower.includes("stealth") ||
                          lower.includes("dark")
                        )
                          setCustomColorHex("#18181B");
                        else if (
                          lower.includes("white") ||
                          lower.includes("silver")
                        )
                          setCustomColorHex("#F8FAFC");
                        else if (
                          lower.includes("gold") ||
                          lower.includes("champagne")
                        )
                          setCustomColorHex("#D97706");
                        else if (
                          lower.includes("purple") ||
                          lower.includes("violet")
                        )
                          setCustomColorHex("#7C3AED");
                        else if (
                          lower.includes("pink") ||
                          lower.includes("rose")
                        )
                          setCustomColorHex("#DB2777");
                        else if (lower.includes("orange"))
                          setCustomColorHex("#EA580C");
                        else if (lower.includes("yellow"))
                          setCustomColorHex("#CA8A04");
                        else if (
                          lower.includes("grey") ||
                          lower.includes("gray")
                        )
                          setCustomColorHex("#4B5563");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomColor();
                        }
                      }}
                      placeholder="Type color name (e.g. Midnight Blue, Rose Gold, Space Grey)..."
                      className={`flex-1 px-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500/30 w-full transition-all ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                          : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />

                    {/* Hex Code Input */}
                    <div className="relative w-full sm:w-28 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                        #
                      </span>
                      <input
                        type="text"
                        value={customColorHex.replace("#", "")}
                        onChange={(e) =>
                          setCustomColorHex(
                            `#${e.target.value.replace(/[^0-9A-Fa-f]/g, "")}`
                          )
                        }
                        maxLength={6}
                        placeholder="HEX"
                        className={`w-full pl-6 pr-2 py-2.5 text-xs font-mono uppercase rounded-xl border focus:outline-none focus:ring-1 focus:ring-pink-500 ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white"
                            : "bg-white border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    {/* Add Color Button */}
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-pink-500/20 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Color</span>
                    </button>
                  </div>

                  {/* Preset Swatches Suggestion Chips */}
                  <div className="pt-1">
                    <p className="text-[11px] text-zinc-500 mb-1.5">
                      Or pick from quick preset shades:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_COLOR_SWATCHES.map((swatch) => {
                        const isSelected = selectedColors.some(
                          (c) =>
                            c.name.toLowerCase() === swatch.name.toLowerCase()
                        );
                        return (
                          <button
                            key={swatch.name}
                            type="button"
                            onClick={() => handleToggleColor(swatch)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? "border-amber-400 bg-amber-500/15 text-amber-400"
                                  : "border-amber-400 bg-amber-50 text-amber-900"
                                : isDark
                                ? "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: swatch.hex }}
                            />
                            <span>{swatch.name}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-3 h-3 text-amber-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. MEDIA UPLOADER */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-inherit">
                  <div className="w-2 h-7 bg-blue-500 rounded-full" />
                  <h3 className="text-lg font-bold tracking-tight">
                    Product High-Res Media (Images & Videos)
                  </h3>
                </div>

                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    isDark
                      ? "border-zinc-800 hover:border-amber-500 hover:bg-zinc-900/50"
                      : "border-slate-300 hover:border-amber-400 hover:bg-amber-50/40"
                  }`}
                >
                  <label className="flex flex-col items-center space-y-3 cursor-pointer">
                    <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center shadow-xs">
                      <ImagePlus className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-base font-bold">
                        Upload Product Images & 3D Render Videos
                      </span>
                      <p className="text-xs text-zinc-500 mt-1">
                        PNG, JPG, WEBP, MP4 files up to 10MB (Multiple selection
                        supported)
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

                {/* Previews */}
                {mediaFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Selected Files ({mediaFiles.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {mediaFiles.map((media, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group shadow-md"
                        >
                          {media.type === "image" ? (
                            <img
                              src={media.previewUrl}
                              alt="Upload preview"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                              <Video className="w-8 h-8 text-amber-400" />
                            </div>
                          )}
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              PRIMARY
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 7. HOMEPAGE & TRENDING SYNC */}
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark
                    ? "bg-zinc-900/60 border-zinc-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold">
                    Homepage & Storefront Visibility Controls
                  </h4>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
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
                      className="w-4 h-4 rounded text-amber-500 border-zinc-700 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold">
                      Mark as Official Trending Product (Shows in Trending
                      Pills)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncToTrendingImage}
                      onChange={(e) => setSyncToTrendingImage(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 border-zinc-700 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-amber-400">
                      🌟 Also Auto-Sync to Homepage "Trending Bestsellers"
                      Showcase Banner
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className={`p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="text-xs text-zinc-400">
                Product will immediately be live in the store upon saving.
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Save & Publish Product</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;

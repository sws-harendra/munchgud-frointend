"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVariantCategories,
  fetchVariantOptions,
  fetchProductVariants,
  createProductVariant,
  deleteProductVariant,
  addVariantCategory,
  addVariantOption,
  deleteVariantCategory,
  deleteVariantOption,
} from "@/app/lib/store/features/variantSlice";
import {
  Plus,
  Search,
  Trash2,
  X,
  Palette,
  Layers,
  ArrowLeft,
  ImagePlus,
  Package,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { AppDispatch, RootState } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";

interface Product {
  id: number;
  name: string;
}

function ProductVariantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryProductId = searchParams.get("productId");

  const dispatch = useDispatch<AppDispatch>();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const { categories, options, productVariants } = useSelector(
    (state: RootState) => state.variants
  );

  const rawProducts = useSelector((state: RootState) => state.product.products);
  const productList: Product[] = useMemo(() => {
    if (!rawProducts) return [];
    if (Array.isArray(rawProducts)) return rawProducts as any;
    if ("products" in (rawProducts as any) && Array.isArray((rawProducts as any).products)) {
      return (rawProducts as any).products as any;
    }
    return [];
  }, [rawProducts]);

  // State
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newOption, setNewOption] = useState({ name: "", categoryId: "", hexCode: "#000000" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);

  // Variant Form state (multi-image support)
  const [newVariant, setNewVariant] = useState({
    optionId: "",
    sku: "",
    price: "",
    originalPrice: "",
    stock: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Fetch categories & options on mount
  useEffect(() => {
    dispatch(fetchVariantCategories());
    dispatch(fetchVariantOptions());
  }, [dispatch]);

  // Load product from query param if available
  useEffect(() => {
    if (queryProductId) {
      const pid = parseInt(queryProductId);
      if (!isNaN(pid)) {
        // Find in products list if loaded, or fetch
        const found = productList.find((p: Product) => p.id === pid);
        if (found) {
          setSelectedProduct({ id: found.id, name: found.name });
        } else {
          // Trigger search or select directly with ID
          setSelectedProduct({ id: pid, name: `Product #${pid}` });
        }
      }
    }
  }, [queryProductId, productList]);

  // Fetch variants whenever selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchProductVariants(selectedProduct.id));
    }
  }, [dispatch, selectedProduct]);

  // Debounced product search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        dispatch(fetchProducts({ search }));
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  // =========================
  // Image Handlers
  // =========================
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...incoming]);

      const newUrls = incoming.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const urlToRemove = previewUrls[index];
    if (urlToRemove) URL.revokeObjectURL(urlToRemove);

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const resetVariantForm = () => {
    setNewVariant({
      optionId: "",
      sku: "",
      price: "",
      originalPrice: "",
      stock: "",
    });
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  // =========================
  // Add Handlers
  // =========================
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      await dispatch(addVariantCategory(newCategory)).unwrap();
      toast.success("Variant Category added successfully!");
      setNewCategory({ name: "", description: "" });
      setShowAddCategory(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add category.");
    }
  };

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.name.trim() || !newOption.categoryId) return;
    try {
      await dispatch(
        addVariantOption({
          name: newOption.name.trim(),
          categoryId: parseInt(newOption.categoryId),
          hexCode: newOption.hexCode,
        } as any)
      ).unwrap();
      toast.success("Option added successfully!");
      setNewOption({ name: "", categoryId: "", hexCode: "#000000" });
      setShowAddOption(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add option.");
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVariant.optionId || !selectedProduct) {
      toast.error("Please choose a Color/Option and select a product");
      return;
    }
    if (!newVariant.price || parseFloat(newVariant.price) <= 0) {
      toast.error("Please enter a valid price for this variant");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createProductVariant({
          productId: selectedProduct.id,
          data: {
            optionId: parseInt(newVariant.optionId),
            sku: newVariant.sku.trim() || undefined,
            price: parseFloat(newVariant.price),
            originalPrice: newVariant.originalPrice ? parseFloat(newVariant.originalPrice) : undefined,
            stock: parseInt(newVariant.stock) || 0,
            images: selectedFiles,
          },
        })
      ).unwrap();

      toast.success("Color Variant Added Successfully! 🎉");
      resetVariantForm();
      setShowAddVariant(false);
      // Refresh variants
      dispatch(fetchProductVariants(selectedProduct.id));
    } catch (err: any) {
      console.error("Failed to add variant:", err);
      toast.error(err?.message || "Failed to add variant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // Delete Handlers
  // =========================
  const handleDeleteVariant = async (variantId: number) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await dispatch(deleteProductVariant(variantId)).unwrap();
        toast.success("Variant deleted successfully!");
        if (selectedProduct) {
          dispatch(fetchProductVariants(selectedProduct.id));
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete variant.");
      }
    }
  };

  const currentVariants = selectedProduct ? productVariants[selectedProduct.id] || [] : [];

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-200 ${isDark ? "bg-[#09090b] text-white" : "bg-slate-50 text-slate-900"}`}>
      {/* Top Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold">
                <Palette size={20} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Product Color & Variant Management
              </h1>
            </div>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Add multiple colors to the same product with separate images, pricing (MRP/Selling), and stock inventory (Amazon & Flipkart style).
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
              isDark
                ? "border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
            }`}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        {/* Product Selection Bar */}
        <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"}`}>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            Select Product to Manage Colors & Variants *
          </label>
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${
                  isDark
                    ? "bg-zinc-950 border-zinc-700 text-white focus:border-amber-400"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white"
                }`}
                placeholder="Type product name to search (e.g. Earbuds, Gold Pro X)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowProductDropdown(true);
                }}
                onFocus={() => setShowProductDropdown(true)}
              />
            </div>

            {/* Dropdown list */}
            {showProductDropdown && (
              <div
                className={`absolute z-20 mt-1.5 w-full rounded-xl shadow-xl border overflow-hidden max-h-64 overflow-y-auto ${
                  isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-slate-200"
                }`}
              >
                {productList.length > 0 ? (
                  productList.map((p: Product) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct({ id: p.id, name: p.name });
                        setShowProductDropdown(false);
                        setSearch("");
                      }}
                      className={`px-4 py-3 cursor-pointer text-sm font-medium flex items-center justify-between transition-colors ${
                        isDark ? "hover:bg-zinc-800 text-zinc-200" : "hover:bg-amber-50 text-slate-800"
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-amber-500 font-bold">ID: #{p.id}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-neutral-400">
                    No products found. Start typing product name.
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="mt-3.5 flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-500" />
                <span className="text-sm font-bold text-amber-500">
                  Active Product: {selectedProduct.name} (ID: #{selectedProduct.id})
                </span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                Change Product
              </button>
            </div>
          )}
        </div>

        {/* 3 Overview Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Categories Card */}
          <div className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"}`}>
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Layers size={17} className="text-amber-500" />
                  <h3 className="font-bold text-base">Variant Categories</h3>
                </div>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 transition-colors"
                  title="Add Category"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                      isDark ? "border-zinc-800 bg-zinc-950/40" : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold">{cat.name}</span>
                    <button
                      onClick={() => dispatch(deleteVariantCategory(cat.id))}
                      className="text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className={`text-[11px] mt-3 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
              Categories group options (e.g., Color, Size).
            </p>
          </div>

          {/* Options Card */}
          <div className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"}`}>
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Palette size={17} className="text-amber-500" />
                  <h3 className="font-bold text-base">Options & Colors</h3>
                </div>
                <button
                  onClick={() => setShowAddOption(true)}
                  className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 transition-colors"
                  title="Add Color / Option"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                      isDark ? "border-zinc-800 bg-zinc-950/40" : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: (opt as any).hexCode || "#111827" }}
                      />
                      <span className="font-semibold">{opt.name}</span>
                    </div>
                    <button
                      onClick={() => dispatch(deleteVariantOption(opt.id))}
                      className="text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className={`text-[11px] mt-3 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
              Available colors: Obsidian Black, Gold, Blue, etc.
            </p>
          </div>

          {/* Add Variant CTA Box */}
          <div className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${isDark ? "bg-gradient-to-br from-amber-500/10 via-zinc-900/60 to-zinc-900 border-amber-500/20" : "bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-200"}`}>
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-extrabold text-base">
                <Sparkles size={18} />
                <h3>Add New Color Variant</h3>
              </div>
              <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-slate-600"}`}>
                Add another color to <span className="font-bold text-amber-500">{selectedProduct?.name || "a product"}</span> with its own separate gallery photos, selling price, and inventory stock.
              </p>
            </div>

            <button
              disabled={!selectedProduct}
              onClick={() => setShowAddVariant(true)}
              className={`mt-4 w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                selectedProduct
                  ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20 hover:scale-[1.01]"
                  : "bg-neutral-300 dark:bg-zinc-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              <Plus size={16} />
              <span>{selectedProduct ? `Add Color to ${selectedProduct.name}` : "Select Product First"}</span>
            </button>
          </div>
        </div>

        {/* Existing Variants List for Selected Product */}
        {selectedProduct && (
          <div className={`rounded-2xl border shadow-xs overflow-hidden ${isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"}`}>
            <div className="p-5 border-b border-neutral-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>Current Variants for</span>
                  <span className="text-amber-500">{selectedProduct.name}</span>
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                  {currentVariants.length} color variant{currentVariants.length === 1 ? "" : "s"} linked with this product.
                </p>
              </div>

              <button
                onClick={() => setShowAddVariant(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Add Another Color</span>
              </button>
            </div>

            {currentVariants.length > 0 ? (
              <div className="divide-y divide-neutral-200 dark:divide-zinc-800">
                {currentVariants.map((v) => {
                  const opt = options.find((o) => o.id === (v as any).optionId) || (v as any).options?.[0];
                  const hex = opt?.hexCode || "#111827";
                  const colorName = opt?.name || (v as any).sku || "Variant";

                  // Extract images list
                  const vImages: string[] = Array.isArray(v.images) && v.images.length > 0
                    ? v.images
                    : v.image
                    ? [v.image]
                    : [];

                  return (
                    <div
                      key={v.id}
                      className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                        isDark ? "hover:bg-zinc-900/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Left: Swatch + Photos */}
                      <div className="flex items-center gap-4">
                        {/* Swatch indicator */}
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-md shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: hex }}
                          title={colorName}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                              {colorName}
                            </h4>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400">
                              SKU: {v.sku || "N/A"}
                            </span>
                          </div>

                          {/* Photos Strip */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {vImages.length > 0 ? (
                              vImages.map((img, i) => (
                                <img
                                  key={i}
                                  src={getImageUrl(img)}
                                  alt={`var-img-${i}`}
                                  className="w-10 h-10 object-cover rounded-lg border border-neutral-200 dark:border-zinc-700 bg-neutral-100 dark:bg-zinc-800"
                                />
                              ))
                            ) : (
                              <span className="text-xs text-neutral-400 italic">No custom images uploaded</span>
                            )}
                            {vImages.length > 0 && (
                              <span className="text-[10px] text-neutral-400 font-semibold ml-1">
                                ({vImages.length} photo{vImages.length > 1 ? "s" : ""})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Stock & Actions */}
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-emerald-500">
                            ₹{Number(v.price).toLocaleString("en-IN")}
                          </div>
                          {v.originalPrice && Number(v.originalPrice) > Number(v.price) && (
                            <div className="text-xs line-through text-neutral-400">
                              MRP: ₹{Number(v.originalPrice).toLocaleString("en-IN")}
                            </div>
                          )}
                        </div>

                        <div>
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              v.stock > 0
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                            }`}
                          >
                            {v.stock > 0 ? `${v.stock} in stock` : "Sold Out"}
                          </span>
                        </div>

                        <button
                          title="Delete variant"
                          onClick={() => handleDeleteVariant(v.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-400 space-y-2">
                <Palette size={32} className="mx-auto text-amber-500 opacity-60" />
                <p className="text-sm font-semibold">No color variants added for this product yet.</p>
                <p className="text-xs">Click &ldquo;Add New Color Variant&rdquo; above to add Black, Gold, Blue, etc.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODAL: ADD VARIANT (WITH MULTI-IMAGE & PRICE & MRP)
        ======================================================== */}
        {showAddVariant && selectedProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col ${isDark ? "bg-[#121215] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
              {/* Modal Header */}
              <div className="p-5 border-b border-neutral-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" />
                    <span>Add Color Variant for</span>
                  </h3>
                  <p className="text-xs text-amber-500 font-semibold">{selectedProduct.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddVariant(false);
                    resetVariantForm();
                  }}
                  className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddVariant} className="p-6 space-y-4 overflow-y-auto">
                {/* 1. Choose Color/Option */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Select Color / Option *
                  </label>
                  <select
                    required
                    value={newVariant.optionId}
                    onChange={(e) => {
                      const optId = e.target.value;
                      const selectedOpt = options.find((o) => o.id === parseInt(optId));
                      const generatedSku = selectedOpt
                        ? `${selectedProduct.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase()}-${selectedOpt.name.toUpperCase()}`
                        : "";
                      setNewVariant((prev) => ({
                        ...prev,
                        optionId: optId,
                        sku: prev.sku || generatedSku,
                      }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none ${
                      isDark
                        ? "bg-zinc-900 border-zinc-700 text-white focus:border-amber-400"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                    }`}
                  >
                    <option value="">-- Choose Color (e.g. Obsidian Black, Gold) --</option>
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} ({categories.find((c) => c.id === opt.categoryId)?.name || "Variant"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. SKU (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    SKU (Unique Code)
                  </label>
                  <input
                    type="text"
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                    placeholder="e.g. FLAZO-GOLD-01"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark
                        ? "bg-zinc-900 border-zinc-700 text-white focus:border-amber-400"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                </div>

                {/* 3. Pricing Row: Selling Price + MRP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                      Selling Price (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={newVariant.price}
                        onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                        placeholder="e.g. 2499"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-bold text-emerald-500 outline-none ${
                          isDark
                            ? "bg-zinc-900 border-zinc-700 focus:border-amber-400"
                            : "bg-slate-50 border-slate-300 focus:border-amber-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                      Original Price / MRP (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newVariant.originalPrice}
                        onChange={(e) => setNewVariant({ ...newVariant, originalPrice: e.target.value })}
                        placeholder="e.g. 6999"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none ${
                          isDark
                            ? "bg-zinc-900 border-zinc-700 focus:border-amber-400"
                            : "bg-slate-50 border-slate-300 focus:border-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Stock Inventory */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newVariant.stock}
                    onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                    placeholder="e.g. 50"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark
                        ? "bg-zinc-900 border-zinc-700 text-white focus:border-amber-400"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                </div>

                {/* 5. MULTIPLE IMAGES UPLOADER */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider">
                      Upload Gallery Photos for this Color
                    </label>
                    <span className="text-[11px] text-amber-500 font-semibold">
                      {selectedFiles.length} photo{selectedFiles.length === 1 ? "" : "s"} selected
                    </span>
                  </div>

                  {/* Drop area */}
                  <label className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    isDark
                      ? "border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-amber-400"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-amber-500"
                  }`}>
                    <ImagePlus className="w-7 h-7 text-amber-500 mb-1" />
                    <span className="text-xs font-bold text-neutral-700 dark:text-zinc-200">
                      Click to choose photos of this specific color
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-0.5">
                      Select 1 to 5 images (PNG, JPG, WEBP)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                  </label>

                  {/* Previews Grid */}
                  {previewUrls.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-300 dark:border-zinc-700 group">
                          <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddVariant(false);
                      resetVariantForm();
                    }}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-zinc-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Uploading & Saving..." : "Save Variant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: ADD VARIANT CATEGORY (e.g. Color)
        ======================================================== */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 ${isDark ? "bg-[#121215] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-zinc-800">
                <h3 className="font-bold text-base">Add Variant Category</h3>
                <button onClick={() => setShowAddCategory(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Color, Size, Storage"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Product shade and color finishes"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: ADD OPTION (e.g. Obsidian Black with Hex)
        ======================================================== */}
        {showAddOption && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 ${isDark ? "bg-[#121215] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-zinc-800">
                <h3 className="font-bold text-base">Add Option / Color</h3>
                <button onClick={() => setShowAddOption(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddOption} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Option Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Champagne Gold, Obsidian Black"
                    value={newOption.name}
                    onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Under Category *</label>
                  <select
                    required
                    value={newOption.categoryId}
                    onChange={(e) => setNewOption({ ...newOption, categoryId: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Hex Color Code</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newOption.hexCode}
                      onChange={(e) => setNewOption({ ...newOption, hexCode: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-300 dark:border-zinc-700 p-0.5"
                    />
                    <input
                      type="text"
                      value={newOption.hexCode}
                      onChange={(e) => setNewOption({ ...newOption, hexCode: e.target.value })}
                      placeholder="#D97706"
                      className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                        isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddOption(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold"
                  >
                    Save Option
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductVariantsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-sm font-bold text-amber-500">
          Loading Variant Management...
        </div>
      }
    >
      <ProductVariantsContent />
    </Suspense>
  );
}

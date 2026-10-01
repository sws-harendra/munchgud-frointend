"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Package,
  Sparkles,
} from "lucide-react";
import { createSection } from "@/app/lib/store/features/sectionSlice";
import { toast } from "react-hot-toast";
import { useAdminTheme } from "../context/AdminThemeContext";
import Loader from "@/app/commonComponents/loader";

export default function AddSectionForm({ onSuccess }: { onSuccess?: () => void }) {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { products, status } = useAppSelector((state) => state.product);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("manual");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const loading = status === "loading";

  // Fetch products when search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchProducts({ search }));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  const toggleProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        createSection({
          title,
          description,
          type,
          order,
          isActive,
          productIds: selectedProducts,
        }),
      ).unwrap();

      toast.success("Section created successfully!");
      setTitle("");
      setDescription("");
      setType("manual");
      setOrder(0);
      setIsActive(true);
      setSelectedProducts([]);
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create section:", error);
      toast.error(error?.message || error?.data?.message || "Failed to create section");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-600/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Create New Section</h2>
            <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
              Build and organize product collections for your storefront
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-7 transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
            : "bg-white border-slate-200/80 text-gray-900 shadow-md"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                Section Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
                }`}
                placeholder="e.g. Best Sellers, Trending, Summer Special..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                Display Order
              </label>
              <input
                type="number"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
                }`}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
              }`}
              placeholder="Describe what kind of products this section highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Active Toggle */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              isDarkMode
                ? "bg-zinc-900/60 border-zinc-800"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isActive
                    ? isDarkMode
                      ? "bg-emerald-950/60 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                    : isDarkMode
                    ? "bg-zinc-800 text-zinc-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Section Status
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  {isActive
                    ? "Active and visible on storefront"
                    : "Hidden from customers"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <div
                className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  isDarkMode
                    ? "bg-zinc-700 peer-checked:bg-indigo-600"
                    : "bg-gray-200 peer-checked:bg-indigo-600"
                }`}
              />
            </label>
          </div>

          {/* Product Search */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-400" />
              <h3
                className={`text-sm font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-200" : "text-gray-800"
                }`}
              >
                Attach Products
              </h3>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type="text"
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
                }`}
                placeholder="Search products by title or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Product List */}
          <div
            className={`rounded-2xl border p-3 ${
              isDarkMode
                ? "bg-zinc-900/40 border-zinc-800"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader inline size={90} text="Loading products..." />
                </div>
              )}

              {!loading &&
                Array.isArray(products?.products) &&
                products.products.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-10 w-10 text-zinc-500 mx-auto mb-2 opacity-50" />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      No products found
                    </p>
                  </div>
                )}

              {!loading &&
                Array.isArray(products?.products) &&
                products.products.length > 0 &&
                products.products?.map((product: any) => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? isDarkMode
                            ? "bg-indigo-950/60 border-indigo-700/80 text-white"
                            : "bg-indigo-50 border-indigo-300 text-indigo-950"
                          : isDarkMode
                          ? "bg-zinc-900/70 border-zinc-800/80 hover:border-zinc-700 text-zinc-200 hover:bg-zinc-900"
                          : "bg-white border-gray-200 hover:border-gray-300 text-gray-800 hover:shadow-xs"
                      }`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="flex-1 pr-2">
                        <p
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {product.name}
                        </p>
                        <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                          ₹{product.discountPrice}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-rose-500/20 text-rose-400"
                            : isDarkMode
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-gray-100 text-gray-600 hover:bg-indigo-100"
                        }`}
                      >
                        {isSelected ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div
              className={`rounded-2xl p-4 border transition-colors ${
                isDarkMode
                  ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                  : "bg-emerald-50/70 border-emerald-200 text-emerald-800"
              }`}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Selected Products ({selectedProducts.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((id) => {
                  const product = products?.products?.find(
                    (p: any) => p.id === id,
                  );
                  return (
                    <span
                      key={id}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        isDarkMode
                          ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-200"
                          : "bg-emerald-100 border-emerald-200 text-emerald-800"
                      }`}
                    >
                      {product?.title || product?.name || `Product #${id}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Search,
  RefreshCcw,
  Plus,
  Filter,
  X,
  ChevronDown,
  Package,
  TrendingUp,
  ShoppingCart,
  SeparatorVertical,
  Flame,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchProducts,
  deleteProduct,
  fetchProductsforadmin,
} from "@/app/lib/store/features/productSlice";
import { Product } from "@/app/types/product.types";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import SidebarForm from "../../components/SidebarForm";
import AddProducts from "../../components/addproduct";
import EditProduct from "../../components/editProduct";
import ProductPreviewModal from "../../components/viewproducts";
import Link from "next/link";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const { products, error, status } = useAppSelector((state) => state.product);
  const isLoading = status === "loading";

  // Filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [trending, setTrending] = useState<boolean | undefined>();
  const [minSellingPrice, setMinSellingPrice] = useState<number | undefined>();
  const [maxSellingPrice, setMaxSellingPrice] = useState<number | undefined>();
  const [brand, setBrand] = useState<string | undefined>();
  const [barcode, setBarcode] = useState<string | undefined>();
  const [tax, setTax] = useState<number | undefined>();
  const [unit, setUnit] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [purchasable, setPurchasable] = useState<boolean | undefined>();
  const [showStockOut, setShowStockOut] = useState<boolean | undefined>();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchProductsforadmin({
        search,
        categoryId,
        minPrice,
        maxPrice,
        trending,
        page,
        limit,
        minSellingPrice,
        maxSellingPrice,
        brand,
        barcode,
        tax,
        unit,
        status: statusFilter,
        purchasable,
        showStockOut,
      })
    );
  }, [
    dispatch,
    search,
    categoryId,
    minPrice,
    maxPrice,
    trending,
    page,
    limit,
    minSellingPrice,
    maxSellingPrice,
    brand,
    barcode,
    tax,
    unit,
    statusFilter,
    purchasable,
    showStockOut,
  ]);
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setTrending(undefined);
    setMinSellingPrice(undefined);
    setMaxSellingPrice(undefined);
    setBrand(undefined);
    setBarcode(undefined);
    setTax(undefined);
    setUnit(undefined);
    setStatusFilter(undefined);
    setPurchasable(undefined);
    setShowStockOut(undefined);
    setPage(1);
  };

  const totalProducts = products?.total || 0;
  const activeProducts = products?.activeProducts || 0;

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-200 ${
        isDark ? "bg-black text-zinc-100" : "bg-slate-50/60 text-slate-800"
      }`}
    >
      {/* Header Banner */}
      <div
        className={`rounded-2xl p-6 border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
            : "bg-white border-slate-200/80 shadow-xs text-slate-900"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl border ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-amber-400"
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}
          >
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Products Inventory
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Catalog
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Manage your Earbuds, audio equipment, stock levels, and store inventory
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter size={16} />
            {showFilters ? "Hide Filters" : "Filter Catalog"}
          </button>

          <button
            onClick={resetFilters}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <X size={15} />
            Reset
          </button>

          <button
            onClick={() => dispatch(fetchProductsforadmin({ page, limit }))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-emerald-400 hover:bg-zinc-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <RefreshCcw size={15} />
            Refresh
          </button>

          <SidebarForm
            title="Add New Product"
            trigger={
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            }
          >
            <AddProducts />
          </SidebarForm>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className={`rounded-2xl p-4.5 border transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                Total Products
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {totalProducts}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-900 text-amber-400 border border-zinc-800" : "bg-blue-50 text-blue-600"}`}>
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl p-4.5 border transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                In Stock & Active
              </p>
              <p className="text-2xl font-bold tracking-tight text-emerald-500">
                {Array.isArray(products?.products) ? activeProducts : 0}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-600"}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl p-4.5 border transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                Low Stock (&lt; 10)
              </p>
              <p className="text-2xl font-bold tracking-tight text-amber-500">
                {Array.isArray(products?.products)
                  ? products.products.filter((p) => (p.stock ?? 0) < 10 && (p.stock ?? 0) > 0)
                      .length
                  : 0}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-600"}`}>
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl p-4.5 border transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                Sold Out / Depleted
              </p>
              <p className="text-2xl font-bold tracking-tight text-rose-500">
                {Array.isArray(products?.products)
                  ? products.products.filter((p) => (p.stock ?? 0) === 0)
                      .length
                  : 0}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-600"}`}>
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className={isDark ? "text-zinc-500" : "text-slate-400"} />
        </div>
        <input
          type="text"
          placeholder="Search products by title, audio specs, driver type or tags..."
          className={`w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500 shadow-xl"
              : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-xs"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div
          className={`rounded-2xl p-6 border mb-6 transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200 text-slate-800 shadow-xs"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Price Range */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                MRP Range
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                  value={minPrice || ""}
                  onChange={(e) =>
                    setMinPrice(Number(e.target.value) || undefined)
                  }
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                  value={maxPrice || ""}
                  onChange={(e) =>
                    setMaxPrice(Number(e.target.value) || undefined)
                  }
                />
              </div>
            </div>

            {/* Selling Price Range */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Selling Price
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                  value={minSellingPrice || ""}
                  onChange={(e) =>
                    setMinSellingPrice(Number(e.target.value) || undefined)
                  }
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                  value={maxSellingPrice || ""}
                  onChange={(e) =>
                    setMaxSellingPrice(Number(e.target.value) || undefined)
                  }
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Status
              </h3>
              <select
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200"
                }`}
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || undefined)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Boolean Options */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Special Visibility
              </h3>
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={!!trending}
                    onChange={() => setTrending(trending ? undefined : true)}
                    className="w-3.5 h-3.5 text-amber-500 rounded border-zinc-700"
                  />
                  <span>Show Trending Products Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={!!showStockOut}
                    onChange={() =>
                      setShowStockOut(showStockOut ? undefined : true)
                    }
                    className="w-3.5 h-3.5 text-amber-500 rounded border-zinc-700"
                  />
                  <span>Show Out of Stock Products</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table Card */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800 shadow-xl" : "bg-white border-slate-200/80"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className={`border-b text-xs uppercase tracking-wider font-semibold ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-400"
                  : "bg-slate-50/80 border-slate-200 text-slate-600"
              }`}
            >
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">MRP</th>
                <th className="px-6 py-4">Sale Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Trending</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-zinc-850" : "divide-slate-100"}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3"></div>
                      <p className={`text-xs font-semibold ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                        Loading products catalog...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : Array.isArray(products?.products) &&
                products.products.length > 0 ? (
                products.products.map((product: Product, index: number) => (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-zinc-900/60" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-xs font-mono ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0].startsWith("http") || product.images[0].startsWith("/")
                                ? product.images[0]
                                : getImageUrl(product.images[0])
                              : "/images/spotlight-earbud.jpg"
                          }
                          alt={product.name}
                          className={`w-11 h-11 object-cover rounded-xl border shrink-0 ${
                            isDark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-100"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className={`text-sm font-semibold truncate max-w-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                            {product.name}
                          </div>
                          <div className={`text-[11px] truncate mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                            {product.varientValue || "Standard Edition"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isDark
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {product.Category?.name || "Earbuds"}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-xs line-through ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                      ₹{product.originalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">
                      ₹{product.discountPrice || product.originalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          (product.stock ?? 0) === 0
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : (product.stock ?? 0) < 10
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {(product.stock ?? 0) === 0
                          ? "Sold Out"
                          : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.trending_product ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Flame size={12} />
                          Trending
                        </span>
                      ) : (
                        <span className={`text-xs ${isDark ? "text-zinc-600" : "text-slate-400"}`}>
                          Regular
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-xs ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                      {new Date(product.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="Preview Product"
                          onClick={() => handleViewProduct(product)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <Eye size={15} />
                        </button>

                        <SidebarForm
                          title={`Edit ${product.name}`}
                          trigger={
                            <button
                              title="Edit Product"
                              className={`p-2 rounded-lg transition-colors ${
                                isDark
                                  ? "text-zinc-400 hover:text-amber-400 hover:bg-zinc-900"
                                  : "text-slate-600 hover:text-amber-600 hover:bg-amber-50"
                              }`}
                            >
                              <Edit size={15} />
                            </button>
                          }
                        >
                          <EditProduct productId={product.id} />
                        </SidebarForm>

                        <button
                          title="Delete Product"
                          onClick={() => handleDelete(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "text-zinc-400 hover:text-rose-400 hover:bg-zinc-900"
                              : "text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="w-10 h-10 text-zinc-500 mb-2" />
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        No products found
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                        Try clearing search filters or click "Add Product" above
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark
                ? "bg-zinc-900/90 border-zinc-800"
                : "bg-slate-50/60 border-slate-200"
            }`}
          >
            <p className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Showing{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {Math.min(page * limit, totalProducts)}
              </span>{" "}
              of{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {totalProducts}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                Previous
              </button>

              <span className={`text-xs font-semibold px-2 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductPreviewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

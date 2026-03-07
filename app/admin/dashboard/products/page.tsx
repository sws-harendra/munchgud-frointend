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

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
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
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Products</h1>
              <p className="text-slate-600 text-sm">
                Manage your inventory and product catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Filter size={18} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <X size={18} />
              Clear
            </button>

            <button
              onClick={() => dispatch(fetchProducts({ page, limit }))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>

            <SidebarForm
              title="Add Product"
              trigger={
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">
                  <Plus size={18} />
                  Add Product
                </button>
              }
            >
              <AddProducts />
            </SidebarForm>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalProducts}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Active Products
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {Array.isArray(products?.products) ? activeProducts : 0}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">
                  {Array.isArray(products?.products)
                    ? products.products.filter((p) => (p.stock ?? 0) < 10)
                        .length
                    : 0}
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {Array.isArray(products?.products)
                    ? products.products.filter((p) => (p.stock ?? 0) === 0)
                        .length
                    : 0}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="w-5 h-5 text-green-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search products by name, description or tags..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Price Range
              </h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  value={minPrice || ""}
                  onChange={(e) =>
                    setMinPrice(Number(e.target.value) || undefined)
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  value={maxPrice || ""}
                  onChange={(e) =>
                    setMaxPrice(Number(e.target.value) || undefined)
                  }
                />
              </div>
            </div>

            {/* Selling Price Range */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Selling Price
              </h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  value={minSellingPrice || ""}
                  onChange={(e) =>
                    setMinSellingPrice(Number(e.target.value) || undefined)
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  value={maxSellingPrice || ""}
                  onChange={(e) =>
                    setMaxSellingPrice(Number(e.target.value) || undefined)
                  }
                />
              </div>
            </div>

            {/* Brand & Barcode */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Brand & Barcode
              </h3>
              <input
                type="text"
                placeholder="Brand name"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                value={brand || ""}
                onChange={(e) => setBrand(e.target.value || undefined)}
              />
              <input
                type="text"
                placeholder="Barcode"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                value={barcode || ""}
                onChange={(e) => setBarcode(e.target.value || undefined)}
              />
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Other Filters
              </h3>
              <input
                type="number"
                placeholder="Tax (%)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                value={tax || ""}
                onChange={(e) => setTax(Number(e.target.value) || undefined)}
              />
              <input
                type="text"
                placeholder="Unit"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                value={unit || ""}
                onChange={(e) => setUnit(e.target.value || undefined)}
              />
            </div>

            {/* Status Filters */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Status</h3>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || undefined)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Boolean Filters */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Options</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!trending}
                    onChange={() => setTrending(trending ? undefined : true)}
                    className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 text-sm">Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!purchasable}
                    onChange={() =>
                      setPurchasable(purchasable ? undefined : true)
                    }
                    className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 text-sm">Purchasable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!showStockOut}
                    onChange={() =>
                      setShowStockOut(showStockOut ? undefined : true)
                    }
                    className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 text-sm">Show Stock Out</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Stock
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Brand
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-slate-500 font-medium">
                        Loading products...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : Array.isArray(products?.products) &&
                products.products.length > 0 ? (
                products.products.map((product: Product, index: number) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            getImageUrl(product.images?.[0]) || "/no-image.png"
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-xl mr-4 border border-slate-200"
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900 max-w-xs truncate">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {product.Category?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      ₹{product.originalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                      ₹{product.discountPrice || product.originalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          (product.stock ?? 0) === 0
                            ? "bg-red-100 text-green-800"
                            : (product.stock ?? 0) < 10
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {product.stock ?? "0"}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {product.brand || "-"}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          product.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : product.status === "inactive"
                            ? "bg-red-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {product.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {" "}
                        {product?.ProductVariants?.length > 0 && (
                          <Link
                            href={`/admin/dashboard/products/${product.id}`}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Manage Variants"
                          >
                            <SeparatorVertical size={16} />
                          </Link>
                        )}
                        <button
                          title="View"
                          onClick={() => handleViewProduct(product)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <SidebarForm
                          title="Edit Product"
                          trigger={
                            <button
                              title="Edit"
                              className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                          }
                        >
                          <EditProduct productId={product.id} />
                        </SidebarForm>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-100 text-green-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-slate-400 mb-3" />
                      <p className="text-slate-500 font-medium">
                        No products found
                      </p>
                      <p className="text-slate-400 text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalProducts)} of {totalProducts}{" "}
                results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pageNum === page
                            ? "bg-indigo-600 text-white"
                            : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
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

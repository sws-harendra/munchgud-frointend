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

export default function AddSectionForm() {
  const dispatch = useAppDispatch();
  const { products, status } = useAppSelector((state) => state.product);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("manual");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const loading = status == "loading";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createSection({
        title,
        description,
        type,
        order,
        isActive,
        productIds: selectedProducts,
      }),
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Create New Section</h2>
            <p className="text-indigo-100 mt-1">
              Build your product collection
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Section Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter section title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
              placeholder="Describe your section..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isActive ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <CheckCircle2
                  className={`h-5 w-5 ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-700">Section Status</p>
                <p className="text-sm text-gray-500">
                  {isActive ? "Active and visible" : "Hidden from users"}
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Product Search */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Add Products
              </h3>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Product List */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="max-h-80 overflow-y-auto space-y-2">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}

              {!loading &&
                Array.isArray(products?.products) &&
                products.products.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}

              {!loading &&
                Array.isArray(products?.products) &&
                products.products.length > 0 &&
                products.products?.map((product: any) => (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedProducts.includes(product.id)
                        ? "bg-indigo-50 border-2 border-indigo-200 shadow-sm"
                        : "bg-white border border-gray-200 hover:shadow-md hover:border-gray-300"
                    }`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-indigo-600 font-medium">
                        ₹{product.discountPrice}
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        selectedProducts.includes(product.id)
                          ? "bg-red-100"
                          : "bg-gray-100 hover:bg-indigo-100"
                      }`}
                    >
                      {selectedProducts.includes(product.id) ? (
                        <Trash2 className="text-green-700 h-5 w-5" />
                      ) : (
                        <Plus className="text-gray-600 h-5 w-5" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Selected Products ({selectedProducts.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((id) => {
                  const product = products.products.find(
                    (p: any) => p.id === id,
                  );
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                    >
                      {product?.title || product?.name || `Product #${id}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

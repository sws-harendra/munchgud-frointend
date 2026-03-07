"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { updateSection } from "@/app/lib/store/features/sectionSlice";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Package,
  Sparkles,
} from "lucide-react";

export default function EditSectionForm({ section }: { section: any }) {
  const dispatch = useAppDispatch();
  const { products, status } = useAppSelector((state) => state.product);

  const [title, setTitle] = useState(section?.title || "");
  const [description, setDescription] = useState(section?.description || "");
  const [type, setType] = useState(section?.type || "manual");
  const [order, setOrder] = useState(section?.order || 0);
  const [isActive, setIsActive] = useState(section?.isActive ?? true);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>(
    section?.Products?.map((p: any) => p.id) || [],
  );

  const loading = status == "loading";

  // fetch products on search
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
      updateSection({
        id: section.id,
        data: {
          title,
          description,
          type,
          order,
          isActive,
          productIds: selectedProducts,
        },
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
            <h2 className="text-2xl font-bold">Edit Section</h2>
            <p className="text-indigo-100 mt-1">
              Update section details and add products
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Section Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`h-5 w-5 ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span className="font-semibold text-gray-700">
                {isActive ? "Active" : "Hidden"}
              </span>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>

          {/* Search + Product List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto space-y-2">
              {loading && <p className="text-center">Loading...</p>}
              {!loading &&
                Array.isArray(products?.products) &&
                products.products?.map((product: any) => (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      selectedProducts.includes(product.id)
                        ? "bg-indigo-50 border-2 border-indigo-200"
                        : "bg-white border border-gray-200"
                    }`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <span>{product.name}</span>
                    {selectedProducts.includes(product.id) ? (
                      <Trash2 className="text-green-700 h-5 w-5" />
                    ) : (
                      <Plus className="text-gray-600 h-5 w-5" />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <h4 className="font-semibold text-green-800 mb-2">
                Selected Products
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((id) => {
                  const product = products?.products?.find(
                    (p: any) => p.id === id,
                  );
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {product?.name || `Product #${id}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

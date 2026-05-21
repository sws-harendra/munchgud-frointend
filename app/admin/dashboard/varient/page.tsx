"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVariantCategories,
  fetchVariantOptions,
  fetchProductVariants,
  createProductVariant,
  deleteProductVariant,
  addVariantCategory,
  addVariantOption,
  // 👇 make sure you have these in your variantSlice
  deleteVariantCategory,
  deleteVariantOption,
} from "@/app/lib/store/features/variantSlice";
import { Plus, Search, Trash2, X } from "lucide-react";
import { AppDispatch, RootState } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { toast } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  optionId: string;
  sku: string;
  price: number;
  stock: number;
}

interface VariantCategories {
  id: number;
  name: string;
  description: string;
}

interface VariantOptions {
  id: number;
  name: string;
  categoryId: string;
}

export default function ProductVariantsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, options, productVariants } = useSelector(
    (state: RootState) => state.variants
  );
  const products = useSelector((state: RootState) => {
    const productsData = state.product.products;
    return productsData ?? [];
  });

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newOption, setNewOption] = useState({ name: "", categoryId: "" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    optionId: "",
    sku: "",
    price: 0,
    stock: 0,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchVariantCategories());
    dispatch(fetchVariantOptions());
    if (selectedProduct) {
      dispatch(fetchProductVariants(selectedProduct.id));
    }
  }, [dispatch, selectedProduct]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        dispatch(fetchProducts({ search }));
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  // =========================
  // Add Handlers
  // =========================
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;
    try {
      await dispatch(addVariantCategory(newCategory)).unwrap();
      toast.success("Category added successfully!");
      setNewCategory({ name: "", description: "" });
      setShowAddCategory(false);
    } catch (err: any) {
      console.error("Failed to add category:", err);
      toast.error(err?.message || "Failed to add category.");
    }
  };

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.name || !newOption.categoryId) return;
    try {
      await dispatch(
        addVariantOption({
          ...newOption,
          categoryId: parseInt(newOption.categoryId),
        })
      ).unwrap();
      toast.success("Option added successfully!");
      setNewOption({ name: "", categoryId: "" });
      setShowAddOption(false);
    } catch (err: any) {
      console.error("Failed to add option:", err);
      toast.error(err?.message || "Failed to add option.");
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVariant.optionId || !selectedProduct) {
      toast.error("Please fill in all required fields and select a product");
      return;
    }
    try {
      await dispatch(
        createProductVariant({
          productId: selectedProduct.id,
          data: { ...newVariant, optionId: parseInt(newVariant.optionId) },
        })
      ).unwrap();
      toast.success("Added Variant Successfully");
      resetVariantForm();
      setShowAddVariant(false);
    } catch (err: any) {
      console.error("Failed to add variant:", err);
      toast.error(err?.message || "Failed to add variant.");
    }
  };

  // =========================
  // Delete Handlers
  // =========================
  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Delete this category?")) {
      try {
        await dispatch(deleteVariantCategory(id)).unwrap();
        toast.success("Category deleted successfully!");
      } catch (err: any) {
        console.error("Failed to delete category:", err);
        toast.error(err?.message || "Failed to delete category.");
      }
    }
  };

  const handleDeleteOption = async (id: number) => {
    if (window.confirm("Delete this option?")) {
      try {
        await dispatch(deleteVariantOption(id)).unwrap();
        toast.success("Option deleted successfully!");
      } catch (err: any) {
        console.error("Failed to delete option:", err);
        toast.error(err?.message || "Failed to delete option.");
      }
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (window.confirm("Delete this variant?")) {
      try {
        await dispatch(deleteProductVariant(variantId)).unwrap();
        toast.success("Variant deleted successfully!");
      } catch (err: any) {
        console.error("Failed to delete variant:", err);
        toast.error(err?.message || "Failed to delete variant.");
      }
    }
  };

  // =========================
  // Utility
  // =========================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewVariant((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewVariant((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const resetVariantForm = () => {
    setNewVariant({
      optionId: "",
      sku: "",
      price: 0,
      stock: 0,
      image: null,
    });
    setImagePreview(null);
  };

  // =========================
  // JSX
  // =========================
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Variants</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Categories */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button
              onClick={() => setShowAddCategory(true)}
              className="p-1.5 rounded-md hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1 text-green-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Options</h2>
            <button
              onClick={() => setShowAddOption(true)}
              className="p-1.5 rounded-md hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {options.map((opt) => (
              <div
                key={opt.id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{opt.name}</p>
                  <p className="text-sm text-gray-500">
                    {categories.find((c) => c.id === opt.categoryId)?.name ??
                      "—"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteOption(opt.id)}
                  className="p-1 text-green-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Variant Button */}
        <div className="bg-white rounded-lg shadow-md flex items-center justify-center">
          <button
            onClick={() => setShowAddVariant(true)}
            className="m-8 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Variant
          </button>
        </div>
      </div>

      {/* Variants List */}
      {selectedProduct && productVariants[selectedProduct.id]?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Variants for {selectedProduct.name}
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {productVariants[selectedProduct.id]?.map((variant) => (
              <div
                key={variant.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">SKU: {variant.sku}</p>
                  <p className="text-sm text-gray-500">
                    {options.find((o) => o.id === variant.optionId)?.name} • $
                    {variant.price} • {variant.stock} in stock
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="p-1 text-green-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Modals */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add Category</h3>
              <button
                onClick={() => setShowAddCategory(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add Option</h3>
              <button
                onClick={() => setShowAddOption(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddOption} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newOption.name}
                  onChange={(e) =>
                    setNewOption({ ...newOption, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newOption.categoryId}
                  onChange={(e) =>
                    setNewOption({ ...newOption, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOption(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddVariant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Add Variant
                {selectedProduct ? ` for ${selectedProduct.name}` : ""}
              </h3>
              <button
                onClick={() => setShowAddVariant(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddVariant} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product <span className="text-green-600">*</span>
                </label>
                <div className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setShowProductDropdown(true)}
                    />
                  </div>

                  {showProductDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-64 focus:outline-none sm:text-sm">
                      {products?.products?.length > 0 ? (
                        products?.products?.map((product: Product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setSelectedProduct({
                                id: product.id,
                                name: product.name,
                              });
                              setShowProductDropdown(false);
                              setSearch("");
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {product.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedProduct && (
                  <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-md">
                    <span className="text-sm text-blue-700">
                      Selected: {selectedProduct.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option <span className="text-green-600">*</span>
                </label>
                <select
                  required
                  value={newVariant.optionId}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, optionId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedProduct}
                >
                  <option value="">Select Option</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={newVariant.sku}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, sku: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SKU"
                  disabled={!selectedProduct}
                />
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Image
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newVariant.price === 0 ? "" : newVariant.price}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        price:
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    disabled={!selectedProduct}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newVariant.stock}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    disabled={!selectedProduct}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVariant(false);
                    setNewVariant({
                      optionId: "",
                      sku: "",
                      price: 0,
                      stock: 0,
                      image: null,
                    });
                    setSearch("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedProduct}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    selectedProduct
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      : "bg-gray-400 cursor-not-allowed"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

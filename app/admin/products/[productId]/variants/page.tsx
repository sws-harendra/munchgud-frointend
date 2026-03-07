'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/lib/store';
import { 
  fetchVariantCategories, 
  fetchVariantOptions, 
  fetchProductVariants, 
  createProductVariant,
  deleteProductVariant,
  addVariantCategory,
  addVariantOption,
} from '@/app/lib/store/features/variantSlice';
import { Plus, Trash2, X } from 'lucide-react';

export default function ProductVariantsPage({ params }: { params: { productId: string } }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, options, productVariants } = useSelector((state: RootState) => state.variants);
  
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newOption, setNewOption] = useState({ name: '', categoryId: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    optionId: '',
    sku: '',
    price: 0,
    stock: 0,
  });

  const productId = parseInt(params.productId);

  useEffect(() => {
    dispatch(fetchVariantCategories());
    dispatch(fetchVariantOptions());
    dispatch(fetchProductVariants(productId));
  }, [dispatch, productId]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;
    await dispatch(addVariantCategory(newCategory));
    setNewCategory({ name: '', description: '' });
    setShowAddCategory(false);
  };

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.name || !newOption.categoryId) return;
    await dispatch(addVariantOption({
      ...newOption,
      categoryId: parseInt(newOption.categoryId),
    }));
    setNewOption({ name: '', categoryId: '' });
    setShowAddOption(false);
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVariant.optionId || !newVariant.sku) return;
    await dispatch(createProductVariant({ 
      productId, 
      data: { ...newVariant, optionId: parseInt(newVariant.optionId) } 
    }));
    setNewVariant({ optionId: '', sku: '', price: 0, stock: 0 });
    setShowAddVariant(false);
  };

  const handleDeleteVariant = (variantId: number) => {
    if (window.confirm('Delete this variant?')) {
      dispatch(deleteProductVariant(variantId));
    }
  };

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
        {/* Categories Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Categories</h2>
              <button 
                onClick={() => setShowAddCategory(true)}
                className="p-1.5 rounded-md hover:bg-gray-100"
                aria-label="Add category"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-2 border rounded mb-2">
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Options Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Options</h2>
              <button 
                onClick={() => setShowAddOption(true)}
                className="p-1.5 rounded-md hover:bg-gray-100"
                aria-label="Add option"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {options.map((opt) => (
              <div key={opt.id} className="p-2 border rounded mb-2">
                <p className="font-medium">{opt.name}</p>
                <p className="text-sm text-gray-500">
                  {categories.find(c => c.id === opt.categoryId)?.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Variant Button */}
        <div className="bg-white rounded-lg shadow-md flex items-center justify-center">
          <button 
            onClick={() => setShowAddVariant(true)}
            className="m-8 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Variant
          </button>
        </div>
      </div>

      {/* Variants List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Product Variants</h2>
        </div>
        <div className="p-4">
          {productVariants[productId]?.map((variant) => (
            <div key={variant.id} className="border rounded p-4 mb-2 flex justify-between items-center">
              <div>
                <p className="font-medium">SKU: {variant.sku}</p>
                <p className="text-sm text-gray-500">
                  {options.find(o => o.id === variant.optionId)?.name} • 
                  ${variant.price} • {variant.stock} in stock
                </p>
              </div>
              <button 
                onClick={() => handleDeleteVariant(variant.id)}
                className="p-2 text-green-600 hover:bg-red-50 rounded-full"
                aria-label="Delete variant"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newOption.name}
                  onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newOption.categoryId}
                  onChange={(e) => setNewOption({...newOption, categoryId: e.target.value})}
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
              <h3 className="text-lg font-semibold">Add Variant</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
                <select 
                  value={newVariant.optionId}
                  onChange={(e) => setNewVariant({...newVariant, optionId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an option</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} ({categories.find(c => c.id === opt.categoryId)?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={newVariant.sku}
                  onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newVariant.price || ''}
                    onChange={(e) => setNewVariant({...newVariant, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newVariant.stock || ''}
                    onChange={(e) => setNewVariant({...newVariant, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVariant(false)}
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
    </div>
  );
}

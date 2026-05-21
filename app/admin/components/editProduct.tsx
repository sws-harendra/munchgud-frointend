"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { updateProduct } from "@/app/lib/store/features/productSlice";
import { toast } from "sonner";
import {
  ImagePlus,
  Upload,
  X,
  Package,
  Tag,
  IndianRupee,
  Archive,
  Video,
} from "lucide-react";
import { categoryService } from "@/app/sercices/category.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { isImageFile, isVideoFile } from "@/app/utils/getMediaType";
import RichTextEditor from "@/app/commonComponents/RichTextEditor";

interface Category {
  id: number;
  name: string;
}

interface EditProductProps {
  productId: number;
}

const EditProduct: React.FC<EditProductProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);

  const [categories, setCategories] = useState<Category[]>([]);
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

  // Separate state for image management
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  // Replace image-specific states with media states
  const [newMedia, setNewMedia] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<string[]>([]);
  const [removedMedia, setRemovedMedia] = useState<string[]>([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
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
  // Load product data
  useEffect(() => {
    const product = products.products.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        varientValue: product.varientValue,
        description: product.description,
        categoryId: String(product.categoryId),
        tags: Array.isArray(product.tags)
          ? product.tags.join(",")
          : product.tags || "",
        originalPrice: String(product.originalPrice),
        discountPrice: String(product.discountPrice),
        stock: String(product.stock),
        trendingProduct: product.trending_product,
        paymentMethods: product.paymentMethods || "both",
      });

      // Set existing media (both images and videos)
      let mediaArray: string[] = [];
      if (Array.isArray(product.images)) {
        mediaArray = product.images;
      } else if (typeof product.images === "string") {
        try {
          const parsed = JSON.parse(product.images);
          mediaArray = Array.isArray(parsed) ? parsed : [];
        } catch {
          if (product.images.trim()) {
            mediaArray = product.images.split(",").map((item: string) => item.trim());
          }
        }
      }
      setExistingMedia(mediaArray);
      setRemovedMedia([]);
      setNewMedia([]);
      setNewMediaPreviews([]);
    }
  }, [productId, products]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Product Description Handler
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

      // Create previews for new media
      const newPreviews = files.map((file) => {
        const type = file.type.startsWith("video/") ? "video" : "image";
        const previewUrl = type === "image" ? URL.createObjectURL(file) : "";
        return { url: previewUrl, type };
      });
      setNewMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveExistingMedia = (mediaPath: string, index: number) => {
    // Move from existing to removed
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    setRemovedMedia((prev) => [...prev, mediaPath]);
  };

  const handleRemoveNewMedia = (index: number) => {
    // Remove from new media
    setNewMedia((prev) => prev.filter((_, i) => i !== index));

    // Clean up preview URL and remove from previews
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
        if (preview.type === "image") {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);
  const handleRemoveExistingImage = (imageUrl: string, index: number) => {
    // Move from existing to removed
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setRemovedImages((prev) => [...prev, imageUrl]);
  };

  const handleRemoveNewImage = (index: number) => {
    // Remove from new images
    setNewImages((prev) => prev.filter((_, i) => i !== index));

    // Clean up preview URL and remove from previews
    const previewToRemove = newImagePreviews[index];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
    }
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // Add form fields
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
      // Add media management data (updated field names)
      data.append("existingMedia", JSON.stringify(existingMedia));
      data.append("removedMedia", JSON.stringify(removedMedia));

      // Add new media files
      newMedia.forEach((file) => {
        data.append("media", file); // Changed from "images" to "media"
      });

      await dispatch(updateProduct({ id: productId, data })).unwrap();
      toast.success("✅ Product updated successfully!");
    } catch (error: any) {
      toast.error(`❌ Failed: ${error}`);
    }
  };

  // Calculate total images for display
  const totalMedia = existingMedia.length + newMedia.length;
  const flattenCategoriesForDropdown = (cats: any[], level = 0): any[] => {
    let result: any[] = [];

    cats.forEach((cat) => {
      // Add current category with proper indentation indicator
      result.push({
        id: cat.id,
        name: cat.name,
        level: level,
        displayName: "  ".repeat(level) + (level > 0 ? "└ " : "") + cat.name,
      });

      // Recursively add subcategories
      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(
          flattenCategoriesForDropdown(cat.subcategories, level + 1),
        );
      }
    });

    return result;
  };

  // Function to flatten categories for table display
  const flattenCategoriesForTable = (cats: any[], level = 0): any[] => {
    let result: any[] = [];

    cats.forEach((cat) => {
      result.push({
        ...cat,
        level: level,
        displayName: "  ".repeat(level) + (level > 0 ? "└ " : "") + cat.name,
      });

      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(
          flattenCategoriesForTable(cat.subcategories, level + 1),
        );
      }
    });

    return result;
  };

  const dropdownCategories = flattenCategoriesForDropdown(categories);

  return (
    <div className="min-h-screen py-2 px-1">
      <div className="max-w-4xl mx-auto">
        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Content */}
            <div className="p-8 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    {/* <textarea
                      name="description"
                      placeholder="Describe your product features and benefits"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      rows={4}
                      required
                    /> */}
                    <RichTextEditor
                      placeholder="Describe your product features and benefits"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      value={formData.description} 
                      onChange={handleDescriptionChange}
                      required
                      />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {dropdownCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Varient Type
                    </label>
                    <input
                      type="text"
                      name="varientValue"
                      placeholder="eg. 100gm or 1kg"
                      value={formData.varientValue}
                      onChange={handleChange}
                      className="w-full pl-2 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="tags"
                        placeholder="smartphone, android, mobile"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Pricing & Inventory
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="originalPrice"
                        placeholder="0.00"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Discount Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="number"
                        name="discountPrice"
                        placeholder="0.00"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-emerald-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <div className="relative">
                      <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="stock"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Product Images
                  </h3>
                </div>

                {/* Upload Area */}
                {/* Media Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Product Media
                    </h3>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                    <label className="flex flex-col items-center space-y-4 cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ImagePlus className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-medium text-gray-700 group-hover:text-blue-600">
                          Upload Additional Media
                        </span>
                        <p className="text-gray-500 mt-1">
                          PNG, JPG, WEBP, MP4 up to 50MB
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*" // Accept both images and videos
                        onChange={handleMediaChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Media Preview */}
                  {(existingMedia.length > 0 || newMedia.length > 0) && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">
                        Product Media ({totalMedia})
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Existing Media */}
                        {existingMedia.map((mediaPath, idx) => {
                          const isImage = isImageFile(mediaPath);
                          const isVideo = isVideoFile(mediaPath);

                          return (
                            <div
                              key={`existing-${idx}`}
                              className="relative group aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                            >
                              {isImage ? (
                                <img
                                  src={getImageUrl(mediaPath)}
                                  alt={`Existing ${idx + 1}`}
                                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : isVideo ? (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <Video className="w-8 h-8 text-gray-500" />
                                  <span className="sr-only">Video file</span>
                                </div>
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">
                                    Unsupported
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                Existing
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveExistingMedia(mediaPath, idx)
                                }
                                className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transform hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {isVideo && (
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                  Video
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* New Media */}
                        {newMediaPreviews.map((preview, idx) => (
                          <div
                            key={`new-${idx}`}
                            className="relative group aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                          >
                            {preview.type === "image" ? (
                              <img
                                src={preview.url}
                                alt={`New ${idx + 1}`}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Video className="w-8 h-8 text-gray-500" />
                                <span className="sr-only">Video file</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveNewMedia(idx)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transform hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {preview.type === "video" && (
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                Video
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Media Summary */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Existing: {existingMedia.length}</span>
                          <span>New: {newMedia.length}</span>
                          <span>Total: {totalMedia}</span>
                          {removedMedia.length > 0 && (
                            <span className="text-green-600">
                              Removed: {removedMedia.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trending Product Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Trending Product
                    </h3>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-3">
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
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Mark as Trending</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Payment Mode Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Payment Mode
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Mode
                  </label>
                  <select
                    name="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="online">Online Payment</option>
                    <option value="both">Both COD & Online</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Upload className="w-6 h-6" />
                Update Product in Inventory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

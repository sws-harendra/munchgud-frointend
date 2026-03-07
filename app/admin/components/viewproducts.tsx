import React, { useState } from "react";
import {
  Eye,
  X,
  Star,
  Tag,
  Package,
  DollarSign,
  IndianRupee,
  Currency,
  CurrencyIcon,
} from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";

// Product Preview Modal Component
const ProductPreviewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Product Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images ? (
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                    <div className="ml-2 text-gray-500 text-sm">
                      No Image Available
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.ratings && (
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(product.ratings)
                              ? "text-green-700 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.ratings})
                    </span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <IndianRupee size={20} className="text-green-600" />
                  <div>
                    {product.discountPrice &&
                    parseFloat(product.discountPrice) !==
                      parseFloat(product.originalPrice) ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          {parseFloat(product.discountPrice).toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {parseFloat(product.originalPrice).toFixed(2)}
                        </span>
                        <span className="text-sm bg-red-100 text-green-700 px-2 py-1 rounded">
                          {Math.round(
                            ((parseFloat(product.originalPrice) -
                              parseFloat(product.discountPrice)) /
                              parseFloat(product.originalPrice)) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        $
                        {parseFloat(
                          product.originalPrice || product.discountPrice
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              {product.category && (
                <div className="flex items-center space-x-2">
                  <Tag size={16} className="text-gray-600" />
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {product.category.name || product.category}
                  </span>
                </div>
              )}

              {/* Stock Status */}
              {product.stock !== undefined && (
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-gray-600" />
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      product.stock > 0 && !product.sold_out
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-green-700"
                    }`}
                  >
                    {product.sold_out
                      ? "Sold Out"
                      : product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              )}

              {/* Max Order Quantity */}
              {product.max_quantity_to_order && (
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-gray-600" />
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Max order: {product.max_quantity_to_order} units
                  </span>
                </div>
              )}

              {/* Trending Badge */}
              {product.trending_product && (
                <div className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  <span>🔥</span>
                  <span>Trending Product</span>
                </div>
              )}

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.isActive ? "bg-green-500" : "bg-green-600"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    product.isActive ? "text-green-700" : "text-green-700"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Payment Methods */}
              {product.paymentMethods && (
                <div className="flex items-center space-x-2">
                  <CurrencyIcon size={16} className="text-gray-600" />
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    Payment: {product.paymentMethods}
                  </span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Reviews */}
              {product.reviews && typeof product.reviews === "string" && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Reviews</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.reviews}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            {product.createdAt && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-semibold text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {product.updatedAt && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Updated</p>
                <p className="font-semibold text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-gray-600">Product ID</p>
              <p className="font-semibold text-gray-900">#{product.id}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Category ID</p>
              <p className="font-semibold text-gray-900">
                #{product.categoryId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPreviewModal;

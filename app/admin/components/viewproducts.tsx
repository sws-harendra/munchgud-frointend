"use client";
import React from "react";
import {
  Eye,
  X,
  Star,
  Tag,
  Package,
  IndianRupee,
  Layers,
  Sparkles,
  CreditCard,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "../context/AdminThemeContext";

interface ProductPreviewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, isOpen, onClose }) => {
  const { isDark } = useAdminTheme();

  if (!isOpen || !product) return null;

  const originalPrice = parseFloat(product.originalPrice) || 0;
  const salePrice = parseFloat(product.discountPrice) || 0;
  const discountPercent =
    originalPrice > 0 && salePrice > 0 && originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className={`rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl transition-all ${
        isDark
          ? "bg-[#09090b] border-zinc-800 text-white"
          : "bg-white border-gray-100 text-gray-900"
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b sticky top-0 backdrop-blur-md z-10 ${
          isDark ? "bg-[#09090b]/90 border-zinc-800" : "bg-white/90 border-gray-100"
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Product Preview
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium ${
              isDark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-600"
            }`}>
              #{product.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-3">
              <div className={`aspect-square rounded-2xl overflow-hidden border ${
                isDark ? "bg-zinc-900 border-zinc-800" : "bg-gray-50 border-gray-100"
              }`}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
                    <Package size={48} className="stroke-[1.5]" />
                    <span className="text-xs font-medium">No Image Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className={`text-xl font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  {product.name}
                </h3>
                {product.varientValue && (
                  <p className="text-xs text-amber-500 font-medium mt-1">
                    {product.varientValue}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className={`p-4 rounded-2xl border ${
                isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-100"
              }`}>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-amber-400">
                    ₹{salePrice > 0 ? salePrice.toLocaleString("en-IN") : originalPrice.toLocaleString("en-IN")}
                  </span>
                  {originalPrice > salePrice && salePrice > 0 && (
                    <>
                      <span className={`text-sm line-through ${isDark ? "text-zinc-500" : "text-gray-400"}`}>
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap gap-2">
                {/* Category */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  isDark ? "bg-zinc-800/80 border-zinc-700 text-zinc-300" : "bg-gray-100 border-gray-200 text-gray-700"
                }`}>
                  <Tag size={12} className="text-amber-400" />
                  <span>{product.category?.name || `Category #${product.categoryId}`}</span>
                </div>

                {/* Stock Status */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  <Package size={12} />
                  <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
                </div>

                {/* Trending */}
                {product.trending_product && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles size={12} />
                    <span>Trending Product</span>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              {product.paymentMethods && (
                <div className={`flex items-center gap-2 text-xs ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                  <CreditCard size={14} className="text-zinc-400" />
                  <span>Payment: <strong className={isDark ? "text-zinc-200" : "text-gray-700"}>{product.paymentMethods}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className={`p-4 rounded-2xl border ${
              isDark ? "bg-zinc-900/30 border-zinc-800" : "bg-gray-50 border-gray-100"
            }`}>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                Description & Specifications
              </h4>
              <div
                className={`text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-gray-700"}`}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Footer Metadata */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t ${
            isDark ? "border-zinc-800 text-zinc-400" : "border-gray-200 text-gray-500"
          }`}>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold">Product ID</p>
              <p className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>#{product.id}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold">Stock Count</p>
              <p className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{product.stock || 0} units</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold">Created</p>
              <p className={`text-sm font-medium mt-0.5 ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold">Status</p>
              <p className="text-sm font-bold mt-0.5 text-emerald-400">
                {product.isActive !== false ? "Active" : "Disabled"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;

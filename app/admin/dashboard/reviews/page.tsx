"use client";

import React, { useState, useEffect, useMemo } from "react";
import { productService } from "@/app/sercices/user/product.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Search,
  RefreshCw,
  Trash2,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  X,
  Package,
  User,
  SlidersHorizontal,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface ReviewItem {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullname: string;
    email?: string;
    avatar?: string;
  };
  product?: {
    id: number;
    name: string;
    images?: any;
  };
}

interface AdminReviewsStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalProductsReviewed: number;
}

export default function AdminReviewsPage() {
  const { isDark } = useAdminTheme();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<AdminReviewsStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    totalProductsReviewed: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Products list for dropdown filter & review creation
  const [productsList, setProductsList] = useState<{ id: number; name: string }[]>([]);

  // Add Review Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormProductId, setAddFormProductId] = useState<number | "">("");
  const [addFormRating, setAddFormRating] = useState<number>(5);
  const [addFormHoverRating, setAddFormHoverRating] = useState<number>(0);
  const [addFormComment, setAddFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm Modal state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load reviews from API
  const loadReviews = async (page = 1, silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const params: any = {
        page,
        limit: 12,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (ratingFilter !== "all") params.rating = parseInt(ratingFilter);
      if (productFilter !== "all") params.productId = parseInt(productFilter);

      const res = await productService.getAllReviewsAdmin(params);

      if (res && res.success) {
        setReviews(res.reviews || []);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || 1);
        setTotalCount(res.totalReviews || 0);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err: any) {
      console.error("Error loading reviews:", err);
      toast.error(err?.response?.data?.message || "Failed to load reviews");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load product options for dropdown
  const loadProductOptions = async () => {
    try {
      const res = await productService.getAllProducts({ limit: 100 });
      const list = Array.isArray(res) ? res : res?.products || [];
      setProductsList(list.map((p: any) => ({ id: p.id, name: p.name })));
    } catch (e) {
      console.error("Failed to load products list:", e);
    }
  };

  useEffect(() => {
    loadProductOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, ratingFilter, productFilter]);

  // Handle Add Review
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormProductId) {
      toast.error("Please select a product");
      return;
    }
    if (!addFormRating) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await productService.createAdminReview({
        productId: Number(addFormProductId),
        rating: addFormRating,
        comment: addFormComment.trim(),
      });

      if (res && res.success) {
        toast.success("Review created successfully! ⭐");
        setIsAddModalOpen(false);
        setAddFormComment("");
        setAddFormRating(5);
        setAddFormProductId("");
        loadReviews(1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await productService.deleteReview(deleteTargetId);
      if (res && res.success) {
        toast.success("Review deleted successfully");
        setDeleteTargetId(null);
        loadReviews(currentPage, true);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Star rating render helper
  const renderStars = (rating: number, size = 16) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-300 dark:text-zinc-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const getProductImage = (images: any) => {
    if (!images) return null;
    let imgList = [];
    if (Array.isArray(images)) imgList = images;
    else if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        imgList = Array.isArray(parsed) ? parsed : [images];
      } catch {
        imgList = [images];
      }
    }
    return imgList[0] ? getImageUrl(imgList[0]) : null;
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
      
      {/* ================= 1. HEADER ROW ================= */}
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-zinc-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
            <Star size={26} className="fill-zinc-950 stroke-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Product Ratings & Reviews
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Live Dynamic
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Review management, customer sentiment, and rating metrics across your entire catalog.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => loadReviews(currentPage, true)}
            disabled={isRefreshing}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? "bg-zinc-800/80 border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700"
            }`}
            title="Refresh reviews"
          >
            <RefreshCw size={15} className={isRefreshing ? "animate-spin text-amber-500" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* ================= 2. ANALYTICS KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Reviews */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Reviews</span>
            <MessageSquare size={16} className="text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{stats.totalReviews}</span>
            <span className="text-xs text-zinc-500 font-semibold">from verified buyers</span>
          </div>
        </div>

        {/* Average Rating */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Average Rating</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="text-3xl font-black text-amber-500">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0.0"}
            </span>
            <div className="flex flex-col">
              {renderStars(Math.round(stats.averageRating || 0), 13)}
              <span className="text-[11px] text-zinc-500 font-medium mt-0.5">Out of 5.0 scale</span>
            </div>
          </div>
        </div>

        {/* 5-Star Reviews */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>5-Star Excellence</span>
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-500">
              {stats.ratingCounts?.[5] || 0}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">
              {stats.totalReviews > 0
                ? `${Math.round(((stats.ratingCounts?.[5] || 0) / stats.totalReviews) * 100)}% of total`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Catalog Coverage */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Reviewed Products</span>
            <Package size={16} className="text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{stats.totalProductsReviewed}</span>
            <span className="text-xs text-zinc-500 font-semibold">active products reviewed</span>
          </div>
        </div>

      </div>

      {/* ================= 3. FILTER & SEARCH TOOLBAR ================= */}
      <div
        className={`p-4 rounded-2xl border space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 ${
          isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200"
        }`}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search reviews by comment or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500/60"
                : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-amber-500"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Rating filter */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {[
              { label: "All", value: "all" },
              { label: "5 ★", value: "5" },
              { label: "4 ★", value: "4" },
              { label: "3 ★", value: "3" },
              { label: "2 ★", value: "2" },
              { label: "1 ★", value: "1" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setRatingFilter(btn.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === btn.value
                    ? "bg-amber-500 text-zinc-950 shadow-xs"
                    : isDark
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Product dropdown filter */}
          {productsList.length > 0 && (
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border outline-none cursor-pointer max-w-[180px] truncate ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800"
              }`}
            >
              <option value="all">All Products</option>
              {productsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ================= 4. REVIEWS LIST / DATA TABLE ================= */}
      {isLoading ? (
        <div
          className={`p-16 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${
            isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <RefreshCw size={28} className="animate-spin text-amber-500" />
          <p className="text-sm font-semibold text-zinc-500">Loading customer reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div
          className={`p-16 rounded-2xl border text-center flex flex-col items-center justify-center gap-4 ${
            isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Star size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">No Reviews Found</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mt-1">
              {searchQuery || ratingFilter !== "all" || productFilter !== "all"
                ? "No reviews match the current filters. Try resetting the search or filter options."
                : "No customer reviews have been submitted yet. You can add launch reviews using the 'Add Review' button above."}
            </p>
          </div>
          {(searchQuery || ratingFilter !== "all" || productFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRatingFilter("all");
                setProductFilter("all");
              }}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => {
              const productImg = getProductImage(rev.product?.images);
              return (
                <div
                  key={rev.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md group ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                      : "bg-white border-zinc-200/90 hover:border-zinc-300"
                  }`}
                >
                  <div>
                    {/* Top row: Product Tag & Star Rating */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {productImg ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200/50">
                            <img
                              src={productImg}
                              alt={rev.product?.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <Package size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={rev.product ? `/products/${rev.product.id}` : "#"}
                            target="_blank"
                            className="text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-amber-500 truncate block transition-colors"
                            title={rev.product?.name || "View Product"}
                          >
                            {rev.product?.name || `Product #${rev.productId}`}
                          </Link>
                          <span className="text-[10px] text-zinc-400 block">
                            ID: #{rev.productId}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {rev.rating}.0
                        </span>
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                      </div>
                    </div>

                    {/* Reviewer identity & Date */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-zinc-100 dark:border-zinc-800/80 my-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {rev.user?.fullname ? rev.user.fullname.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">
                            {rev.user?.fullname || "Verified Customer"}
                          </span>
                          <span title="Verified Customer" className="inline-flex">
                            <ShieldCheck size={13} className="text-emerald-500" />
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] text-zinc-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Star row */}
                    <div className="my-2">{renderStars(rev.rating, 14)}</div>

                    {/* Comment text */}
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-4 mt-1 italic">
                      "{rev.comment || "No detailed written feedback provided."}"
                    </p>
                  </div>

                  {/* Bottom action row */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Review #{rev.id}
                    </span>

                    <button
                      onClick={() => setDeleteTargetId(rev.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= 5. PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-zinc-500 font-semibold">
                Showing page {currentPage} of {totalPages} ({totalCount} total reviews)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => loadReviews(currentPage - 1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    currentPage <= 1
                      ? "opacity-40 cursor-not-allowed"
                      : isDark
                      ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                      : "bg-white border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => loadReviews(currentPage + 1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    currentPage >= totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : isDark
                      ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                      : "bg-white border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 6. ADD REVIEW MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 ${
              isDark ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Star size={20} className="fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Product Review</h3>
                  <p className="text-xs text-zinc-500">Seed realistic customer rating & review</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Product selector */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Select Product *
                </label>
                <select
                  required
                  value={addFormProductId}
                  onChange={(e) => setAddFormProductId(Number(e.target.value))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-amber-500"
                      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-amber-500"
                  }`}
                >
                  <option value="">-- Choose a product to review --</option>
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: #{p.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating picker */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-950 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setAddFormHoverRating(star)}
                        onMouseLeave={() => setAddFormHoverRating(0)}
                        onClick={() => setAddFormRating(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= (addFormHoverRating || addFormRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-zinc-300 dark:text-zinc-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-amber-500 ml-2">
                    {addFormRating === 5
                      ? "5.0 ★ Excellent"
                      : addFormRating === 4
                      ? "4.0 ★ Good"
                      : addFormRating === 3
                      ? "3.0 ★ Average"
                      : addFormRating === 2
                      ? "2.0 ★ Below Average"
                      : "1.0 ★ Poor"}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Customer Review Comment *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share realistic detailed product experience, sound quality, durability, delivery time, etc."
                  value={addFormComment}
                  onChange={(e) => setAddFormComment(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm outline-none ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-amber-500"
                      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-amber-500"
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 7. DELETE CONFIRMATION MODAL ================= */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl border p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 text-center ${
              isDark ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold">Delete Customer Review?</h3>
              <p className="text-xs text-zinc-500 mt-1">
                This review will be removed from storefront calculations and product statistics.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

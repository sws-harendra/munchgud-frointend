"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchBlogPosts,
  deleteBlogPost,
  toggleBlogStatus,
  toggleBlogFeatured,
  toggleBlogTrending,
  selectAllPosts,
  selectBlogStatus,
} from "@/app/lib/store/features/blogSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Star,
  Flame,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Filter,
  Layers,
  Sparkles,
  FileText,
  User,
  Tag,
  AlertCircle,
} from "lucide-react";

export default function AdminBlogManagement() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts) || [];
  const status = useAppSelector(selectBlogStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "featured" | "trending"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  // Dynamic categories extracted from live posts
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category.trim());
    });
    return Array.from(cats);
  }, [posts]);

  // Aggregate KPI stats
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published" || !p.status).length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const featured = posts.filter((p) => p.isFeatured).length;
    const trending = posts.filter((p) => p.isTrending).length;
    const totalViews = posts.reduce((acc, curr) => acc + (Number(curr.views) || 0), 0);
    return { total, published, drafts, featured, trending, totalViews };
  }, [posts]);

  // Filtered posts based on search, category, and status filter
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search term match
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.authorName?.toLowerCase().includes(query) ||
        post.tags?.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      // Status/Badge match
      let matchesStatus = true;
      if (statusFilter === "published") {
        matchesStatus = post.status === "published" || !post.status;
      } else if (statusFilter === "draft") {
        matchesStatus = post.status === "draft";
      } else if (statusFilter === "featured") {
        matchesStatus = !!post.isFeatured;
      } else if (statusFilter === "trending") {
        matchesStatus = !!post.isTrending;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchTerm, selectedCategory, statusFilter]);

  // 1-Click Toggle: Published <-> Draft
  const handleToggleStatus = async (id: string | number) => {
    setActionLoadingId(id);
    try {
      await dispatch(toggleBlogStatus(id)).unwrap();
      toast.success("Publication status updated");
    } catch {
      toast.error("Failed to update publication status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 1-Click Toggle: Featured
  const handleToggleFeatured = async (id: string | number) => {
    setActionLoadingId(id);
    try {
      await dispatch(toggleBlogFeatured(id)).unwrap();
      toast.success("Featured status updated");
    } catch {
      toast.error("Failed to update featured status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 1-Click Toggle: Trending
  const handleToggleTrending = async (id: string | number) => {
    setActionLoadingId(id);
    try {
      await dispatch(toggleBlogTrending(id)).unwrap();
      toast.success("Trending status updated");
    } catch {
      toast.error("Failed to update trending status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Blog
  const handleDelete = async (id: string | number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    const toastId = toast.loading("Deleting blog article...");
    try {
      await dispatch(deleteBlogPost(id)).unwrap();
      toast.success("Article deleted successfully", { id: toastId });
    } catch {
      toast.error("Failed to delete article", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <BookOpen className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Acoustic Journal & Blogs
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage all articles, audio technology guides, lifestyle stories, and editorial features. Everything is 100% dynamic.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => dispatch(fetchBlogPosts())}
            title="Refresh Data"
            className="p-3 rounded-2xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-5 h-5 ${status === "loading" ? "animate-spin" : ""}`}
            />
          </button>

          <Link
            href="/blogs"
            target="_blank"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-amber-300 bg-amber-50/50 text-amber-900 hover:bg-amber-100 font-semibold text-sm transition-all"
          >
            <ExternalLink className="w-4 h-4 text-amber-600" />
            <span>View Live Journal</span>
          </Link>

          <Link
            href="/admin/dashboard/blogs/create"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-sm hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Write New Article</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Articles */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Articles</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{stats.total}</div>
          <span className="text-xs text-gray-400 mt-1">In database</span>
        </div>

        {/* Published */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{stats.published}</div>
          <span className="text-xs text-emerald-600/70 mt-1">Live on storefront</span>
        </div>

        {/* Drafts */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-700">{stats.drafts}</div>
          <span className="text-xs text-gray-400 mt-1">Unpublished</span>
        </div>

        {/* Featured Story */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 bg-gradient-to-br from-amber-50/40 to-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Featured</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-700">{stats.featured}</div>
          <span className="text-xs text-amber-700/70 mt-1">Hero spot highlight</span>
        </div>

        {/* Trending Top */}
        <div className="bg-white rounded-3xl p-5 border border-orange-200/80 bg-gradient-to-br from-orange-50/40 to-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-orange-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Trending</span>
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-orange-700">{stats.trending}</div>
          <span className="text-xs text-orange-700/70 mt-1">Ranked charts</span>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-700">
            {stats.totalViews > 1000 ? `${(stats.totalViews / 1000).toFixed(1)}k` : stats.totalViews}
          </div>
          <span className="text-xs text-gray-400 mt-1">Reader impressions</span>
        </div>
      </div>

      {/* 3. Filters & Controls Strip */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, excerpt, category, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-gray-800 placeholder-gray-400 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges & View Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="all">All Categories ({posts.length})</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({posts.filter((p) => p.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === "all"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === "published"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === "draft"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setStatusFilter("featured")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                statusFilter === "featured"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Featured
            </button>
            <button
              onClick={() => setStatusFilter("trending")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                statusFilter === "trending"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
              Trending
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-1.5 rounded-xl transition ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-1.5 rounded-xl transition ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Articles Grid / Table Display */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No blog articles found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            No articles match your current search or filter criteria. Try clearing filters or create a new article.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {(searchTerm || selectedCategory !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                Reset All Filters
              </button>
            )}
            <Link
              href="/admin/dashboard/blogs/create"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
            >
              + Create Article
            </Link>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isPublished = post.status === "published" || !post.status;
            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Cover Image & Overlaid Badges */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  {post.featuredImage ? (
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                      <BookOpen className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-xs">No Cover Image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Category Chip */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-900 shadow-sm">
                      {post.category || "Editorial"}
                    </span>
                  </div>

                  {/* 1-Click Toggle Badges in Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {/* Featured Star Toggle */}
                    <button
                      onClick={() => handleToggleFeatured(post.id)}
                      disabled={actionLoadingId === post.id}
                      title={post.isFeatured ? "Featured Story (Click to remove)" : "Click to mark as Featured Story"}
                      className={`p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                        post.isFeatured
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                          : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${post.isFeatured ? "fill-white" : ""}`}
                      />
                    </button>

                    {/* Trending Flame Toggle */}
                    <button
                      onClick={() => handleToggleTrending(post.id)}
                      disabled={actionLoadingId === post.id}
                      title={post.isTrending ? "Trending Article (Click to remove)" : "Click to mark as Trending"}
                      className={`p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                        post.isTrending
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
                      }`}
                    >
                      <Flame
                        className={`w-4 h-4 ${post.isTrending ? "fill-white" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Views & Read Time Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {post.readTime || "5 min read"}
                    </span>
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Eye className="w-3 h-3 text-blue-400" />
                      {post.views || 0} views
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Status Pill & Author */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-medium text-gray-600">
                        <User className="w-3 h-3 text-gray-400" />
                        {post.authorName || "Team Flazo"}
                      </span>

                      {/* 1-Click Status Toggle */}
                      <button
                        onClick={() => handleToggleStatus(post.id)}
                        disabled={actionLoadingId === post.id}
                        className={`px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {isPublished ? "● Live / Published" : "○ Draft"}
                      </button>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/admin/dashboard/blogs/edit/${post.id}/${post.slug || "article"}`}
                      className="block font-bold text-gray-900 hover:text-amber-600 transition text-base line-clamp-2 mb-2"
                    >
                      {post.title}
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Live Storefront View */}
                      <Link
                        href={`/blogs/${post.id}/${post.slug || "article"}`}
                        target="_blank"
                        title="View on Storefront"
                        className="p-2 rounded-xl text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {/* Admin Preview View */}
                      <Link
                        href={`/admin/dashboard/blogs/${post.id}/${post.slug || "article"}`}
                        title="Admin View"
                        className="p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Edit Article */}
                      <Link
                        href={`/admin/dashboard/blogs/edit/${post.id}/${post.slug || "article"}`}
                        title="Edit Article"
                        className="p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      title="Delete Article"
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Author</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Featured</th>
                  <th className="px-4 py-4 text-center">Trending</th>
                  <th className="px-4 py-4">Views</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => {
                  const isPublished = post.status === "published" || !post.status;
                  return (
                    <tr key={post.id} className="hover:bg-slate-50/60 transition">
                      {/* Article & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                            {post.featuredImage ? (
                              <img
                                src={getImageUrl(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/dashboard/blogs/edit/${post.id}/${post.slug || "article"}`}
                              className="font-bold text-gray-900 hover:text-amber-600 transition line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            <span className="text-xs text-gray-400 font-mono">
                              /{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                          {post.category || "General"}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 text-xs font-medium text-gray-700">
                        {post.authorName || "Team Flazo"}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleStatus(post.id)}
                          disabled={actionLoadingId === post.id}
                          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </button>
                      </td>

                      {/* Featured 1-Click Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(post.id)}
                          disabled={actionLoadingId === post.id}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            post.isFeatured
                              ? "bg-amber-100 text-amber-700"
                              : "text-gray-300 hover:text-amber-500 hover:bg-amber-50"
                          }`}
                        >
                          <Star
                            className={`w-4 h-4 ${post.isFeatured ? "fill-amber-500 text-amber-500" : ""}`}
                          />
                        </button>
                      </td>

                      {/* Trending 1-Click Toggle */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleTrending(post.id)}
                          disabled={actionLoadingId === post.id}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            post.isTrending
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-300 hover:text-orange-500 hover:bg-orange-50"
                          }`}
                        >
                          <Flame
                            className={`w-4 h-4 ${post.isTrending ? "fill-orange-500 text-orange-500" : ""}`}
                          />
                        </button>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-4 text-xs font-semibold text-gray-700">
                        {post.views || 0}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/blogs/${post.id}/${post.slug || "article"}`}
                            target="_blank"
                            title="Live Storefront"
                            className="p-2 rounded-xl text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/dashboard/blogs/edit/${post.id}/${post.slug || "article"}`}
                            title="Edit"
                            className="p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            title="Delete"
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

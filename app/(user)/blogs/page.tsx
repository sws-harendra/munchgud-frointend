"use strict";
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchBlogPosts,
  selectAllPosts,
  selectBlogStatus,
} from "@/app/lib/store/features/blogSlice";
import { BlogPostItem } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  Star,
  Search,
  ArrowRight,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  BookOpen,
  User,
  Filter,
} from "lucide-react";

export default function BlogListPage() {
  const dispatch = useAppDispatch();
  const allPosts = useAppSelector(selectAllPosts);
  const status = useAppSelector(selectBlogStatus);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  // Only consider published posts for public view
  const publishedPosts: BlogPostItem[] = useMemo(() => {
    return (allPosts || []).filter(
      (post) => post.status === "published" || !post.status
    );
  }, [allPosts]);

  // Extract dynamic categories from existing posts in database
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedPosts.forEach((p) => {
      if (p.category?.trim()) set.add(p.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [publishedPosts]);

  // Featured Post: First one with isFeatured = true, or latest post
  const featuredPost: BlogPostItem | undefined = useMemo(() => {
    const explicitlyFeatured = publishedPosts.find((p) => p.isFeatured);
    return explicitlyFeatured || publishedPosts[0];
  }, [publishedPosts]);

  // Trending Posts: All posts with isTrending = true, or sorted by views
  const trendingPosts: BlogPostItem[] = useMemo(() => {
    const list = publishedPosts.filter(
      (p) => p.isTrending && (!featuredPost || p.id !== featuredPost.id)
    );
    if (list.length >= 3) return list.slice(0, 4);

    // If few trending, fill with highest viewed posts
    const others = publishedPosts
      .filter((p) => !featuredPost || p.id !== featuredPost.id)
      .sort((a, b) => (b.views || 0) - (a.views || 0));
    return others.slice(0, 4);
  }, [publishedPosts, featuredPost]);

  // Filtered latest articles for the grid
  const filteredArticles: BlogPostItem[] = useMemo(() => {
    return publishedPosts.filter((article) => {
      // Category filter
      const matchesCategory =
        activeCategory === "All" ||
        article.category?.toLowerCase() === activeCategory.toLowerCase();

      // Search filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(query)) ||
        (article.category && article.category.toLowerCase().includes(query)) ||
        (article.authorName && article.authorName.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [publishedPosts, activeCategory, searchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 pb-24 selection:bg-[#B8860B] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. DYNAMIC HERO SPOTLIGHT & TRENDING NOW (100% From Admin)
         ───────────────────────────────────────────────────────────── */}
      {featuredPost ? (
        <section className="pt-6 pb-4 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left (Col 8): Big Featured Story Card */}
            <div className="lg:col-span-8 bg-neutral-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-neutral-800 flex flex-col justify-between group shadow-xl min-h-[460px]">
              {/* Dynamic Cover Image from Admin */}
              {featuredPost.featuredImage && (
                <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[65%] opacity-85 pointer-events-none overflow-hidden">
                  <img
                    src={getImageUrl(featuredPost.featuredImage)}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
                </div>
              )}

              {/* Dynamic Badges & Headline from Admin */}
              <div className="relative z-10 space-y-4 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" />
                    FEATURED STORY
                  </span>

                  {featuredPost.category && (
                    <span className="text-[11px] font-mono tracking-widest text-[#B8860B] uppercase">
                      {featuredPost.category}
                    </span>
                  )}
                </div>

                <Link href={`/blogs/${featuredPost.id}/${featuredPost.slug}`}>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-black text-white leading-tight hover:text-amber-400 transition-colors">
                    {featuredPost.title}
                  </h1>
                </Link>

                {featuredPost.excerpt && (
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>

              {/* Dynamic Meta & Direct Read Link */}
              <div className="relative z-10 pt-8 mt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    {featuredPost.authorName || "Team Flazo"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {featuredPost.readTime || "5 min read"}
                  </span>
                  {featuredPost.views !== undefined && featuredPost.views > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        {featuredPost.views.toLocaleString("en-IN")} views
                      </span>
                    </>
                  )}
                </div>

                <Link
                  href={`/blogs/${featuredPost.id}/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md group/btn shrink-0"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right (Col 4): Dynamic Trending Now Articles from Admin */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D7BF] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-5 border-b border-[#E8D7BF]">
                  <TrendingUp className="w-5 h-5 text-[#9E6B20]" />
                  <h2 className="font-serif font-black text-xl text-neutral-950">
                    Trending Now
                  </h2>
                </div>

                <div className="divide-y divide-[#F0E6D6]">
                  {trendingPosts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400">
                      No trending articles marked yet.
                    </div>
                  ) : (
                    trendingPosts.map((post, idx) => (
                      <Link
                        key={post.id}
                        href={`/blogs/${post.id}/${post.slug}`}
                        className="py-4 flex items-center gap-4 group cursor-pointer"
                      >
                        <span className="text-xl font-serif font-black text-[#C99726] group-hover:text-[#9E6B20] transition-colors w-7 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#9E6B20] transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                            <span>{post.readTime || "5 min read"}</span>
                            <span>•</span>
                            <span>{post.views?.toLocaleString("en-IN") || 0} views</span>
                          </div>
                        </div>

                        {post.featuredImage && (
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                            <img
                              src={getImageUrl(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8D7BF]">
                <a
                  href="#all-articles"
                  className="flex items-center justify-between text-xs font-bold text-[#9E6B20] hover:text-[#8A5B17] transition"
                >
                  <span>Explore all articles ({publishedPosts.length})</span>
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────────────────────
          2. DYNAMIC CATEGORY BAR & SEARCH (Derived from Live Database)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-6 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Dynamic Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#9E6B20] text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-[#E8D7BF] hover:bg-[#FAF3E5] hover:text-[#8C6016]"
                  }`}
                >
                  <span>{cat}</span>
                  {cat !== "All" && (
                    <span className="text-[10px] opacity-75">
                      ({publishedPosts.filter((p) => p.category === cat).length})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-4 pr-11 py-2 bg-white border border-[#E8D7BF] rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#9E6B20] shadow-xs"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#9E6B20] text-white flex items-center justify-center pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. DYNAMIC ARTICLES GRID (100% From Admin Database)
         ───────────────────────────────────────────────────────────── */}
      <section id="all-articles" className="py-8 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-950">
              {activeCategory === "All" ? "All Publications" : `${activeCategory} Articles`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Showing {filteredArticles.length} published stories from the database
            </p>
          </div>
        </div>

        {/* Shimmer loading skeleton */}
        {status === "loading" && publishedPosts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-4 border border-[#E8D7BF] space-y-3 animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#E8D7BF] max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-[#9E6B20] mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">
              No Articles Found
            </h3>
            <p className="text-xs text-gray-500">
              {publishedPosts.length === 0
                ? "No articles have been published from the admin panel yet."
                : "Try selecting another category or clear your search term."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.id}/${article.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8D7BF] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                    {article.featuredImage ? (
                      <img
                        src={getImageUrl(article.featuredImage)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
                        <BookOpen className="w-8 h-8 opacity-30 mb-1" />
                        <span className="text-[11px]">No Image</span>
                      </div>
                    )}

                    {article.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-black uppercase text-[#9E6B20] shadow-xs">
                        {article.category}
                      </span>
                    )}

                    {article.isFeatured && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Article Info */}
                  <div className="p-5 space-y-2 text-left">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                      <span>•</span>
                      <span>{article.readTime || "5 min read"}</span>
                    </div>

                    <h3 className="font-serif font-black text-base sm:text-lg text-neutral-900 group-hover:text-[#9E6B20] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Read Link & Author */}
                <div className="p-5 pt-3 border-t border-[#F5EEDD] mt-2 flex items-center justify-between text-xs text-neutral-400">
                  <span>By {article.authorName || "Team Flazo"}</span>
                  <span className="font-bold text-[#9E6B20] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Read Story <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

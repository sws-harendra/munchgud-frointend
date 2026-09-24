"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchBlogPosts } from "@/app/lib/store/features/blogSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { ArrowRight, Clock, BookOpen, Star, Flame } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

const AllBlogsHomePage = () => {
  const dispatch = useAppDispatch();
  const { posts, status } = useAppSelector((state) => state.blog);

  useEffect(() => {
    if (status === "idle") dispatch(fetchBlogPosts());
  }, [dispatch, status]);

  if (status === "loading")
    return (
      <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
        Loading acoustic journal...
      </div>
    );

  if (status === "failed") return null;

  // Filter only published blogs for public storefront
  const publishedPosts = (posts || []).filter(
    (p) => p.status === "published" || !p.status
  );

  if (publishedPosts.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 bg-gradient-to-b from-gray-50/70 to-white">
      {/* Header */}
      <div className="relative mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">
            Acoustic Editorial & Guides
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            Flazo <span className="text-amber-600">Sound Journal</span>
          </h2>
          <p className="mt-2 text-gray-600 text-sm lg:text-base max-w-xl">
            Explore expert audio deep-dives, noise-cancellation science, and sound lifestyle guides.
          </p>
        </div>

        {/* View All Button */}
        <div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-neutral-950 text-amber-300 font-bold text-xs shadow-md hover:bg-amber-600 hover:text-white transition-all group"
          >
            <span>Explore All Publications</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {publishedPosts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.id}/${slugify(post.slug!)}`}
            className="group"
          >
            <div className="bg-white rounded-3xl border border-gray-100 hover:border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              {/* Image Container */}
              <div className="p-3 pb-0">
                <div className="h-48 w-full relative overflow-hidden rounded-2xl bg-neutral-950">
                  {post.featuredImage ? (
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
                      <BookOpen className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[11px]">No Image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-neutral-900 shadow-xs">
                    {post.category || "Sound"}
                  </span>

                  {/* Featured / Trending Badge */}
                  {post.isFeatured && (
                    <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-amber-500 text-white shadow-xs" title="Featured Story">
                      <Star className="w-3 h-3 fill-white" />
                    </span>
                  )}
                  {post.isTrending && !post.isFeatured && (
                    <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-orange-500 text-white shadow-xs" title="Trending Article">
                      <Flame className="w-3 h-3 fill-white" />
                    </span>
                  )}

                  {/* Read Time */}
                  <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {post.readTime || "5 min read"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Read Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    By {post.authorName || "Team Flazo"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:gap-1.5 transition-all">
                    Read Story <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AllBlogsHomePage;

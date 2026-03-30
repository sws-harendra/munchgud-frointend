"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchBlogPosts } from "@/app/lib/store/features/blogSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { ArrowRight } from "lucide-react";
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
      <div className="text-center py-12 text-gray-500 text-lg animate-pulse">
        Loading blogs...
      </div>
    );
  if (status === "failed")
    return (
      <div className="text-center py-12 text-green-600 font-medium">
        Failed to load blogs.
      </div>
    );
  if (!posts || posts.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="relative mb-14">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-center">
          ⭐ Latest <span className="text-lime-600">Blogs</span>
        </h2>
        <p className="mt-3 text-gray-600 text-base lg:text-lg max-w-xl mx-auto text-center">
          Discover insights, stories, and trends shaping the creative world.
        </p>

        {/* View All Button for desktop */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-lime-600 text-white font-semibold shadow-md hover:bg-lime-700 transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.id}/${slugify(post.slug!)}`}
            className="group"
          >
            <div className="bg-gradient-to-b from-green-200 via-green-50 to-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              {/* Image */}
              <div className="p-3">
                <div className="h-44 w-full relative overflow-hidden rounded-xl">
                  {post.featuredImage ? (
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-medium">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 group-hover:text-lime-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* CTA */}
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-lime-600 group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={14} />
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

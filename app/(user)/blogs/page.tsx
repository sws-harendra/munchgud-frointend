"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchBlogPosts,
  deleteBlogPost,
  selectAllPosts,
  selectBlogStatus,
} from "@/app/lib/store/features/blogSlice";
import { getImageUrl } from "@/app/utils/getImageUrl"; // helper to get image URL

export default function BlogList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const status = useAppSelector(selectBlogStatus);

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlogPost(id));
    }
  };

  if (status === "loading")
    return <p className="text-center mt-10 text-gray-500">Loading blogs...</p>;
  if (status === "failed")
    return (
      <p className="text-center mt-10 text-green-600">Failed to load blogs.</p>
    );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Blogs</h1>
      </div>

      {/* Blog cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link href={`/blogs/${post.id}/${post.slug}`} key={post.id}>
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Featured image */}
              {post.featuredImage && (
                <Link href={`/blogs/${post.id}/${post.slug}`}>
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <Link href={`/admin/dashboard/blogs/${post.slug}`}>
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-green-600 hover:underline transition">
                      {post.title}
                    </h2>
                  </Link>
                  {post.excerpt && (
                    <p className="text-gray-500 mt-2 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* <div className="mt-4 flex justify-between items-center">
                <Link href={`/blogs/${post.id}/${post.slug}`}>
                  <button className="text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition">
                    View
                  </button>
                </Link>
              </div> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

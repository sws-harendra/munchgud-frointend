import React from "react";
import Link from "next/link";
import { BlogPostItem, blogService } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Clock,
  Eye,
  User,
  Star,
  Flame,
  CheckCircle2,
  Calendar,
  Tag,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string; slug?: string }>;
}

export default async function AdminViewBlog({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let post: BlogPostItem | null = null;
  try {
    post = await blogService.getBlogById(id);
  } catch (error) {
    console.error("Error fetching blog for admin view:", error);
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900/10 p-6 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <p className="text-gray-600 font-semibold">Article not found</p>
          <Link
            href="/admin/dashboard/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-2xl text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  let tagsArray: string[] = [];
  if (post.tags) {
    try {
      const parsed = JSON.parse(post.tags);
      tagsArray = Array.isArray(parsed) ? parsed : [post.tags];
    } catch {
      tagsArray = post.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Action Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blogs"
            className="p-2.5 rounded-2xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Admin Article Preview
            </h1>
            <span className="text-xs text-gray-400 font-mono">
              Database ID: #{post.id} • Slug: /{post.slug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/blogs/${post.id}/${post.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-amber-300 bg-amber-50/50 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>Storefront View</span>
          </Link>
          <Link
            href={`/admin/dashboard/blogs/edit/${post.id}/${post.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Article</span>
          </Link>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Cover Image */}
        {post.featuredImage && (
          <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden">
            <img
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            
            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-900 shadow-sm">
                {post.category || "Technology"}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md text-white ${
                post.status === "published" || !post.status ? "bg-emerald-600/90" : "bg-slate-700/90"
              }`}>
                {post.status === "published" || !post.status ? "● Published" : "○ Draft"}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              {post.isFeatured && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  Featured Story
                </span>
              )}
              {post.isTrending && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Trending Top
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <User className="w-3.5 h-3.5 text-amber-600" />
              {post.authorName || "Team Flazo"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {post.readTime || "5 min read"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              {post.views || 0} reader views
            </span>
            {post.createdAt && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-sm text-amber-950 font-medium italic">
              &ldquo;{post.excerpt}&rdquo;
            </div>
          )}

          {/* Tags */}
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {tagsArray.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Body Content */}
          <div className="pt-6 border-t border-gray-100 prose prose-neutral max-w-none text-gray-800 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}

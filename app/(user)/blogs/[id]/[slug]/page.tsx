"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { blogService } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { ArrowLeft, Clock, Calendar, Headphones, Share2, Check } from "lucide-react";

export default function ViewBlog() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id);
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
            Loading Acoustic Journal...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-amber-100 shadow-sm">
          <Headphones className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
            Journal Article Not Found
          </h2>
          <p className="text-xs text-neutral-500 mb-6">
            The requested publication may have been updated or moved to our sound archives.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-amber-300 text-xs font-bold rounded-xl hover:bg-amber-600 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Flazo Acoustic Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-neutral-900 pb-28">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-amber-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-amber-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Acoustic Journal
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-amber-700 transition px-3 py-1 rounded-lg border border-amber-200 bg-amber-50/50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-700 font-semibold mb-4">
          <span className="px-3 py-1 bg-amber-100 rounded-full">
            Acoustic Masterclass
          </span>
          <span className="text-neutral-400">•</span>
          <span className="flex items-center gap-1 text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            6 min read
          </span>
          {post.createdAt && (
            <>
              <span className="text-neutral-400">•</span>
              <span className="flex items-center gap-1 text-neutral-500">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-neutral-900 tracking-tight leading-tight mb-8">
          {post.title}
        </h1>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-amber-100 mb-10 bg-neutral-950 max-h-[500px]">
            <img
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Excerpt if present */}
        {post.excerpt && (
          <div className="p-6 rounded-2xl bg-amber-50/60 border-l-4 border-amber-500 text-sm text-neutral-700 font-medium italic mb-8">
            &ldquo;{post.excerpt}&rdquo;
          </div>
        )}

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-100/90 shadow-xs">
          <div
            className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed space-y-4 text-base"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Bottom Author & Share Strip */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center font-bold">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Flazo Acoustic Research Desk</p>
              <p className="text-xs text-neutral-500">Published in Flazo Sound Labs</p>
            </div>
          </div>

          <Link
            href="/blogs"
            className="px-5 py-2.5 bg-neutral-950 text-amber-300 text-xs font-bold rounded-xl hover:bg-amber-600 hover:text-white transition"
          >
            Explore More Publications →
          </Link>
        </div>
      </div>
    </article>
  );
}

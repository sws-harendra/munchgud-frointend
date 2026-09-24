"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { blogService, BlogPostItem } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Headphones,
  Share2,
  Check,
  Eye,
  Tag,
  Star,
  Flame,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function ViewBlog() {
  const params = useParams();
  const id = params?.id as string;
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // Fetch current blog
        const data = await blogService.getBlogById(id || slug);
        setPost(data);

        // Fetch related blogs dynamically from database
        try {
          const allBlogs = await blogService.getAllBlogs();
          const filtered = allBlogs
            .filter(
              (b) =>
                String(b.id) !== String(data.id) &&
                (b.status === "published" || !b.status)
            )
            .sort((a, b) => {
              // Prioritize same category, then trending, then latest
              if (a.category === data.category && b.category !== data.category) return -1;
              if (b.category === data.category && a.category !== data.category) return 1;
              return 0;
            })
            .slice(0, 3);
          setRelatedPosts(filtered);
        } catch {}
      } catch (error) {
        console.error("Failed to load article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id || slug) {
      fetchBlogData();
    }
  }, [id, slug]);

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
            Loading Acoustic Publication...
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

  // Parse tags
  let tagsList: string[] = [];
  if (post.tags) {
    try {
      const parsed = JSON.parse(post.tags);
      tagsList = Array.isArray(parsed) ? parsed : [post.tags];
    } catch {
      tagsList = post.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-neutral-900 pb-28">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-amber-100 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 backdrop-blur-md bg-white/90">
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-amber-700 transition px-3.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Share Story</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Dynamic Category & Meta Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-700 font-semibold mb-4">
          <Link
            href={`/blogs?category=${encodeURIComponent(post.category || "Technology")}`}
            className="px-3.5 py-1 bg-amber-100 hover:bg-amber-200 rounded-full transition"
          >
            {post.category || "Acoustic Masterclass"}
          </Link>

          {post.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[11px]">
              <Star className="w-3 h-3 fill-white" />
              Featured
            </span>
          )}

          {post.isTrending && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-bold text-[11px]">
              <Flame className="w-3 h-3 fill-white" />
              Trending
            </span>
          )}

          <span className="text-neutral-300">•</span>
          <span className="flex items-center gap-1 text-neutral-500">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {post.readTime || "5 min read"}
          </span>

          {post.views !== undefined && post.views > 0 && (
            <>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1 text-neutral-500">
                <Eye className="w-3.5 h-3.5 text-purple-600" />
                {post.views > 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views} reads
              </span>
            </>
          )}

          {post.createdAt && (
            <>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1 text-neutral-500">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {/* Dynamic Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-neutral-900 tracking-tight leading-tight mb-8">
          {post.title}
        </h1>

        {/* Dynamic Featured Cover Image */}
        {post.featuredImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-amber-100 mb-10 bg-neutral-950 max-h-[520px]">
            <img
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover max-h-[520px]"
            />
          </div>
        )}

        {/* Dynamic Excerpt if present */}
        {post.excerpt && (
          <div className="p-6 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-base text-neutral-800 font-serif italic mb-8 leading-relaxed">
            &ldquo;{post.excerpt}&rdquo;
          </div>
        )}

        {/* Dynamic Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-100/90 shadow-xs mb-8">
          <div
            className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed space-y-4 text-base"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Dynamic Tags Chips */}
        {tagsList.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-amber-100 flex flex-wrap items-center gap-2 mb-8">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">
              <Tag className="w-3.5 h-3.5" /> Topics:
            </span>
            {tagsList.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-800 rounded-lg text-xs font-semibold transition cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Dynamic Author Card Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-neutral-900">
                {post.authorName || "Team Flazo"}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Flazo Acoustic Labs & Editorial Board
              </p>
            </div>
          </div>

          <Link
            href="/blogs"
            className="px-5 py-2.5 bg-neutral-950 text-amber-300 text-xs font-bold rounded-xl hover:bg-amber-600 hover:text-white transition"
          >
            Explore All Journal Stories →
          </Link>
        </div>

        {/* Dynamic Related Stories Section */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-amber-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
                  Continue Reading
                </span>
                <h3 className="text-2xl font-serif font-black text-neutral-900 mt-1">
                  Related Acoustic Stories
                </h3>
              </div>
              <Link
                href="/blogs"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.id}/${item.slug}`}
                  className="group bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-40 bg-neutral-950 overflow-hidden">
                    {item.featuredImage ? (
                      <img
                        src={getImageUrl(item.featuredImage)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                        <BookOpen className="w-6 h-6 opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-neutral-900 uppercase">
                      {item.category || "Story"}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 group-hover:text-amber-700 transition line-clamp-2 text-sm mb-2">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed mb-3">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                      <span>{item.readTime || "5 min read"}</span>
                      <span className="font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

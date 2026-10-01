"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store/store";
import { addBlogPost, updateBlogPost } from "@/app/lib/store/features/blogSlice";
import { BlogPostItem } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  Clock,
  Star,
  Flame,
  Tag,
  User,
  Sparkles,
  Layers,
  X,
  FileText,
  Globe,
  Loader2,
} from "lucide-react";
import { useSafeAdminTheme } from "@/app/admin/context/AdminThemeContext";

const RichTextEditor = dynamic(
  () => import("@/app/commonComponents/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-zinc-400 bg-zinc-900/40 rounded-2xl animate-pulse">
        Loading Rich Text Studio...
      </div>
    ),
  }
);

const CATEGORY_PRESETS = [
  "Technology",
  "Tips & Tricks",
  "Lifestyle",
  "Product Guides",
  "Acoustic Masterclass",
  "Industry Insights",
  "News & Announcements",
];

interface BlogEditorFormProps {
  initialData?: BlogPostItem | null;
  isEdit?: boolean;
}

export default function BlogEditorForm({
  initialData,
  isEdit = false,
}: BlogEditorFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const themeContext = useSafeAdminTheme();
  const isDarkMode = Boolean(
    themeContext?.isDark || themeContext?.resolvedTheme === "dark"
  );

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(
    initialData?.category || CATEGORY_PRESETS[0]
  );
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [tagsInput, setTagsInput] = useState(initialData?.tags || "");
  const [authorName, setAuthorName] = useState(
    initialData?.authorName || "Team Flazo"
  );
  const [readTime, setReadTime] = useState(
    initialData?.readTime || "4 min read"
  );
  const [views, setViews] = useState(initialData?.views || 0);

  // Status & Flags
  const [status, setStatus] = useState<"published" | "draft">(
    (initialData?.status as any) || "published"
  );
  const [isFeatured, setIsFeatured] = useState(
    Boolean(initialData?.isFeatured)
  );
  const [isTrending, setIsTrending] = useState(
    Boolean(initialData?.isTrending)
  );

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    initialData?.metaKeywords || ""
  );

  // Image Upload
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.featuredImage || null
  );
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugManuallyEdited && title && !isEdit) {
      const generated = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
      setSlug(generated);
    }
  }, [title, isSlugManuallyEdited, isEdit]);

  // Handle Cover Image Selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImageFile(null);
    setImagePreview(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Article Title is required.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      toast.error("Full Article Content cannot be empty.");
      return;
    }

    const toastId = toast.loading(
      isEdit ? "Updating article..." : "Publishing article..."
    );
    setLoading(true);

    try {
      const finalCategory = isCustomCategory
        ? customCategory.trim() || "General"
        : category;

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", slug.trim() || "article");
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content);
      formData.append("category", finalCategory);
      formData.append("tags", tagsInput.trim());
      formData.append("authorName", authorName.trim());
      formData.append("readTime", readTime.trim());
      formData.append("views", String(views));
      formData.append("status", status);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isTrending", String(isTrending));

      // SEO
      formData.append("metaTitle", metaTitle.trim() || title.trim());
      formData.append("metaDescription", metaDescription.trim() || excerpt.trim());
      formData.append("metaKeywords", metaKeywords.trim() || tagsInput.trim());

      // File
      if (featuredImageFile) {
        formData.append("featuredImage", featuredImageFile);
      } else if (imagePreview && !featuredImageFile) {
        formData.append("featuredImage", imagePreview);
      }

      if (isEdit && initialData?.id) {
        await dispatch(
          updateBlogPost({ id: initialData.id, formData })
        ).unwrap();
        toast.success("Blog article updated successfully!", { id: toastId });
      } else {
        await dispatch(addBlogPost(formData)).unwrap();
        toast.success("Blog article published successfully!", { id: toastId });
      }

      setTimeout(() => {
        router.push("/admin/dashboard/blogs");
      }, 400);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.message || "Failed to save article. Please verify inputs.",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const cardClass = `rounded-3xl p-6 border transition-all ${
    isDarkMode
      ? "bg-zinc-900/60 border-zinc-800/80 shadow-black"
      : "bg-white border-slate-200/80 shadow-xs"
  }`;

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${
    isDarkMode ? "text-zinc-400" : "text-gray-700"
  }`;

  const inputClass = `w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
    isDarkMode
      ? "bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500/60"
      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500"
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Bar Navigation & Actions */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl border transition-all ${
          isDarkMode
            ? "bg-zinc-900/60 border-zinc-800/80 shadow-black"
            : "bg-white border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blogs"
            className={`p-2.5 rounded-2xl border transition ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
                : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {isEdit ? "Edit Acoustic Article" : "Write New Publication"}
            </h1>
            <p
              className={`text-xs ${
                isDarkMode ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              {isEdit
                ? `Updating "${initialData?.title}"`
                : "Create a rich, studio-grade article for the live storefront"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blogs"
            className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold transition ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 text-sm font-bold shadow-md shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Article"
                : "Publish Article"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content, Title, Excerpt (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Core Information Card */}
          <div className={`${cardClass} space-y-5`}>
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FileText className="w-4 h-4 text-amber-500" />
              Article Content & Headline
            </h2>

            {/* Title */}
            <div>
              <label className={labelClass}>
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Science Behind Exceptional Sound"
                required
                className={`${inputClass} text-base font-medium`}
              />
            </div>

            {/* Slug URL Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass}>Slug / URL Path</label>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  storefront path: /blogs/:id/:slug
                </span>
              </div>
              <div
                className={`flex items-center rounded-2xl border overflow-hidden px-3 py-2 text-sm ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800"
                    : "bg-slate-50/60 border-gray-200"
                }`}
              >
                <span className="text-zinc-500 font-mono select-none">
                  /blogs/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="article-slug"
                  className={`w-full bg-transparent font-mono focus:outline-none px-1 ${
                    isDarkMode ? "text-zinc-200" : "text-gray-700"
                  }`}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>
                  Excerpt / Executive Summary
                </label>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  {excerpt.length}/250 characters
                </span>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A compelling 1-2 sentence hook displayed on homepage cards, featured story highlights, and search teasers..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className={labelClass}>
                Full Article Body <span className="text-rose-500">*</span>
              </label>
              <div
                className={`border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 ${
                  isDarkMode ? "border-zinc-800" : "border-gray-200"
                }`}
              >
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>

          {/* SEO & Metadata Card */}
          <div className={`${cardClass} space-y-4`}>
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Globe className="w-4 h-4 text-blue-500" />
              SEO & Social Meta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-bold mb-1.5 ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to article title if empty"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-bold mb-1.5 ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="sound, ANC, audio, Flazo"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                placeholder="Search engine snippet preview..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media, Flags, Categorization (1 span) */}
        <div className="space-y-6">
          {/* Publishing & Visibility Settings */}
          <div className={`${cardClass} space-y-5`}>
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Publishing & Visibility
            </h2>

            {/* Status Select */}
            <div>
              <label className={labelClass}>Publication Status</label>
              <div
                className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800"
                    : "bg-slate-100 border-slate-200/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "published"
                      ? isDarkMode
                        ? "bg-zinc-800 text-emerald-400 border border-zinc-700/60 shadow-sm"
                        : "bg-white text-emerald-700 shadow-sm"
                      : isDarkMode
                      ? "text-zinc-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "draft"
                      ? isDarkMode
                        ? "bg-zinc-800 text-zinc-200 border border-zinc-700/60 shadow-sm"
                        : "bg-white text-slate-900 shadow-sm"
                      : isDarkMode
                      ? "text-zinc-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  Draft
                </button>
              </div>
            </div>

            {/* Featured Story Toggle */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                isDarkMode
                  ? "border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-zinc-900/60 to-zinc-900/80"
                  : "border-amber-200/70 bg-gradient-to-br from-amber-50/50 to-white"
              }`}
            >
              <div>
                <div
                  className={`flex items-center gap-1.5 text-sm font-bold ${
                    isDarkMode ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      isDarkMode ? "fill-amber-400 text-amber-400" : "fill-amber-500 text-amber-500"
                    }`}
                  />
                  <span>Hero Featured Story</span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isDarkMode ? "text-amber-400/70" : "text-amber-800/80"
                  }`}
                >
                  Pin as the main spotlight card on the blogs page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isFeatured
                    ? "bg-amber-500"
                    : isDarkMode
                    ? "bg-zinc-800 border border-zinc-700"
                    : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isFeatured
                      ? "translate-x-6 bg-zinc-950"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </button>
            </div>

            {/* Trending Toggle */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                isDarkMode
                  ? "border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-zinc-900/60 to-zinc-900/80"
                  : "border-orange-200/70 bg-gradient-to-br from-orange-50/50 to-white"
              }`}
            >
              <div>
                <div
                  className={`flex items-center gap-1.5 text-sm font-bold ${
                    isDarkMode ? "text-orange-400" : "text-orange-900"
                  }`}
                >
                  <Flame
                    className={`w-4 h-4 ${
                      isDarkMode ? "fill-orange-400 text-orange-400" : "fill-orange-500 text-orange-500"
                    }`}
                  />
                  <span>Trending Top Chart</span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isDarkMode ? "text-orange-400/70" : "text-orange-800/80"
                  }`}
                >
                  Include in the numbered "Trending Now" charts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTrending(!isTrending)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isTrending
                    ? "bg-orange-500"
                    : isDarkMode
                    ? "bg-zinc-800 border border-zinc-700"
                    : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isTrending
                      ? "translate-x-6 bg-zinc-950"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </button>
            </div>

            {/* Author Name */}
            <div>
              <label className={labelClass}>Author / Desk Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g., Team Flazo or Acoustic Labs"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Read Time & Views */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Read Time</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Initial Views</label>
                <input
                  type="number"
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value) || 0)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload Card */}
          <div className={`${cardClass} space-y-4`}>
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <UploadCloud className="w-4 h-4 text-amber-500" />
              Featured Cover Image
            </h2>

            {/* Image Preview or Dropzone */}
            {imagePreview ? (
              <div
                className={`relative rounded-2xl overflow-hidden border group ${
                  isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-slate-950"
                }`}
              >
                <img
                  src={
                    imagePreview.startsWith("blob:")
                      ? imagePreview
                      : getImageUrl(imagePreview)
                  }
                  alt="Cover Preview"
                  className="w-full h-48 object-cover group-hover:opacity-90 transition"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div
                  className={`p-3 border-t flex items-center justify-between text-xs ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                      : "bg-white border-gray-100 text-gray-500"
                  }`}
                >
                  <span className="truncate max-w-[200px]">
                    {featuredImageFile?.name || "Current Image Active"}
                  </span>
                  <label className="text-amber-500 font-semibold cursor-pointer hover:underline">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition group ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-950/60 hover:border-amber-500/50 hover:bg-zinc-900/40"
                    : "border-gray-300 bg-slate-50/50 hover:bg-amber-50/20"
                }`}
              >
                <UploadCloud
                  className={`w-8 h-8 mb-2 transition ${
                    isDarkMode
                      ? "text-zinc-500 group-hover:text-amber-400"
                      : "text-gray-400 group-hover:text-amber-600"
                  }`}
                />
                <span
                  className={`text-sm font-semibold transition ${
                    isDarkMode
                      ? "text-zinc-300 group-hover:text-amber-400"
                      : "text-gray-700 group-hover:text-amber-700"
                  }`}
                >
                  Click to upload cover image
                </span>
                <span
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  JPG, PNG, WebP up to 5MB (16:9 recommended)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Category & Tags Card */}
          <div className={`${cardClass} space-y-4`}>
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500" />
              Category & Tags
            </h2>

            {/* Category Select */}
            <div>
              <label className={labelClass}>Category</label>
              {!isCustomCategory ? (
                <div className="space-y-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                        className={isDarkMode ? "bg-zinc-900 text-white" : ""}
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(true)}
                    className="text-xs text-amber-500 font-semibold hover:underline cursor-pointer"
                  >
                    + Enter custom category
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Acoustic Masterclass"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className={`text-xs font-semibold hover:underline cursor-pointer ${
                      isDarkMode ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    ← Back to presets
                  </button>
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className={labelClass}>Tags (Comma separated)</label>
              <div className="relative">
                <Tag className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Technology, ANC, Earbuds, Audiophile"
                  className={`${inputClass} pl-10`}
                />
              </div>

              {/* Tag Chips Preview */}
              {tagsInput && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((chip, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          isDarkMode
                            ? "bg-amber-950/50 text-amber-400 border-amber-800/60"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        #{chip}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

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
  Eye,
  User,
  Sparkles,
  Layers,
  HelpCircle,
  X,
  FileText,
  Globe,
} from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/app/commonComponents/RichTextEditor"),
  { ssr: false, loading: () => <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl animate-pulse">Loading Rich Text Studio...</div> }
);

const CATEGORY_PRESETS = [
  "Technology",
  "Tips & Tricks",
  "Lifestyle",
  "Product Guides",
  "Acoustic Masterclass",
  "Reviews & Awards",
  "Firmware & Updates",
];

interface BlogEditorFormProps {
  initialData?: BlogPostItem | null;
  isEdit?: boolean;
}

export default function BlogEditorForm({
  initialData,
  isEdit = false,
}: BlogEditorFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "Technology");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "published"
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialData?.isFeatured || false
  );
  const [isTrending, setIsTrending] = useState<boolean>(
    initialData?.isTrending || false
  );

  const [authorName, setAuthorName] = useState(
    initialData?.authorName || "Team Flazo"
  );
  const [readTime, setReadTime] = useState(initialData?.readTime || "");
  const [views, setViews] = useState<number>(initialData?.views || 0);

  // Tags
  const [tagsInput, setTagsInput] = useState(() => {
    if (!initialData?.tags) return "";
    try {
      const parsed = JSON.parse(initialData.tags);
      return Array.isArray(parsed) ? parsed.join(", ") : initialData.tags;
    } catch {
      return initialData.tags;
    }
  });

  // Media
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.featuredImage || null
  );

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    initialData?.metaKeywords || ""
  );

  const [loading, setLoading] = useState(false);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!isSlugManuallyEdited && !isEdit) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  }, [title, isSlugManuallyEdited, isEdit]);

  // Auto-calculate read time if left empty
  useEffect(() => {
    if (!readTime && content) {
      const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.round(wordCount / 200));
      setReadTime(`${mins} min read`);
    }
  }, [content, readTime]);

  // Handle image upload
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
      toast.error("Article title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Article content is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      isEdit ? "Saving changes..." : "Publishing article..."
    );

    try {
      const activeCategory = isCustomCategory
        ? customCategory.trim() || "General"
        : category;

      // Parse tags to array
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", slug.trim() || title.toLowerCase().replace(/\s+/g, "-"));
      formData.append("content", content);
      formData.append("excerpt", excerpt.trim());
      formData.append("category", activeCategory);
      formData.append("status", status);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isTrending", String(isTrending));
      formData.append("authorName", authorName.trim() || "Team Flazo");
      formData.append("readTime", readTime || "5 min read");
      formData.append("views", String(views));
      formData.append("tags", JSON.stringify(parsedTags));

      if (metaTitle) formData.append("metaTitle", metaTitle);
      if (metaDescription) formData.append("metaDescription", metaDescription);
      if (metaKeywords) formData.append("metaKeywords", metaKeywords);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blogs"
            className="p-2.5 rounded-2xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {isEdit ? "Edit Acoustic Article" : "Write New Publication"}
            </h1>
            <p className="text-xs text-gray-500">
              {isEdit
                ? `Updating "${initialData?.title}"`
                : "Create a rich, studio-grade article for the live storefront"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blogs"
            className="px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Article Content & Headline
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Science Behind Exceptional Sound"
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Slug URL Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Slug / URL Path
                </label>
                <span className="text-xs text-gray-400">
                  storefront path: /blogs/:id/:slug
                </span>
              </div>
              <div className="flex items-center rounded-2xl border border-gray-200 bg-slate-50/60 overflow-hidden px-3 py-2 text-sm">
                <span className="text-gray-400 font-mono select-none">/blogs/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="article-slug"
                  className="w-full bg-transparent font-mono text-gray-700 focus:outline-none px-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Excerpt / Executive Summary
                </label>
                <span className="text-xs text-gray-400">
                  {excerpt.length}/250 characters
                </span>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A compelling 1-2 sentence hook displayed on homepage cards, featured story highlights, and search teasers..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Full Article Body <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* SEO & Metadata Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              SEO & Social Meta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to article title if empty"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="sound, ANC, audio, Flazo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                placeholder="Search engine snippet preview..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media, Flags, Categorization (1 span) */}
        <div className="space-y-6">
          {/* Publishing & Visibility Settings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Publishing & Visibility
            </h2>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Publication Status
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "published"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "draft"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Draft
                </button>
              </div>
            </div>

            {/* Featured Story Toggle */}
            <div className="p-4 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/50 to-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Hero Featured Story</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  Pin as the main spotlight card at the top of the blogs page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isFeatured ? "bg-amber-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isFeatured ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Trending Toggle */}
            <div className="p-4 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50/50 to-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-orange-900">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>Trending Top Chart</span>
                </div>
                <p className="text-xs text-orange-800/80 mt-0.5">
                  Include in the numbered "Trending Now" charts (01, 02, 03...).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTrending(!isTrending)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isTrending ? "bg-orange-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isTrending ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Author / Desk Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g., Team Flazo or Acoustic Labs"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Read Time & Views */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Initial Views
                </label>
                <input
                  type="number"
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-amber-600" />
              Featured Cover Image
            </h2>

            {/* Image Preview or Dropzone */}
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 group bg-slate-950">
                <img
                  src={imagePreview.startsWith("blob:") ? imagePreview : getImageUrl(imagePreview)}
                  alt="Cover Preview"
                  className="w-full h-48 object-cover group-hover:opacity-90 transition"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-xl backdrop-blur-sm transition"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate max-w-[200px]">
                    {featuredImageFile?.name || "Current Image Active"}
                  </span>
                  <label className="text-amber-600 font-semibold cursor-pointer hover:underline">
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
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-amber-50/20 transition group">
                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-amber-600 transition mb-2" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-700">
                  Click to upload cover image
                </span>
                <span className="text-xs text-gray-400 mt-1">
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              Category & Tags
            </h2>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Category
              </label>
              {!isCustomCategory ? (
                <div className="space-y-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(true)}
                    className="text-xs text-amber-600 font-semibold hover:underline"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="text-xs text-gray-500 font-semibold hover:underline"
                  >
                    ← Back to presets
                  </button>
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Tags (Comma separated)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Technology, ANC, Earbuds, Audiophile"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-amber-500"
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
                        className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200"
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

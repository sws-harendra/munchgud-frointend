"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createDiscussionThunk,
  updateDiscussionThunk,
} from "@/app/lib/store/features/communitySlice";
import {
  CommunityDiscussionItem,
  CommunityTopicItem,
} from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { X } from "lucide-react";
import { toast } from "sonner";

interface DiscussionModalProps {
  isOpen: boolean;
  initialData: CommunityDiscussionItem | null;
  topics: CommunityTopicItem[];
  onClose: () => void;
}

export default function DiscussionModal({
  isOpen,
  initialData,
  topics,
  onClose,
}: DiscussionModalProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();
  const defaultTopic = topics[0];
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    desc: initialData?.desc || "",
    author: initialData?.author || "",
    time: initialData?.time || "Just now",
    category: initialData?.category || defaultTopic?.title || "Product Help",
    tag: initialData?.tag || defaultTopic?.slug || defaultTopic?.topicId || "help",
    votes: initialData?.votes ?? 0,
    comments: initialData?.comments ?? 0,
    views: initialData?.views || "10",
    isPinned: initialData?.isPinned || false,
    isActive: initialData?.isActive ?? true,
    displayOrder: initialData?.displayOrder ?? 0,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatar ? getImageUrl(initialData.avatar) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a discussion title");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => {
        fd.append(k, (formData as any)[k]);
      });
      if (avatarFile) {
        fd.append("avatar", avatarFile);
      }

      if (initialData?.id) {
        await dispatch(updateDiscussionThunk({ id: initialData.id, data: fd })).unwrap();
        toast.success("Discussion updated successfully!");
      } else {
        await dispatch(createDiscussionThunk(fd)).unwrap();
        toast.success("New discussion thread created!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save discussion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-neutral-200 text-neutral-900"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? "border-zinc-800" : "border-neutral-100"
          }`}
        >
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
            {initialData ? "Edit Discussion Thread" : "Create New Discussion"}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg cursor-pointer transition ${
              isDark
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Thread Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="e.g. Which Flazo earbuds are best for workouts?"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Thread Content / Description
            </label>
            <textarea
              rows={3}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="Describe the issue, question, or vibe..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Author Name *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
                placeholder="Rohit Sharma"
              />
            </div>
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Time Label
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
                placeholder="2h ago, 1d ago"
              />
            </div>
          </div>

          {/* Dynamic Topic & Category Selector */}
          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Topic / Category *
            </label>
            <select
              value={formData.tag}
              onChange={(e) => {
                const selectedTag = e.target.value;
                const matchedTopic = topics.find((t) => (t.slug || t.topicId) === selectedTag);
                setFormData({
                  ...formData,
                  tag: selectedTag,
                  category: matchedTopic ? matchedTopic.title : formData.category,
                });
              }}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border font-medium cursor-pointer focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
            >
              {topics.map((t) => {
                const slugVal = t.slug || t.topicId;
                return (
                  <option key={t.id} value={slugVal}>
                    {t.title} ({slugVal})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Stats: Votes, Comments, Views */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Upvotes
              </label>
              <input
                type="number"
                value={formData.votes}
                onChange={(e) => setFormData({ ...formData, votes: Number(e.target.value) })}
                className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
              />
            </div>
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Comments
              </label>
              <input
                type="number"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: Number(e.target.value) })}
                className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
              />
            </div>
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Views
              </label>
              <input
                type="text"
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
                placeholder="1.2K"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Author Avatar
            </label>
            <div className="flex items-center gap-3">
              {avatarPreview && (
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden relative shrink-0 border ${
                    isDark ? "border-zinc-800" : "border-neutral-200"
                  }`}
                >
                  <Image src={avatarPreview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAvatarFile(e.target.files[0]);
                    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className={`text-xs cursor-pointer ${
                  isDark
                    ? "text-zinc-400 file:bg-amber-950/80 file:text-amber-300 file:border-amber-800/50 hover:file:bg-amber-900/80"
                    : "text-neutral-600 file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                } file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold`}
              />
            </div>
          </div>

          {/* Checkboxes: Pin & Active */}
          <div className="flex items-center gap-6 pt-2">
            <label
              className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                isDark ? "text-zinc-300" : "text-neutral-700"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 accent-amber-600"
              />
              <span>Pin to top</span>
            </label>

            <label
              className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                isDark ? "text-zinc-300" : "text-neutral-700"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 accent-amber-600"
              />
              <span>Active (Visible on Storefront)</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div
            className={`pt-4 border-t flex items-center justify-end gap-3 ${
              isDark ? "border-zinc-800" : "border-neutral-100"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition ${
                isDark
                  ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Thread" : "Publish Thread"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createTopicThunk,
  updateTopicThunk,
} from "@/app/lib/store/features/communitySlice";
import { CommunityTopicItem } from "@/app/sercices/user/community.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { X } from "lucide-react";
import { toast } from "sonner";

interface TopicModalProps {
  isOpen: boolean;
  initialData: CommunityTopicItem | null;
  onClose: () => void;
}

export default function TopicModal({
  isOpen,
  initialData,
  onClose,
}: TopicModalProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || initialData?.topicId || "",
    desc: initialData?.desc || "",
    iconName: initialData?.iconName || initialData?.icon || "Headphones",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Please enter topic title and slug");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await dispatch(updateTopicThunk({ id: initialData.id, data: formData })).unwrap();
        toast.success("Topic updated!");
      } else {
        await dispatch(createTopicThunk(formData)).unwrap();
        toast.success("Topic created!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-neutral-200 text-neutral-900"
        }`}
      >
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? "border-zinc-800" : "border-neutral-100"
          }`}
        >
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
            {initialData ? "Edit Category Topic" : "Add Category Topic"}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Title *
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
              placeholder="Product Help"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Slug / ID *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="help, tips, lifestyle"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Short Description
            </label>
            <input
              type="text"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="Get solutions, Maximize experience"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Icon Name
            </label>
            <select
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border cursor-pointer focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
            >
              <option value="Headphones">Headphones</option>
              <option value="Lightbulb">Lightbulb</option>
              <option value="Music">Music</option>
              <option value="Sliders">Sliders</option>
              <option value="Calendar">Calendar</option>
              <option value="Users">Users</option>
              <option value="Sparkles">Sparkles</option>
            </select>
          </div>

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
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

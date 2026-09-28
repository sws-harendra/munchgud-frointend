"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createContributorThunk,
  updateContributorThunk,
} from "@/app/lib/store/features/communitySlice";
import { CommunityContributorItem } from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ContributorModalProps {
  isOpen: boolean;
  initialData: CommunityContributorItem | null;
  onClose: () => void;
}

export default function ContributorModal({
  isOpen,
  initialData,
  onClose,
}: ContributorModalProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();
  const [formData, setFormData] = useState({
    rank: initialData?.rank ?? 1,
    name: initialData?.name || "",
    points: initialData?.points || "1.0K points",
    role: initialData?.role || "Sound Expert",
    badgeClass: initialData?.badgeClass || "bg-amber-100 text-amber-900 font-bold",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatar ? getImageUrl(initialData.avatar) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter contributor name");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => fd.append(k, (formData as any)[k]));
      if (avatarFile) fd.append("avatar", avatarFile);

      if (initialData?.id) {
        await dispatch(updateContributorThunk({ id: initialData.id, data: fd })).unwrap();
        toast.success("Contributor updated!");
      } else {
        await dispatch(createContributorThunk(fd)).unwrap();
        toast.success("Contributor added!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save contributor");
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
            {initialData ? "Edit Contributor" : "Add Top Contributor"}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Rank *
              </label>
              <input
                type="number"
                required
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: Number(e.target.value) })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
              />
            </div>
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Points Display
              </label>
              <input
                type="text"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
                placeholder="1.2K points"
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              Role / Badge Label
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="Sound Expert, Top Helper"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Avatar Image
            </label>
            {avatarPreview && (
              <div
                className={`relative w-12 h-12 rounded-full overflow-hidden mb-2 border ${
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
              {isSubmitting ? "Saving..." : "Save Contributor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

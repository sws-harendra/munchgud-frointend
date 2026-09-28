"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createCreatorThunk,
  updateCreatorThunk,
} from "@/app/lib/store/features/communitySlice";
import { CommunityCreatorItem } from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { X } from "lucide-react";
import { toast } from "sonner";

interface CreatorModalProps {
  isOpen: boolean;
  initialData: CommunityCreatorItem | null;
  onClose: () => void;
}

export default function CreatorModal({
  isOpen,
  initialData,
  onClose,
}: CreatorModalProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();
  const [formData, setFormData] = useState({
    handle: initialData?.handle || "",
    role: initialData?.role || "",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(
    initialData?.img ? getImageUrl(initialData.img) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.handle.trim()) {
      toast.error("Please enter a creator handle");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => fd.append(k, (formData as any)[k]));
      if (imgFile) fd.append("img", imgFile);

      if (initialData?.id) {
        await dispatch(updateCreatorThunk({ id: initialData.id, data: fd })).unwrap();
        toast.success("Creator updated successfully!");
      } else {
        await dispatch(createCreatorThunk(fd)).unwrap();
        toast.success("Creator added to spotlight!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save creator");
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
            {initialData ? "Edit Creator Polaroid" : "Add Featured Creator"}
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
              Handle *
            </label>
            <input
              type="text"
              required
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="@tanya_music"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Role / Passion *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "border-neutral-200 focus:border-amber-600"
              }`}
              placeholder="Music Creator, Tech Reviewer"
            />
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
              Polaroid Photo
            </label>
            {imgPreview && (
              <div
                className={`relative w-32 aspect-[4/5] rounded-xl overflow-hidden mb-2 border ${
                  isDark ? "border-zinc-800" : "border-neutral-200"
                }`}
              >
                <Image src={imgPreview} alt="Preview" fill unoptimized className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImgFile(e.target.files[0]);
                  setImgPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className={`text-xs cursor-pointer ${
                isDark
                  ? "text-zinc-400 file:bg-amber-950/80 file:text-amber-300 file:border-amber-800/50 hover:file:bg-amber-900/80"
                  : "text-neutral-600 file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
              } file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold`}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className={`text-xs font-bold block mb-1 ${isDark ? "text-zinc-300" : "text-neutral-700"}`}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className={`w-24 px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 focus:border-amber-500"
                    : "border-neutral-200 focus:border-amber-600"
                }`}
              />
            </div>

            <label
              className={`flex items-center gap-2 text-xs font-bold cursor-pointer mt-4 ${
                isDark ? "text-zinc-300" : "text-neutral-700"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 accent-amber-600"
              />
              <span>Active</span>
            </label>
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
              {isSubmitting ? "Saving..." : "Save Creator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

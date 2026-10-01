"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  createMediaCoverage,
  updateMediaCoverage,
  MediaCoverage,
} from "@/app/lib/store/features/mediaCoverageSlice";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useSafeAdminTheme } from "@/app/admin/context/AdminThemeContext";

interface MediaCoverageFormProps {
  onSuccess: () => void;
  initialData?: MediaCoverage | null;
  onCancel: () => void;
  isEditMode?: boolean;
}

const MediaCoverageForm = ({
  onSuccess,
  initialData,
  onCancel,
  isEditMode,
}: MediaCoverageFormProps) => {
  const dispatch = useAppDispatch();
  const themeContext = useSafeAdminTheme();
  const isDarkMode = Boolean(themeContext?.isDark || themeContext?.resolvedTheme === "dark");

  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.imageUrl) {
      setPreviewImage(getImageUrl(initialData.imageUrl));
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // preview image
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("url", url);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditMode && initialData) {
        await dispatch(
          updateMediaCoverage({ id: initialData.id, formData })
        ).unwrap();
        toast.success("Media coverage updated successfully");
      } else {
        await dispatch(createMediaCoverage(formData)).unwrap();
        toast.success("Media coverage created successfully");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label
          className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDarkMode ? "text-zinc-400" : "text-gray-700"
          }`}
        >
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
            isDarkMode
              ? "bg-zinc-900/90 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500/60"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500"
          }`}
          placeholder="Enter title"
        />
      </div>

      {/* URL */}
      <div>
        <label
          className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDarkMode ? "text-zinc-400" : "text-gray-700"
          }`}
        >
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
            isDarkMode
              ? "bg-zinc-900/90 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500/60"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500"
          }`}
          placeholder="https://example.com"
        />
      </div>

      {/* Image */}
      <div>
        <label
          className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDarkMode ? "text-zinc-400" : "text-gray-700"
          }`}
        >
          Image {!isEditMode && <span className="text-amber-500">* (Required)</span>}
        </label>
        <div
          className={`mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-dashed rounded-2xl transition-all ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/40 hover:bg-zinc-900/70"
              : "border-gray-300 bg-gray-50/60 hover:border-amber-500/40 hover:bg-gray-50"
          }`}
        >
          <div className="space-y-2 text-center w-full">
            {previewImage ? (
              <div className="relative inline-block max-w-full">
                <img
                  src={previewImage}
                  alt="Preview"
                  className={`max-h-48 rounded-xl object-contain mx-auto border shadow-md ${
                    isDarkMode ? "border-zinc-800 bg-zinc-950/60" : "border-gray-200 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="absolute -top-2.5 -right-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1.5 shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Remove image"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div
                    className={`p-3 rounded-2xl ${
                      isDarkMode ? "bg-zinc-800/80 text-amber-400" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <ImageIcon className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <label
                    htmlFor="file-upload"
                    className={`relative cursor-pointer font-semibold transition-colors focus-within:outline-none ${
                      isDarkMode
                        ? "text-amber-400 hover:text-amber-300"
                        : "text-amber-600 hover:text-amber-700"
                    }`}
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!isEditMode}
                    />
                  </label>
                  <p className={`pl-1.5 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                    or drag and drop
                  </p>
                </div>
                <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex justify-end items-center gap-3 pt-4 border-t ${
        isDarkMode ? "border-zinc-800/80" : "border-gray-200"
      }`}>
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving..." : isEditMode ? "Update Coverage" : "Create Coverage"}
        </button>
      </div>
    </form>
  );
};

export default MediaCoverageForm;

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
import { X, Image as ImageIcon } from "lucide-react";

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
        console.log(initialData);
        console.log("formdata==>", formData);
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
      console.log(error);

      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter title"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image {!isEditMode && "(Required)"}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-48 mx-auto"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
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
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default MediaCoverageForm;

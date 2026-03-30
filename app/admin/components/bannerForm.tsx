import {
  Banner,
  updateBanner,
  createBanner,
} from "@/app/lib/store/features/bannerSlice";
import { useAppDispatch } from "@/app/lib/store/store";
import { categoryService } from "@/app/sercices/category.service";
import { Category } from "@/app/types/product.types";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

// Banner Form Component
const BannerForm = ({
  editingBanner,
  onSuccess,
}: {
  editingBanner?: Banner | null;
  onSuccess: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Banner>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (editingBanner) {
      setForm({
        title: editingBanner.title,
        subtitle: editingBanner.subtitle,
        link: editingBanner.link,
        ctaText: editingBanner.ctaText,
        categoryId: editingBanner.categoryId,
      });
    }
  }, [editingBanner]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.categories);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    const fd = new FormData();
    if (file) fd.append("image", file);
    if (form.title) fd.append("title", form.title);
    if (form.subtitle) fd.append("subtitle", form.subtitle);
    if (form.link) fd.append("link", form.link);
    if (form.ctaText) fd.append("ctaText", form.ctaText);
    if (form.categoryId) fd.append("categoryId", String(form.categoryId));

    try {
      if (editingBanner) {
        await dispatch(
          updateBanner({ id: editingBanner.id, data: fd })
        ).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await dispatch(createBanner(fd)).unwrap();
        toast.success("Banner created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Banner Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">
              {file ? file.name : "Click to upload image"}
            </span>
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          placeholder="Enter banner title"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Subtitle</label>
        <textarea
          name="subtitle"
          value={form.subtitle || ""}
          onChange={handleChange}
          placeholder="Enter banner subtitle"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Link */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Link URL</label>
        <input
          name="link"
          value={form.link || ""}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* CTA Text */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          CTA Button Text
        </label>
        <input
          name="ctaText"
          value={form.ctaText || ""}
          onChange={handleChange}
          placeholder="Learn More"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          name="categoryId"
          value={form.categoryId?.toString() || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/25"
      >
        {loading
          ? "Saving..."
          : editingBanner
            ? "Update Banner"
            : "Create Banner"}
      </button>
    </div>
  );
};
export default BannerForm;

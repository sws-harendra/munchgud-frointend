import { Banner, updateBanner } from "@/app/lib/store/features/bannerSlice";
import { useAppDispatch } from "@/app/lib/store/store";
import { categoryService } from "@/app/sercices/category.service";
import { Category } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSafeAdminTheme } from "@/app/admin/context/AdminThemeContext";

const EditBannerForm = ({
  banner,
  onSuccess,
}: {
  banner: Banner;
  onSuccess: () => void;
}) => {
  const dispatch = useAppDispatch();
  const themeContext = useSafeAdminTheme();
  const isDarkMode = Boolean(themeContext?.isDark || themeContext?.resolvedTheme === "dark");

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Banner>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    // Pre-fill form with banner data
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      ctaText: banner.ctaText,
      categoryId: banner.categoryId,
    });
  }, [banner]);

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
      await dispatch(updateBanner({ id: banner.id, data: fd })).unwrap();
      toast.success("Banner updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 border rounded-xl transition-all text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
    isDarkMode
      ? "bg-zinc-900/90 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500/60"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500"
  }`;

  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
    isDarkMode ? "text-zinc-400" : "text-gray-700"
  }`;

  return (
    <div className="space-y-5">
      {/* Current Image Preview */}
      <div>
        <label className={labelClass}>Current Image</label>
        <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80">
          <img
            src={`${getImageUrl(banner.imageUrl)}`}
            alt={banner.title}
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold px-3 py-1.5 bg-black/70 rounded-full border border-zinc-700/60">
              Current Banner Image
            </span>
          </div>
        </div>
      </div>

      {/* New Image Upload */}
      <div>
        <label className={labelClass}>Upload New Image (Optional)</label>
        <div
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50 hover:bg-zinc-900/70"
              : "border-gray-300 bg-gray-50/50 hover:border-amber-500/50 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="edit-image-upload"
          />
          <label
            htmlFor="edit-image-upload"
            className="cursor-pointer flex flex-col items-center gap-2.5"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                isDarkMode ? "bg-zinc-800/80 text-amber-400" : "bg-amber-50 text-amber-600"
              }`}
            >
              <Plus className="w-6 h-6" />
            </div>
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-zinc-300" : "text-gray-600"
              }`}
            >
              {file ? file.name : "Click to upload replacement image"}
            </span>
            <span className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
              Recommended size: 1920x600 px (PNG, JPG, WebP)
            </span>
          </label>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          placeholder="Enter banner title"
          className={inputClass}
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className={labelClass}>Subtitle</label>
        <textarea
          name="subtitle"
          value={form.subtitle || ""}
          onChange={handleChange}
          placeholder="Enter banner subtitle"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Link */}
      <div>
        <label className={labelClass}>Link URL</label>
        <input
          name="link"
          value={form.link || ""}
          onChange={handleChange}
          placeholder="https://example.com"
          className={inputClass}
        />
      </div>

      {/* CTA Text */}
      <div>
        <label className={labelClass}>CTA Button Text</label>
        <input
          name="ctaText"
          value={form.ctaText || ""}
          onChange={handleChange}
          placeholder="Learn More"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select
          name="categoryId"
          value={form.categoryId?.toString() || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>
            Select Category
          </option>
          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
              className={isDarkMode ? "bg-zinc-900 text-white" : ""}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={loading || !form.title}
        className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? "Updating..." : "Update Banner"}
      </button>
    </div>
  );
};

export default EditBannerForm;

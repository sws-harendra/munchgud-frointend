"use client";

import React, { useState, useEffect } from "react";
import { Mail, User, Camera, X, Phone, Shield, CheckCircle2 } from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/store";
import { updateUser } from "@/app/lib/store/features/userSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";
import { useAdminTheme } from "../context/AdminThemeContext";

interface EditUserProps {
  user: {
    id: string | number;
    fullname: string;
    email?: string | null;
    phoneNumber?: string | number | null;
    avatar?: string | null;
    role: string;
  };
  onSuccess: () => void;
}

const EditUser = ({ user, onSuccess }: EditUserProps) => {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "user",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      fullname: user.fullname || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber ? String(user.phoneNumber) : "",
      role: user.role || "user",
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fullname", form.fullname.trim());
      if (form.email.trim()) {
        fd.append("email", form.email.trim());
      }
      if (form.phoneNumber) {
        fd.append("phoneNumber", form.phoneNumber.replace(/\D/g, ""));
      }
      fd.append("role", form.role);
      if (profileImage) {
        fd.append("file", profileImage);
      }

      await dispatch(updateUser({ userId: String(user.id), data: fd })).unwrap();
      toast.success("User updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const labelClasses = `text-xs font-bold uppercase tracking-wider block mb-1.5 ${
    isDarkMode ? "text-zinc-300" : "text-slate-700"
  }`;

  const inputBaseClasses = `w-full rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900/90 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-emerald-600/20"
  }`;

  const prefixClasses = `flex items-center pl-3.5 pr-2.5 rounded-l-xl border border-r-0 text-sm font-semibold select-none ${
    isDarkMode
      ? "bg-zinc-800/80 border-zinc-800 text-zinc-300"
      : "bg-slate-100 border-slate-200 text-slate-700"
  }`;

  return (
    <form onSubmit={handleSave} noValidate className="space-y-5 pb-4">
      {/* Current / New Avatar */}
      <div>
        <label className={labelClasses}>Profile Avatar</label>
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-zinc-900/60 border-zinc-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500 shadow-md flex-shrink-0 bg-neutral-900 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="New preview"
                  className="w-full h-full object-cover"
                />
              ) : user.avatar ? (
                <img
                  src={`${getImageUrl(user.avatar)}`}
                  alt={user.fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-zinc-400" />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {imagePreview
                  ? profileImage?.name
                  : user.avatar
                  ? "Current Photo"
                  : "No Avatar Set"}
              </p>
              <label className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 cursor-pointer underline">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
              title="Remove new photo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid: Full Name & Mobile Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullname" className={labelClasses}>
            Full Name <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User
                className={`h-4 w-4 ${
                  isDarkMode ? "text-zinc-500" : "text-slate-400"
                }`}
              />
            </div>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className={`${inputBaseClasses} pl-10 pr-4 py-2.5`}
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="phoneNumber" className={labelClasses}>
            Mobile Number
          </label>
          <div className="relative flex rounded-xl shadow-xs">
            <div className={prefixClasses}>
              <Phone className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
              <span>+91</span>
            </div>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  phoneNumber: e.target.value.replace(/\D/g, ""),
                })
              }
              className={`${inputBaseClasses} rounded-l-none pl-3 pr-4 py-2.5`}
            />
          </div>
        </div>
      </div>

      {/* Grid: Email & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="email" className={labelClasses.replace("mb-1.5", "")}>
              Email Address
            </label>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                isDarkMode
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              Optional
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail
                className={`h-4 w-4 ${
                  isDarkMode ? "text-zinc-500" : "text-slate-400"
                }`}
              />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`${inputBaseClasses} pl-10 pr-4 py-2.5`}
            />
          </div>
        </div>

        {/* User Role */}
        <div>
          <label htmlFor="role" className={labelClasses}>
            Account Role <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Shield
                className={`h-4 w-4 ${
                  isDarkMode ? "text-zinc-500" : "text-slate-400"
                }`}
              />
            </div>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`${inputBaseClasses} pl-10 pr-8 py-2.5 cursor-pointer appearance-none`}
            >
              <option value="user" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>
                Customer / Standard User
              </option>
              <option value="driver" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>
                Associate / Logistics Driver
              </option>
              <option value="admin" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>
                Store Administrator
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={`pt-4 mt-6 border-t flex items-center justify-end gap-3 ${
          isDarkMode ? "border-zinc-800/80" : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={onSuccess}
          disabled={loading}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            isDarkMode
              ? "border-zinc-800 hover:bg-zinc-850 text-zinc-300"
              : "border-slate-200 hover:bg-slate-100 text-slate-700"
          }`}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-700/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditUser;

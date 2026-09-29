"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  Camera,
  X,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/lib/store/store";
import { registerUserbyAdmin } from "@/app/lib/store/features/authSlice";
import { useAdminTheme } from "../context/AdminThemeContext";

interface AddUsersProps {
  onSuccess?: () => void;
}

const AddUsers = ({ onSuccess }: AddUsersProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP)");
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

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let gen = "";
    for (let i = 0; i < 10; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
    setShowPassword(true);
    toast.info("Generated temporary secure password");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const trimmedName = fullname.trim();
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Full name is required");
      toast.error("Full name is required");
      return;
    }

    if (!cleanPhone || cleanPhone.length !== 10) {
      setError("A valid 10-digit mobile number is required");
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setError("Please enter a valid email address");
        toast.error("Please enter a valid email address");
        return;
      }
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", trimmedName);
      formData.append("phoneNumber", cleanPhone);
      if (trimmedEmail) {
        formData.append("email", trimmedEmail);
      }
      formData.append("password", password);
      formData.append("role", role);

      if (profileImage) {
        formData.append("file", profileImage);
      }

      const response = await dispatch(registerUserbyAdmin(formData)).unwrap();

      if (response?.success) {
        toast.success(response?.message || "User created successfully!");
        onSuccess?.();
        router.refresh();
      } else {
        const msg = response?.message || "Failed to create user";
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("Create user error:", err);
      const msg =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Failed to create user";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Theming classes
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
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-5 pb-4">
      {/* Error alert */}
      {error && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium border ${
            isDarkMode
              ? "bg-rose-950/40 border-rose-900/60 text-rose-300"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="hover:opacity-75 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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
              type="text"
              autoComplete="name"
              placeholder="e.g. Rahul Sharma"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className={`${inputBaseClasses} pl-10 pr-4 py-2.5`}
            />
          </div>
        </div>

        {/* Mobile Number (Compulsory) */}
        <div>
          <label htmlFor="phoneNumber" className={labelClasses}>
            Mobile Number <span className="text-amber-500">*</span>
          </label>
          <div className="relative flex rounded-xl shadow-xs">
            <div className={prefixClasses}>
              <Phone className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
              <span>+91</span>
            </div>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              placeholder="98765 43210"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, ""))
              }
              className={`${inputBaseClasses} rounded-l-none pl-3 pr-4 py-2.5`}
            />
          </div>
        </div>
      </div>

      {/* Grid: Email & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Address (Optional) */}
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
              type="email"
              autoComplete="email"
              placeholder="name@example.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={role}
              onChange={(e) => setRole(e.target.value)}
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

      {/* Password with Eye Toggle & Generator */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className={labelClasses.replace("mb-1.5", "")}>
            Password <span className="text-amber-500">*</span>
          </label>
          <button
            type="button"
            onClick={generateRandomPassword}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              isDarkMode
                ? "text-amber-400 hover:text-amber-300"
                : "text-emerald-700 hover:text-emerald-800"
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>Generate Secure</span>
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock
              className={`h-4 w-4 ${
                isDarkMode ? "text-zinc-500" : "text-slate-400"
              }`}
            />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputBaseClasses} pl-10 pr-11 py-2.5`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer ${
              isDarkMode
                ? "text-zinc-500 hover:text-zinc-200"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Avatar Upload (Replaced Product Upload) */}
      <div>
        <label className={labelClasses}>
          Profile Avatar <span className="text-zinc-500 font-normal">(Optional)</span>
        </label>

        {imagePreview ? (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isDarkMode
                ? "bg-zinc-900/60 border-zinc-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500 shadow-md flex-shrink-0">
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p
                  className={`text-xs font-bold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {profileImage?.name || "Avatar selected"}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {profileImage
                    ? `${(profileImage.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Ready to upload"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/60 hover:bg-zinc-900/70"
                : "border-slate-300 bg-slate-50/60 hover:border-emerald-500 hover:bg-emerald-50/20"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
                isDarkMode
                  ? "bg-zinc-800 text-amber-400 group-hover:bg-amber-500/20"
                  : "bg-white text-emerald-600 shadow-xs group-hover:bg-emerald-100"
              }`}
            >
              <Camera className="w-6 h-6" />
            </div>

            <span
              className={`text-xs font-bold tracking-tight mb-0.5 ${
                isDarkMode ? "text-zinc-200" : "text-slate-800"
              }`}
            >
              Upload Profile Photo
            </span>
            <p className="text-[11px] text-zinc-500">
              JPG, PNG, WebP up to 5MB (Optional)
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Action Footer */}
      <div
        className={`pt-4 mt-6 border-t flex items-center justify-end gap-3 ${
          isDarkMode ? "border-zinc-800/80" : "border-slate-200"
        }`}
      >
        {onSuccess && (
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
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-700/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating User...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Create User</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddUsers;

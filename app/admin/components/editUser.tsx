"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  User,
  Camera,
  X,
  Phone,
  Shield,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";
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

  // Dynamic Password Change State
  const [changePassword, setChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setForm({
      fullname: user.fullname || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber ? String(user.phoneNumber) : "",
      role: user.role || "user",
    });
    // Reset password state whenever user changes
    setChangePassword(false);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setProfileImage(null);
    setImagePreview(null);
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

  // Generate strong random password
  const generateRandomPassword = () => {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const special = "!@#$%^&*";
    const all = uppercase + lowercase + numbers + special;

    let gen = "";
    gen += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    gen += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    gen += numbers.charAt(Math.floor(Math.random() * numbers.length));
    gen += special.charAt(Math.floor(Math.random() * special.length));

    for (let i = 4; i < 10; i++) {
      gen += all.charAt(Math.floor(Math.random() * all.length));
    }

    // Shuffle characters
    const shuffled = gen
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setPassword(shuffled);
    setConfirmPassword(shuffled);
    setShowPassword(true);
    setShowConfirmPassword(true);
    toast.info("Generated secure temporary password");
  };

  // Dynamic Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "None", color: "bg-zinc-600" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    if (score <= 4) return { score: 2, label: "Medium", color: "bg-amber-500", text: "text-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    // If password change is requested, validate
    if (changePassword) {
      if (!password || password.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
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

      // Append new password if toggled on
      if (changePassword && password.trim()) {
        fd.append("password", password.trim());
      }

      await dispatch(updateUser({ userId: String(user.id), data: fd })).unwrap();
      toast.success(
        changePassword
          ? "User details and password updated successfully!"
          : "User updated successfully"
      );
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

      {/* DYNAMIC PASSWORD CHANGE SECTION */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 ${
          changePassword
            ? isDarkMode
              ? "bg-zinc-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
              : "bg-white border-amber-500/50 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/20"
            : isDarkMode
            ? "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
            : "bg-slate-50 border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                changePassword
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : isDarkMode
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-sm font-bold truncate ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Change Account Password
                </h4>
                {changePassword && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-xs truncate ${
                  isDarkMode ? "text-zinc-400" : "text-slate-500"
                }`}
              >
                {changePassword
                  ? "Provide a new password for this account"
                  : "Keep current password untouched"}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setChangePassword((prev) => !prev);
              if (changePassword) {
                setPassword("");
                setConfirmPassword("");
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
              changePassword
                ? "bg-amber-500"
                : isDarkMode
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-slate-300 hover:bg-slate-400"
            }`}
            role="switch"
            aria-checked={changePassword}
            title={changePassword ? "Cancel password change" : "Enable password change"}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                changePassword ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Dynamic Expandable Password Form */}
        {changePassword && (
          <div className="mt-4 pt-4 border-t border-dashed space-y-4 border-zinc-700/60 dark:border-zinc-800">
            {/* Auto-Generate Bar */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  isDarkMode ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Want a secure generated password?
              </span>
              <button
                type="button"
                onClick={generateRandomPassword}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs ${
                  isDarkMode
                    ? "bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate</span>
              </button>
            </div>

            {/* Inputs: New Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className={labelClasses}>
                  New Password <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock
                      className={`h-4 w-4 ${
                        isDarkMode ? "text-zinc-500" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className={`${inputBaseClasses} pl-10 pr-10 py-2.5 font-mono text-xs tracking-wider`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClasses}>
                  Confirm Password <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Shield
                      className={`h-4 w-4 ${
                        isDarkMode ? "text-zinc-500" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={`${inputBaseClasses} pl-10 pr-10 py-2.5 font-mono text-xs tracking-wider`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Status: Strength Meter & Match Validation */}
            {password && (
              <div
                className={`p-3 rounded-xl border space-y-2.5 ${
                  isDarkMode
                    ? "bg-zinc-950/80 border-zinc-800"
                    : "bg-slate-100/70 border-slate-200"
                }`}
              >
                {/* Strength Meter Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isDarkMode ? "text-zinc-400" : "text-slate-600"}>
                      Password Strength:{" "}
                      <span className={`font-bold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </span>
                    <span className={`text-[11px] ${password.length >= 6 ? "text-emerald-500" : "text-amber-500"}`}>
                      {password.length}/6+ chars
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 1 ? passwordStrength.color : "bg-zinc-700/40"
                      }`}
                    />
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 2 ? passwordStrength.color : "bg-zinc-700/40"
                      }`}
                    />
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 3 ? passwordStrength.color : "bg-zinc-700/40"
                      }`}
                    />
                  </div>
                </div>

                {/* Match Status Badge */}
                {confirmPassword && (
                  <div className="pt-2 border-t border-zinc-800/60 dark:border-zinc-800 flex items-center gap-2 text-xs">
                    {passwordsMatch ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Passwords match perfectly
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-500 font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Passwords do not match yet
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
          disabled={loading || (changePassword && passwordsMatch === false)}
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

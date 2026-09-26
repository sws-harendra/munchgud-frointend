"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Camera,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store/store";
import { registerUser } from "@/app/lib/store/features/authSlice";
import { toast } from "sonner";
import { brandName } from "@/app/contants";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
    terms: "",
  });

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file (JPG, PNG, WebP)",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setProfileImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      terms: "",
    });

    let hasErrors = false;
    const newErrors = {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      terms: "",
    };

    const trimmedName = fullname.trim();
    if (!trimmedName) {
      newErrors.fullname = "Full name is required";
      hasErrors = true;
    } else if (trimmedName.length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
      hasErrors = true;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
      hasErrors = true;
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (!acceptTerms) {
      newErrors.terms = "You must agree to the Terms and Privacy Policy";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", trimmedEmail);
      formData.append("password", password);
      formData.append("fullname", trimmedName);
      if (profileImage) {
        formData.append("file", profileImage);
      }

      const response = await dispatch(registerUser(formData)).unwrap();

      if (response && response.success) {
        toast.success(
          `Account created successfully! Welcome to ${brandName}.`
        );

        const createdRole = response?.user?.role;
        if (createdRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        toast.success(response?.message || "Account created successfully!");
        router.push("/authentication/login");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const message =
        typeof err === "string"
          ? err
          : err?.message ||
            err?.data?.message ||
            "Registration failed. Please try again.";

      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Decorative ambient warm golden glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-block mb-2 group transition-transform hover:scale-105"
          >
            <span className="text-3xl font-black tracking-widest text-neutral-950 group-hover:text-amber-600 transition-colors">
              FLAZO<span className="text-amber-500">.</span>
            </span>
            <p className="text-[10px] font-semibold text-amber-600 tracking-[0.25em] uppercase">
              Acoustic Gold
            </p>
          </Link>
          <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Sign up to access exclusive member offers and seamless checkout
          </p>
        </div>

        {/* Card Split Layout */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-950/5 border border-amber-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Profile Photo & Gold Brand Perks */}
            <div className="lg:col-span-4 bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_65%)] pointer-events-none" />

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  VIP Member Access
                </span>

                <div className="text-center sm:text-left mb-6">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    Personalize Profile
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    Upload an avatar for your account (optional)
                  </p>
                </div>

                {/* Avatar Uploader */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative group">
                    <div
                      className={`w-28 h-28 rounded-full overflow-hidden border-3 ${
                        imagePreview
                          ? "border-amber-400 shadow-xl shadow-amber-500/20"
                          : "border-amber-500/30 bg-neutral-900"
                      } flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-amber-400/60" />
                      )}
                    </div>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <label className="mt-4 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 border border-amber-400/40 text-amber-200 text-xs font-semibold rounded-xl transition-all shadow-xs">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>{imagePreview ? "Change Photo" : "Upload Photo"}</span>
                    </span>
                  </label>

                  {errors.image && (
                    <p className="text-rose-400 text-xs mt-2 text-center font-medium">
                      {errors.image}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-400 mt-2">
                    JPG, PNG, WebP up to 5MB (Optional)
                  </p>
                </div>
              </div>

              {/* Perks List */}
              <div className="space-y-3 pt-6 border-t border-amber-900/40">
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Real-time tracking on all flagship orders</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Save multiple shipping addresses</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Exclusive warranty registration & benefits</span>
                </div>
              </div>
            </div>

            {/* Right Column: Register Form */}
            <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10">
              {serverError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800 text-sm">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span className="font-medium">{serverError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setServerError("")}
                    className="text-rose-500 hover:text-rose-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="fullname"
                    className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User
                        className={`h-5 w-5 ${
                          errors.fullname ? "text-rose-400" : "text-neutral-400"
                        }`}
                      />
                    </div>
                    <input
                      id="fullname"
                      type="text"
                      autoComplete="name"
                      value={fullname}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullname)
                          setErrors((prev) => ({ ...prev, fullname: "" }));
                      }}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                        errors.fullname
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                          : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                      }`}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  {errors.fullname && (
                    <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.fullname}</span>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail
                        className={`h-5 w-5 ${
                          errors.email ? "text-rose-400" : "text-neutral-400"
                        }`}
                      />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                        errors.email
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                          : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                      }`}
                      placeholder="name@example.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password & Confirm Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock
                          className={`h-5 w-5 ${
                            errors.password ? "text-rose-400" : "text-neutral-400"
                          }`}
                        />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        className={`w-full pl-11 pr-11 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                          errors.password
                            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                            : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                        }`}
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium mt-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock
                          className={`h-5 w-5 ${
                            errors.confirmPassword
                              ? "text-rose-400"
                              : "text-neutral-400"
                          }`}
                        />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword)
                            setErrors((prev) => ({
                              ...prev,
                              confirmPassword: "",
                            }));
                        }}
                        className={`w-full pl-11 pr-11 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                          errors.confirmPassword
                            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                            : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                        }`}
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium mt-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.confirmPassword}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (errors.terms)
                          setErrors((prev) => ({ ...prev, terms: "" }));
                      }}
                      className="w-4 h-4 mt-0.5 text-amber-600 border-neutral-300 rounded focus:ring-amber-400 accent-amber-600 cursor-pointer"
                    />
                    <span className="text-xs text-neutral-600 leading-relaxed">
                      I agree to the{" "}
                      <Link
                        href="/terms&conditions"
                        className="text-amber-600 hover:text-amber-700 hover:underline font-semibold"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-amber-600 hover:text-amber-700 hover:underline font-semibold"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.terms}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 tracking-wide"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                        <span>Creating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Already have an account */}
              <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
                <p className="text-sm text-neutral-600">
                  Already have an account?{" "}
                  <Link
                    href="/authentication/login"
                    className="font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

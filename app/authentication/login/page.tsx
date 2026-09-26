"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { emailLogin } from "@/app/lib/store/features/authSlice";
import { toast } from "sonner";
import { brandName } from "@/app/contants";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const dispatch = useAppDispatch();
  const { status, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // If already authenticated and not loading, redirect accordingly
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl || "/");
      }
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
    } else {
      setPassword(value);
      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    let hasErrors = false;
    const newErrors = { email: "", password: "" };

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

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await dispatch(
        emailLogin({ email: trimmedEmail, password })
      ).unwrap();

      toast.success("Welcome back! Logged in successfully.");

      const loggedUser = response?.user;
      if (loggedUser?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl || "/");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const message =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Invalid email or password";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || status === "loading";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block mb-3 group transition-transform hover:scale-105"
          >
            <span className="text-3xl font-black tracking-widest text-neutral-950 group-hover:text-amber-600 transition-colors">
              FLAZO<span className="text-amber-500">.</span>
            </span>
            <p className="text-[10px] font-semibold text-amber-600 tracking-[0.25em] uppercase">
              Acoustic Gold
            </p>
          </Link>

          <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-600 mt-1.5">
            Sign in to access your orders, cart, and account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-950/5 p-6 sm:p-8 border border-amber-100 transition-all">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                      : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1 font-medium animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                >
                  Password
                </label>
                <Link
                  href="/authentication/forgot-password"
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full pl-11 pr-11 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                      : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1 font-medium animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-400 accent-amber-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-neutral-600">
                  Keep me signed in on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 tracking-wide"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/authentication/register"
                className="font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Feature badge footer */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Verified Quality</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Secure Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

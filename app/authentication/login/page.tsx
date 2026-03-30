"use client";
import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { emailLogin } from "@/app/lib/store/features/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>(""); // ✅ starts as empty string
  const [password, setPassword] = useState<string>(""); // ✅
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const { status, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const isLoading = status === "loading";



  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    let hasErrors = false;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
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

    const credentials = { email, password };

    try {
      const user = await dispatch(emailLogin(credentials)).unwrap();

      if (user?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

    } catch (err: any) {
      console.log("ERROR 👉", err);

      const message =
        typeof err === "string"
          ? err
          : err?.message || "Invalid credentials";

      toast.error(message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 to-green-700 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-black ${errors.email
                    ? "border-green-700"
                    : "border-green-500 hover:border-green-700"
                    }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-green-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-black ${errors.password
                    ? "border-green-700"
                    : "border-green-500 hover:border-green-700"
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-green-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/authentication/forgot-password"
                className="text-sm text-green-700 hover:text-green-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don&#39;t have an account?{" "}
            <Link
              href="/authentication/register"
              className="font-medium text-green-700 hover:text-green-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

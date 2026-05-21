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
} from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "@/app/lib/store/store";
import { registerUser } from "@/app/lib/store/features/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    fullname: "",
    image: "",
    confirmPassword: "",
    terms: "",   // ✅ ADD THIS
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file) {
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
          image: "Please select a valid image file",
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));
      if (file) setProfileImage(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async () => {
    setErrors({
      email: "",
      password: "",
      fullname: "",
      image: "",
      confirmPassword: "",
      terms: "",   // ✅ ADD HERE ALSO
    });
    setIsLoading(true);
    try {
      let hasErrors = false;
      const newErrors = {
        email: "",
        password: "",
        fullname: "",
        image: "",
        confirmPassword: "",
        terms: "",   // ✅ ADD THIS
      };

      if (!fullname.trim()) {
        newErrors.fullname = "Full name is required!";
        hasErrors = true;
      } else if (fullname.trim().length < 2) {
        newErrors.fullname = "Full name must be at least 2 characters!";
        hasErrors = true;
      } else if (/\d/.test(fullname)) {   // ✅ NO NUMBERS ALLOWED
        newErrors.fullname = "Full name cannot contain numbers!";
        hasErrors = true;
      }

      if (!email) {
        newErrors.email = "Email is required!";
        hasErrors = true;
      } else if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email!";
        hasErrors = true;
      }

      if (!password) {
        newErrors.password = "Password is required!";
        hasErrors = true;
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters!";
        hasErrors = true;
      }

      // ✅ CONFIRM PASSWORD VALIDATION
      if (!confirmPassword) {
        newErrors.confirmPassword = "Password do not match!";
        hasErrors = true;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match!";
        hasErrors = true;
      }
      // ✅ TERMS VALIDATION
      if (!acceptTerms) {
        newErrors.terms = "You must accept Terms & Conditions!";
        hasErrors = true;
      }

      if (hasErrors) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fullname", fullname);
      if (profileImage) formData.append("file", profileImage);

      const response = await dispatch(registerUser(formData)).unwrap();
      console.log("hererer", response);
      if (response.success) {
        // ✅ redirect here
        toast.success("Account created successfully! Welcome to Munchgud Makhana.");
        router.push("/");
      }
      setIsLoading(false);
    } catch (err: any) {
      console.log("FULL ERROR:", err);

      // ✅ RTK unwrap error comes directly like this
      const message =
        err?.message ||
        err?.data?.message ||
        err ||
        "Something went wrong";

      if (message.toLowerCase().includes("exists")) {
        setServerError("User already exists!");
        toast.error("User already exists!");
      } else {
        setServerError(message);
        toast.error(message);
      }

      setErrors({
        email: "",
        password: "",
        fullname: "",
        image: "",
        confirmPassword: "",
        terms: "",
      });
    } finally {
      setIsLoading(false); // ✅ only stop loader after request is done
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-700 text-lg">
            Sign up to get started with your account
          </p>
        </div>

        {/* Main Form Container */}
        <div className="rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Profile Image */}
            <div className="lg:w-1/3 bg-gradient-to-br from-green-700 via-green-700 to-green-800/90 p-8 flex flex-col items-center justify-center space-y-6 border-b lg:border-b-0 lg:border-r border-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Profile Photo
                </h3>
                <p className="text-white text-sm">
                  Choose a profile picture to personalize your account
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl ${profileImage
                      ? ""
                      : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                  >
                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {profileImage && (
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 w-8 h-8 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors flex items-center justify-center shadow-lg"
                    >
                      ×
                    </button>
                  )}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-xl  hover:border-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Camera className="w-5 h-5" />
                    <span className="font-medium">
                      {profileImage ? "Change Photo" : "Upload Photo"}
                    </span>
                  </div>
                </label>

                {errors.image && (
                  <p className="text-white bg-red-400 py-1 px-4 rounded-3xl text-sm text-center">
                    {errors.image}
                  </p>
                )}

                <p className="text-xs text-white font-bold text-center">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>
            {/* Right Side - Form Fields */}
            <div className="lg:w-2/3 p-8">
              <div className="max-w-md mx-auto space-y-6">

                {/* Full Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullname"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <User className="h-5 w-5 text-gray-700" />
                    </div>
                    <input
                      id="fullname"
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border-2  rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-black ${errors.fullname
                        ? "border-red-400"
                        : "border-green-500 hover:border-green-700"
                        }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullname}
                    </p>
                  )}
                </div>

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
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-black ${errors.email
                        ? "border-red-400"
                        : "border-green-500 hover:border-green-700"
                        }`}
                      placeholder="Enter your email"
                    />
                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
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
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/10 backdrop-blur-sm transition-all text-black duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent  ${errors.password
                        ? "border-red-400"
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
                        <EyeOff className="h-5 w-5 text-gray-700 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-700 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                {/**confirm password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    {/* 🔒 LOCK ICON (FIXED CENTER) */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Lock className="h-5 w-5 text-gray-700" />
                    </div>

                    {/* INPUT */}
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 h-[48px] border-2 rounded-xl bg-white/10 backdrop-blur-sm transition-all text-black duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.confirmPassword
                        ? "border-red-400"
                        : "border-green-500 hover:border-green-700"
                        }`}
                      placeholder="Confirm your password"
                    />

                    {/* 👁 EYE ICON */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                  </div>

                  {/* ❗ ERROR (NO SHIFT NOW) */}
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className={`h-4 w-4 rounded cursor-pointer ${errors.terms
                      ? "ring-2 ring-red-500 border-red-500"
                      : "border-gray-300"
                      }`}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 leading-5"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms&conditions"
                      className="text-green-700 hover:text-green-700 font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      className="text-green-700 hover:text-green-700 font-medium"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-700 to-green-700 text-white py-4 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-700 pt-4">
                  Already have an account?{" "}
                  <Link
                    href="/authentication/login"
                    className="font-medium text-green-700 hover:text-green-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*eroor popup */}
      {serverError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-600 text-white shadow-lg">

            {/* ICON */}
            <span className="text-lg">⚠️</span>

            {/* TEXT */}
            <p className="text-sm font-medium">{serverError}</p>

            {/* CLOSE */}
            <button
              onClick={() => setServerError("")}
              className="ml-2 text-white hover:text-gray-200 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

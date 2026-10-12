"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { emailLogin, verifyPhoneOtp } from "@/app/lib/store/features/authSlice";
import { authService } from "@/app/sercices/user/auth.service";
import { toast } from "sonner";
import Loader from "@/app/commonComponents/loader";
import FlazoLogo from "@/app/commonComponents/FlazoLogo";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const dispatch = useAppDispatch();
  const { status, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  // Mode: "phone_otp" (default) or "password" (admin/legacy fallback)
  const [loginMode, setLoginMode] = useState<"phone_otp" | "password">("phone_otp");

  // Phone OTP Flow states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpStep, setOtpStep] = useState<"enter_phone" | "enter_otp">("enter_phone");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Password Flow states (admin)
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Errors
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({ identifier: "", password: "" });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated and not loading, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl || "/");
      }
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpStep === "enter_otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setCanResend(false);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStep, timer]);

  // Focus first OTP input on step change
  useEffect(() => {
    if (otpStep === "enter_otp") {
      inputRefs.current[0]?.focus();
    }
  }, [otpStep]);

  // ==========================================
  // 1. Phone OTP Flow Handlers
  // ==========================================

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    const clean = phoneNumber.trim().replace(/\D/g, "");
    if (!clean) {
      setPhoneError("Mobile number is required");
      return;
    }
    if (clean.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await authService.sendOtpToPhone({
        phoneNumber: clean,
        purpose: "login",
      });

      if (response && response.success) {
        toast.success(response.message || `OTP sent to +91 ${clean}`);
        setOtpStep("enter_otp");
        setTimer(30);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpError("");
      } else {
        const msg = response?.message || "Failed to send OTP";
        setPhoneError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Failed to send verification code";
      setPhoneError(message);
      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleDigitChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      setOtpError("");
      return;
    }

    // Handle paste of multiple digits
    if (cleaned.length > 1) {
      const updated = [...otpDigits];
      const chars = cleaned.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        if (chars[i]) updated[i] = chars[i];
      }
      setOtpDigits(updated);
      setOtpError("");
      const nextIdx = Math.min(chars.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned[0];
    setOtpDigits(updated);
    setOtpError("");

    // Move to next input box
    if (index < 5 && cleaned[0]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasteData) return;

    const updated = [...otpDigits];
    const chars = pasteData.split("");
    for (let i = 0; i < 6; i++) {
      updated[i] = chars[i] || "";
    }
    setOtpDigits(updated);
    setOtpError("");
    const targetIdx = Math.min(chars.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setOtpError("Please enter all 6 digits of the OTP.");
      return;
    }

    const clean = phoneNumber.trim().replace(/\D/g, "");
    setIsVerifyingOtp(true);

    try {
      const response = await dispatch(
        verifyPhoneOtp({
          phoneNumber: clean,
          otp: fullOtp,
        })
      ).unwrap();

      toast.success(response?.message || "Logged in successfully!");

      const loggedUser = response?.user;
      if (loggedUser?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl || "/");
      }
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Invalid OTP code";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    const clean = phoneNumber.trim().replace(/\D/g, "");
    setIsResending(true);
    setOtpError("");

    try {
      const response = await authService.sendOtpToPhone({
        phoneNumber: clean,
        purpose: "login",
      });
      toast.success(response?.message || "New OTP sent to your mobile number");
      setTimer(30);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  // ==========================================
  // 2. Password Flow Handlers (Admin/Fallback)
  // ==========================================

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({ identifier: "", password: "" });

    let hasErrors = false;
    const newErrors = { identifier: "", password: "" };

    const trimmedInput = emailOrPhone.trim();
    if (!trimmedInput) {
      newErrors.identifier = "Email or mobile number is required";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setPasswordErrors(newErrors);
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const response = await dispatch(
        emailLogin({ email: trimmedInput, password })
      ).unwrap();

      toast.success("Logged in successfully!");
      const loggedUser = response?.user;
      if (loggedUser?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl || "/");
      }
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Invalid credentials";
      toast.error(message);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const isGlobalLoading =
    isSendingOtp || isVerifyingOtp || isSubmittingPassword || status === "loading";

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
            aria-label="Flazo Home"
          >
            <FlazoLogo size="lg" align="center" />
          </Link>

          <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-600 mt-1.5">
            {loginMode === "phone_otp"
              ? otpStep === "enter_phone"
                ? "Sign in quickly with your 10-digit mobile number"
                : "Enter the OTP sent to your phone"
              : "Sign in with password"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-950/5 p-6 sm:p-8 border border-amber-100 transition-all">
          {loginMode === "phone_otp" ? (
            // ==========================================
            // A. MOBILE NUMBER + OTP LOGIN FLOW
            // ==========================================
            otpStep === "enter_phone" ? (
              // Step 1: Enter Phone Number
              <form onSubmit={handleSendOtp} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="loginPhone"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                    >
                      Mobile Number
                    </label>
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      OTP Login
                    </span>
                  </div>

                  <div className="relative flex rounded-xl shadow-xs">
                    <div className="flex items-center pl-3.5 pr-2.5 rounded-l-xl bg-neutral-100/80 border border-r-0 border-neutral-200 text-neutral-700 text-sm font-semibold select-none">
                      <Phone className="h-4 w-4 text-amber-500 mr-1.5" />
                      <span>+91</span>
                    </div>
                    <input
                      id="loginPhone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhoneNumber(val);
                        if (phoneError) setPhoneError("");
                      }}
                      className={`w-full pl-3 pr-4 py-3.5 rounded-r-xl bg-neutral-50/50 border text-base text-neutral-900 placeholder:text-neutral-400 font-medium transition-all duration-200 focus:outline-none focus:ring-3 ${
                        phoneError
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                          : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                      }`}
                      placeholder="98765 43210"
                      autoFocus
                    />
                  </div>

                  {phoneError && (
                    <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200/50 rounded-xl text-amber-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    No password required! We will send a secure 6-digit OTP to your mobile.
                  </span>
                </div>

                {/* Send OTP Button */}
                <button
                  type="submit"
                  disabled={isGlobalLoading || phoneNumber.length !== 10}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 tracking-wide"
                >
                  {isSendingOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Get OTP to Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Step 2: Enter OTP
              <form onSubmit={handleVerifyOtp} noValidate className="space-y-6">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100/80 px-3 py-1 rounded-full font-medium">
                    <span>Sent to +91 {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep("enter_phone");
                        setOtpError("");
                      }}
                      className="text-amber-700 hover:underline font-bold ml-1"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* 6 Digits Boxes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block text-center">
                    Enter 6-Digit OTP
                  </label>
                  <div
                    className="flex justify-center items-center gap-2 sm:gap-3"
                    onPaste={handlePaste}
                  >
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(e.target.value, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-neutral-50/60 text-neutral-900 transition-all duration-150 focus:outline-none focus:ring-3 ${
                          otpError
                            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                            : digit
                            ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20 text-amber-950"
                            : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                        }`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="flex items-center justify-center gap-1.5 text-rose-600 text-xs mt-2 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}
                </div>

                {/* Resend OTP */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep("enter_phone");
                      setOtpError("");
                    }}
                    className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-800 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="inline-flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-800 hover:underline transition-colors disabled:opacity-50"
                      >
                        <RotateCcw
                          className={`w-3.5 h-3.5 ${
                            isResending ? "animate-spin" : ""
                          }`}
                        />
                        <span>{isResending ? "Resending..." : "Resend OTP"}</span>
                      </button>
                    ) : (
                      <span className="text-neutral-400 font-medium">
                        Resend code in{" "}
                        <strong className="text-neutral-700">{timer}s</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Verify Button */}
                <button
                  type="submit"
                  disabled={isGlobalLoading || otpDigits.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 tracking-wide"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            // ==========================================
            // B. ADMIN / PASSWORD LOGIN (FALLBACK)
            // ==========================================
            <form onSubmit={handlePasswordSubmit} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="adminIdentifier"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-700 block"
                >
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 ${
                        passwordErrors.identifier
                          ? "text-rose-400"
                          : "text-neutral-400"
                      }`}
                    />
                  </div>
                  <input
                    id="adminIdentifier"
                    type="text"
                    autoComplete="username"
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      if (passwordErrors.identifier)
                        setPasswordErrors((prev) => ({
                          ...prev,
                          identifier: "",
                        }));
                    }}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                      passwordErrors.identifier
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                        : "border-neutral-200 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                    }`}
                    placeholder="admin@munchgud.com"
                  />
                </div>
                {passwordErrors.identifier && (
                  <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1 font-medium animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{passwordErrors.identifier}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="adminPassword"
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
                        passwordErrors.password
                          ? "text-rose-400"
                          : "text-neutral-400"
                      }`}
                    />
                  </div>
                  <input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordErrors.password)
                        setPasswordErrors((prev) => ({
                          ...prev,
                          password: "",
                        }));
                    }}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-neutral-50/50 border text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-3 ${
                      passwordErrors.password
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
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.password && (
                  <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1 font-medium animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{passwordErrors.password}</span>
                  </div>
                )}
              </div>

              {/* Password Login Submit */}
              <button
                type="submit"
                disabled={isGlobalLoading}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 tracking-wide"
              >
                {isSubmittingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between OTP and Password login */}
          <div className="mt-5 text-center">
            {loginMode === "phone_otp" ? (
              <button
                type="button"
                onClick={() => setLoginMode("password")}
                className="text-xs font-semibold text-neutral-500 hover:text-amber-700 transition-colors"
              >
                Admin? Sign in with password
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginMode("phone_otp")}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors inline-flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Sign in with Mobile Number & OTP</span>
              </button>
            )}
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
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
            <span>Instant OTP Access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>100% Secure</span>
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
          <Loader size={120} text="Loading sign in..." />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

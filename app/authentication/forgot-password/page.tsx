"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/app/sercices/user/auth.service";
import FlazoLogo from "@/app/commonComponents/FlazoLogo";

type Step = "phone" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentStep === "otp" && timer > 0) {
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
  }, [currentStep, timer]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (currentStep === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [currentStep]);

  // Clean phone input (digits only, max 10)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length <= 10) {
      setPhoneNumber(raw);
      setErrorMsg("");
    }
  };

  // STEP 1: Submit Phone Number to receive OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const clean = phoneNumber.trim();
    if (!clean || clean.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.sendForgotOtp(clean);

      if (res && res.success) {
        toast.success(res.message || `Verification OTP sent to +91 ${clean}`);
        setCurrentStep("otp");
        setTimer(30);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
      } else {
        const msg = res?.message || "Failed to send verification code";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("Forgot OTP Error:", err);
      const msg = err?.message || err?.response?.data?.message || "Unable to send OTP. Please check your number.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Change Handler
  const handleOtpDigitChange = (val: string, index: number) => {
    const digitsOnly = val.replace(/\D/g, "");
    const updated = [...otpDigits];

    // Handle paste of full 6-digit code
    if (digitsOnly.length > 1) {
      const parts = digitsOnly.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        if (parts[i]) updated[i] = parts[i];
      }
      setOtpDigits(updated);
      setErrorMsg("");
      const nextIdx = Math.min(parts.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    updated[index] = digitsOnly ? digitsOnly[0] : "";
    setOtpDigits(updated);
    setErrorMsg("");

    if (digitsOnly && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the OTP code");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifyResetOtp(phoneNumber, enteredOtp);

      if (res && res.success) {
        toast.success(res.message || "OTP verified! Please set your new password.");
        if (res.resetToken) {
          setResetToken(res.resetToken);
        }
        setCurrentStep("password");
      } else {
        const msg = res?.message || "Invalid OTP code";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("Verify OTP Error:", err);
      const msg = err?.message || err?.response?.data?.message || "Invalid OTP code. Please check and try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend || resending) return;
    setErrorMsg("");

    try {
      setResending(true);
      const res = await authService.resendOtp(phoneNumber);
      toast.success(res?.message || `New OTP code sent to +91 ${phoneNumber}`);
      setTimer(30);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error("Resend OTP Error:", err);
      const msg = err?.message || err?.response?.data?.message || "Failed to resend OTP";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  // STEP 3: Save New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPasswordWithPhone({
        phoneNumber,
        resetToken,
        password: newPassword,
        confirmPassword,
      });

      if (res && res.success) {
        toast.success(res.message || "Password updated successfully!");
        setCurrentStep("success");
        setTimeout(() => {
          router.push("/authentication/login");
        }, 2000);
      } else {
        const msg = res?.message || "Failed to update password";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      const msg = err?.message || err?.response?.data?.message || "Failed to update password. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="bg-white border border-amber-100 shadow-2xl shadow-amber-950/5 rounded-3xl p-6 sm:p-8 w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group" aria-label="Flazo Home">
            <FlazoLogo size="lg" align="center" />
          </Link>

          {/* Stepper Title */}
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-3">
            {currentStep === "phone" && "Forgot Password"}
            {currentStep === "otp" && "Verify OTP"}
            {currentStep === "password" && "Set New Password"}
            {currentStep === "success" && "Password Updated!"}
          </h1>

          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
            {currentStep === "phone" &&
              "Enter your registered mobile number to receive a 6-digit verification code."}
            {currentStep === "otp" && (
              <>
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-neutral-800">
                  +91 {phoneNumber}
                </span>
              </>
            )}
            {currentStep === "password" &&
              "Create a strong new password for your Flazo account."}
            {currentStep === "success" &&
              "Your password has been changed. Redirecting you to login..."}
          </p>
        </div>

        {/* Multi-Step Visual Progress Bar */}
        {currentStep !== "success" && (
          <div className="flex items-center justify-between mb-8 px-4">
            {/* Step 1 Pill */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep === "phone"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {currentStep === "otp" || currentStep === "password" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "1"
                )}
              </div>
              <span className="text-[10px] font-semibold mt-1 text-neutral-500">
                Number
              </span>
            </div>

            {/* Connecting Line 1-2 */}
            <div
              className={`flex-1 h-0.5 mx-2 rounded transition-all duration-300 ${
                currentStep === "otp" || currentStep === "password"
                  ? "bg-amber-500"
                  : "bg-neutral-200"
              }`}
            />

            {/* Step 2 Pill */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep === "otp"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105"
                    : currentStep === "password"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {currentStep === "password" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "2"
                )}
              </div>
              <span className="text-[10px] font-semibold mt-1 text-neutral-500">
                OTP
              </span>
            </div>

            {/* Connecting Line 2-3 */}
            <div
              className={`flex-1 h-0.5 mx-2 rounded transition-all duration-300 ${
                currentStep === "password" ? "bg-amber-500" : "bg-neutral-200"
              }`}
            />

            {/* Step 3 Pill */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep === "password"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                3
              </div>
              <span className="text-[10px] font-semibold mt-1 text-neutral-500">
                Password
              </span>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: PHONE NUMBER FORM ================= */}
        {currentStep === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Mobile Number
              </label>
              <div className="relative flex items-center rounded-xl border border-neutral-200 bg-neutral-50/50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-200/50 focus-within:border-amber-500 transition-all">
                <div className="flex items-center gap-1.5 pl-3.5 pr-2.5 py-3 border-r border-neutral-200 bg-neutral-100/60 text-xs font-bold text-neutral-700">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  className="w-full px-3.5 py-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium tracking-wide"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length !== 10}
              className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */}
        {currentStep === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* Number Display with Edit Option */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-neutral-700 font-medium">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>+91 {phoneNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep("phone");
                  setErrorMsg("");
                }}
                className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
              >
                Change
              </button>
            </div>

            {/* 6 Individual Digit Inputs */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2 text-center">
                Enter 6-Digit Code
              </label>
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-11 sm:w-12 h-13 text-center text-lg font-bold rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                  />
                ))}
              </div>
            </div>

            {/* Timer and Resend Link */}
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <span>Didn&apos;t receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  <span>Resend OTP</span>
                </button>
              ) : (
                <span className="font-semibold text-neutral-400">
                  Resend in <span className="text-amber-600 font-bold">{timer}s</span>
                </span>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otpDigits.join("").length !== 6}
              className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 3: NEW PASSWORD & CONFIRM ================= */}
        {currentStep === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                New Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-500 transition-all font-medium"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Confirm New Password
              </label>
              <div className="relative group">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-500 transition-all font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Password Match Indicator */}
            {newPassword && confirmPassword && (
              <div
                className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                  newPassword === confirmPassword
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-amber-700 bg-amber-50"
                }`}
              >
                {newPassword === confirmPassword ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Passwords do not match yet</span>
                  </>
                )}
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={
                loading ||
                newPassword.length < 6 ||
                newPassword !== confirmPassword
              }
              className="w-full mt-2 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save New Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 4: SUCCESS CONFIRMATION ================= */}
        {currentStep === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-neutral-900">
                Password Successfully Reset!
              </h2>
              <p className="text-xs text-neutral-500">
                You can now log in with your updated credentials.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/authentication/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Back to Login Footer */}
        {currentStep !== "success" && (
          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <Link
              href="/authentication/login"
              className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 hover:underline font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
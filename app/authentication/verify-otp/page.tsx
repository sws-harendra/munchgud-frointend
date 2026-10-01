"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store/store";
import { verifyPhoneOtp } from "@/app/lib/store/features/authSlice";
import { authService } from "@/app/sercices/user/auth.service";
import { toast } from "sonner";
import { brandName } from "@/app/contants";
import Loader from "@/app/commonComponents/loader";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const phoneParam = searchParams.get("phone") || "";
  const devOtpParam = searchParams.get("devOtp") || "";
  const redirectParam = searchParams.get("redirect") || "/";

  const [phoneNumber, setPhoneNumber] = useState(phoneParam);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [currentDevOtp, setCurrentDevOtp] = useState(devOtpParam);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load phone number and devOtp from sessionStorage if missing from query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone = sessionStorage.getItem("flazo_verify_phone");
      const storedDevOtp = sessionStorage.getItem("flazo_dev_otp");

      if (!phoneNumber && storedPhone) {
        setPhoneNumber(storedPhone);
      }
      if (!currentDevOtp && storedDevOtp) {
        setCurrentDevOtp(storedDevOtp);
      }
    }
  }, [phoneNumber, currentDevOtp]);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      setErrorMessage("");
      return;
    }

    // Handle paste of multiple digits
    if (cleaned.length > 1) {
      const updated = [...otpDigits];
      const chars = cleaned.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        if (chars[i]) {
          updated[i] = chars[i];
        }
      }
      setOtpDigits(updated);
      setErrorMessage("");
      const nextIdx = Math.min(chars.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned[0];
    setOtpDigits(updated);
    setErrorMessage("");

    // Move to next input box if available
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
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const updated = [...otpDigits];
    const chars = pasteData.split("");
    for (let i = 0; i < 6; i++) {
      updated[i] = chars[i] || "";
    }
    setOtpDigits(updated);
    setErrorMessage("");

    const targetIdx = Math.min(chars.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  const handleAutoFillDevOtp = () => {
    const code = currentDevOtp || "123456";
    const chars = code.slice(0, 6).split("");
    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = chars[i] || "";
    }
    setOtpDigits(updated);
    setErrorMessage("");
    inputRefs.current[5]?.focus();
    toast.info(`Filled code: ${code}`);
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    if (!phoneNumber) {
      setErrorMessage("Mobile number is missing. Please go back and try again.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await dispatch(
        verifyPhoneOtp({
          phoneNumber,
          otp: fullOtp,
        })
      ).unwrap();

      toast.success(
        response?.message || `Welcome to ${brandName}! Your account has been verified.`
      );

      // Clean session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("flazo_verify_phone");
        sessionStorage.removeItem("flazo_verify_name");
        sessionStorage.removeItem("flazo_dev_otp");
      }

      const role = response?.user?.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectParam);
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const msg =
        typeof err === "string"
          ? err
          : err?.message ||
            err?.data?.message ||
            "Verification failed. Please check the code and try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    if (!phoneNumber) {
      toast.error("Mobile number is missing.");
      return;
    }

    setIsResending(true);
    setErrorMessage("");

    try {
      const response = await authService.resendOtp(phoneNumber);

      if (response && response.success) {
        toast.success(response.message || "New verification code sent!");
        setTimer(30);
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        if (response.devOtp) {
          setCurrentDevOtp(response.devOtp);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("flazo_dev_otp", response.devOtp);
          }
        }
      } else {
        toast.error(response?.message || "Failed to resend code.");
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      const msg =
        typeof err === "string"
          ? err
          : err?.message || "Failed to resend OTP. Please try again later.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Masked phone display for privacy (e.g. +91 98765 •••••)
  const displayPhone = phoneNumber
    ? `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
    : "your mobile number";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
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
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-950/5 border border-amber-100 p-6 sm:p-8 overflow-hidden">
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
              Verify Mobile Number
            </h1>
            <p className="text-xs text-neutral-600 mt-1.5 max-w-xs leading-relaxed">
              We have sent a 6-digit verification code to
            </p>
            <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-neutral-900 tracking-wide">
                {displayPhone}
              </span>
            </div>
          </div>

          {/* Test Mode Helper Banner (when in dev mode or devOtp available) */}
          {(currentDevOtp || process.env.NODE_ENV !== "production") && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-amber-900">
                    Testing Mode OTP:{" "}
                    <span className="font-mono text-xs font-extrabold text-amber-700 bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                      {currentDevOtp || "123456"}
                    </span>
                  </p>
                  <p className="text-[10px] text-amber-700/80">
                    Live SMS key can be added in .env anytime
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFillDevOtp}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-xs transition-all flex-shrink-0"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-2 text-rose-800 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="text-rose-500 hover:text-rose-700 font-bold ml-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block text-center">
                Enter 6-Digit Code
              </label>

              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    onFocus={(e) => {
                      setActiveInputIndex(index);
                      e.target.select();
                    }}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border transition-all duration-200 focus:outline-none focus:ring-3 ${
                      errorMessage
                        ? "border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-rose-200"
                        : digit
                        ? "border-amber-500 bg-amber-50/30 text-neutral-900 focus:border-amber-600 focus:ring-amber-200/50 shadow-xs"
                        : "border-neutral-200 bg-neutral-50/50 text-neutral-900 hover:border-neutral-300 focus:border-amber-500 focus:ring-amber-200/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || otpDigits.join("").length !== 6}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 tracking-wide"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Access Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP & Change Number Controls */}
          <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span>Didn&apos;t receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <div className="w-3 h-3 border border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>Resending...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Resend OTP</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="font-semibold text-neutral-400">
                  Resend in 00:{timer < 10 ? `0${timer}` : timer}s
                </span>
              )}
            </div>

            <Link
              href="/authentication/register"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Wrong number? Edit Details</span>
            </Link>
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Encrypted Verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Instant Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Loader size={120} text="Loading verification..." />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}

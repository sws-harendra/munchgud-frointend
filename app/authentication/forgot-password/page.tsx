"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { serverurl, brandName } from "@/app/contants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${serverurl}/forget-password/forgot`, {
        email,
      });

      if (res.data?.success === false) {
        return toast.error(res.data.message || "User not found");
      }

      toast.success(res.data.message || "Reset link sent to your email");
      setEmail("");
    } catch (err: any) {
      console.log("Forgot password error:", err);

      let message = "Something went wrong";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.response?.status === 404) {
        message = "User not found";
      } else if (err?.response?.status === 400) {
        message = "Invalid request";
      } else if (err?.message === "Network Error") {
        message = "Server not reachable";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="bg-white border border-amber-100 shadow-2xl shadow-amber-950/5 rounded-3xl p-8 w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group">
            <span className="text-2xl font-black tracking-widest text-neutral-950 group-hover:text-amber-600 transition-colors">
              FLAZO<span className="text-amber-500">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">
            Reset Password
          </h2>
          <p className="text-neutral-500 text-xs mt-1">
            We will send a reset link valid for{" "}
            <span className="font-semibold text-amber-600">5 minutes</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/authentication/login"
            className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 hover:underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
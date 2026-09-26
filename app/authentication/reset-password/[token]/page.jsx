"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { serverurl } from "@/app/contants";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${serverurl}/reset-password/reset/${token}`,
        {
          password,
          confirmPassword,
        }
      );

      toast.success(res.data?.message || "Password updated successfully");

      setTimeout(() => {
        router.push("/authentication/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Invalid or expired link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="bg-white border border-amber-100 shadow-2xl shadow-amber-950/5 rounded-3xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group">
            <span className="text-2xl font-black tracking-widest text-neutral-950 group-hover:text-amber-600 transition-colors">
              FLAZO<span className="text-amber-500">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">
            Create New Password
          </h2>
          <p className="text-neutral-500 text-xs mt-1">
            Choose a strong password with at least 6 characters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type={show ? "text" : "password"}
                placeholder="New password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-3.5 cursor-pointer text-neutral-400 hover:text-neutral-700"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type={show ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-500 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Back */}
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
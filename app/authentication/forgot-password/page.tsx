"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { serverurl } from "@/app/contants";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return toast.error("Email is required");
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${serverurl}/forget-password/forgot`,
                { email }
            );

            // ❗ IMPORTANT CHECK
            if (res.data?.success === false) {
                return toast.error(res.data.message || "User not found");
            }

            toast.success(res.data.message || "Reset link sent to your email");
            setEmail("");

        } catch (err) {
            console.log("FULL ERROR 👉", err);

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
            setLoading(false); // ❗ ALWAYS STOP LOADING
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white px-4">

            {/* Card */}
            <div className="backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-green-200">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Forgot Password
                </h2>

                <p className="text-center text-gray-500 mb-6 text-sm">
                    We will send a reset link valid for <span className="font-semibold text-green-600">5 minutes</span>
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Input */}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-green-600 transition" />

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pl-10 p-3 rounded-xl border border-gray-200 bg-white/90 
            focus:outline-none focus:ring-2 focus:ring-green-400 
            focus:border-green-400 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-white font-medium transition-all duration-300 
            ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] hover:shadow-lg"
                            }`}
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
                    <a
                        href="/authentication/login"
                        className="text-sm text-green-600 hover:underline font-medium"
                    >
                        ← Back to Login
                    </a>
                </div>

            </div>
        </div>
    );
}
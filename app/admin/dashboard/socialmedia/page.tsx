"use client";

import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { socialLinksService } from "@/app/sercices/user/social-media.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import {
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Globe,
} from "lucide-react";

const SocialMediaSettingsPage = () => {
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const [links, setLinks] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  // Fetch links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setFetching(true);
        const data = await socialLinksService.getLinks();
        if (data) {
          setLinks({
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            twitter: data.twitter || "",
          });
        }
      } catch (err) {
        console.error("Fetch error", err);
        toast.error("Failed to load current social media links");
      } finally {
        setFetching(false);
      }
    };

    fetchLinks();
  }, []);

  // Save links
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await socialLinksService.saveLinks(links);
      toast.success("Social links saved successfully!");
    } catch (err) {
      console.error("Save error", err);
      toast.error("Error saving social media links");
    } finally {
      setLoading(false);
    }
  };

  const configuredCount = [links.instagram, links.facebook, links.twitter].filter(
    (l) => Boolean(l && l.trim())
  ).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-6xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Social Media Settings
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isDarkMode
                  ? "bg-zinc-900 text-amber-400 border-zinc-800"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {configuredCount}/3 Configured
            </span>
          </div>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            }`}
          >
            Manage live social media channels, official storefront links, and footer brand presence.
          </p>
        </div>
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className={`rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 transition-all ${
              isDarkMode
                ? "bg-zinc-900/60 border-zinc-800/80 shadow-black"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h2
                    className={`text-base font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Social Profiles
                  </h2>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    Enter complete URLs including https://
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-xs shadow-xs">
                    <FaInstagram className="w-3.5 h-3.5" />
                  </span>
                  Instagram
                </span>
                {links.instagram ? (
                  <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium lowercase">
                    <CheckCircle2 className="w-3 h-3" /> active
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-500 lowercase">not configured</span>
                )}
              </label>
              <input
                type="url"
                name="instagram"
                value={links.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourbrand"
                className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-500/20 ${
                  isDarkMode
                    ? "bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-pink-500/60"
                    : "bg-gray-50/70 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-pink-500"
                }`}
              />
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs shadow-xs">
                    <FaFacebookF className="w-3 h-3" />
                  </span>
                  Facebook
                </span>
                {links.facebook ? (
                  <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium lowercase">
                    <CheckCircle2 className="w-3 h-3" /> active
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-500 lowercase">not configured</span>
                )}
              </label>
              <input
                type="url"
                name="facebook"
                value={links.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  isDarkMode
                    ? "bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-blue-500/60"
                    : "bg-gray-50/70 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                }`}
              />
            </div>

            {/* Twitter / X */}
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-xs ${
                      isDarkMode
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-black text-white"
                    }`}
                  >
                    <FaXTwitter className="w-3 h-3" />
                  </span>
                  Twitter / X
                </span>
                {links.twitter ? (
                  <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium lowercase">
                    <CheckCircle2 className="w-3 h-3" /> active
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-500 lowercase">not configured</span>
                )}
              </label>
              <input
                type="url"
                name="twitter"
                value={links.twitter}
                onChange={handleChange}
                placeholder="https://x.com/yourhandle"
                className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                  isDarkMode
                    ? "bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500/60"
                    : "bg-gray-50/70 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500"
                }`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || fetching}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Storefront Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${
              isDarkMode
                ? "bg-zinc-900/60 border-zinc-800/80 shadow-black"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDarkMode
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3
                  className={`text-base font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Live Storefront Preview
                </h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  Real-time appearance in footer & header
                </p>
              </div>
            </div>

            {/* Storefront Mockup Box */}
            <div
              className={`mt-6 p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-4 ${
                isDarkMode
                  ? "bg-zinc-950/90 border-zinc-800/80"
                  : "bg-slate-50/70 border-slate-200/80"
              }`}
            >
              <span
                className={`text-xs uppercase tracking-wider font-semibold ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Connect With Us
              </span>

              {/* Interactive Icon Buttons */}
              <div className="flex items-center justify-center gap-3">
                {/* Instagram Preview */}
                <a
                  href={links.instagram || "#"}
                  target={links.instagram ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!links.instagram) e.preventDefault();
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                    links.instagram
                      ? isDarkMode
                        ? "bg-zinc-900 border-zinc-700/80 text-pink-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-105 shadow-md"
                        : "bg-white border-gray-200 text-pink-500 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-105 shadow-md"
                      : "opacity-30 cursor-not-allowed bg-zinc-800/40 border-zinc-800 text-zinc-500"
                  }`}
                  title={links.instagram ? "Instagram (Configured)" : "Instagram (Not set)"}
                >
                  <FaInstagram className="text-xl" />
                </a>

                {/* Facebook Preview */}
                <a
                  href={links.facebook || "#"}
                  target={links.facebook ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!links.facebook) e.preventDefault();
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                    links.facebook
                      ? isDarkMode
                        ? "bg-zinc-900 border-zinc-700/80 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-transparent hover:scale-105 shadow-md"
                        : "bg-white border-gray-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent hover:scale-105 shadow-md"
                      : "opacity-30 cursor-not-allowed bg-zinc-800/40 border-zinc-800 text-zinc-500"
                  }`}
                  title={links.facebook ? "Facebook (Configured)" : "Facebook (Not set)"}
                >
                  <FaFacebookF className="text-lg" />
                </a>

                {/* Twitter / X Preview */}
                <a
                  href={links.twitter || "#"}
                  target={links.twitter ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!links.twitter) e.preventDefault();
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                    links.twitter
                      ? isDarkMode
                        ? "bg-zinc-900 border-zinc-700/80 text-white hover:bg-white hover:text-zinc-950 hover:border-transparent hover:scale-105 shadow-md"
                        : "bg-white border-gray-200 text-black hover:bg-black hover:text-white hover:border-transparent hover:scale-105 shadow-md"
                      : "opacity-30 cursor-not-allowed bg-zinc-800/40 border-zinc-800 text-zinc-500"
                  }`}
                  title={links.twitter ? "Twitter / X (Configured)" : "Twitter / X (Not set)"}
                >
                  <FaXTwitter className="text-lg" />
                </a>
              </div>

              <p
                className={`text-[11px] ${
                  isDarkMode ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                Click any active icon above to test URL redirection.
              </p>
            </div>

            {/* Quick Summary Info */}
            <div className="mt-6 space-y-2.5">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDarkMode
                    ? "bg-zinc-950/60 border-zinc-800/60 text-zinc-300"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaInstagram className="text-pink-500" />
                  Instagram Link
                </span>
                {links.instagram ? (
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    open <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDarkMode
                    ? "bg-zinc-950/60 border-zinc-800/60 text-zinc-300"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaFacebookF className="text-blue-500" />
                  Facebook Link
                </span>
                {links.facebook ? (
                  <a
                    href={links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    open <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDarkMode
                    ? "bg-zinc-950/60 border-zinc-800/60 text-zinc-300"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaXTwitter className={isDarkMode ? "text-white" : "text-black"} />
                  Twitter / X Link
                </span>
                {links.twitter ? (
                  <a
                    href={links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    open <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSettingsPage;
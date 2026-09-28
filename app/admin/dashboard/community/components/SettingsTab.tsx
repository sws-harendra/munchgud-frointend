"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import { updateSettingsThunk } from "@/app/lib/store/features/communitySlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface SettingsTabProps {
  settings: any;
}

export default function SettingsTab({ settings }: SettingsTabProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();

  const [formData, setFormData] = useState({
    heroHeadline:
      settings?.heroHeadline ||
      settings?.heroTitle ||
      "Not Just Listeners.\nA Community\nThat Feels.",
    heroSubtitle:
      settings?.heroSubtitle ||
      "Connect. Share. Learn. Create. Grow. Because better sound brings better people together.",
    heroTag: settings?.heroTag || "// FLAZO COMMUNITY",
    heroQuote: settings?.heroQuote || settings?.memberQuote || "Together for a Brighter India",
    heroQuoteAuthor:
      settings?.heroQuoteAuthor || settings?.quoteAuthor || "Good People. Better Sound.",
    heroMembersCount: settings?.heroMembersCount || settings?.membersCount || "25K+",
    heroDiscussionsCount: settings?.heroDiscussionsCount || settings?.discussionsCount || "10K+",
    heroAnswersCount: settings?.heroAnswersCount || settings?.answersCount || "50K+",
    heroExpertsCount: settings?.heroExpertsCount || settings?.expertsCount || "100+",
    // Expanded dynamic cards & actions
    watchStoryText: settings?.watchStoryText || "Watch Our Story",
    watchStoryUrl: settings?.watchStoryUrl || "",
    joinButtonText: settings?.joinButtonText || "Join the Community",
    pillarsText: settings?.pillarsText || "MUSIC,PEOPLE,IDEAS,IMPACT",
    ideaCardTitle: settings?.ideaCardTitle || "Your Ideas Shape the Next Sound",
    ideaCardSubtitle:
      settings?.ideaCardSubtitle ||
      "Share feedback, suggest features, and be a part of what we build next.",
    ideaCardButtonText: settings?.ideaCardButtonText || "Share Your Idea",
    missionCardTitle: settings?.missionCardTitle || "A Stronger Community. A Brighter India.",
    missionCardSubtitle:
      settings?.missionCardSubtitle || "Sound that empowers the creators of tomorrow.",
    missionCardBadge: settings?.missionCardBadge || "Made for Sound",
  });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    settings?.heroImage
      ? getImageUrl(settings.heroImage)
      : "/images/flazo_community_hero_hq.jpg"
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        heroHeadline: settings.heroHeadline || settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        heroTag: settings.heroTag || "// FLAZO COMMUNITY",
        heroQuote: settings.heroQuote || settings.memberQuote || "Together for a Brighter India",
        heroQuoteAuthor:
          settings.heroQuoteAuthor || settings.quoteAuthor || "Good People. Better Sound.",
        heroMembersCount: settings.heroMembersCount || settings.membersCount || "25K+",
        heroDiscussionsCount: settings.heroDiscussionsCount || settings.discussionsCount || "10K+",
        heroAnswersCount: settings.heroAnswersCount || settings.answersCount || "50K+",
        heroExpertsCount: settings.heroExpertsCount || settings.expertsCount || "100+",
        watchStoryText: settings.watchStoryText || "Watch Our Story",
        watchStoryUrl: settings.watchStoryUrl || "",
        joinButtonText: settings.joinButtonText || "Join the Community",
        pillarsText: settings.pillarsText || "MUSIC,PEOPLE,IDEAS,IMPACT",
        ideaCardTitle: settings.ideaCardTitle || "Your Ideas Shape the Next Sound",
        ideaCardSubtitle:
          settings.ideaCardSubtitle ||
          "Share feedback, suggest features, and be a part of what we build next.",
        ideaCardButtonText: settings.ideaCardButtonText || "Share Your Idea",
        missionCardTitle: settings.missionCardTitle || "A Stronger Community. A Brighter India.",
        missionCardSubtitle:
          settings.missionCardSubtitle || "Sound that empowers the creators of tomorrow.",
        missionCardBadge: settings.missionCardBadge || "Made for Sound",
      });
      if (settings.heroImage) {
        setImagePreview(getImageUrl(settings.heroImage));
      }
    }
  }, [settings]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        fd.append(key, (formData as any)[key]);
      });
      if (heroImageFile) {
        fd.append("heroImage", heroImageFile);
      }

      await dispatch(updateSettingsThunk(fd)).unwrap();
      toast.success("All community settings and storefront cards updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update community settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div
        className={`p-6 rounded-2xl border transition-colors space-y-6 ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
        }`}
      >
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDark ? "border-zinc-800" : "border-neutral-100"
          }`}
        >
          <div>
            <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-neutral-950"}`}>
              Storefront Hero & Live Metrics
            </h2>
            <p className={`text-xs ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
              Customize banner headline, subtitle, hero photography, live metrics, action buttons, and community cards.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Changes..." : "Save Community Settings"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Text fields */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label
                className={`text-xs font-bold block mb-1 ${
                  isDark ? "text-zinc-300" : "text-neutral-700"
                }`}
              >
                Tag / Pill Label
              </label>
              <input
                type="text"
                value={formData.heroTag}
                onChange={(e) => setFormData({ ...formData, heroTag: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
                }`}
                placeholder="// FLAZO COMMUNITY"
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold block mb-1 ${
                  isDark ? "text-zinc-300" : "text-neutral-700"
                }`}
              >
                Main Headline (New lines will render as breaks)
              </label>
              <textarea
                rows={3}
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
                }`}
                placeholder="Not Just Listeners.&#10;A Community&#10;That Feels."
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold block mb-1 ${
                  isDark ? "text-zinc-300" : "text-neutral-700"
                }`}
              >
                Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
                }`}
                placeholder="Connect. Share. Learn. Create. Grow..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`text-xs font-bold block mb-1 ${
                    isDark ? "text-zinc-300" : "text-neutral-700"
                  }`}
                >
                  Quote Script
                </label>
                <input
                  type="text"
                  value={formData.heroQuote}
                  onChange={(e) => setFormData({ ...formData, heroQuote: e.target.value })}
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`text-xs font-bold block mb-1 ${
                    isDark ? "text-zinc-300" : "text-neutral-700"
                  }`}
                >
                  Quote Author / Tagline
                </label>
                <input
                  type="text"
                  value={formData.heroQuoteAuthor}
                  onChange={(e) =>
                    setFormData({ ...formData, heroQuoteAuthor: e.target.value })
                  }
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
                  }`}
                />
              </div>
            </div>

            {/* Buttons & Watermark Customization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label
                  className={`text-xs font-bold block mb-1 ${
                    isDark ? "text-zinc-300" : "text-neutral-700"
                  }`}
                >
                  Join Button Text
                </label>
                <input
                  type="text"
                  value={formData.joinButtonText}
                  onChange={(e) => setFormData({ ...formData, joinButtonText: e.target.value })}
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`text-xs font-bold block mb-1 ${
                    isDark ? "text-zinc-300" : "text-neutral-700"
                  }`}
                >
                  Story Button Text
                </label>
                <input
                  type="text"
                  value={formData.watchStoryText}
                  onChange={(e) => setFormData({ ...formData, watchStoryText: e.target.value })}
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`text-xs font-bold block mb-1 ${
                    isDark ? "text-zinc-300" : "text-neutral-700"
                  }`}
                >
                  Story Video/Link URL
                </label>
                <input
                  type="text"
                  value={formData.watchStoryUrl}
                  onChange={(e) => setFormData({ ...formData, watchStoryUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`text-xs font-bold block mb-1 ${
                  isDark ? "text-zinc-300" : "text-neutral-700"
                }`}
              >
                Hero Watermark Pillars (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.pillarsText}
                onChange={(e) => setFormData({ ...formData, pillarsText: e.target.value })}
                placeholder="MUSIC,PEOPLE,IDEAS,IMPACT"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                }`}
              />
            </div>

            {/* 4 Community Numbers */}
            <div className="pt-2">
              <h3
                className={`text-xs font-mono font-bold uppercase tracking-wider mb-3 ${
                  isDark ? "text-amber-400" : "text-amber-800"
                }`}
              >
                Live Storefront Counter Badges
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label
                    className={`text-[11px] font-bold block mb-1 ${
                      isDark ? "text-zinc-400" : "text-neutral-600"
                    }`}
                  >
                    Members
                  </label>
                  <input
                    type="text"
                    value={formData.heroMembersCount}
                    onChange={(e) =>
                      setFormData({ ...formData, heroMembersCount: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                    }`}
                    placeholder="25K+"
                  />
                </div>
                <div>
                  <label
                    className={`text-[11px] font-bold block mb-1 ${
                      isDark ? "text-zinc-400" : "text-neutral-600"
                    }`}
                  >
                    Discussions
                  </label>
                  <input
                    type="text"
                    value={formData.heroDiscussionsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, heroDiscussionsCount: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                    }`}
                    placeholder="10K+"
                  />
                </div>
                <div>
                  <label
                    className={`text-[11px] font-bold block mb-1 ${
                      isDark ? "text-zinc-400" : "text-neutral-600"
                    }`}
                  >
                    Answers
                  </label>
                  <input
                    type="text"
                    value={formData.heroAnswersCount}
                    onChange={(e) =>
                      setFormData({ ...formData, heroAnswersCount: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                    }`}
                    placeholder="50K+"
                  />
                </div>
                <div>
                  <label
                    className={`text-[11px] font-bold block mb-1 ${
                      isDark ? "text-zinc-400" : "text-neutral-600"
                    }`}
                  >
                    Verified Experts
                  </label>
                  <input
                    type="text"
                    value={formData.heroExpertsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, heroExpertsCount: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "bg-neutral-50/50 border-neutral-200 text-neutral-900 focus:border-amber-600"
                    }`}
                    placeholder="100+"
                  />
                </div>
              </div>
            </div>

            {/* Bottom 2 Dynamic Cards Control */}
            <div
              className={`pt-4 border-t space-y-4 ${
                isDark ? "border-zinc-800" : "border-neutral-100"
              }`}
            >
              <h3
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isDark ? "text-amber-400" : "text-amber-800"
                }`}
              >
                Bottom Community Cards Customization
              </h3>

              {/* Idea Card */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
                  isDark ? "bg-zinc-900/70 border-zinc-800" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <span
                  className={`text-xs font-bold block ${
                    isDark ? "text-zinc-100" : "text-neutral-900"
                  }`}
                >
                  Idea Submission Card
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Idea Card Title"
                    value={formData.ideaCardTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, ideaCardTitle: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={formData.ideaCardButtonText}
                    onChange={(e) =>
                      setFormData({ ...formData, ideaCardButtonText: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Idea Card Subtitle"
                  value={formData.ideaCardSubtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, ideaCardSubtitle: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "border-neutral-200 bg-white text-neutral-900"
                  }`}
                />
              </div>

              {/* Mission / Brighter India Card */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
                  isDark ? "bg-zinc-900/70 border-zinc-800" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <span
                  className={`text-xs font-bold block ${
                    isDark ? "text-zinc-100" : "text-neutral-900"
                  }`}
                >
                  Mission / Heritage Card
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Mission Card Title"
                    value={formData.missionCardTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, missionCardTitle: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Badge Text"
                    value={formData.missionCardBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, missionCardBadge: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                      isDark
                        ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Mission Card Subtitle"
                  value={formData.missionCardSubtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, missionCardSubtitle: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                      : "border-neutral-200 bg-white text-neutral-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right: Hero Image Upload & Preview */}
          <div className="lg:col-span-5 space-y-3">
            <label
              className={`text-xs font-bold block ${
                isDark ? "text-zinc-300" : "text-neutral-700"
              }`}
            >
              Hero Photography Visual
            </label>
            <div
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md group border transition-colors ${
                isDark ? "bg-zinc-900 border-zinc-800" : "bg-neutral-900 border-neutral-200"
              }`}
            >
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Community Hero Preview"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer flex items-center gap-1.5 transition ${
                    isDark
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-700 hover:bg-zinc-800"
                      : "bg-white text-neutral-900"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className={`text-[11px] ${isDark ? "text-zinc-500" : "text-neutral-400"}`}>
              Recommended: 1600x1200 high resolution photo showing friends or community listeners.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

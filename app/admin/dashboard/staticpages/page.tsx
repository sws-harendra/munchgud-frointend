"use client";

import React, { useEffect, useState } from "react";
import RichTextEditor from "@/app/commonComponents/RichTextEditor";
import { pageService } from "@/app/sercices/user/staticpage.service";
import { toast } from "sonner";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { FileText, Save, RefreshCw, Sparkles, CheckCircle2, Globe } from "lucide-react";

const pages = [
  { title: "Privacy Policy", slug: "privacy-policy" },
  { title: "Refund Policy", slug: "refund-policy" },
  { title: "Terms & Conditions", slug: "terms&conditions" },
  { title: "About Us", slug: "aboutus" },
];

export default function PageEditor() {
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [content, setContent] = useState("<p>Edit your page content here...</p>");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch page content when page changes
  const fetchPage = async (slug: string) => {
    try {
      setLoading(true);
      const res = await pageService.getPageBySlug(slug);

      if (res?.content) {
        setContent(res.content);
      } else {
        setContent(`<p>Write your ${selectedPage.title} content here...</p>`);
      }
    } catch (err: any) {
      // Graceful fallback for non-existing pages
      setContent(`<p>Write your ${selectedPage.title} content here...</p>`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(selectedPage.slug);
  }, [selectedPage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await pageService.createOrUpdatePage({
        title: selectedPage.title,
        slug: selectedPage.slug,
        content,
      });

      toast.success(`${selectedPage.title} saved successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-200 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-slate-50/70 text-slate-800"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
              : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-3.5 rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center text-zinc-950 font-bold">
              <FileText className="h-7 w-7 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Page Editor
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Content
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Configure public store legal, terms, privacy, and static content pages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <Save className="w-4 h-4 text-zinc-950" />
              )}
              <span>{saving ? "Saving..." : `Save ${selectedPage.title}`}</span>
            </button>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
              : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <span className={`text-sm font-semibold ${isDarkMode ? "text-zinc-200" : "text-gray-700"}`}>
              Select Static Page:
            </span>
          </div>

          <div
            className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl border ${
              isDarkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-gray-100 border-gray-200"
            }`}
          >
            {pages.map((page) => (
              <button
                key={page.slug}
                onClick={() => setSelectedPage(page)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPage.slug === page.slug
                    ? "bg-amber-500 text-zinc-950 shadow-sm font-bold"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Container Card */}
        <div
          className={`rounded-3xl border p-4 sm:p-6 transition-all duration-200 ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800/90 shadow-xl shadow-black/40"
              : "bg-white border-slate-200/80 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2
                className={`text-base sm:text-lg font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Editing: <span className="text-amber-400">{selectedPage.title}</span>
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-mono border ${
                  isDarkMode
                    ? "bg-zinc-900 text-zinc-400 border-zinc-800"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                /{selectedPage.slug}
              </span>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Loading content...</span>
              </div>
            )}
          </div>

          <RichTextEditor value={content} onChange={setContent} isDarkMode={isDarkMode} />

          {/* Bottom Bar */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t ${
              isDarkMode ? "border-zinc-800/80" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>
                Changes saved here will reflect immediately on the storefront footer links.
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <Save className="w-4 h-4 text-zinc-950" />
              )}
              <span>{saving ? "Saving..." : `Save ${selectedPage.title}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
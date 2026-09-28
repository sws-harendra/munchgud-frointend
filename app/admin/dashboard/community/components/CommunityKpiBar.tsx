"use client";

import React from "react";

interface CommunityKpiBarProps {
  kpiStats: {
    totalDiscussions: number;
    activeDiscussions: number;
    pinnedCount: number;
    totalUpvotes: number;
    activeCreators: number;
    activeContributors: number;
  };
  settings: any;
  isDark: boolean;
}

export default function CommunityKpiBar({ kpiStats, settings, isDark }: CommunityKpiBarProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t ${
        isDark ? "border-zinc-800" : "border-neutral-100"
      }`}
    >
      {/* 1. Discussions */}
      <div
        className={`p-3 rounded-xl border transition-colors ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
        }`}
      >
        <span
          className={`text-[11px] font-mono uppercase tracking-wider block ${
            isDark ? "text-zinc-400" : "text-neutral-500"
          }`}
        >
          Discussions
        </span>
        <span className={`text-lg font-black ${isDark ? "text-white" : "text-neutral-950"}`}>
          {kpiStats.totalDiscussions}
        </span>
        <span
          className={`text-[10px] font-medium ml-1.5 ${
            isDark ? "text-emerald-400" : "text-emerald-700"
          }`}
        >
          ({kpiStats.activeDiscussions} active)
        </span>
      </div>

      {/* 2. Pinned */}
      <div
        className={`p-3 rounded-xl border transition-colors ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
        }`}
      >
        <span
          className={`text-[11px] font-mono uppercase tracking-wider block ${
            isDark ? "text-zinc-400" : "text-neutral-500"
          }`}
        >
          Pinned
        </span>
        <span className={`text-lg font-black ${isDark ? "text-amber-400" : "text-amber-800"}`}>
          {kpiStats.pinnedCount}
        </span>
        <span className={`text-[10px] font-medium ml-1.5 ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
          Featured
        </span>
      </div>

      {/* 3. Total Votes */}
      <div
        className={`p-3 rounded-xl border transition-colors ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
        }`}
      >
        <span
          className={`text-[11px] font-mono uppercase tracking-wider block ${
            isDark ? "text-zinc-400" : "text-neutral-500"
          }`}
        >
          Total Votes
        </span>
        <span className={`text-lg font-black ${isDark ? "text-white" : "text-neutral-950"}`}>
          {kpiStats.totalUpvotes.toLocaleString()}
        </span>
        <span className={`text-[10px] font-medium ml-1.5 ${isDark ? "text-amber-400" : "text-amber-700"}`}>
          Engaged
        </span>
      </div>

      {/* 4. Creators */}
      <div
        className={`p-3 rounded-xl border transition-colors ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
        }`}
      >
        <span
          className={`text-[11px] font-mono uppercase tracking-wider block ${
            isDark ? "text-zinc-400" : "text-neutral-500"
          }`}
        >
          Creators
        </span>
        <span className={`text-lg font-black ${isDark ? "text-white" : "text-neutral-950"}`}>
          {kpiStats.activeCreators}
        </span>
        <span className={`text-[10px] font-medium ml-1.5 ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
          Spotlight
        </span>
      </div>

      {/* 5. Contributors */}
      <div
        className={`p-3 rounded-xl border transition-colors ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
        }`}
      >
        <span
          className={`text-[11px] font-mono uppercase tracking-wider block ${
            isDark ? "text-zinc-400" : "text-neutral-500"
          }`}
        >
          Contributors
        </span>
        <span className={`text-lg font-black ${isDark ? "text-white" : "text-neutral-950"}`}>
          {kpiStats.activeContributors}
        </span>
        <span className={`text-[10px] font-medium ml-1.5 ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
          Leaderboard
        </span>
      </div>

      {/* 6. Display Members */}
      <div
        className={`p-3 rounded-xl border transition-colors ${
          isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
        }`}
      >
        <span
          className={`text-[11px] font-mono uppercase tracking-wider block ${
            isDark ? "text-zinc-400" : "text-neutral-500"
          }`}
        >
          Display Members
        </span>
        <span className={`text-lg font-black ${isDark ? "text-amber-400" : "text-amber-900"}`}>
          {settings?.heroMembersCount || settings?.membersCount || "25K+"}
        </span>
        <span className={`text-[10px] font-medium ml-1.5 ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
          Storefront
        </span>
      </div>
    </div>
  );
}

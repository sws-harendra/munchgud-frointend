"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  toggleDiscussionPinnedThunk,
  toggleDiscussionStatusThunk,
  deleteDiscussionThunk,
} from "@/app/lib/store/features/communitySlice";
import {
  CommunityDiscussionItem,
  CommunityTopicItem,
} from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import {
  Search,
  Plus,
  Pin,
  PinOff,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ThumbsUp,
  MessageCircle,
  Eye,
  MessagesSquare,
} from "lucide-react";
import { toast } from "sonner";

interface DiscussionsTabProps {
  discussions: CommunityDiscussionItem[];
  topics: CommunityTopicItem[];
  onOpenCreate: () => void;
  onOpenEdit: (item: CommunityDiscussionItem) => void;
}

export default function DiscussionsTab({
  discussions,
  topics,
  onOpenCreate,
  onOpenEdit,
}: DiscussionsTabProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  // Filtered Discussions
  const filteredDiscussions = useMemo(() => {
    return discussions.filter((d) => {
      const matchSearch =
        !searchQuery ||
        d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = filterTag === "all" || d.tag === filterTag;
      return matchSearch && matchTag;
    });
  }, [discussions, searchQuery, filterTag]);

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div
        className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? "text-zinc-500" : "text-neutral-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search thread title, description, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                  : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
              }`}
            />
          </div>

          {/* 100% Dynamic Topic Filter Dropdown */}
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className={`text-xs px-3 py-2 rounded-xl border font-medium focus:outline-none cursor-pointer transition-colors ${
              isDark
                ? "bg-zinc-900/90 border-zinc-800 text-zinc-200 focus:border-amber-500"
                : "bg-neutral-50/50 border-neutral-200 text-neutral-700 focus:border-amber-600"
            }`}
          >
            <option value="all">All Dynamic Topics ({topics.length})</option>
            {topics.map((t) => {
              const tagVal = t.slug || t.topicId;
              return (
                <option key={t.id} value={tagVal}>
                  {t.title}
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Discussions List */}
      <div
        className={`rounded-2xl border transition-colors overflow-hidden ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
        }`}
      >
        <div className={`divide-y ${isDark ? "divide-zinc-800/80" : "divide-neutral-100"}`}>
          {filteredDiscussions.length === 0 ? (
            <div className={`p-12 text-center ${isDark ? "text-zinc-500" : "text-neutral-400"}`}>
              <MessagesSquare
                className={`w-10 h-10 mx-auto stroke-1 mb-2 ${
                  isDark ? "text-zinc-600" : "text-neutral-300"
                }`}
              />
              <p className="text-sm font-medium">No discussions found matching your filter.</p>
            </div>
          ) : (
            filteredDiscussions.map((d) => (
              <div
                key={d.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  isDark ? "hover:bg-zinc-900/60" : "hover:bg-neutral-50/80"
                }`}
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full overflow-hidden relative shrink-0 border ${
                      isDark ? "border-zinc-800 bg-zinc-900" : "border-neutral-200 bg-neutral-100"
                    }`}
                  >
                    {d.avatar || d.authorAvatar ? (
                      <Image
                        src={getImageUrl(d.avatar || d.authorAvatar)}
                        alt={d.author}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center font-bold text-sm ${
                          isDark ? "bg-amber-950 text-amber-300" : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {d.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {d.isPinned && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            isDark
                              ? "bg-amber-950/70 border border-amber-800/60 text-amber-300"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          <Pin className="w-2.5 h-2.5" />
                          Pinned
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isDark
                            ? "bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {d.category || d.tag}
                      </span>
                      <span
                        className={`text-[11px] font-mono ${
                          isDark ? "text-zinc-400" : "text-neutral-400"
                        }`}
                      >
                        By{" "}
                        <strong className={isDark ? "text-zinc-200" : "text-neutral-700"}>
                          {d.author}
                        </strong>{" "}
                        • {d.time || "Recently"}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold truncate ${
                        isDark ? "text-zinc-100" : "text-neutral-900"
                      }`}
                    >
                      {d.title}
                    </h3>
                    <p
                      className={`text-xs line-clamp-1 ${
                        isDark ? "text-zinc-400" : "text-neutral-500"
                      }`}
                    >
                      {d.desc}
                    </p>

                    {/* Stats Row */}
                    <div
                      className={`flex items-center gap-4 text-[11px] font-mono pt-1 ${
                        isDark ? "text-zinc-400" : "text-neutral-500"
                      }`}
                    >
                      <span
                        className={`flex items-center gap-1 font-bold ${
                          isDark ? "text-amber-400" : "text-amber-800"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {d.votes} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {d.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {d.views || "0"} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Toggle Pinned */}
                  <button
                    onClick={async () => {
                      try {
                        await dispatch(toggleDiscussionPinnedThunk(d.id)).unwrap();
                        toast.success(
                          d.isPinned ? "Unpinned discussion" : "Pinned discussion to top!"
                        );
                      } catch (err: any) {
                        toast.error(err.message || "Failed to toggle pin");
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      d.isPinned
                        ? isDark
                          ? "bg-amber-950/70 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60"
                          : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        : isDark
                        ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                    title={d.isPinned ? "Unpin thread" : "Pin to top"}
                  >
                    {d.isPinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
                  </button>

                  {/* Toggle Active */}
                  <button
                    onClick={async () => {
                      try {
                        await dispatch(toggleDiscussionStatusThunk(d.id)).unwrap();
                        toast.success(`Thread is now ${d.isActive ? "inactive" : "active"}`);
                      } catch (err: any) {
                        toast.error(err.message || "Failed to toggle status");
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      d.isActive
                        ? isDark
                          ? "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : isDark
                        ? "bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                    }`}
                  >
                    {d.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onOpenEdit(d)}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      isDark
                        ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                    title="Edit Discussion"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to delete "${d.title}"?`)) {
                        try {
                          await dispatch(deleteDiscussionThunk(d.id)).unwrap();
                          toast.success("Discussion deleted successfully");
                        } catch (err: any) {
                          toast.error(err.message || "Failed to delete discussion");
                        }
                      }
                    }}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      isDark
                        ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                        : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    }`}
                    title="Delete Discussion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchDiscussionsAdmin,
  createDiscussionThunk,
  updateDiscussionThunk,
  toggleDiscussionStatusThunk,
  toggleDiscussionPinnedThunk,
  deleteDiscussionThunk,
  fetchCreatorsAdmin,
  createCreatorThunk,
  updateCreatorThunk,
  toggleCreatorStatusThunk,
  deleteCreatorThunk,
  fetchContributorsAdmin,
  createContributorThunk,
  updateContributorThunk,
  toggleContributorStatusThunk,
  deleteContributorThunk,
  fetchTopicsAdmin,
  createTopicThunk,
  updateTopicThunk,
  toggleTopicStatusThunk,
  deleteTopicThunk,
  fetchSettingsAdmin,
  updateSettingsThunk,
} from "@/app/lib/store/features/communitySlice";
import {
  CommunityDiscussionItem,
  CommunityCreatorItem,
  CommunityContributorItem,
  CommunityTopicItem,
  CommunitySettingItem,
} from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  MessagesSquare,
  Plus,
  Edit,
  Trash2,
  Pin,
  PinOff,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Sparkles,
  Upload,
  Users,
  Award,
  Sliders,
  Settings as SettingsIcon,
  Flame,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  Clock,
  Tag,
  HelpCircle,
  X,
  Save,
  Check,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCommunityDashboardPage() {
  const dispatch = useAppDispatch();
  const {
    discussions,
    creators,
    contributors,
    topics,
    settings,
    status,
  } = useAppSelector((state) => state.community);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "discussions" | "creators" | "contributors" | "topics" | "settings"
  >("discussions");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  // Modal States
  const [discussionModalOpen, setDiscussionModalOpen] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState<CommunityDiscussionItem | null>(null);

  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<CommunityCreatorItem | null>(null);

  const [contributorModalOpen, setContributorModalOpen] = useState(false);
  const [editingContributor, setEditingContributor] = useState<CommunityContributorItem | null>(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<CommunityTopicItem | null>(null);

  // Initial Fetch
  const reloadAll = () => {
    dispatch(fetchDiscussionsAdmin());
    dispatch(fetchCreatorsAdmin());
    dispatch(fetchContributorsAdmin());
    dispatch(fetchTopicsAdmin());
    dispatch(fetchSettingsAdmin());
  };

  useEffect(() => {
    reloadAll();
  }, [dispatch]);

  // Compute KPI Stats
  const kpiStats = useMemo(() => {
    const totalDiscussions = discussions.length;
    const activeDiscussions = discussions.filter((d) => d.isActive).length;
    const pinnedCount = discussions.filter((d) => d.isPinned).length;
    const totalUpvotes = discussions.reduce((acc, d) => acc + (d.votes || 0), 0);
    const activeCreators = creators.filter((c) => c.isActive).length;
    const activeContributors = contributors.filter((c) => c.isActive).length;

    return {
      totalDiscussions,
      activeDiscussions,
      pinnedCount,
      totalUpvotes,
      activeCreators,
      activeContributors,
    };
  }, [discussions, creators, contributors]);

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
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP CONTROLS
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-800/20">
                  <MessagesSquare className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black text-neutral-950 tracking-tight">
                    Community Studio Control
                  </h1>
                  <p className="text-xs text-neutral-500 font-medium">
                    100% Dynamic control center for Flazo Community discussions, creators, leaderboard, and branding.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={reloadAll}
                className="px-3.5 py-2 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                title="Reload community data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>

              <Link
                href="/community"
                target="_blank"
                className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Live View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* KPI Mini-Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-neutral-100">
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-900/10">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Discussions</span>
              <span className="text-lg font-black text-neutral-950">{kpiStats.totalDiscussions}</span>
              <span className="text-[10px] text-emerald-700 font-medium ml-1.5">({kpiStats.activeDiscussions} active)</span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-900/10">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Pinned</span>
              <span className="text-lg font-black text-amber-800">{kpiStats.pinnedCount}</span>
              <span className="text-[10px] text-neutral-500 font-medium ml-1.5">Featured</span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-900/10">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Total Votes</span>
              <span className="text-lg font-black text-neutral-950">{kpiStats.totalUpvotes.toLocaleString()}</span>
              <span className="text-[10px] text-amber-700 font-medium ml-1.5">Engaged</span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-900/10">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Creators</span>
              <span className="text-lg font-black text-neutral-950">{kpiStats.activeCreators}</span>
              <span className="text-[10px] text-neutral-500 font-medium ml-1.5">Spotlight</span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-900/10">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Contributors</span>
              <span className="text-lg font-black text-neutral-950">{kpiStats.activeContributors}</span>
              <span className="text-[10px] text-neutral-500 font-medium ml-1.5">Leaderboard</span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-900/10">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Display Members</span>
              <span className="text-lg font-black text-amber-900">
                {settings?.heroMembersCount || settings?.membersCount || "25K+"}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium ml-1.5">Storefront</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-5 pt-2 border-t border-neutral-100">
            <button
              onClick={() => setActiveTab("discussions")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "discussions"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <MessagesSquare className="w-3.5 h-3.5" />
              <span>Discussions ({discussions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("creators")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "creators"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Creator Spotlight ({creators.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("contributors")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "contributors"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Top Contributors ({contributors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("topics")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "topics"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Category Topics ({topics.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Hero & Community Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TAB CONTENT
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 mt-6">
        {/* ========================================================= */}
        {/* TAB 1: DISCUSSIONS */}
        {/* ========================================================= */}
        {activeTab === "discussions" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search thread title, description, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                  />
                </div>

                {/* 100% Dynamic Topic Filter Dropdown */}
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 font-medium text-neutral-700 focus:outline-none focus:border-amber-600 cursor-pointer"
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
                onClick={() => {
                  setEditingDiscussion(null);
                  setDiscussionModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Discussion Thread</span>
              </button>
            </div>

            {/* Discussions List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {filteredDiscussions.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400">
                    <MessagesSquare className="w-10 h-10 mx-auto stroke-1 mb-2 text-neutral-300" />
                    <p className="text-sm font-medium">No discussions found matching your filter.</p>
                  </div>
                ) : (
                  filteredDiscussions.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* Left: Avatar + Details */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 border border-neutral-200 bg-neutral-100">
                          {d.avatar || d.authorAvatar ? (
                            <Image
                              src={getImageUrl(d.avatar || d.authorAvatar)}
                              alt={d.author}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-amber-900 bg-amber-100 text-sm">
                              {d.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {d.isPinned && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 flex items-center gap-1">
                                <Pin className="w-2.5 h-2.5" />
                                Pinned
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700">
                              {d.category || d.tag}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              By <strong className="text-neutral-700">{d.author}</strong> • {d.time || "Recently"}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-neutral-900 truncate">
                            {d.title}
                          </h3>
                          <p className="text-xs text-neutral-500 line-clamp-1">
                            {d.desc}
                          </p>

                          {/* Stats Row */}
                          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 pt-1">
                            <span className="flex items-center gap-1 text-amber-800 font-bold">
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
                              toast.success(d.isPinned ? "Unpinned discussion" : "Pinned discussion to top!");
                            } catch (err: any) {
                              toast.error(err.message || "Failed to toggle pin");
                            }
                          }}
                          className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            d.isPinned
                              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
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
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
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
                          onClick={() => {
                            setEditingDiscussion(d);
                            setDiscussionModalOpen(true);
                          }}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
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
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
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
        )}

        {/* ========================================================= */}
        {/* TAB 2: CREATOR SPOTLIGHT */}
        {/* ========================================================= */}
        {activeTab === "creators" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
              <div>
                <h2 className="text-sm font-bold text-neutral-950">Creator Spotlight Polaroids</h2>
                <p className="text-xs text-neutral-500">
                  Featured ambassadors and creators showcased in rotating Polaroid cards on the community storefront.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCreator(null);
                  setCreatorModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Featured Creator</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {creators.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Polaroid Image */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-100">
                      <Image
                        src={getImageUrl(c.img)}
                        alt={c.handle}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.isActive ? "bg-emerald-500 text-white" : "bg-neutral-700 text-white"
                          }`}
                        >
                          {c.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-neutral-900">{c.handle}</h3>
                      <p className="text-xs font-medium text-amber-800">{c.role}</p>
                      <p className="text-[10px] font-mono text-neutral-400 mt-0.5">Order: #{c.displayOrder}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
                    <button
                      onClick={async () => {
                        try {
                          await dispatch(toggleCreatorStatusThunk(c.id)).unwrap();
                          toast.success(`Creator status updated`);
                        } catch (err: any) {
                          toast.error(err.message || "Failed to toggle status");
                        }
                      }}
                      className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCreator(c);
                          setCreatorModalOpen(true);
                        }}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
                        title="Edit Creator"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete creator ${c.handle}?`)) {
                            try {
                              await dispatch(deleteCreatorThunk(c.id)).unwrap();
                              toast.success("Creator deleted");
                            } catch (err: any) {
                              toast.error(err.message || "Failed to delete creator");
                            }
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Creator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TOP CONTRIBUTORS */}
        {/* ========================================================= */}
        {activeTab === "contributors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
              <div>
                <h2 className="text-sm font-bold text-neutral-950">Top Contributors Leaderboard</h2>
                <p className="text-xs text-neutral-500">
                  Hall-of-fame community members displayed in the sidebar leaderboard with points and role badges.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingContributor(null);
                  setContributorModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Contributor</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {contributors.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-black font-mono text-sm text-amber-900">
                        #{member.rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0 border border-neutral-200 bg-neutral-100">
                        {member.avatar ? (
                          <Image
                            src={getImageUrl(member.avatar)}
                            alt={member.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-amber-900 text-xs">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${member.badgeClass || "bg-amber-100 text-amber-900"}`}>
                            {member.role}
                          </span>
                        </h4>
                        <p className="text-xs font-mono font-bold text-amber-800">{member.points}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await dispatch(toggleContributorStatusThunk(member.id)).unwrap();
                            toast.success("Contributor status updated");
                          } catch (err: any) {
                            toast.error(err.message || "Failed to toggle");
                          }
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                          member.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {member.isActive ? "Active" : "Hidden"}
                      </button>

                      <button
                        onClick={() => {
                          setEditingContributor(member);
                          setContributorModalOpen(true);
                        }}
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete contributor ${member.name}?`)) {
                            try {
                              await dispatch(deleteContributorThunk(member.id)).unwrap();
                              toast.success("Contributor deleted");
                            } catch (err: any) {
                              toast.error(err.message || "Failed to delete");
                            }
                          }
                        }}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CATEGORY TOPICS */}
        {/* ========================================================= */}
        {activeTab === "topics" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
              <div>
                <h2 className="text-sm font-bold text-neutral-950">Category Topic Filters</h2>
                <p className="text-xs text-neutral-500">
                  Topic pills dynamically rendered on storefront header and feed filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTopic(null);
                  setTopicModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category Topic</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                        Slug: {t.slug || t.topicId}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900">{t.title}</h4>
                      <p className="text-xs text-neutral-500">{t.desc}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${(t.isActive ?? t.status === "active") ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-500"}`}>
                      {(t.isActive ?? t.status === "active") ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500 font-mono">
                    <span>Order: #{t.displayOrder}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={async () => {
                          try {
                            await dispatch(toggleTopicStatusThunk(t.id)).unwrap();
                            toast.success("Topic status updated");
                          } catch (err: any) {
                            toast.error(err.message || "Failed to update");
                          }
                        }}
                        className="p-1.5 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
                      >
                        {(t.isActive ?? t.status === "active") ? <Eye className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setEditingTopic(t);
                          setTopicModalOpen(true);
                        }}
                        className="p-1.5 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete topic ${t.title}?`)) {
                            try {
                              await dispatch(deleteTopicThunk(t.id)).unwrap();
                              toast.success("Topic deleted");
                            } catch (err: any) {
                              toast.error(err.message || "Failed to delete");
                            }
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: HERO & COMMUNITY SETTINGS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <SettingsTabContent settings={settings} />
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODALS FOR CRUD OPERATIONS
         ───────────────────────────────────────────────────────────── */}
      {discussionModalOpen && (
        <DiscussionFormModal
          isOpen={discussionModalOpen}
          initialData={editingDiscussion}
          topics={topics}
          onClose={() => {
            setDiscussionModalOpen(false);
            setEditingDiscussion(null);
          }}
        />
      )}

      {creatorModalOpen && (
        <CreatorFormModal
          isOpen={creatorModalOpen}
          initialData={editingCreator}
          onClose={() => {
            setCreatorModalOpen(false);
            setEditingCreator(null);
          }}
        />
      )}

      {contributorModalOpen && (
        <ContributorFormModal
          isOpen={contributorModalOpen}
          initialData={editingContributor}
          onClose={() => {
            setContributorModalOpen(false);
            setEditingContributor(null);
          }}
        />
      )}

      {topicModalOpen && (
        <TopicFormModal
          isOpen={topicModalOpen}
          initialData={editingTopic}
          onClose={() => {
            setTopicModalOpen(false);
            setEditingTopic(null);
          }}
        />
      )}
    </div>
  );
}

// ====================================================================
// SETTINGS TAB COMPONENT
// ====================================================================
function SettingsTabContent({ settings }: { settings: any }) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    heroHeadline: settings?.heroHeadline || settings?.heroTitle || "Not Just Listeners.\nA Community\nThat Feels.",
    heroSubtitle:
      settings?.heroSubtitle ||
      "Connect. Share. Learn. Create. Grow. Because better sound brings better people together.",
    heroTag: settings?.heroTag || "// FLAZO COMMUNITY",
    heroQuote: settings?.heroQuote || settings?.memberQuote || "Together for a Brighter India",
    heroQuoteAuthor: settings?.heroQuoteAuthor || settings?.quoteAuthor || "Good People. Better Sound.",
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
    missionCardSubtitle: settings?.missionCardSubtitle || "Sound that empowers the creators of tomorrow.",
    missionCardBadge: settings?.missionCardBadge || "Made for Sound",
  });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    settings?.heroImage ? getImageUrl(settings.heroImage) : "/images/flazo_community_hero_hq.jpg"
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        heroHeadline: settings.heroHeadline || settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        heroTag: settings.heroTag || "// FLAZO COMMUNITY",
        heroQuote: settings.heroQuote || settings.memberQuote || "Together for a Brighter India",
        heroQuoteAuthor: settings.heroQuoteAuthor || settings.quoteAuthor || "Good People. Better Sound.",
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
        missionCardSubtitle: settings.missionCardSubtitle || "Sound that empowers the creators of tomorrow.",
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
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-950">Storefront Hero & Live Metrics</h2>
            <p className="text-xs text-neutral-500">
              Customize banner headline, subtitle, hero photography, live metrics, action buttons, and community cards.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Changes..." : "Save Community Settings"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Text fields */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Tag / Pill Label</label>
              <input
                type="text"
                value={formData.heroTag}
                onChange={(e) => setFormData({ ...formData, heroTag: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                placeholder="// FLAZO COMMUNITY"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Main Headline (New lines will render as breaks)
              </label>
              <textarea
                rows={3}
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                placeholder="Not Just Listeners.&#10;A Community&#10;That Feels."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                placeholder="Connect. Share. Learn. Create. Grow..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Quote Script</label>
                <input
                  type="text"
                  value={formData.heroQuote}
                  onChange={(e) => setFormData({ ...formData, heroQuote: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Quote Author / Tagline</label>
                <input
                  type="text"
                  value={formData.heroQuoteAuthor}
                  onChange={(e) => setFormData({ ...formData, heroQuoteAuthor: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                />
              </div>
            </div>

            {/* Buttons & Watermark Customization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Join Button Text</label>
                <input
                  type="text"
                  value={formData.joinButtonText}
                  onChange={(e) => setFormData({ ...formData, joinButtonText: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Story Button Text</label>
                <input
                  type="text"
                  value={formData.watchStoryText}
                  onChange={(e) => setFormData({ ...formData, watchStoryText: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Story Video/Link URL</label>
                <input
                  type="text"
                  value={formData.watchStoryUrl}
                  onChange={(e) => setFormData({ ...formData, watchStoryUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Hero Watermark Pillars (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.pillarsText}
                onChange={(e) => setFormData({ ...formData, pillarsText: e.target.value })}
                placeholder="MUSIC,PEOPLE,IDEAS,IMPACT"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50"
              />
            </div>

            {/* 4 Community Numbers */}
            <div className="pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 mb-3">
                Live Storefront Counter Badges
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">Members</label>
                  <input
                    type="text"
                    value={formData.heroMembersCount}
                    onChange={(e) => setFormData({ ...formData, heroMembersCount: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                    placeholder="25K+"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">Discussions</label>
                  <input
                    type="text"
                    value={formData.heroDiscussionsCount}
                    onChange={(e) => setFormData({ ...formData, heroDiscussionsCount: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                    placeholder="10K+"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">Answers</label>
                  <input
                    type="text"
                    value={formData.heroAnswersCount}
                    onChange={(e) => setFormData({ ...formData, heroAnswersCount: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                    placeholder="50K+"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">Verified Experts</label>
                  <input
                    type="text"
                    value={formData.heroExpertsCount}
                    onChange={(e) => setFormData({ ...formData, heroExpertsCount: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50/50"
                    placeholder="100+"
                  />
                </div>
              </div>
            </div>

            {/* Bottom 2 Dynamic Cards Control */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
                Bottom Community Cards Customization
              </h3>

              {/* Idea Card */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <span className="text-xs font-bold text-neutral-900 block">Idea Submission Card</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Idea Card Title"
                    value={formData.ideaCardTitle}
                    onChange={(e) => setFormData({ ...formData, ideaCardTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={formData.ideaCardButtonText}
                    onChange={(e) => setFormData({ ...formData, ideaCardButtonText: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Idea Card Subtitle"
                  value={formData.ideaCardSubtitle}
                  onChange={(e) => setFormData({ ...formData, ideaCardSubtitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                />
              </div>

              {/* Mission / Brighter India Card */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <span className="text-xs font-bold text-neutral-900 block">Mission / Heritage Card</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Mission Card Title"
                    value={formData.missionCardTitle}
                    onChange={(e) => setFormData({ ...formData, missionCardTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Badge Text"
                    value={formData.missionCardBadge}
                    onChange={(e) => setFormData({ ...formData, missionCardBadge: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Mission Card Subtitle"
                  value={formData.missionCardSubtitle}
                  onChange={(e) => setFormData({ ...formData, missionCardSubtitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Right: Hero Image Upload & Preview */}
          <div className="lg:col-span-5 space-y-3">
            <label className="text-xs font-bold text-neutral-700 block">Hero Photography Visual</label>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-md group">
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
                <label className="px-4 py-2 bg-white text-neutral-900 rounded-xl text-xs font-bold shadow-lg cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">
              Recommended: 1600x1200 high resolution photo showing friends or community listeners.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

// ====================================================================
// MODAL 1: DISCUSSION FORM
// ====================================================================
function DiscussionFormModal({
  isOpen,
  initialData,
  topics,
  onClose,
}: {
  isOpen: boolean;
  initialData: CommunityDiscussionItem | null;
  topics: CommunityTopicItem[];
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const defaultTopic = topics[0];
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    desc: initialData?.desc || "",
    author: initialData?.author || "",
    time: initialData?.time || "Just now",
    category: initialData?.category || defaultTopic?.title || "Product Help",
    tag: initialData?.tag || defaultTopic?.slug || defaultTopic?.topicId || "help",
    votes: initialData?.votes ?? 0,
    comments: initialData?.comments ?? 0,
    views: initialData?.views || "10",
    isPinned: initialData?.isPinned || false,
    isActive: initialData?.isActive ?? true,
    displayOrder: initialData?.displayOrder ?? 0,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatar ? getImageUrl(initialData.avatar) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a discussion title");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => {
        fd.append(k, (formData as any)[k]);
      });
      if (avatarFile) {
        fd.append("avatar", avatarFile);
      }

      if (initialData?.id) {
        await dispatch(updateDiscussionThunk({ id: initialData.id, data: fd })).unwrap();
        toast.success("Discussion updated successfully!");
      } else {
        await dispatch(createDiscussionThunk(fd)).unwrap();
        toast.success("New discussion thread created!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save discussion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            {initialData ? "Edit Discussion Thread" : "Create New Discussion"}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Thread Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              placeholder="e.g. Which Flazo earbuds are best for workouts?"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Thread Content / Description</label>
            <textarea
              rows={3}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              placeholder="Describe the issue, question, or vibe..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Author Name *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
                placeholder="Rohit Sharma"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Time Label</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
                placeholder="2h ago, 1d ago"
              />
            </div>
          </div>

          {/* Dynamic Topic & Category Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Topic / Category *</label>
            <select
              value={formData.tag}
              onChange={(e) => {
                const selectedTag = e.target.value;
                const matchedTopic = topics.find((t) => (t.slug || t.topicId) === selectedTag);
                setFormData({
                  ...formData,
                  tag: selectedTag,
                  category: matchedTopic ? matchedTopic.title : formData.category,
                });
              }}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 font-medium cursor-pointer"
            >
              {topics.map((t) => {
                const slugVal = t.slug || t.topicId;
                return (
                  <option key={t.id} value={slugVal}>
                    {t.title} ({slugVal})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Stats: Votes, Comments, Views */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Upvotes</label>
              <input
                type="number"
                value={formData.votes}
                onChange={(e) => setFormData({ ...formData, votes: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Comments</label>
              <input
                type="number"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Views</label>
              <input
                type="text"
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200"
                placeholder="1.2K"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Author Avatar</label>
            <div className="flex items-center gap-3">
              {avatarPreview && (
                <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-neutral-200">
                  <Image src={avatarPreview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAvatarFile(e.target.files[0]);
                    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Checkboxes: Pin & Active */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded text-amber-800"
              />
              <span>Pin to top</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-800"
              />
              <span>Active (Visible on Storefront)</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold hover:shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Thread" : "Publish Thread"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ====================================================================
// MODAL 2: CREATOR FORM
// ====================================================================
function CreatorFormModal({
  isOpen,
  initialData,
  onClose,
}: {
  isOpen: boolean;
  initialData: CommunityCreatorItem | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    handle: initialData?.handle || "",
    role: initialData?.role || "",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(
    initialData?.img ? getImageUrl(initialData.img) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.handle.trim()) {
      toast.error("Please enter a creator handle");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => fd.append(k, (formData as any)[k]));
      if (imgFile) fd.append("img", imgFile);

      if (initialData?.id) {
        await dispatch(updateCreatorThunk({ id: initialData.id, data: fd })).unwrap();
        toast.success("Creator updated successfully!");
      } else {
        await dispatch(createCreatorThunk(fd)).unwrap();
        toast.success("Creator added to spotlight!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save creator");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            {initialData ? "Edit Creator Polaroid" : "Add Featured Creator"}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Handle *</label>
            <input
              type="text"
              required
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:border-amber-600"
              placeholder="@tanya_music"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Role / Passion *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:border-amber-600"
              placeholder="Music Creator, Tech Reviewer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Polaroid Photo</label>
            {imgPreview && (
              <div className="relative w-32 aspect-[4/5] rounded-xl overflow-hidden mb-2 border border-neutral-200">
                <Image src={imgPreview} alt="Preview" fill unoptimized className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImgFile(e.target.files[0]);
                  setImgPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-24 px-3 py-1.5 text-xs rounded-lg border border-neutral-200"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-800"
              />
              <span>Active</span>
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-neutral-600 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Creator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ====================================================================
// MODAL 3: CONTRIBUTOR FORM
// ====================================================================
function ContributorFormModal({
  isOpen,
  initialData,
  onClose,
}: {
  isOpen: boolean;
  initialData: CommunityContributorItem | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    rank: initialData?.rank ?? 1,
    name: initialData?.name || "",
    points: initialData?.points || "1.0K points",
    role: initialData?.role || "Sound Expert",
    badgeClass: initialData?.badgeClass || "bg-amber-100 text-amber-900 font-bold",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatar ? getImageUrl(initialData.avatar) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter contributor name");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => fd.append(k, (formData as any)[k]));
      if (avatarFile) fd.append("avatar", avatarFile);

      if (initialData?.id) {
        await dispatch(updateContributorThunk({ id: initialData.id, data: fd })).unwrap();
        toast.success("Contributor updated!");
      } else {
        await dispatch(createContributorThunk(fd)).unwrap();
        toast.success("Contributor added!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save contributor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            {initialData ? "Edit Contributor" : "Add Top Contributor"}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Rank *</label>
              <input
                type="number"
                required
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Points Display</label>
              <input
                type="text"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
                placeholder="1.2K points"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
              placeholder="Rohit Sharma"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Role / Badge Label</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
              placeholder="Sound Expert, Top Helper"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Avatar Image</label>
            {avatarPreview && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden mb-2 border border-neutral-200">
                <Image src={avatarPreview} alt="Preview" fill unoptimized className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAvatarFile(e.target.files[0]);
                  setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-neutral-600 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Contributor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ====================================================================
// MODAL 4: TOPIC FORM
// ====================================================================
function TopicFormModal({
  isOpen,
  initialData,
  onClose,
}: {
  isOpen: boolean;
  initialData: CommunityTopicItem | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || initialData?.topicId || "",
    desc: initialData?.desc || "",
    iconName: initialData?.iconName || initialData?.icon || "Headphones",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Please enter topic title and slug");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await dispatch(updateTopicThunk({ id: initialData.id, data: formData })).unwrap();
        toast.success("Topic updated!");
      } else {
        await dispatch(createTopicThunk(formData)).unwrap();
        toast.success("Topic created!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            {initialData ? "Edit Category Topic" : "Add Category Topic"}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
              placeholder="Product Help"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Slug / ID *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
              placeholder="help, tips, lifestyle"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Short Description</label>
            <input
              type="text"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200"
              placeholder="Get solutions, Maximize experience"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Icon Name</label>
            <select
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 cursor-pointer"
            >
              <option value="Headphones">Headphones</option>
              <option value="Lightbulb">Lightbulb</option>
              <option value="Music">Music</option>
              <option value="Sliders">Sliders</option>
              <option value="Calendar">Calendar</option>
              <option value="Users">Users</option>
              <option value="Sparkles">Sparkles</option>
            </select>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-neutral-600 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

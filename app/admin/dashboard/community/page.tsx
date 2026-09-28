"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchDiscussionsAdmin,
  fetchCreatorsAdmin,
  fetchContributorsAdmin,
  fetchTopicsAdmin,
  fetchSettingsAdmin,
} from "@/app/lib/store/features/communitySlice";
import {
  CommunityDiscussionItem,
  CommunityCreatorItem,
  CommunityContributorItem,
  CommunityTopicItem,
} from "@/app/sercices/user/community.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import {
  MessagesSquare,
  Users,
  Award,
  Tag,
  Settings as SettingsIcon,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// Modular Community Components
import CommunityKpiBar from "./components/CommunityKpiBar";
import DiscussionsTab from "./components/DiscussionsTab";
import CreatorsTab from "./components/CreatorsTab";
import ContributorsTab from "./components/ContributorsTab";
import TopicsTab from "./components/TopicsTab";
import SettingsTab from "./components/SettingsTab";

// Modular CRUD Modals
import DiscussionModal from "./components/DiscussionModal";
import CreatorModal from "./components/CreatorModal";
import ContributorModal from "./components/ContributorModal";
import TopicModal from "./components/TopicModal";

export default function AdminCommunityDashboardPage() {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();
  const {
    discussions,
    creators,
    contributors,
    topics,
    settings,
    status,
  } = useAppSelector((state) => state.community);

  // Active Tab Navigation
  const [activeTab, setActiveTab] = useState<
    "discussions" | "creators" | "contributors" | "topics" | "settings"
  >("discussions");

  // Modal State Management
  const [discussionModalOpen, setDiscussionModalOpen] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState<CommunityDiscussionItem | null>(null);

  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<CommunityCreatorItem | null>(null);

  const [contributorModalOpen, setContributorModalOpen] = useState(false);
  const [editingContributor, setEditingContributor] = useState<CommunityContributorItem | null>(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<CommunityTopicItem | null>(null);

  // Initial & Manual Data Refresh
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

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        isDark ? "bg-black text-zinc-100" : "bg-[#FDFCFB] text-neutral-900"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP CONTROLS
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`border-b sticky top-0 z-30 shadow-xs transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200/80"
        }`}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-800/20">
                  <MessagesSquare className="w-5 h-5" />
                </div>
                <div>
                  <h1
                    className={`text-xl sm:text-2xl font-serif font-black tracking-tight ${
                      isDark ? "text-white" : "text-neutral-950"
                    }`}
                  >
                    Community Studio Control
                  </h1>
                  <p
                    className={`text-xs font-medium ${
                      isDark ? "text-zinc-400" : "text-neutral-500"
                    }`}
                  >
                    100% Dynamic control center for Flazo Community discussions, creators, leaderboard, and branding.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={reloadAll}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                    : "text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                }`}
                title="Reload community data"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${status === "loading" ? "animate-spin" : ""}`}
                />
                <span>Sync</span>
              </button>

              <Link
                href="/community"
                target="_blank"
                className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs ${
                  isDark
                    ? "text-amber-400 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50"
                    : "text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <span>Live View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* KPI Mini-Bar Component */}
          <CommunityKpiBar kpiStats={kpiStats} settings={settings} isDark={isDark} />

          {/* Navigation Tabs */}
          <div
            className={`flex items-center gap-2 overflow-x-auto scrollbar-none mt-5 pt-2 border-t ${
              isDark ? "border-zinc-800" : "border-neutral-100"
            }`}
          >
            <button
              onClick={() => setActiveTab("discussions")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "discussions"
                  ? isDark
                    ? "bg-amber-500 text-neutral-950 font-black shadow-sm"
                    : "bg-neutral-900 text-white shadow-sm"
                  : isDark
                  ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
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
                  ? isDark
                    ? "bg-amber-500 text-neutral-950 font-black shadow-sm"
                    : "bg-neutral-900 text-white shadow-sm"
                  : isDark
                  ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
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
                  ? isDark
                    ? "bg-amber-500 text-neutral-950 font-black shadow-sm"
                    : "bg-neutral-900 text-white shadow-sm"
                  : isDark
                  ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
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
                  ? isDark
                    ? "bg-amber-500 text-neutral-950 font-black shadow-sm"
                    : "bg-neutral-900 text-white shadow-sm"
                  : isDark
                  ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
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
                  ? isDark
                    ? "bg-amber-500 text-neutral-950 font-black shadow-sm"
                    : "bg-neutral-900 text-white shadow-sm"
                  : isDark
                  ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
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
        {activeTab === "discussions" && (
          <DiscussionsTab
            discussions={discussions}
            topics={topics}
            onOpenCreate={() => {
              setEditingDiscussion(null);
              setDiscussionModalOpen(true);
            }}
            onOpenEdit={(item) => {
              setEditingDiscussion(item);
              setDiscussionModalOpen(true);
            }}
          />
        )}

        {activeTab === "creators" && (
          <CreatorsTab
            creators={creators}
            onOpenCreate={() => {
              setEditingCreator(null);
              setCreatorModalOpen(true);
            }}
            onOpenEdit={(item) => {
              setEditingCreator(item);
              setCreatorModalOpen(true);
            }}
          />
        )}

        {activeTab === "contributors" && (
          <ContributorsTab
            contributors={contributors}
            onOpenCreate={() => {
              setEditingContributor(null);
              setContributorModalOpen(true);
            }}
            onOpenEdit={(item) => {
              setEditingContributor(item);
              setContributorModalOpen(true);
            }}
          />
        )}

        {activeTab === "topics" && (
          <TopicsTab
            topics={topics}
            onOpenCreate={() => {
              setEditingTopic(null);
              setTopicModalOpen(true);
            }}
            onOpenEdit={(item) => {
              setEditingTopic(item);
              setTopicModalOpen(true);
            }}
          />
        )}

        {activeTab === "settings" && <SettingsTab settings={settings} />}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CRUD MODALS
         ───────────────────────────────────────────────────────────── */}
      {discussionModalOpen && (
        <DiscussionModal
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
        <CreatorModal
          isOpen={creatorModalOpen}
          initialData={editingCreator}
          onClose={() => {
            setCreatorModalOpen(false);
            setEditingCreator(null);
          }}
        />
      )}

      {contributorModalOpen && (
        <ContributorModal
          isOpen={contributorModalOpen}
          initialData={editingContributor}
          onClose={() => {
            setContributorModalOpen(false);
            setEditingContributor(null);
          }}
        />
      )}

      {topicModalOpen && (
        <TopicModal
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

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Play,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Eye,
  Headphones,
  Lightbulb,
  Music,
  Sliders,
  Calendar,
  Users,
  ArrowRight,
  ChevronRight,
  Award,
  Star,
  CheckCircle2,
  X,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchCommunityPageData,
  voteDiscussionThunk,
} from "@/app/lib/store/features/communitySlice";
import { getImageUrl } from "@/app/utils/getImageUrl";

const ICON_MAP: Record<string, any> = {
  Headphones,
  Lightbulb,
  Music,
  Sliders,
  Calendar,
  Users,
  Sparkles,
};

export default function FlazoCommunityPage() {
  const dispatch = useAppDispatch();
  const { pageData, status } = useAppSelector((state) => state.community);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState<boolean>(false);
  const [ideaInput, setIdeaInput] = useState<string>("");
  const [joinEmail, setJoinEmail] = useState<string>("");

  useEffect(() => {
    dispatch(fetchCommunityPageData());
  }, [dispatch]);

  // Dynamic Data from Backend Redux
  const settings = pageData?.settings;
  const discussions = pageData?.discussions || [];
  const creators = pageData?.creators || [];
  const contributors = pageData?.contributors || [];
  const topics = pageData?.topics || [];

  // Filter discussions by active category
  const filteredDiscussions =
    selectedCategory === "all"
      ? discussions
      : discussions.filter(
          (d) =>
            d.tag?.toLowerCase() === selectedCategory.toLowerCase() ||
            d.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Upvote Handler
  const handleVote = (id: number, delta: number) => {
    const isUpvoted = upvotedIds.has(id);
    if (delta > 0 && !isUpvoted) {
      setUpvotedIds((s) => new Set(s).add(id));
      dispatch(voteDiscussionThunk({ id, delta: 1 }));
      toast.success("Upvoted discussion!");
    } else if (delta < 0 && isUpvoted) {
      setUpvotedIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      dispatch(voteDiscussionThunk({ id, delta: -1 }));
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinEmail) {
      toast.success("Welcome to Flazo Community! Verification link sent.");
      setIsJoinModalOpen(false);
      setJoinEmail("");
    }
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ideaInput.trim()) {
      toast.success("Thank you for shaping the next sound of Flazo!");
      setIsIdeaModalOpen(false);
      setIdeaInput("");
    }
  };

  const heroImageSrc = settings?.heroImage
    ? getImageUrl(settings.heroImage)
    : "/images/flazo_community_hero_hq.jpg";

  // Dynamic Pillars
  const pillars = (settings?.pillarsText || "MUSIC,PEOPLE,IDEAS,IMPACT")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const displayMembersCount =
    settings?.heroMembersCount || settings?.membersCount || "25K+";
  const displayDiscussionsCount =
    settings?.heroDiscussionsCount || settings?.discussionsCount || "10K+";
  const displayAnswersCount =
    settings?.heroAnswersCount || settings?.answersCount || "50K+";
  const displayExpertsCount =
    settings?.heroExpertsCount || settings?.expertsCount || "100+";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 selection:bg-amber-200 selection:text-neutral-950">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: 100% DYNAMIC HEADLINE, SUBTITLE & VISUAL
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 border-b border-[#E8DFC8]/70">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 relative z-10">
              
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#9E6B20] uppercase">
                <span>{settings?.heroTag || "// FLAZO COMMUNITY"}</span>
              </div>

              {/* Main Headline */}
              <div className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-neutral-950 leading-[1.08] tracking-tight whitespace-pre-line">
                  {settings?.heroHeadline || settings?.heroTitle || (
                    <>
                      Not Just Listeners. <br />
                      <span className="font-serif italic font-normal text-[#C99726]">A Community</span> <br />
                      That Feels.
                    </>
                  )}
                </h1>

                {/* Floating Handwritten Style Script */}
                {settings?.heroQuoteAuthor && (
                  <div className="absolute right-0 -bottom-4 hidden sm:block pointer-events-none select-none text-right">
                    <span className="font-serif italic text-base sm:text-lg text-neutral-600 font-medium">
                      {settings.heroQuoteAuthor}
                    </span>
                    <div className="w-16 h-1 bg-[#C99726] rounded-full ml-auto mt-0.5" />
                  </div>
                )}
              </div>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed font-normal whitespace-pre-line">
                {settings?.heroSubtitle ||
                  "Connect. Share. Learn. Create. Grow. \nBecause better sound brings better people together."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8C5F19] via-[#A87422] to-[#C99726] hover:from-[#7A5013] hover:to-[#B8860B] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>{settings?.joinButtonText || "Join the Community"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (settings?.watchStoryUrl) {
                      window.open(settings.watchStoryUrl, "_blank");
                    } else {
                      toast.info("Playing: The Flazo Community Story");
                    }
                  }}
                  className="px-6 py-3.5 rounded-full bg-white border border-[#E0D3C1] text-neutral-800 hover:text-neutral-950 font-bold text-sm shadow-xs hover:bg-[#F8F3EB] transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[#8C5F19]">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </div>
                  <span>{settings?.watchStoryText || "Watch Our Story"}</span>
                </button>
              </div>

              {/* Dynamic Trust & Engagement Stats Pill */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E8DFC8]/60">
                {/* Dynamic Avatar Stack from real contributors */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {contributors.slice(0, 4).map((member, i) => (
                      <div
                        key={member.id || i}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-xs bg-neutral-200"
                      >
                        {member.avatar ? (
                          <Image
                            src={getImageUrl(member.avatar)}
                            alt={member.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-900 bg-amber-100">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-mono font-black text-neutral-950 block">
                      {displayMembersCount}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium">Members & Growing</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-[#E8DFC8]" />

                {/* Real Conversations Badge */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-[#9E6B20]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-neutral-950 block">Real People</span>
                    <span className="text-[11px] text-neutral-500 font-medium">Real Conversations</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-amber-200/80 bg-neutral-900 group">
                <Image
                  src={heroImageSrc}
                  alt="Flazo Community"
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                  priority
                  unoptimized
                />

                {/* Dynamic Architectural Pillars Watermark */}
                <div className="absolute top-6 right-6 text-right space-y-0.5 select-none pointer-events-none drop-shadow-md">
                  {pillars.map((pillar) => (
                    <p key={pillar} className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase">
                      {pillar}
                    </p>
                  ))}
                </div>

                {/* Dynamic Quote Overlay */}
                <div className="absolute bottom-6 right-6 text-right select-none pointer-events-none">
                  <span className="font-serif italic text-lg sm:text-xl text-amber-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-semibold block">
                    {settings?.heroQuote || settings?.memberQuote || "Together for a Brighter India"}
                  </span>
                  <div className="w-14 h-0.5 bg-amber-400 rounded-full ml-auto mt-1" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. DYNAMIC CATEGORY PILL FILTER BAR
         ───────────────────────────────────────────────────────────── */}
      {topics.length > 0 && (
        <section className="py-6 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                selectedCategory === "all"
                  ? "bg-[#8C5F19] text-white shadow-md shadow-amber-900/20"
                  : "bg-white text-neutral-700 hover:bg-[#F3EDE2] border border-[#E8DFC8]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Discussions</span>
            </button>

            {topics.map((cat) => {
              const Icon = (cat.icon && ICON_MAP[cat.icon]) || (cat.iconName && ICON_MAP[cat.iconName]) || Headphones;
              const topicKey = cat.slug || cat.topicId;
              const isActive = selectedCategory === topicKey;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(topicKey)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-[#8C5F19] text-white shadow-md shadow-amber-900/20"
                      : "bg-white text-neutral-700 hover:bg-[#F3EDE2] border border-[#E8DFC8]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#9E6B20]" />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. "WHAT'S HAPPENING IN THE COMMUNITY?" & SIDEBAR GRID
         ───────────────────────────────────────────────────────────── */}
      <section className="py-6 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT (Col 8): Community Discussions List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Header with Title and "Explore All" */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]/70">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-950 tracking-tight">
                What&apos;s Happening in the Community?
              </h2>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-[#8C5F19] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Discussions List */}
            <div className="space-y-3">
              {filteredDiscussions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#E8DFC8] text-neutral-400">
                  <MessageSquare className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                  <p className="text-sm font-medium">No discussions found under this topic.</p>
                </div>
              ) : (
                filteredDiscussions.map((item) => {
                  const isUpvoted = upvotedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] hover:border-[#C99726] shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
                    >
                      {/* Upvote Counter */}
                      <div className="flex flex-col items-center bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E8DFC8]/60 shrink-0">
                        <button
                          onClick={() => handleVote(item.id, 1)}
                          className={`p-1 rounded-md hover:bg-white transition cursor-pointer ${
                            isUpvoted ? "text-[#8C5F19]" : "text-neutral-500 hover:text-neutral-900"
                          }`}
                          title="Upvote"
                        >
                          <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <span className={`text-xs font-mono font-bold my-0.5 ${isUpvoted ? "text-[#8C5F19]" : "text-neutral-800"}`}>
                          {item.votes}
                        </span>
                        <button
                          onClick={() => handleVote(item.id, -1)}
                          className="p-1 rounded-md hover:bg-white text-neutral-400 hover:text-neutral-900 transition cursor-pointer"
                          title="Downvote"
                        >
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Author Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-neutral-200 mt-0.5 bg-neutral-100">
                        {item.avatar || item.authorAvatar ? (
                          <Image
                            src={getImageUrl(item.avatar || item.authorAvatar)}
                            alt={item.author}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-amber-900 text-xs">
                            {item.author.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Main Thread Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <h3
                          onClick={() => toast.info(`Viewing discussion: ${item.title}`)}
                          className="text-sm sm:text-base font-serif font-black text-neutral-950 group-hover:text-[#8C5F19] transition-colors leading-snug cursor-pointer"
                        >
                          {item.title}
                        </h3>

                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>

                        {/* Thread Meta & Tag */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-500 font-medium">
                          <span>By <strong className="text-neutral-800 font-bold">{item.author}</strong></span>
                          <span>•</span>
                          <span>{item.time || "Recently"}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF4E8] text-[#8C5F19] font-bold border border-[#E8DFC8]">
                            {item.category || item.tag}
                          </span>
                        </div>
                      </div>

                      {/* Engagement Stats */}
                      <div className="flex items-center gap-4 text-xs text-neutral-400 shrink-0 self-center hidden sm:flex">
                        <span className="flex items-center gap-1 hover:text-neutral-700 transition">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {item.comments}
                        </span>
                        <span className="flex items-center gap-1 hover:text-neutral-700 transition">
                          <Eye className="w-3.5 h-3.5" />
                          {item.views}
                        </span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT (Col 4): Community Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: "Be Part of Something Bigger" */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#1C150B] via-[#2A1D0E] to-[#140E07] text-white border border-amber-900/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                  Be Part of <br />
                  Something Bigger
                </h3>

                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  Share your story, get expert advice, help others and shape what&apos;s next with Flazo.
                </p>

                {/* Sub-Card: Dynamic Members Count Box */}
                <div className="p-4 rounded-2xl bg-white text-neutral-900 border border-neutral-100 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-mono font-black text-neutral-950 block">
                      {displayMembersCount}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold block">Members</span>
                  </div>

                  <div className="flex -space-x-2">
                    {contributors.slice(0, 3).map((m, i) => (
                      <div
                        key={m.id || i}
                        className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative shadow-xs bg-neutral-200"
                      >
                        {m.avatar ? (
                          <Image src={getImageUrl(m.avatar)} alt={m.name} fill unoptimized className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-amber-900 text-[10px]">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-amber-200/80 leading-normal font-medium">
                  From Students to Creators to Professionals. One Community.
                </p>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#9E6B20] via-[#B8860B] to-[#D4A017] hover:from-[#8A5B17] hover:to-[#B8860B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{settings?.joinButtonText || "Join Now"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Card 2: Dynamic "Top Contributors" Leaderboard */}
            <div className="rounded-3xl p-6 bg-white border border-[#E8DFC8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h4 className="text-base font-serif font-black text-neutral-950">
                  Top Contributors
                </h4>
                <button
                  onClick={() => toast.info("Showing leaderboard of top contributors")}
                  className="text-xs font-bold text-[#8C5F19] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Contributors List */}
              <div className="space-y-3">
                {contributors.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7F2] transition cursor-pointer group"
                    onClick={() => toast.info(`Viewing profile: ${user.name}`)}
                  >
                    {/* Rank Circle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        user.badgeClass || "bg-amber-100 text-amber-900 font-bold"
                      }`}
                    >
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 border border-neutral-200 bg-neutral-100">
                      {user.avatar ? (
                        <Image
                          src={getImageUrl(user.avatar)}
                          alt={user.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-900">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-neutral-900 group-hover:text-[#8C5F19] transition truncate">
                        {user.name}
                      </h5>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {user.points}
                      </span>
                    </div>

                    {/* Role Badge */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{user.role}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. DYNAMIC "EXPLORE BY TOPIC" SECTION
         ───────────────────────────────────────────────────────────── */}
      {topics.length > 0 && (
        <section className="py-10 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E8DFC8]/70">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-950 tracking-tight">
              Explore by Topic
            </h2>
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-bold text-[#8C5F19] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {topics.map((topic) => {
              const Icon = (topic.icon && ICON_MAP[topic.icon]) || (topic.iconName && ICON_MAP[topic.iconName]) || Headphones;
              const topicKey = topic.slug || topic.topicId;
              const isSelected = selectedCategory === topicKey;
              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    setSelectedCategory(topicKey);
                    toast.info(`Filtered: ${topic.title}`);
                  }}
                  className={`p-4 rounded-2xl transition-all cursor-pointer border flex flex-col justify-between group shadow-xs ${
                    isSelected
                      ? "bg-[#8C5F19] text-white border-[#8C5F19] shadow-md scale-102"
                      : "bg-white hover:bg-[#FAF7F2] text-neutral-900 border-[#E8DFC8] hover:border-[#C99726]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#FAF4E8] text-[#8C5F19] border border-[#E8DFC8]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className={`text-xs font-serif font-bold ${isSelected ? "text-white" : "text-neutral-950"}`}>
                      {topic.title}
                    </h4>
                    <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? "text-amber-200" : "text-neutral-500"}`}>
                      {topic.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. DYNAMIC CREATOR SPOTLIGHT BANNER
         ───────────────────────────────────────────────────────────── */}
      {creators.length > 0 && (
        <section className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141009] via-[#22180D] to-[#120E08] text-white p-6 sm:p-10 lg:p-12 border border-amber-900/40 shadow-2xl">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Content */}
              <div className="lg:col-span-4 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Creator Spotlight</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
                  Real People. <br />
                  Real Stories.
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  Meet the creators, artists, students and professionals who bring the Flazo community to life.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => toast.info("Opening all Flazo creator stories")}
                    className="px-6 py-2.5 rounded-full border border-amber-400/60 text-amber-300 hover:bg-amber-400 hover:text-neutral-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Creator Stories</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Creator Cards & Signature Script */}
              <div className="lg:col-span-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Dynamic Polaroids */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
                  {creators.map((creator, i) => (
                    <div
                      key={creator.id}
                      className={`relative rounded-2xl overflow-hidden aspect-[3/4] border border-amber-400/40 shadow-xl group cursor-pointer transition-transform duration-300 hover:scale-105 hover:-translate-y-1 ${
                        i % 2 === 0 ? "-rotate-1" : "rotate-1"
                      }`}
                      onClick={() => toast.info(`Viewing spotlight: ${creator.handle}`)}
                    >
                      <Image
                        src={getImageUrl(creator.img)}
                        alt={creator.handle}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                      
                      {/* Bottom Handle & Role */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                        <p className="text-xs font-mono font-bold text-white truncate drop-shadow-sm">
                          {creator.handle}
                        </p>
                        <p className="text-[10px] text-amber-300 font-medium truncate">
                          {creator.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Far Right Script */}
                {settings?.heroQuoteAuthor && (
                  <div className="text-center md:text-right select-none shrink-0 hidden xl:block">
                    <span className="font-serif italic text-base sm:text-lg text-amber-300/90 font-medium block leading-tight">
                      {settings.heroQuoteAuthor}
                    </span>
                    <div className="w-12 h-0.5 bg-amber-400 rounded-full ml-auto mt-1" />
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. DYNAMIC THREE BOTTOM CARDS STRIP
         ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1 (Col 4): Dynamic Idea Submission Card */}
          <div className="lg:col-span-4 rounded-3xl p-6 bg-[#FDFBF7] border border-[#E8DFC8] shadow-xs flex items-center gap-4 hover:shadow-md transition">
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative shrink-0">
              <Image
                src="/images/newsletter_flazo_earbud.png"
                alt="Flazo Earbuds"
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-serif font-black text-neutral-950 leading-snug">
                {settings?.ideaCardTitle || "Your Ideas Shape the Next Sound"}
              </h4>
              <p className="text-[11px] text-neutral-600 leading-normal">
                {settings?.ideaCardSubtitle ||
                  "Share feedback, suggest features, and be a part of what we build next."}
              </p>
              <button
                onClick={() => setIsIdeaModalOpen(true)}
                className="mt-1 px-4 py-1.5 rounded-full bg-[#8C5F19] hover:bg-[#7A5013] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{settings?.ideaCardButtonText || "Share Your Idea"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2 (Col 5): Dynamic 4 Stats & Member Quote */}
          <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
            {/* 4 Stats */}
            <div className="grid grid-cols-4 gap-2 text-center pb-3 border-b border-neutral-100">
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">
                  {displayMembersCount}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Members</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">
                  {displayDiscussionsCount}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Discussions</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">
                  {displayAnswersCount}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Answers</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">
                  {displayExpertsCount}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Verified Experts</span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xs text-neutral-600 italic leading-relaxed text-center">
              &ldquo;{settings?.heroQuote || settings?.memberQuote || "Flazo community feels like a family. It's amazing to see real people talking, helping and vibing over something we all love — music."}&rdquo;
              <span className="block mt-1 font-sans not-italic text-[11px] font-bold text-neutral-800">
                — {settings?.heroQuoteAuthor || settings?.quoteAuthor || "Neha P., Community Member"}
              </span>
            </blockquote>
          </div>

          {/* Card 3 (Col 3): Dynamic Mission Card */}
          <div className="lg:col-span-3 rounded-3xl p-6 bg-[#FDFBF7] border border-[#E8DFC8] shadow-xs flex items-center justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-serif font-black text-neutral-950 leading-snug">
                {settings?.missionCardTitle || "A Stronger Community. A Brighter India."}
              </h4>
              <p className="text-[11px] text-neutral-600 leading-normal">
                {settings?.missionCardSubtitle || "Sound that empowers the creators of tomorrow."}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C5F19]">
                <Award className="w-3.5 h-3.5" />
                <span>{settings?.missionCardBadge || "Made for Sound"}</span>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#9E6B20]">
              <Sparkles className="w-8 h-8 stroke-1" />
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: JOIN COMMUNITY
         ───────────────────────────────────────────────────────────── */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#8C5F19] flex items-center justify-center border border-[#E8DFC8]">
                <Users className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-black text-neutral-950">Join Flazo Community</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Connect with audio lovers, unlock early access to drops, and get verified member perks.
                </p>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8C5F19] to-[#C99726] hover:from-[#7A5013] hover:to-[#B8860B] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Join with 1-Click
                </button>
              </form>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam. Leave anytime.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: SHARE YOUR IDEA
         ───────────────────────────────────────────────────────────── */}
      {isIdeaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setIsIdeaModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#8C5F19] flex items-center justify-center border border-[#E8DFC8]">
                <Lightbulb className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-black text-neutral-950">Share Your Idea</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Have a suggestion for sound tuning, earbuds design, or community meetups?
                </p>
              </div>

              <form onSubmit={handleIdeaSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Your Feature / Idea</label>
                  <textarea
                    rows={4}
                    required
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    placeholder="Tell us what you'd love to see in next Flazo product..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-amber-600 bg-neutral-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8C5F19] to-[#C99726] hover:from-[#7A5013] hover:to-[#B8860B] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit to Flazo Sound Labs
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

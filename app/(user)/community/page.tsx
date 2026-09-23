"use client";

import React, { useState } from "react";
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

interface Discussion {
  id: number;
  title: string;
  desc: string;
  author: string;
  time: string;
  category: string;
  tag: string;
  votes: number;
  comments: number;
  views: string;
  avatar: string;
}

const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    title: "Which Flazo earbuds are best for workouts?",
    desc: "I'm looking for something comfortable, durable and with good bass. Any suggestions from your experience?",
    author: "Rohit Sharma",
    time: "2h ago",
    category: "Product Help",
    tag: "help",
    votes: 286,
    comments: 42,
    views: "1.3K",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    title: "Tips to get the best battery life out of your Flazo earbuds",
    desc: "Here are some simple tips that have worked for me. Feel free to add more!",
    author: "Sneha Verma",
    time: "5h ago",
    category: "Tips & Tricks",
    tag: "tips",
    votes: 194,
    comments: 28,
    views: "980",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    title: "Flazo Nirvana Gold Pro X vs Flazo Air — Which one to choose?",
    desc: "Comparing sound quality, ANC, battery and comfort. Let's discuss!",
    author: "Arjun Mehta",
    time: "1d ago",
    category: "General",
    tag: "lifestyle",
    votes: 152,
    comments: 37,
    views: "2.4K",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    title: "Share your Flazo setup! 🎧",
    desc: "Post your photos and tell us how you use your Flazo in your daily life.",
    author: "Karan Patel",
    time: "1d ago",
    category: "Lifestyle",
    tag: "lifestyle",
    votes: 97,
    comments: 64,
    views: "1.8K",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 5,
    title: "Feature Request: Multi-device pairing",
    desc: "It would be amazing to have seamless switching between laptop and phone!",
    author: "Aditi Singh",
    time: "3d ago",
    category: "Feature Request",
    tag: "requests",
    votes: 89,
    comments: 21,
    views: "760",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
];

const TOP_CONTRIBUTORS = [
  {
    rank: 1,
    name: "Rohit Sharma",
    points: "1.2K points",
    role: "Sound Expert",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    badgeClass: "bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-black",
  },
  {
    rank: 2,
    name: "Sneha Verma",
    points: "980 points",
    role: "Top Helper",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    badgeClass: "bg-neutral-300 text-neutral-800 font-bold",
  },
  {
    rank: 3,
    name: "Arjun Mehta",
    points: "870 points",
    role: "Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    badgeClass: "bg-amber-700/60 text-white font-bold",
  },
  {
    rank: 4,
    name: "Karan Patel",
    points: "650 points",
    role: "Community Star",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    badgeClass: "text-neutral-500 font-mono font-bold",
  },
  {
    rank: 5,
    name: "Aditi Singh",
    points: "520 points",
    role: "Creative Listener",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    badgeClass: "text-neutral-500 font-mono font-bold",
  },
];

const TOPIC_CARDS = [
  {
    id: "help",
    title: "Product Help",
    desc: "Get solutions",
    icon: Headphones,
  },
  {
    id: "tips",
    title: "Tips & Tricks",
    desc: "Maximize your experience",
    icon: Lightbulb,
  },
  {
    id: "lifestyle",
    title: "Music & Lifestyle",
    desc: "Vibe that fits you",
    icon: Music,
  },
  {
    id: "requests",
    title: "Feature Requests",
    desc: "Help us improve",
    icon: Sliders,
  },
  {
    id: "events",
    title: "Events",
    desc: "Offline & online",
    icon: Calendar,
  },
  {
    id: "creators",
    title: "Creators",
    desc: "Talk, collaborate, grow",
    icon: Users,
  },
];

const CREATORS = [
  {
    handle: "@tanya_music",
    role: "Music Creator",
    img: "/images/community_ambassador_creator.jpg",
  },
  {
    handle: "@rohit_audio",
    role: "Tech Reviewer",
    img: "/images/community_ambassador_dj.jpg",
  },
  {
    handle: "@kabir_explorer",
    role: "Explorer",
    img: "/images/community_ambassador_fitness.jpg",
  },
  {
    handle: "@priya_art",
    role: "Digital Artist",
    img: "/images/community_ambassador_gamer.jpg",
  },
];

export default function FlazoCommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState<boolean>(false);
  const [ideaInput, setIdeaInput] = useState<string>("");
  const [joinEmail, setJoinEmail] = useState<string>("");

  // Upvote Handler
  const handleVote = (id: number, delta: number) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const isUpvoted = upvotedIds.has(id);
          if (delta > 0 && !isUpvoted) {
            setUpvotedIds((s) => new Set(s).add(id));
            toast.success("Upvoted discussion!");
            return { ...d, votes: d.votes + 1 };
          } else if (delta < 0 && isUpvoted) {
            setUpvotedIds((s) => {
              const next = new Set(s);
              next.delete(id);
              return next;
            });
            return { ...d, votes: d.votes - 1 };
          }
        }
        return d;
      })
    );
  };

  // Filter discussions by active category
  const filteredDiscussions =
    selectedCategory === "all"
      ? discussions
      : discussions.filter((d) => d.tag === selectedCategory);

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 selection:bg-amber-200 selection:text-neutral-950">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: "NOT JUST LISTENERS. A COMMUNITY THAT FEELS."
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
                <span>// FLAZO COMMUNITY</span>
              </div>

              {/* Main Headline */}
              <div className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-neutral-950 leading-[1.08] tracking-tight">
                  Not Just Listeners. <br />
                  <span className="font-serif italic font-normal text-[#C99726]">A Community</span> <br />
                  That Feels.
                </h1>

                {/* Floating Handwritten Style Script */}
                <div className="absolute right-0 -bottom-4 hidden sm:block pointer-events-none select-none text-right">
                  <span className="font-serif italic text-base sm:text-lg text-neutral-600 font-medium">
                    Good People <br />
                    <span className="text-[#9E6B20] font-bold">Better Sound.</span>
                  </span>
                  <div className="w-16 h-1 bg-[#C99726] rounded-full ml-auto mt-0.5" />
                </div>
              </div>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed font-normal">
                Connect. Share. Learn. Create. Grow. <br />
                Because better sound brings better people together.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8C5F19] via-[#A87422] to-[#C99726] hover:from-[#7A5013] hover:to-[#B8860B] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Join the Community</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toast.info("Playing: The Flazo Community Story (2026)")}
                  className="px-6 py-3.5 rounded-full bg-white border border-[#E0D3C1] text-neutral-800 hover:text-neutral-950 font-bold text-sm shadow-xs hover:bg-[#F8F3EB] transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[#8C5F19]">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </div>
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Trust & Engagement Stats Pill */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E8DFC8]/60">
                {/* Avatar Stack */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Member" fill unoptimized className="object-cover" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Member" fill unoptimized className="object-cover" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80" alt="Member" fill unoptimized className="object-cover" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Member" fill unoptimized className="object-cover" />
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-mono font-black text-neutral-950 block">25K+</span>
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

            {/* Right Hero Visual Column (Sunlit Balcony, Friends & Flazo Earbuds) */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-amber-200/80 bg-neutral-900 group">
                <Image
                  src="/images/flazo_community_hero_hq.jpg"
                  alt="Flazo Community: Friends enjoying music on terrace"
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                  priority
                />

                {/* Floating Architectural Pillars Watermark */}
                <div className="absolute top-6 right-6 text-right space-y-0.5 select-none pointer-events-none drop-shadow-md">
                  <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase">MUSIC</p>
                  <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase">PEOPLE</p>
                  <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase">IDEAS</p>
                  <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase">IMPACT</p>
                </div>

                {/* Neon Script Overlay on Top Right */}
                <div className="absolute bottom-6 right-6 text-right select-none pointer-events-none">
                  <span className="font-serif italic text-lg sm:text-xl text-amber-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-semibold block">
                    Together for a <br />
                    <span className="text-[#F5C451]">Brighter India</span>
                  </span>
                  <div className="w-14 h-0.5 bg-amber-400 rounded-full ml-auto mt-1" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CATEGORY PILL FILTER BAR
         ───────────────────────────────────────────────────────────── */}
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

          {TOPIC_CARDS.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
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
              {filteredDiscussions.map((item) => {
                const isUpvoted = upvotedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] hover:border-[#C99726] shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
                  >
                    {/* Reddit/boAt Style Upvote Counter */}
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
                    <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-neutral-200 mt-0.5">
                      <Image src={item.avatar} alt={item.author} fill unoptimized className="object-cover" />
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
                        <span>{item.time}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF4E8] text-[#8C5F19] font-bold border border-[#E8DFC8]">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Engagement Stats (Right Side) */}
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
              })}
            </div>

          </div>

          {/* RIGHT (Col 4): Community Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: "Be Part of Something Bigger" */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#1C150B] via-[#2A1D0E] to-[#140E07] text-white border border-amber-900/40 shadow-xl relative overflow-hidden">
              
              {/* Subtle Golden Ambient Light */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                  Be Part of <br />
                  Something Bigger
                </h3>

                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  Share your story, get expert advice, help others and shape what&apos;s next with Flazo.
                </p>

                {/* Sub-Card: 25K+ Members Box */}
                <div className="p-4 rounded-2xl bg-white text-neutral-900 border border-neutral-100 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-mono font-black text-neutral-950 block">25K+</span>
                    <span className="text-xs text-neutral-500 font-bold block">Members</span>
                  </div>

                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=70&q=80" alt="M" fill unoptimized className="object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=70&q=80" alt="M" fill unoptimized className="object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                      <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=70&q=80" alt="M" fill unoptimized className="object-cover" />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-amber-200/80 leading-normal font-medium">
                  From Students to Creators to Professionals. One Community.
                </p>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#9E6B20] via-[#B8860B] to-[#D4A017] hover:from-[#8A5B17] hover:to-[#B8860B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Join Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Card 2: "Top Contributors" */}
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
                {TOP_CONTRIBUTORS.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7F2] transition cursor-pointer group"
                    onClick={() => toast.info(`Viewing profile: ${user.name}`)}
                  >
                    {/* Rank Circle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${user.badgeClass}`}
                    >
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 border border-neutral-200">
                      <Image src={user.avatar} alt={user.name} fill unoptimized className="object-cover" />
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
          4. "EXPLORE BY TOPIC" SECTION
         ───────────────────────────────────────────────────────────── */}
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

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {TOPIC_CARDS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedCategory === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => {
                  setSelectedCategory(topic.id);
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

      {/* ─────────────────────────────────────────────────────────────
          5. CREATOR SPOTLIGHT BANNER: "REAL PEOPLE. REAL STORIES."
         ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141009] via-[#22180D] to-[#120E08] text-white p-6 sm:p-10 lg:p-12 border border-amber-900/40 shadow-2xl">
          
          {/* Subtle Ambient Glow */}
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
              
              {/* 4 Angled Polaroids */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
                {CREATORS.map((creator, i) => (
                  <div
                    key={creator.handle}
                    className={`relative rounded-2xl overflow-hidden aspect-[3/4] border border-amber-400/40 shadow-xl group cursor-pointer transition-transform duration-300 hover:scale-105 hover:-translate-y-1 ${
                      i % 2 === 0 ? "-rotate-1" : "rotate-1"
                    }`}
                    onClick={() => toast.info(`Viewing spotlight: ${creator.handle}`)}
                  >
                    <Image
                      src={creator.img}
                      alt={creator.handle}
                      fill
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

              {/* Far Right Script: "Different People Same Vibration" */}
              <div className="text-center md:text-right select-none shrink-0 hidden xl:block">
                <span className="font-serif italic text-base sm:text-lg text-amber-300/90 font-medium block leading-tight">
                  Different <br />
                  People <br />
                  <span className="text-[#F5C451] font-bold">Same Vibration.</span>
                </span>
                <div className="w-12 h-0.5 bg-amber-400 rounded-full ml-auto mt-1" />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. THREE BOTTOM CARDS STRIP
         ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1 (Col 4): "Your Ideas Shape the Next Sound" */}
          <div className="lg:col-span-4 rounded-3xl p-6 bg-[#FDFBF7] border border-[#E8DFC8] shadow-xs flex items-center gap-4 hover:shadow-md transition">
            {/* Earbud Case Graphic */}
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
                Your Ideas <br />
                <span className="text-[#8C5F19]">Shape the Next Sound</span>
              </h4>
              <p className="text-[11px] text-neutral-600 leading-normal">
                Share feedback, suggest features, and be a part of what we build next.
              </p>
              <button
                onClick={() => setIsIdeaModalOpen(true)}
                className="mt-1 px-4 py-1.5 rounded-full bg-[#8C5F19] hover:bg-[#7A5013] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Share Your Idea</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2 (Col 5): 4 Stats & Member Quote */}
          <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
            {/* 4 Stats */}
            <div className="grid grid-cols-4 gap-2 text-center pb-3 border-b border-neutral-100">
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">25K+</span>
                <span className="text-[10px] text-neutral-500 font-medium">Members</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">10K+</span>
                <span className="text-[10px] text-neutral-500 font-medium">Discussions</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">500+</span>
                <span className="text-[10px] text-neutral-500 font-medium">Expert Answers</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-mono font-black text-neutral-950 block">50+</span>
                <span className="text-[10px] text-neutral-500 font-medium">Verified Experts</span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xs text-neutral-600 italic leading-relaxed text-center">
              &ldquo;Flazo community feels like a family. It&apos;s amazing to see real people talking, helping and vibing over something we all love — music.&rdquo;
              <span className="block mt-1 font-sans not-italic text-[11px] font-bold text-neutral-800">
                — Neha P., Community Member
              </span>
            </blockquote>
          </div>

          {/* Card 3 (Col 3): "A Stronger Community for a Brighter India" */}
          <div className="lg:col-span-3 rounded-3xl p-6 bg-[#FDFBF7] border border-[#E8DFC8] shadow-xs flex items-center justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-serif font-black text-neutral-950 leading-snug">
                A Stronger <br />
                Community for a <br />
                <span className="text-[#8C5F19]">Brighter India</span>
              </h4>
            </div>

            <button
              onClick={() => toast.info("Exploring nationwide Flazo community chapters")}
              className="w-10 h-10 rounded-full bg-[#8C5F19] hover:bg-[#7A5013] text-white flex items-center justify-center shrink-0 shadow-md transition cursor-pointer"
              title="Explore Community"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. FOOTER
         ───────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1560px] mx-auto border-t border-[#E8DFC8] mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Logo & Subtitle */}
          <div className="text-center sm:text-left">
            <span className="text-2xl font-serif font-black tracking-wider text-neutral-950 block">
              Flazo
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#9E6B20] uppercase font-bold">
              SOUND FOR A BRIGHTER INDIA
            </span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-6 text-xs font-bold text-neutral-600">
            <Link href="/" className="hover:text-neutral-950 transition">Home</Link>
            <Link href="/earbuds" className="hover:text-neutral-950 transition">Products</Link>
            <Link href="/blogs" className="hover:text-neutral-950 transition">Blogs</Link>
            <Link href="/community" className="text-[#8C5F19] transition">Community</Link>
            <Link href="/support-warranty" className="hover:text-neutral-950 transition">Support</Link>
          </div>

          {/* Signature */}
          <div className="text-center sm:text-right select-none">
            <span className="font-serif italic text-base text-neutral-800 font-semibold block">
              Good People Better Sound.
            </span>
            <div className="w-12 h-0.5 bg-[#C99726] rounded-full ml-auto mt-0.5" />
          </div>

        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          JOIN COMMUNITY MODAL
         ───────────────────────────────────────────────────────────── */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200 relative">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#8C5F19] flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-black text-neutral-950">
                Join the Flazo Community
              </h3>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Connect with 25,000+ audiophiles, creators, and engineers across India. Access exclusive beta drops, giveaways, and offline listening sessions.
              </p>

              <form onSubmit={handleJoinSubmit} className="space-y-3 pt-2">
                <input
                  type="email"
                  required
                  value={joinEmail}
                  onChange={(e) => setJoinEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#8C5F19] hover:bg-[#7A5013] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Join 25K+ Members →
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SHARE YOUR IDEA MODAL
         ───────────────────────────────────────────────────────────── */}
      {isIdeaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200 relative">
            <button
              onClick={() => setIsIdeaModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#8C5F19] flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-black text-neutral-950">
                  Shape the Next Sound
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Have an idea for a feature, tuning preset, or new product accessory? Share it directly with our acoustic engineering team.
                </p>
              </div>

              <form onSubmit={handleIdeaSubmit} className="space-y-3">
                <textarea
                  required
                  rows={4}
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder="Describe your idea or feature request in detail..."
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#8C5F19] hover:bg-[#7A5013] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Submit Idea to Flazo Labs →
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  Headphones,
  Sparkles,
  Coffee,
  Lightbulb,
  Building2,
  Star,
  Search,
  ArrowRight,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// Categories matching reference design
const CATEGORIES = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "guides", name: "Product Guides", icon: Headphones },
  { id: "tech", name: "Technology", icon: Sparkles },
  { id: "lifestyle", name: "Lifestyle", icon: Coffee },
  { id: "tips", name: "Tips & Tricks", icon: Lightbulb },
  { id: "brand", name: "Behind the Brand", icon: Building2 },
  { id: "stories", name: "User Stories", icon: Star },
];

// Trending Articles List
const TRENDING_ARTICLES = [
  {
    rank: "01",
    id: "trending-1",
    title: "10 Tips to Get the Best Sound From Your Flazo Earbuds",
    readTime: "5 min read",
    views: "18K views",
    image: "/images/spotlight-earbud.jpg",
  },
  {
    rank: "02",
    id: "trending-2",
    title: "ANC vs ENC: What's the Difference?",
    readTime: "6 min read",
    views: "14K views",
    image: "/images/blog_card_man_focus.jpg",
  },
  {
    rank: "03",
    id: "trending-3",
    title: "How to Choose the Right Earbuds for Your Lifestyle",
    readTime: "4 min read",
    views: "12K views",
    image: "/images/community_ambassador_creator.jpg",
  },
  {
    rank: "04",
    id: "trending-4",
    title: "The Future of Audio: What's Next?",
    readTime: "7 min read",
    views: "9K views",
    image: "/images/community_ambassador_dj.jpg",
  },
];

// Latest Articles Grid
const LATEST_ARTICLES = [
  {
    id: "article-1",
    slug: "how-to-set-up-flazo-earbuds-step-by-step",
    category: "PRODUCT GUIDES",
    title: "How to Set Up Your Flazo Earbuds (Step-by-Step)",
    excerpt:
      "A simple guide to get you started in minutes and enjoy the full Flazo experience.",
    date: "Sep 10, 2026",
    readTime: "4 min read",
    image: "/images/blog_card_book.jpg",
  },
  {
    id: "article-2",
    slug: "music-for-a-more-focused-and-productive-you",
    category: "LIFESTYLE",
    title: "Music for a More Focused and Productive You",
    excerpt:
      "Discover how the right sound can boost your focus, mood and productivity.",
    date: "Sep 8, 2026",
    readTime: "5 min read",
    image: "/images/blog_card_man_focus.jpg",
  },
  {
    id: "article-3",
    slug: "7-everyday-habits-for-better-listening-experience",
    category: "TIPS & TRICKS",
    title: "7 Everyday Habits for a Better Listening Experience",
    excerpt:
      "Small changes, big difference. Make your music, calls and meetings sound even better.",
    date: "Sep 5, 2026",
    readTime: "6 min read",
    image: "/images/spotlight-earbud.jpg",
  },
  {
    id: "article-4",
    slug: "the-flazo-story-a-journey-of-better-sound",
    category: "BEHIND THE BRAND",
    title: "The Flazo Story: A Journey of Better Sound",
    excerpt:
      "From a simple idea to a growing community — discover the story behind Flazo.",
    date: "Sep 1, 2026",
    readTime: "8 min read",
    image: "/images/lifestyle-model.jpg",
  },
];

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      toast.success("Welcome to The Flazo Journal! You're on the list.");
      setEmailInput("");
    }
  };

  const filteredArticles = LATEST_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 pb-20 selection:bg-[#B8860B] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Exact Reference Match)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden w-full max-w-[1560px] mx-auto pt-6 px-4 sm:px-6 lg:px-12">
        <div className="relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] flex items-center shadow-xs border border-[#E8D7BF]">
          
          {/* Background Image: Woman Enjoying Music in Golden Hour */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/blog_hero_woman.jpg"
              alt="The Flazo Journal - Stories That Move You Closer to Better Sound"
              fill
              priority
              className="object-cover object-[75%_center] sm:object-center"
            />
            {/* Subtle left-side white/cream gradient to guarantee crisp readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 sm:via-[#FAF7F2]/75 to-transparent w-full sm:w-[65%]" />
          </div>

          {/* Script Watermark on Top-Right */}
          <div className="absolute top-6 right-6 sm:right-12 z-10 pointer-events-none select-none hidden sm:block">
            <span className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-[#5C4524]/80 drop-shadow-xs">
              Good <br />
              Sound <br />
              Brighter <br />
              Days
            </span>
          </div>

          {/* Floating Quote Card on Bottom-Right */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-20 hidden md:block max-w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E8D7BF] shadow-md">
            <p className="text-xs text-neutral-800 leading-relaxed font-medium">
              &ldquo;Music isn&apos;t just heard; it&apos;s felt. And we&apos;re here to make it feel better.&rdquo;
            </p>
            <p className="text-[11px] text-[#8C6016] font-bold mt-2 text-right">
              — Team Flazo
            </p>
          </div>

          {/* Left Text Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-2xl space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#8C6016] uppercase block">
              THE FLAZO JOURNAL
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#1A1A1A] leading-[1.1]">
              Stories That <br />
              Move You Closer <br />
              to{" "}
              <span className="font-serif italic text-[#C28C1A] bg-gradient-to-r from-[#B8860B] via-[#C99726] to-[#A07014] bg-clip-text text-transparent">
                Better Sound
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg leading-relaxed pt-1">
              Insights, guides, innovations and real stories — for everyone who believes in a richer, clearer, more meaningful audio experience.
            </p>

            <div className="pt-3">
              <a
                href="#all-articles"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#9E6B20] hover:bg-[#8A5B17] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md group"
              >
                <span>Explore Articles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CATEGORY PILL BAR & SEARCH
         ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto py-1">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#9E6B20] text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-[#E8D7BF] hover:bg-[#FAF3E5] hover:text-[#8C6016]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Search Input */}
          <div className="w-full lg:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-4 pr-11 py-2 bg-white border border-[#E8D7BF] rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#9E6B20] shadow-xs"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#9E6B20] text-white flex items-center justify-center hover:bg-[#8A5B17] transition shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED STORY & TRENDING NOW (Two-Column Section)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-4 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left (Col 8): Big Featured Story Card */}
          <div className="lg:col-span-8 bg-neutral-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-neutral-800 flex flex-col justify-between group shadow-xl">
            {/* Background Exploded Technical Diagram Image */}
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[60%] opacity-85 pointer-events-none">
              <Image
                src="/images/blog_featured_exploded.jpg"
                alt="The Science Behind Exceptional Sound"
                fill
                className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
            </div>

            {/* Top Badge & Category */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <Star className="w-3 h-3 fill-current" />
                FEATURED
              </div>

              <span className="text-[11px] font-mono tracking-widest text-[#B8860B] uppercase block">
                TECHNOLOGY
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight max-w-lg">
                The Science Behind Exceptional Sound
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed">
                Discover how dual-coaxial drivers, 50dB Hybrid ANC and Auracast™ work together to create a truly immersive listening experience.
              </p>
            </div>

            {/* Bottom Meta & Cursive Script */}
            <div className="relative z-10 pt-8 mt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Sep 15, 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    6 min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    12.4K views
                  </span>
                </div>

                <Link
                  href="/blogs/flazo-article-1/science-behind-50db-hybrid-anc"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition group-hover:translate-x-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Script Watermark */}
              <span className="font-serif italic text-lg sm:text-xl text-neutral-400 select-none">
                Engineered for Real Life
              </span>
            </div>

          </div>

          {/* Right (Col 4): Trending Now Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D7BF] shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
                <div className="flex items-center gap-2 text-base font-serif font-black text-[#1A1A1A]">
                  <TrendingUp className="w-4 h-4 text-[#9E6B20]" />
                  <span>Trending Now</span>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Showing top trending audiophile articles")}
                  className="text-xs font-bold text-[#8C6016] hover:underline"
                >
                  View All →
                </button>
              </div>

              {/* 4 Trending Items */}
              <div className="space-y-4">
                {TRENDING_ARTICLES.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#FAF6EE] transition cursor-pointer group"
                    onClick={() => toast.info(`Opening: ${item.title}`)}
                  >
                    {/* Rank Number */}
                    <span className="text-xs font-mono font-bold text-neutral-400 shrink-0 w-5">
                      {item.rank}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-14 h-12 rounded-xl overflow-hidden relative shrink-0 bg-neutral-100 border border-neutral-200">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Title & Meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-bold text-neutral-900 group-hover:text-[#9E6B20] transition line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        {item.readTime} • {item.views}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-4 text-center">
              <span className="text-[11px] text-neutral-400 font-medium">
                Updated hourly based on reader engagement
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. LATEST ARTICLES GRID
         ───────────────────────────────────────────────────────────── */}
      <section id="all-articles" className="py-14 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Latest Articles
            </h2>
            <div className="w-16 h-0.5 bg-[#D9C4A4] hidden sm:block" />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-1.5 rounded-full border border-[#D9C4A4] text-xs font-bold text-neutral-700 hover:bg-[#FAF3E5] transition hidden sm:inline-block"
            >
              View All Articles →
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[#D9C4A4] flex items-center justify-center text-neutral-600 hover:bg-[#FAF3E5] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-[#D9C4A4] flex items-center justify-center text-neutral-600 hover:bg-[#FAF3E5] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8D7BF] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#8C6016] uppercase block">
                    {article.category}
                  </span>

                  <h3 className="text-base font-serif font-black text-[#1A1A1A] group-hover:text-[#9E6B20] transition leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    {article.date} • {article.readTime}
                  </span>

                  <Link
                    href={`/blogs/${article.id}/${article.slug}`}
                    className="text-xs font-bold text-[#8C6016] group-hover:text-[#9E6B20] flex items-center gap-1 group-hover:translate-x-0.5 transition"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. NEWSLETTER STRIP ("STAY IN THE LOOP")
         ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#21180D] via-[#382611] to-[#1D150B] text-white p-8 sm:p-10 lg:p-12 border border-[#C99726]/40 shadow-[0_15px_50px_rgba(201,151,38,0.18)]">
          
          {/* Background Image Layer with Golden & Black Atmosphere & Earbud */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/images/newsletter_golden_banner_bg.png"
              alt="Flazo Acoustic Golden Ambience"
              fill
              className="object-cover object-right sm:object-center opacity-95"
              priority
            />
            {/* Subtle soft gradient overlay to guarantee text legibility on smaller screens */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E160C]/90 via-[#261B0E]/60 to-transparent sm:via-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-3.5 max-w-xl">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-amber-200/90 uppercase block">
                STAY IN THE LOOP
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight drop-shadow-sm">
                Get the Latest from Flazo
              </h3>

              <p className="text-xs sm:text-sm text-neutral-200 max-w-lg leading-relaxed drop-shadow-xs">
                New articles, expert tips, product updates and exclusive stories — straight to your inbox.
              </p>

              {/* Subscribe White Pill Input */}
              <div className="pt-2">
                {isSubscribed ? (
                  <div className="inline-flex items-center gap-2 p-3 rounded-full bg-amber-500/25 border border-amber-400 text-amber-200 text-xs font-bold backdrop-blur-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    Thank you! You&apos;re subscribed to The Flazo Journal.
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-center bg-white rounded-full p-1 pl-4 shadow-xl max-w-lg transition-all focus-within:ring-2 focus-within:ring-amber-500"
                  >
                    <Mail className="w-4 h-4 text-neutral-500 shrink-0 mr-2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none py-1.5"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9E6B20] via-[#B8860B] to-[#D49E2E] hover:from-[#8A5B17] hover:to-[#B8860B] text-white text-xs sm:text-sm font-bold whitespace-nowrap transition-transform active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      Subscribe →
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Spacer & Far Right Motto with Golden Smile Arc */}
            <div className="lg:col-span-4 flex items-center justify-end">
              <div className="flex flex-col items-start select-none shrink-0 pr-2 sm:pr-4">
                <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase leading-tight">PEOPLE</p>
                <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase leading-tight">SOUND</p>
                <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase leading-tight">A BRIGHTER</p>
                <p className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase leading-tight">INDIA</p>
                <div className="pt-1 w-full">
                  <svg className="w-14 h-3 text-[#E2A62C]" viewBox="0 0 60 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 13C20 6 40 2 58 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

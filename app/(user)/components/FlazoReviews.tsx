"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Award,
  Sparkles,
  ShieldCheck,
  MessageSquareQuote,
} from "lucide-react";

interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  product: string;
  date: string;
  title: string;
  comment: string;
  tag: string;
  likes: number;
  verified: boolean;
}

const reviewsData: Review[] = [
  {
    id: 1,
    name: "Rohit Malhotra",
    city: "Mumbai, Maharashtra",
    rating: 5,
    product: "Flazo Nirvana Gold Pro",
    date: "Verified Purchase • 2 days ago",
    title: "Monster bass that rivals Sony XM4 at 1/5th the price!",
    comment:
      "I was skeptical about a new brand, but Flazo's 13mm titanium drivers blew me away. The sub-bass is chest-thumping without drowning vocals. The 50dB Hybrid ANC easily silences the chaos of Mumbai local trains.",
    tag: "bass",
    likes: 312,
    verified: true,
  },
  {
    id: 2,
    name: "Sneha Sen",
    city: "Bengaluru, Karnataka",
    rating: 5,
    product: "Flazo Aerobeat Ultralight",
    date: "Verified Purchase • 4 days ago",
    title: "Looks like luxury jewelry & zero ear fatigue during workouts",
    comment:
      "The champagne gold accents look so elegant. Extremely light (3.6g) and doesn't slip out during my 10k morning jogs. The battery easily lasts all week with fast case recharge.",
    tag: "battery",
    likes: 184,
    verified: true,
  },
  {
    id: 3,
    name: "Karanveer Gill",
    city: "Chandigarh, Punjab",
    rating: 5,
    product: "Flazo BassPod Extreme",
    date: "Verified Purchase • 1 week ago",
    title: "35ms Beast™ gaming sync is genuine for BGMI & COD",
    comment:
      "Footsteps and gunfire sound instant with zero delay. Soundstage is wide and punchy. Arrived in 36 hours with safe armored packaging and proper GST invoice.",
    tag: "gaming",
    likes: 245,
    verified: true,
  },
  {
    id: 4,
    name: "Priya Deshmukh",
    city: "Pune, Maharashtra",
    rating: 5,
    product: "Flazo Nirvana Gold Pro",
    date: "Verified Purchase • 1 week ago",
    title: "Doorstep replacement policy gave me total confidence",
    comment:
      "Quad-mic ENC is remarkably clear for office Zoom calls in cafes. The best part is knowing they offer a 1-year doorstep replacement without service center loops. Pure peace of mind.",
    tag: "anc",
    likes: 198,
    verified: true,
  },
  {
    id: 5,
    name: "Aditya Rawat",
    city: "Delhi NCR",
    rating: 5,
    product: "Flazo BassPod Extreme",
    date: "Verified Purchase • 2 weeks ago",
    title: "Tuned specifically for Indian bass lovers. Phenomenal!",
    comment:
      "If you love EDM drops and thumping Punjabi beats, look no further. The lower end has actual physical weight to it. Unboxing felt like receiving a Swiss timepiece.",
    tag: "bass",
    likes: 156,
    verified: true,
  },
  {
    id: 6,
    name: "Ananya Joshi",
    city: "Hyderabad, Telangana",
    rating: 5,
    product: "Flazo Aerobeat Ultralight",
    date: "Verified Purchase • 2 weeks ago",
    title: "Outstanding ANC in metro transit and flight cabins",
    comment:
      "Travelled to Dubai wearing these; cabin drone was completely wiped out. Dual pairing between my MacBook and iPhone works seamlessly with 1-tap touch controls.",
    tag: "anc",
    likes: 132,
    verified: true,
  },
];

export default function FlazoReviews() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  const filteredReviews =
    activeFilter === "all"
      ? reviewsData
      : reviewsData.filter((r) => r.tag === activeFilter);

  const toggleLike = (id: number) => {
    if (likedReviews.includes(id)) {
      setLikedReviews(likedReviews.filter((item) => item !== id));
    } else {
      setLikedReviews([...likedReviews, id]);
    }
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-gradient-to-b from-white via-amber-50/20 to-white border-b border-amber-100/80">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-amber-200/60 pb-8">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Real Verified Customer Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight">
              LOVED BY <span className="gold-gradient-text">148,000+ AUDIOPHILES</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base max-w-xl">
              Don’t take our word for it. Read authentic, unfiltered experiences from listeners who switched to Flazo signature acoustics.
            </p>
          </div>

          {/* Aggregate Rating Badge Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-300 shadow-lg flex items-center gap-5 shrink-0 card-lift">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">4.9</div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-neutral-500 font-bold block mt-1">148,520 Ratings</span>
            </div>
            <div className="h-10 w-px bg-neutral-200" />
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>98.6% Recommendation</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>100% Verified Purchases</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Reviews (148K+)" },
            { id: "bass", label: "BoomBass™ 13mm Punch" },
            { id: "anc", label: "50dB Hybrid ANC & Mic" },
            { id: "gaming", label: "35ms Beast™ Gaming" },
            { id: "battery", label: "Battery & Comfort" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-neutral-950 text-amber-300 shadow-md shadow-neutral-950/20"
                  : "bg-white border border-amber-200 text-neutral-700 hover:border-amber-400 hover:bg-amber-50/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((r) => {
            const isLiked = likedReviews.includes(r.id);
            return (
              <div
                key={r.id}
                className="card-lift rounded-3xl bg-white border border-amber-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-amber-400 relative group text-left"
              >
                <div className="space-y-4">
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Comment */}
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-neutral-950 leading-snug group-hover:text-amber-800 transition-colors">
                      &ldquo;{r.title}&rdquo;
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {r.comment}
                    </p>
                  </div>

                  {/* Product Tag */}
                  <div className="pt-2">
                    <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60">
                      Model: {r.product}
                    </span>
                  </div>
                </div>

                {/* Bottom User Info & Like */}
                <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-xs text-neutral-900">{r.name}</div>
                    <div className="text-[11px] text-neutral-400">{r.city}</div>
                  </div>

                  <button
                    onClick={() => toggleLike(r.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isLiked
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-neutral-50 text-neutral-500 hover:bg-amber-50 hover:text-amber-800"
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${isLiked ? "fill-amber-600 text-amber-600" : ""}`} />
                    <span>{r.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Strip (Footer of Reviews) */}
        <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-amber-500/30 flex flex-wrap items-center justify-around gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase text-amber-300">100% Genuine Reviews</div>
              <div className="text-[11px] text-neutral-400">Audited via verified order IDs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase text-amber-300">Best Audio Wearable 2025</div>
              <div className="text-[11px] text-neutral-400">Tech & Lifestyle Consumer Choice</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase text-amber-300">7-Day Zero-Risk Trial</div>
              <div className="text-[11px] text-neutral-400">Love the sound or get instant swap</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";
import React, { useState } from "react";
import { Watch, Radio, Headphones, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function FlazoFutureTeaser() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSubmitted(true);
      toast.success("Welcome to the Flazo VIP Circle!", {
        description: "You will receive exclusive early launch pricing on our upcoming electronics.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16 md:py-20 bg-neutral-950 text-white relative overflow-hidden border-b border-amber-900/40">
      {/* Subtle gold glow lights */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12">

        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Expanding Beyond TWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            THE FLAZO <span className="gold-gradient-text">ELECTRONICS</span> HORIZON
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            While True Wireless Earbuds are our heartbeat, our engineering labs are crafting the next generation of luxury consumer electronics.
          </p>
        </div>

        {/* Future Category Previews with card-lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="card-lift p-6 rounded-3xl bg-neutral-900/70 border border-amber-500/20 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-500/10 transition-all group space-y-4 cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Coming Soon</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">Flazo Chrono Smartwatch</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Sapphire glass AMOLED display encased in brushed champagne gold stainless steel with heart rate and calling.
              </p>
            </div>
          </div>

          <div className="card-lift p-6 rounded-3xl bg-neutral-900/70 border border-amber-500/20 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-500/10 transition-all group space-y-4 cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">In Development</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">Flazo Studio Over-Ears</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                40mm bio-cellulose drivers, plush memory foam earcups, and lossless spatial audio with gold hardware accents.
              </p>
            </div>
          </div>

          <div className="card-lift p-6 rounded-3xl bg-neutral-900/70 border border-amber-500/20 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-500/10 transition-all group space-y-4 cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Concept Lab</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">Flazo Sonic Neckbands</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Ultra-flexible magnetic neckband with 80 hours battery backup and ASAP fast flash charging.
              </p>
            </div>
          </div>

        </div>

        {/* VIP Early Access Form */}
        <div className="max-w-xl mx-auto text-center space-y-4 pt-4">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Be the first to know when new electronics drop
          </p>

          {isSubmitted ? (
            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center gap-2 text-amber-300 text-sm font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>You are on the Flazo VIP Priority Waitlist!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-5 py-3 rounded-xl bg-neutral-900 border border-amber-500/30 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                className="btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-neutral-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-amber-500/30 shrink-0 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Join VIP List</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

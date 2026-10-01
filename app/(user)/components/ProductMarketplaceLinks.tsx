"use client";

import React from "react";
import { ArrowUpRight, ShieldCheck, ShoppingBag, ExternalLink } from "lucide-react";
import { PlatformLink } from "@/app/types/product.types";

interface ProductMarketplaceLinksProps {
  platformLinks?: PlatformLink[] | string | null;
  productName?: string;
  className?: string;
}

export default function ProductMarketplaceLinks({
  platformLinks,
  productName = "Product",
  className = "",
}: ProductMarketplaceLinksProps) {
  // Normalize links if stored as string in DB
  const links: PlatformLink[] = React.useMemo(() => {
    if (!platformLinks) return [];
    if (Array.isArray(platformLinks)) return platformLinks;
    if (typeof platformLinks === "string") {
      try {
        const parsed = JSON.parse(platformLinks);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [platformLinks]);

  if (links.length === 0) return null;

  // Platform styling config
  const getPlatformConfig = (name: string) => {
    const lower = (name || "").toLowerCase().trim();

    if (lower.includes("amazon")) {
      return {
        brandName: "Amazon",
        bgClass: "bg-[#131921] hover:bg-[#1a222d] text-white border-[#232f3e]",
        accentColor: "text-[#FF9900]",
        badgeBg: "bg-[#FF9900]/20 text-[#FF9900] border-[#FF9900]/30",
        defaultBadge: "Prime Available",
        iconText: "a",
      };
    }

    if (lower.includes("flipkart")) {
      return {
        brandName: "Flipkart",
        bgClass: "bg-[#2874F0] hover:bg-[#1f63d4] text-white border-[#1c5cbd]",
        accentColor: "text-[#FFE500]",
        badgeBg: "bg-[#FFE500]/20 text-[#FFE500] border-[#FFE500]/40",
        defaultBadge: "Flipkart Assured",
        iconText: "fk",
      };
    }

    if (lower.includes("myntra")) {
      return {
        brandName: "Myntra",
        bgClass: "bg-[#E11B55] hover:bg-[#c91448] text-white border-[#b0103e]",
        accentColor: "text-amber-200",
        badgeBg: "bg-white/20 text-white border-white/30",
        defaultBadge: "100% Genuine",
        iconText: "m",
      };
    }

    if (lower.includes("meesho")) {
      return {
        brandName: "Meesho",
        bgClass: "bg-[#8B2C84] hover:bg-[#782372] text-white border-[#661b60]",
        accentColor: "text-pink-300",
        badgeBg: "bg-white/20 text-white border-white/30",
        defaultBadge: "Best Value",
        iconText: "me",
      };
    }

    if (lower.includes("jiomart") || lower.includes("jio")) {
      return {
        brandName: "JioMart",
        bgClass: "bg-[#0078AD] hover:bg-[#006694] text-white border-[#00557c]",
        accentColor: "text-cyan-200",
        badgeBg: "bg-white/20 text-white border-white/30",
        defaultBadge: "Express Mart",
        iconText: "jio",
      };
    }

    if (lower.includes("tata") || lower.includes("cliq")) {
      return {
        brandName: "Tata CLiQ",
        bgClass: "bg-[#C9002B] hover:bg-[#b00025] text-white border-[#96001f]",
        accentColor: "text-amber-200",
        badgeBg: "bg-white/20 text-white border-white/30",
        defaultBadge: "Luxury Store",
        iconText: "cliq",
      };
    }

    // Default / Custom
    return {
      brandName: name,
      bgClass: "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700",
      accentColor: "text-amber-400",
      badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/30",
      defaultBadge: "Verified Partner",
      iconText: "store",
    };
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-white to-amber-50/40 border border-amber-200/80 shadow-2xs space-y-3.5 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/50 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#B8860B]">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-neutral-900 leading-tight">
              Also Available on Marketplaces
            </h4>
            <p className="text-[10px] text-neutral-500">
              Buy directly through our verified official store channels
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-neutral-600 bg-white px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official Store</span>
        </div>
      </div>

      {/* Dynamic Marketplace Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
        {links.map((link, idx) => {
          const cfg = getPlatformConfig(link.name);
          const badgeText = link.badge || cfg.defaultBadge;

          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between p-3 rounded-xl border shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${cfg.bgClass}`}
              title={`Buy ${productName} on ${link.name}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Platform Logo Avatar Badge */}
                <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center font-black uppercase text-xs tracking-tighter shrink-0 shadow-inner">
                  {cfg.iconText === "a" ? (
                    <span className="text-[#FF9900] text-sm font-black italic">a</span>
                  ) : cfg.iconText === "fk" ? (
                    <span className="text-[#FFE500] text-xs font-black">fk</span>
                  ) : cfg.iconText === "m" ? (
                    <span className="text-white text-xs font-black">M</span>
                  ) : cfg.iconText === "me" ? (
                    <span className="text-pink-200 text-xs font-black">me</span>
                  ) : (
                    <span className="text-xs font-black">{cfg.iconText.slice(0, 3)}</span>
                  )}
                </div>

                {/* Text Info */}
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black tracking-tight truncate">
                      Buy on {link.name}
                    </span>
                  </div>

                  {badgeText && (
                    <div className="pt-0.5">
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${cfg.badgeBg}`}>
                        {badgeText}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* External Arrow Link */}
              <div className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors ml-2">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Trust Micro Strip */}
      <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-500">
        <span>✓ Pan-India Delivery Applicable</span>
        <span>•</span>
        <span>✓ Same Genuine Warranty</span>
        <span>•</span>
        <span>✓ Direct Marketplace Checkout</span>
      </div>
    </div>
  );
}

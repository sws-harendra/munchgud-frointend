import React from "react";
import Script from "next/script";
import FlazoHero from "./components/FlazoHero";
import FlazoMarqueeTicker from "./components/FlazoMarqueeTicker";
import FlazoBrandSpotlight from "./components/FlazoBrandSpotlight";
import FlazoSaleIsLive from "./components/FlazoSaleIsLive";
import FlazoFlagshipShowcase from "./components/FlazoFlagshipShowcase";
import FlazoTechAcoustics from "./components/FlazoTechAcoustics";
import FlazoComparison from "./components/FlazoComparison";
import FlazoLifestyleStory from "./components/FlazoLifestyleStory";
import FlazoReviews from "./components/FlazoReviews";
import FlazoFAQ from "./components/FlazoFAQ";
import FlazoFutureTeaser from "./components/FlazoFutureTeaser";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: "Flazo",
    url: "https://flazo.com",
    logo: "https://flazo.com/images/hero-earbuds.jpg",
    description: "Flazo premium wireless earbuds engineered with 13mm BoomBass™ titanium drivers and 50dB Hybrid Active Noise Cancellation in signature gold luxury.",
    sameAs: ["https://instagram.com/flazo_audio"],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-amber-200 selection:text-neutral-950">
      <Script
        id="flazo-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Invisible SEO h1 */}
      <h1 className="sr-only">
        Flazo | Premium Wireless Earbuds, Active Noise Cancellation & Signature Gold Audio
      </h1>

      {/* 1. Flazo Flagship Hero Section (boAt Style Sliding Carousel) */}
      <FlazoHero />

      {/* Signature Continuous Marquee Motion Ticker */}
      <FlazoMarqueeTicker />

      {/* 2. EarFun Style Brand Spotlight Banner & Sub-Spotlight Tiles */}
      <FlazoBrandSpotlight />

      {/* 3. boAt Style "Sale Is Live" Section with Value Assurance Strip */}
      <FlazoSaleIsLive />

      {/* 4. Flagship Earbuds Spotlight (Interactive Switcher) */}
      <FlazoFlagshipShowcase />

      {/* 5. boAt & Boult Inspired Acoustic Tech & Sound Deconstruction */}
      <FlazoTechAcoustics />

      {/* 6. Why Flazo vs Ordinary Buds Comparison */}
      <FlazoComparison />

      {/* 7. Editorial Lifestyle Story & Doorstep Replacement Guarantee */}
      <FlazoLifestyleStory />

      {/* 8. Authentic Verified Customer Reviews & Social Proof */}
      <FlazoReviews />

      {/* 9. Acoustic FAQs & Buyer Assurance Accordion */}
      <FlazoFAQ />

      {/* 10. Upcoming Electronics Horizon Teaser (Smartwatches & Audio Tech) */}
      <FlazoFutureTeaser />
    </div>
  );
}

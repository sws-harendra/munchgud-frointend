"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBannerSlide {
  id: string;
  bannerImage: string;
  alt: string;
  link: string;
}

const bannerSlides: HeroBannerSlide[] = [
  {
    id: "flazo-flagship-trinity",
    bannerImage: "/images/hero-banner-1.jpg",
    alt: "Flazo Luxury True Wireless Earbuds Flagship Trinity",
    link: "#flagship-series",
  },
  {
    id: "flazo-gaming-dolby",
    bannerImage: "/images/hero-banner-2.jpg",
    alt: "Flazo BassPod Extreme Dolby Spatial Audio Gaming Earbuds",
    link: "#flagship-series",
  },
  {
    id: "flazo-aerobeat-luxury",
    bannerImage: "/images/hero-banner-3.jpg",
    alt: "Flazo Aerobeat Ultralight Marble & Champagne Gold Earbuds",
    link: "#flagship-series",
  },
  {
    id: "flazo-apex-collection",
    bannerImage: "/images/hero-banner-4.jpg",
    alt: "The Flazo Apex Horizon Earbuds and Wearables",
    link: "#flagship-series",
  },
];

export default function FlazoHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (!touchStartX.current) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) handleNext();
        if (diff < -50) handlePrev();
        touchStartX.current = null;
      }}
    >
      {/* Slider Carousel Container */}
      <div
        className="flex transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className="min-w-full relative flex items-center justify-center overflow-hidden aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] min-h-[300px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[640px]"
          >
            {/* Clean Clickable Full-Bleed Panoramic Image Banner (Zero Text Overlay) */}
            <Link
              href={slide.link}
              className="relative block w-full h-full cursor-pointer"
              aria-label={slide.alt}
            >
              <Image
                src={slide.bannerImage}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center w-full h-full transition-transform duration-700 hover:scale-[1.01]"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Left Chevron Navigation Button */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 shadow-xl cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right Chevron Navigation Button */}
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 shadow-xl cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Pagination Indicator Bars (Bottom Center) */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === i
                ? "w-8 bg-amber-400 shadow-sm shadow-amber-400/50"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use strict";
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { serverurl } from "@/app/contants";

interface HeroSlideData {
  id: string | number;
  bannerImage: string;
  alt: string;
  link: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
}

export default function FlazoHero() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch purely dynamic hero images from backend API
  useEffect(() => {
    let isMounted = true;

    async function loadDynamicHeroImages() {
      try {
        setIsLoading(true);
        const res = await fetch(`${serverurl}/hero-images`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dynamicSlides: HeroSlideData[] = json.data.map((item: any) => ({
            id: item.id,
            bannerImage: getImageUrl(item.imageUrl),
            alt: item.altText || item.title || "Flazo Hero Slide",
            link: item.link || "#flagship-series",
            title: item.title,
            subtitle: item.subtitle,
            ctaText: item.ctaText,
          }));

          if (isMounted) {
            setSlides(dynamicSlides);
          }
        } else {
          if (isMounted) {
            setSlides([]);
          }
        }
      } catch (err) {
        console.error("Hero dynamic slides fetch error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDynamicHeroImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length;

  // Auto-slide every 5.5 seconds (only when more than 1 slide)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Loading skeleton while fetching dynamic slides from database
  if (isLoading && slides.length === 0) {
    return (
      <div className="w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] min-h-[300px] sm:min-h-[420px] md:min-h-[500px] bg-neutral-900 animate-pulse flex items-center justify-center">
        <div className="flex items-center gap-2 text-neutral-600 text-xs font-mono">
          <div className="w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span>Loading dynamic hero slides...</span>
        </div>
      </div>
    );
  }

  // If no dynamic images are uploaded in the database yet, return null
  if (!isLoading && slides.length === 0) {
    return null;
  }

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
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="min-w-full relative flex items-center justify-center overflow-hidden aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] min-h-[300px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[640px]"
          >
            {/* Dynamic Clickable Full-Bleed Panoramic Image Banner */}
            <Link
              href={slide.link}
              className="relative block w-full h-full cursor-pointer"
              aria-label={slide.alt}
            >
              <img
                src={slide.bannerImage}
                alt={slide.alt}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                className="object-cover object-center w-full h-full transition-transform duration-700 hover:scale-[1.01]"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Only shown when there are multiple slides) */}
      {totalSlides > 1 && (
        <>
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
            {slides.map((_, i) => (
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
        </>
      )}
    </div>
  );
}

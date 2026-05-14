"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { Banner, fetchBanners } from "@/app/lib/store/features/bannerSlice";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Loader from "@/app/commonComponents/loader";
import { getImageUrl } from "@/app/utils/getImageUrl";

type BannerCarouselProps = {
  initialBanners?: Banner[];
};

export default function BannerCarousel({
  initialBanners = [],
}: BannerCarouselProps) {
  const dispatch = useAppDispatch();
  const { banners, error, status } = useAppSelector((state) => state.banners);
  const displayBanners = initialBanners.length > 0 ? initialBanners : banners;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {},
  );

  useEffect(() => {
    if (initialBanners.length === 0) {
      dispatch(fetchBanners());
    }
  }, [dispatch, initialBanners.length]);

  useEffect(() => {
    if (error) toast.error(error as string);
  }, [error]);

  // autoplay
  useEffect(() => {
    if (isPlaying && !isHovered && displayBanners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isHovered, displayBanners.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + displayBanners.length) % displayBanners.length,
    );

  const goToSlide = (index: number) => setCurrentSlide(index);

  const handleImageLoad = (index: number) =>
    setImageLoaded((prev) => ({ ...prev, [index]: true }));

  const handleBannerClick = (banner: any) => {
    if (banner.link) window.location.href = banner.link;
  };

  const previousSlide =
    (currentSlide - 1 + displayBanners.length) % displayBanners.length;
  const nextSlideIndex = (currentSlide + 1) % displayBanners.length;

  const isLoading = status === "loading";
  if (isLoading) return <Loader />;

  if (!displayBanners.length) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="h-64 flex items-center justify-center rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200">
          <div className="text-gray-500 text-lg font-medium">
            No banners available
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className=" max-w-[100%] mx-auto">
      {/* Floating carousel wrapper */}
      <div className="relative w-full  ">
        {/* Background blur effect */}
        <div className="absolute  bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl  opacity-50" />

        {/* Main carousel container */}
        <div
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[645px] overflow-hidden  shadow-2xl bg-white border border-gray-200/50 backdrop-blur-sm "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Inner shadow for depth */}
          <div className="absolute  rounded-3xl shadow-inner pointer-events-none z-10" />

          {/* slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {displayBanners.map((banner, index) => (
              <div
                key={banner.id}
                className="min-w-full h-full relative cursor-pointer group overflow-hidden"
                onClick={() => handleBannerClick(banner)}
              >
                {index === currentSlide ||
                index === previousSlide ||
                index === nextSlideIndex ? (
                  <Image
                    src={getImageUrl(banner.imageUrl)}
                    // src={banner.imageUrl}
                    alt={banner.title || "MunchGud banner"}
                    fill
                    className={`w-full h-full object-cover  ${
                      imageLoaded[index] ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="100vw"
                    priority={index === 0}
                    quality={75}
                    onLoad={() => handleImageLoad(index)}
                    loading={index === 0 ? undefined : "lazy"}
                  />
                ) : null}

                {!imageLoaded[index] && (
                  <div className="absolute inset-0  animate-pulse flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500" />

                {/* Additional subtle overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Enhanced text content */}
                <div className="absolute inset-0 flex items-center justify-start z-20">
                  <div className="text-white px-8 sm:px-12 md:px-16 lg:px-20 max-w-5xl transform transition-all duration-700 group-hover:translate-x-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 leading-tight drop-shadow-xl transform transition-all duration-500 group-hover:scale-105">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 opacity-90 font-medium drop-shadow-lg transform transition-all duration-500 delay-100 group-hover:translate-y-1">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.ctaText && (
                      <button className="bg-green-700 text-white hover:from-green-700 hover:via-green-700 hover:to-green-700 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl flex items-center space-x-3 group/btn">
                        <span className="drop-shadow-sm">{banner.ctaText}</span>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-2 group-hover/btn:rotate-12 transition-all duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced navigation arrows */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute top-1/2 left-6 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-green-700 rounded-2xl p-3 transition-all duration-300 hover:scale-110 shadow-xl border border-green-700/10 z-30 group/nav"
          >
            <ChevronLeft className="w-6 h-6 group-hover/nav:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute top-1/2 right-6 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-green-700 rounded-2xl p-3 transition-all duration-300 hover:scale-110 shadow-xl border border-green-700/10 z-30 group/nav"
          >
            <ChevronRight className="w-6 h-6 group-hover/nav:translate-x-0.5 transition-transform" />
          </button>

          {/* Enhanced play/pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="hidden md:flex absolute bottom-6 left-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-green-700 rounded-2xl p-3 transition-all duration-300 hover:scale-110 shadow-xl border border-green-700/20 z-30 group/play"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 group-hover/play:scale-110 transition-transform" />
            ) : (
              <Play className="w-5 h-5 group-hover/play:scale-110 transition-transform" />
            )}
          </button>

          {/* Enhanced counter */}
          <div className="hidden md:flex absolute bottom-6 right-6 bg-white/20 backdrop-blur-md text-green-700 px-4 py-2 rounded-2xl text-sm font-semibold shadow-xl border border-white/20 z-30">
            <span className="drop-shadow-sm">
              {currentSlide + 1} / {displayBanners.length}
            </span>
          </div>

          {/* Enhanced dots indicator */}
          <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 space-x-3 z-30">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full border-2 ${
                  currentSlide === index
                    ? "w-8 h-3 bg-green-700 border-white shadow-lg"
                    : "w-3 h-3 bg-white/50 border-white/50 hover:bg-white/70 hover:scale-125"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating effect indicators */}
        <div className="hidden absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60 animate-pulse" />
        <div
          className=" hidden absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-pink-400 to-green-600 rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className=" hidden absolute top-1/4 -right-1 w-2 h-2 bg-gradient-to-br from-green-700 to-orange-500 rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
}

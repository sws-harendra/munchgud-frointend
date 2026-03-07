"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { fetchVideos } from "@/app/lib/store/features/video.slice";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { slugify } from "@/app/utils/slugify";
import { getImageUrl } from "@/app/utils/getImageUrl";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Description from "./Description";

export default function VideoProduct() {
  const dispatch = useAppDispatch();
  const { videos } = useAppSelector((state) => state.video);
  const [unmutedId, setUnmutedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (unmutedId === id) {
      videoRefs.current[id]?.pause();
      setUnmutedId(null);
      setIsPlaying(null);
    } else {
      // Mute all others
      Object.keys(videoRefs.current).forEach((key) => {
        const video = videoRefs.current[Number(key)];
        if (video) {
          video.muted = true;
          video.pause();
        }
      });

      // Unmute/play the selected video
      const video = videoRefs.current[id];
      if (video) {
        video.muted = false;
        video.play();
        setUnmutedId(id);
        setIsPlaying(id);
      }
    }
  };

  const togglePlayPause = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(id);
      } else {
        video.pause();
        setIsPlaying(null);
      }
    }
  };

  const handleAutoScrollToggle = () => {
    setIsAutoScrolling(!isAutoScrolling);
    if (swiperRef.current && swiperRef.current.swiper) {
      if (!isAutoScrolling) {
        swiperRef.current.swiper.autoplay.start();
      } else {
        swiperRef.current.swiper.autoplay.stop();
      }
    }
  };

  const handleShopNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Shop Now clicked!");
  };

  if (!videos.length)
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        {/* <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-700 via-green-600 to-lime-500 flex items-center justify-center mb-4">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600 text-lg font-medium">No videos available</p> */}
      </div>
    );

  return (
    <div className="py-6 px-4 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12 mt-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          WATCH AND SHOP
        </h2>
        <p className="mt-3 text-gray-600">
          Discover amazing products through immersive video experiences
        </p>
      </div>

      {/* Video Carousel */}
      <div className="relative  mx-auto">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          centeredSlides={false}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          autoplay={
            isAutoScrolling
              ? { delay: 4000, disableOnInteraction: false }
              : false
          }
          loop={videos.length > 1}
          className="pb-12"
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Video Container - Increased Height */}
                <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={getImageUrl(video.videoUrl)}
                    muted={unmutedId !== video.id}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    autoPlay
                  />

                  {/* Video Controls */}
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                      onClick={(e) => toggleMute(video.id, e)}
                      className="bg-black bg-opacity-60 text-green-700 p-2 rounded-full hover:bg-opacity-80 transition-all duration-200"
                    >
                      {unmutedId === video.id ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </button>
                    {/* <button
                      onClick={(e) => togglePlayPause(video.id, e)}
                      className="bg-black bg-opacity-60 text-lime-500 p-2 rounded-full hover:bg-opacity-80 transition-all duration-200"
                    >
                      {isPlaying === video.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button> */}
                  </div>

                  {/* Playing Indicator */}
                  {isPlaying === video.id && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="flex items-center gap-2 bg-green-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Playing
                      </div>
                    </div>
                  )}

                  {/* Enhanced Gradient Overlay for Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  {/* Product Information Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h3 className="font-bold text-xl md:text-sm mb-3 leading-tight">
                      {video.Product?.name || `Product #${video.productId}`}
                    </h3>

                    {video.Product?.description && (
                      <p className="text-white text-sm md:text-base mb-4 leading-relaxed line-clamp-2 opacity-90">
                        <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: video.Product.description }}></p>
                        {/* <Description description={video.Product.description} /> */}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {video.Product?.price && (
                        <span className="text-2xl md:text-3xl font-bold text-green-700 drop-shadow-lg">
                          ${video.Product.price}
                        </span>
                      )}

                      <Link
                        href={`/products/${slugify(
                          video.Product?.name || "product"
                        )}/${video.productId}`}
                        onClick={handleShopNowClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm  shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-3 rounded-full hover:bg-gray-50 transition-colors duration-200">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-3 rounded-full hover:bg-gray-50 transition-colors duration-200">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Pagination */}
        <div className="custom-pagination flex justify-center mt-8"></div>
      </div>

      {/* Auto-scroll Toggle */}
      {/* <div className="flex justify-center mt-8">
        <button
          onClick={handleAutoScrollToggle}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isAutoScrolling
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {isAutoScrolling ? "Pause Auto-scroll" : "Resume Auto-scroll"}
        </button>
      </div> */}

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-bullet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 4px;
          opacity: 0.5;
        }

        .custom-bullet:hover {
          opacity: 0.8;
          transform: scale(1.1);
        }

        .custom-bullet-active {
          background: #2563eb;
          opacity: 1;
          transform: scale(1.2);
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

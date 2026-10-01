"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Trash2,
  Video,
  Edit3,
  X,
  Check,
  Upload,
  Play,
  RefreshCw,
  Film,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  createVideo,
  deleteVideo,
  fetchVideos,
  updateVideo,
} from "@/app/lib/store/features/video.slice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import Loader from "@/app/commonComponents/loader";

export default function VideoManager() {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { videos, status } = useAppSelector((state) => state.video);
  const { products } = useAppSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const isloading = status === "loading";
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchProducts({ search }));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  // Safely extract product array
  const productList: any[] = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (Array.isArray((products as any)?.products)) return (products as any).products;
    return [];
  }, [products]);

  const selectedProductObj = useMemo(() => {
    return productList.find((p) => p.id === selectedProductId) || null;
  }, [productList, selectedProductId]);

  const handleUpload = async () => {
    if (!videoFile || !selectedProductId) {
      toast.error("Please select both a target product and a video file");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("productId", selectedProductId.toString());

    try {
      await dispatch(createVideo(formData)).unwrap();
      toast.success("Video uploaded and published successfully!");
      setVideoFile(null);
      setSelectedProductId(null);
      setSearch("");
      dispatch(fetchVideos());
    } catch (err: any) {
      console.error("Failed to upload video:", err);
      toast.error(err?.message || "Failed to upload video. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const file = files.find((f) => f.type.startsWith("video/"));
    if (file) {
      setVideoFile(file);
    } else {
      toast.error("Please drop a valid video file (MP4, WebM, MOV)");
    }
  };

  const startEdit = (video: any) => {
    setEditingId(video.id);
    setEditProductId(video.productId);
  };

  const saveEdit = async () => {
    if (!editingId || !editProductId) {
      toast.error("Please select a product");
      return;
    }

    const formData = new FormData();
    formData.append("productId", editProductId.toString());

    try {
      await dispatch(updateVideo({ id: editingId, data: formData })).unwrap();
      toast.success("Video product updated successfully!");
      setEditingId(null);
      setEditProductId(null);
      dispatch(fetchVideos());
    } catch (err: any) {
      console.error("Failed to update video:", err);
      toast.error(err?.message || "Failed to update video.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditProductId(null);
  };

  const toggleVideo = (videoId: number) => {
    const currentVideo = videoRefs.current[videoId];
    if (!currentVideo) return;

    if (playingVideo === videoId) {
      currentVideo.pause();
      setPlayingVideo(null);
    } else {
      Object.values(videoRefs.current).forEach((v) => v?.pause());
      currentVideo.play();
      setPlayingVideo(videoId);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-200 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-slate-50/60 text-slate-800"
      }`}
    >
      {/* 1. Header Section */}
      <div
        className={`rounded-3xl p-6 border flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-white shadow-xl shadow-black/60"
            : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
        }`}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-600/30">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Video Manager
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  <Sparkles size={11} />
                  Video Showcase
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-0.5 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Upload and link product showcase videos displayed across the storefront
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => dispatch(fetchVideos())}
            title="Refresh Videos"
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white"
            }`}
          >
            <RefreshCw
              size={18}
              className={isloading ? "animate-spin text-violet-400" : ""}
            />
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Videos */}
        <div
          className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-gray-900"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              Total Videos
            </p>
            <p className="text-3xl font-extrabold mt-1 text-violet-400">
              {videos.length}
            </p>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              Uploaded to storage
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
        </div>

        {/* Linked Products */}
        <div
          className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-gray-900"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Linked Products
            </p>
            <p className="text-3xl font-extrabold mt-1 text-emerald-400">
              {new Set(videos.map((v) => v.productId)).size}
            </p>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              Unique product targets
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Stream Playback */}
        <div
          className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-gray-900"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Playback Stream
            </p>
            <p className="text-xl font-bold mt-2 text-amber-400">
              Adaptive High-Res
            </p>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              Optimized for mobile
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Play className="w-6 h-6" />
          </div>
        </div>

        {/* Formats Supported */}
        <div
          className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-gray-900"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Format Support
            </p>
            <p className="text-lg font-bold mt-2 text-sky-400">
              MP4 / WebM / MOV
            </p>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              Cross-browser ready
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Upload New Video Card */}
        <div className="lg:col-span-1">
          <div
            className={`rounded-3xl p-6 border transition-colors ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-800 text-white shadow-xl shadow-black/50"
                : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
            }`}
          >
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Upload className="h-5 w-5 text-violet-500" />
              <span>Upload New Video</span>
            </h2>

            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                  dragOver
                    ? isDarkMode
                      ? "border-violet-500 bg-violet-500/15 scale-[1.01]"
                      : "border-violet-500 bg-violet-50 scale-[1.01]"
                    : isDarkMode
                    ? "border-zinc-800 bg-zinc-900/40 hover:border-violet-500/50 hover:bg-zinc-900/70"
                    : "border-slate-300 bg-slate-50/60 hover:border-violet-400 hover:bg-slate-100/60"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`p-3 rounded-2xl transition-colors ${
                      isDarkMode
                        ? "bg-violet-500/15 text-violet-400 border border-violet-500/30"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    {videoFile ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-violet-400 break-all text-sm">
                          {videoFile.name}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-zinc-400" : "text-gray-500"
                          }`}
                        >
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                          to upload
                        </p>
                      </div>
                    ) : (
                      <>
                        <p
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-zinc-200" : "text-gray-700"
                          }`}
                        >
                          Drop video here or click to browse
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-zinc-500" : "text-gray-400"
                          }`}
                        >
                          Supports MP4, WebM, MOV, AVI formats
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {videoFile && (
                <div className="flex justify-end -mt-3">
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      isDarkMode
                        ? "border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30"
                        : "border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200"
                    }`}
                  >
                    Clear selected file
                  </button>
                </div>
              )}

              {/* Product Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-zinc-400" : "text-gray-600"
                    }`}
                  >
                    Select Target Product
                  </label>
                  {selectedProductId && (
                    <span className="text-xs text-violet-400 font-semibold">
                      Selected #{selectedProductId}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Search
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                      isDarkMode ? "text-zinc-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`pl-10 pr-4 py-2.5 rounded-xl w-full text-sm border transition-all ${
                      isDarkMode
                        ? "bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                        : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                    }`}
                  />
                </div>

                {/* Active Selected Card */}
                {selectedProductObj && (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isDarkMode
                        ? "bg-violet-500/10 border-violet-500/30 text-white"
                        : "bg-violet-50 border-violet-200 text-violet-900"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold truncate">
                        {selectedProductObj.name}
                      </p>
                      <p className="text-[11px] opacity-75">
                        ID: #{selectedProductObj.id}
                        {selectedProductObj.price
                          ? ` • ₹${selectedProductObj.price}`
                          : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(null)}
                      className="p-1 rounded-lg hover:bg-violet-500/20 text-violet-400 hover:text-white transition-colors cursor-pointer"
                      title="Clear selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Product Dropdown List */}
                {productList.length > 0 && (
                  <div
                    className={`max-h-48 overflow-y-auto border rounded-2xl divide-y transition-colors ${
                      isDarkMode
                        ? "border-zinc-800 bg-zinc-900/90 divide-zinc-800/60"
                        : "border-slate-200 bg-white divide-slate-100"
                    }`}
                  >
                    {productList.map((p: any) => {
                      const isSelected = selectedProductId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProductId(p.id)}
                          className={`p-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected
                              ? isDarkMode
                                ? "bg-violet-500/20 text-violet-300 font-semibold"
                                : "bg-violet-50 text-violet-900 font-semibold"
                              : isDarkMode
                              ? "hover:bg-zinc-800/60 text-zinc-300"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate font-medium">{p.name}</p>
                            <p
                              className={`text-xs ${
                                isDarkMode ? "text-zinc-500" : "text-gray-400"
                              }`}
                            >
                              ID: #{p.id}
                              {p.price ? ` • ₹${p.price}` : ""}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!videoFile || !selectedProductId || isloading}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isloading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>
                  {isloading ? "Uploading to Cloud..." : "Upload Showcase Video"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Video Library Card */}
        <div className="lg:col-span-2">
          <div
            className={`rounded-3xl border overflow-hidden transition-colors ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-800 text-white shadow-xl shadow-black/50"
                : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
            }`}
          >
            {/* Header */}
            <div
              className={`p-6 border-b flex items-center justify-between ${
                isDarkMode
                  ? "border-zinc-800/80 bg-zinc-900/30"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Play className="h-5 w-5 text-violet-500" />
                <span>Video Library</span>
              </h2>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            </div>

            {/* Body */}
            <div className="p-6">
              {status === "loading" && videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader inline size={110} text="Loading videos..." />
                </div>
              ) : videos.length === 0 ? (
                <div
                  className={`text-center py-16 px-4 rounded-2xl border border-dashed transition-colors ${
                    isDarkMode
                      ? "border-zinc-800/80 bg-zinc-900/20"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Video className="h-8 w-8" />
                  </div>
                  <h3
                    className={`text-base font-semibold ${
                      isDarkMode ? "text-zinc-200" : "text-gray-800"
                    }`}
                  >
                    No videos uploaded yet
                  </h3>
                  <p
                    className={`text-xs mt-1 max-w-sm mx-auto ${
                      isDarkMode ? "text-zinc-500" : "text-gray-500"
                    }`}
                  >
                    Upload your first product video showcase using the panel on
                    the left.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className={`rounded-2xl p-5 border transition-all ${
                        isDarkMode
                          ? "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/80 shadow-md shadow-black/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        {/* Video Player Box */}
                        <div className="w-full sm:w-52 h-36 rounded-xl overflow-hidden bg-black border border-zinc-800/90 relative flex-shrink-0 shadow-inner">
                          <video
                            ref={(el) => {
                              videoRefs.current[video.id] = el;
                            }}
                            src={getImageUrl(video.videoUrl)}
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                            onClick={() => toggleVideo(video.id)}
                          />
                        </div>

                        {/* Video Info & Controls */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              {editingId === video.id ? (
                                <div className="space-y-3">
                                  <label
                                    className={`text-xs font-semibold ${
                                      isDarkMode
                                        ? "text-zinc-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    Reassign Target Product
                                  </label>
                                  <div className="relative">
                                    <Search
                                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${
                                        isDarkMode
                                          ? "text-zinc-500"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <input
                                      type="text"
                                      placeholder="Search products..."
                                      value={search}
                                      onChange={(e) =>
                                        setSearch(e.target.value)
                                      }
                                      className={`pl-9 pr-3 py-1.5 rounded-lg text-xs border w-full sm:w-64 transition-all ${
                                        isDarkMode
                                          ? "bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500"
                                          : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                                      }`}
                                    />
                                  </div>
                                  {productList.length > 0 && (
                                    <div
                                      className={`max-h-32 overflow-y-auto border rounded-xl divide-y w-full sm:w-64 ${
                                        isDarkMode
                                          ? "bg-zinc-950 border-zinc-800 divide-zinc-800/60"
                                          : "bg-white border-slate-200 divide-slate-100"
                                      }`}
                                    >
                                      {productList.map((p: any) => (
                                        <div
                                          key={p.id}
                                          onClick={() =>
                                            setEditProductId(p.id)
                                          }
                                          className={`p-2 text-xs cursor-pointer truncate transition-colors ${
                                            editProductId === p.id
                                              ? isDarkMode
                                                ? "bg-violet-500/20 text-violet-300 font-semibold"
                                                : "bg-violet-50 text-violet-900 font-semibold"
                                              : isDarkMode
                                              ? "hover:bg-zinc-800 text-zinc-300"
                                              : "hover:bg-slate-50 text-slate-700"
                                          }`}
                                        >
                                          {p.name} (ID: #{p.id})
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <h3
                                    className={`text-base font-bold truncate ${
                                      isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {video.Product?.name ||
                                      `Product #${video.productId}`}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        isDarkMode
                                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                          : "bg-violet-50 text-violet-700 border-violet-200"
                                      }`}
                                    >
                                      Video #{video.id}
                                    </span>
                                    <span
                                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        isDarkMode
                                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      }`}
                                    >
                                      Product #{video.productId}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {editingId === video.id ? (
                                <>
                                  <button
                                    onClick={saveEdit}
                                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                      isDarkMode
                                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    }`}
                                    title="Save Changes"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                      isDarkMode
                                        ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                                    }`}
                                    title="Cancel"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(video)}
                                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                      isDarkMode
                                        ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                    title="Edit Product Association"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to delete this video?"
                                        )
                                      ) {
                                        try {
                                          await dispatch(
                                            deleteVideo(video.id)
                                          ).unwrap();
                                          toast.success(
                                            "Video deleted successfully!"
                                          );
                                        } catch (err: any) {
                                          console.error(
                                            "Failed to delete video:",
                                            err
                                          );
                                          toast.error(
                                            err?.message ||
                                              "Failed to delete video. Please try again."
                                          );
                                        }
                                      }
                                    }}
                                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                      isDarkMode
                                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                                        : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                    }`}
                                    title="Delete Video"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

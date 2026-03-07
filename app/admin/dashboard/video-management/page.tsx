"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
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
  Pause,
} from "lucide-react";
import {
  createVideo,
  deleteVideo,
  fetchVideos,
} from "@/app/lib/store/features/video.slice";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function VideoManager() {
  const dispatch = useAppDispatch();
  const { videos, status } = useAppSelector((state) => state.video);
  const { products } = useAppSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const isloading = status == "loading";
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

  const handleUpload = async () => {
    if (!videoFile || !selectedProductId) {
      alert("Please select both a product and video file");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("productId", selectedProductId.toString());

    await dispatch(createVideo(formData));
    setVideoFile(null);
    setSelectedProductId(null);
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
    const videoFile = files.find((file) => file.type.startsWith("video/"));
    if (videoFile) {
      setVideoFile(videoFile);
    }
  };

  const startEdit = (video: any) => {
    setEditingId(video.id);
    setEditProductId(video.productId);
  };

  const saveEdit = async () => {
    // Dispatch update action here if needed
    setEditingId(null);
    setEditProductId(null);
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
      // Pause all other videos
      Object.values(videoRefs.current).forEach((v) => v?.pause());
      currentVideo.play();
      setPlayingVideo(videoId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg">
              <Video className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Video Manager
            </h1>
          </div>
          <p className="text-gray-600">Manage your product videos with ease</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Upload className="h-5 w-5 text-violet-600" />
                Upload New Video
              </h2>

              <div className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragOver
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-violet-100 rounded-full">
                      <Upload className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {videoFile
                          ? videoFile.name
                          : "Drop video here or click to browse"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports MP4, MOV, AVI formats
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Search */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Select Product
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Product List */}
                {products?.products?.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl bg-white">
                    {products.products.map((p: any) => (
                      <div
                        key={p.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedProductId === p.id
                            ? "bg-gradient-to-r from-violet-100 to-indigo-100 border-l-4 border-violet-500 text-violet-900"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => setSelectedProductId(p.id)}
                      >
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm opacity-75">ID: {p.id}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!videoFile || !selectedProductId || isloading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  {isloading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {isloading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            </div>
          </div>

          {/* Video List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Play className="h-5 w-5 text-violet-600" />
                  Video Library
                  <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {videos.length} videos
                  </span>
                </h2>
              </div>

              <div className="p-6">
                {status === "loading" ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                    <p className="ml-3 text-gray-600">Loading videos...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No videos uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                      >
                        <div className="flex items-start gap-6">
                          {/* Video Thumbnail/Player */}
                          <div className="relative">
                            <video
                              ref={(el) => (videoRefs.current[video.id] = el)}
                              src={getImageUrl(video.videoUrl)}
                              className="w-48 h-32 object-cover rounded-lg shadow-md cursor-pointer"
                              poster=""
                              onClick={() => toggleVideo(video.id)}
                              controls
                            />
                          </div>

                          {/* Video Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                {editingId === video.id ? (
                                  <div className="space-y-3">
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                      <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 text-sm focus:ring-2 focus:ring-violet-500"
                                        value={search}
                                        onChange={(e) =>
                                          setSearch(e.target.value)
                                        }
                                      />
                                    </div>
                                    {products?.products?.length > 0 && (
                                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white w-64">
                                        {products.products.map((p: any) => (
                                          <div
                                            key={p.id}
                                            className={`p-2 cursor-pointer text-sm ${
                                              editProductId === p.id
                                                ? "bg-violet-100 text-violet-900"
                                                : "hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                              setEditProductId(p.id)
                                            }
                                          >
                                            {p.name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                      {video.Product?.name ||
                                        `Product #${video.productId}`}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                        ID: {video.id}
                                      </span>
                                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                        Product ID: {video.productId}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                {editingId === video.id ? (
                                  <>
                                    <button
                                      onClick={saveEdit}
                                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                      title="Save changes"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                      title="Cancel edit"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to delete this video?"
                                        )
                                      ) {
                                        dispatch(deleteVideo(video.id));
                                      }
                                    }}
                                    className="p-2 bg-red-100 text-green-700 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Delete video"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
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
    </div>
  );
}

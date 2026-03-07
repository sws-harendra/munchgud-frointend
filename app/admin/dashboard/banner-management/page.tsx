"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchBanners,
  deleteBanner,
  createBanner,
  updateBanner,
  Banner,
} from "@/app/lib/store/features/bannerSlice";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Tag,
  ExternalLink,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { categoryService } from "@/app/sercices/category.service";
import SidebarForm from "../../components/SidebarForm";
import BannerForm from "../../components/bannerForm";
import EditBannerForm from "../../components/editbanerform";

interface Category {
  id: number;
  name: string;
}

export default function AdminBannersPage() {
  const dispatch = useAppDispatch();
  const { banners, status } = useAppSelector((state) => state.banners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      dispatch(deleteBanner(id))
        .unwrap()
        .then(() => toast.success("Banner deleted successfully"))
        .catch(() => toast.error("Failed to delete banner"));
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsEditSidebarOpen(true);
  };

  const handleSuccess = () => {
    setEditingBanner(null);
    setIsEditSidebarOpen(false);
  };

  const handleAddSuccess = () => {
    setEditingBanner(null);
    setIsEditSidebarOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Banner Management
            </h1>
            <p className="text-gray-600">
              Manage your website banners and promotional content
            </p>
          </div>

          {/* Add Banner Button */}
          <SidebarForm
            title="Add New Banner"
            trigger={
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/25">
                <Plus size={18} />
                Add Banner
              </button>
            }
          >
            <BannerForm onSuccess={handleAddSuccess} />
          </SidebarForm>
        </div>

        {/* Edit Banner Sidebar (conditionally rendered) */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {banners.length}
              </p>
              <p className="text-sm text-gray-600">Total Banners</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {banners.filter((b) => b.Category).length}
              </p>
              <p className="text-sm text-gray-600">Categorized</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {banners.filter((b) => b.link).length}
              </p>
              <p className="text-sm text-gray-600">With Links</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {status === "loading" && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {banners.map((banner: Banner) => (
          <div
            key={banner.id}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={`${getImageUrl(banner.imageUrl)}`}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Badge */}
              {banner.Category && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    <Tag size={12} />
                    {banner.Category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {banner.subtitle}
                </p>
              )}

              {/* CTA Text */}
              {banner.ctaText && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {banner.ctaText}
                  </span>
                </div>
              )}

              {/* Date */}
              {banner.createdAt && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <Calendar size={12} />
                  {formatDate(banner.createdAt)}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <SidebarForm
                  title="Edit Banner"
                  trigger={
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  }
                >
                  <EditBannerForm
                    banner={banner}
                    onSuccess={() => handleAddSuccess}
                  />
                </SidebarForm>

                <button
                  onClick={() => handleDelete(banner.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-green-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {banners.length === 0 && status !== "loading" && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No banners yet
          </h3>
          <p className="text-gray-600 mb-8">
            Get started by creating your first banner
          </p>
        </div>
      )}
    </div>
  );
}

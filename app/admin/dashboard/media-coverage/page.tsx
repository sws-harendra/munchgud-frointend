"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchMediaCoverages,
  deleteMediaCoverage,
  toggleMediaCoverageStatus,
  MediaCoverage,
  setCurrentCoverage,
  clearCurrentCoverage,
} from "@/app/lib/store/features/mediaCoverageSlice";
import { Plus, Trash2, Edit, Eye, EyeOff, ExternalLink, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import MediaCoverageForm from "./components/MediaCoverageForm";
import SidebarForm from "../../components/SidebarForm";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import Loader from "@/app/commonComponents/loader";

const MediaCoveragePage = () => {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { coverages, status, currentCoverage } = useAppSelector(
    (state) => state.mediaCoverages
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMediaCoverages();
  }, []);

  const loadMediaCoverages = async () => {
    try {
      setIsLoading(true);
      await dispatch(fetchMediaCoverages()).unwrap();
    } catch (error) {
      toast.error("Failed to load media coverages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this media coverage?")) {
      try {
        await dispatch(deleteMediaCoverage(id)).unwrap();
        toast.success("Media coverage deleted successfully");
      } catch (error) {
        toast.error("Failed to delete media coverage");
      }
    }
  };

  const handleStatusToggle = async (id: number) => {
    try {
      await dispatch(toggleMediaCoverageStatus(id)).unwrap();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (coverage: MediaCoverage) => {
    dispatch(setCurrentCoverage(coverage));
    setIsSidebarOpen(true);
  };

  const handleFormSuccess = () => {
    setIsSidebarOpen(false);
    dispatch(clearCurrentCoverage());
    loadMediaCoverages();
  };

  const handleCancel = () => {
    setIsSidebarOpen(false);
    dispatch(clearCurrentCoverage());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between pb-6 border-b border-zinc-800/60">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Media Coverage
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isDarkMode
                  ? "bg-zinc-900 text-amber-400 border-zinc-800"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {coverages?.length || 0} Total
            </span>
          </div>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            }`}
          >
            Manage media coverage items that appear on the website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <SidebarForm
            title={
              currentCoverage ? "Edit Media Coverage" : "Add New Media Coverage"
            }
            trigger={
              <button
                type="button"
                onClick={() => {
                  dispatch(clearCurrentCoverage());
                  setIsSidebarOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Media Coverage
              </button>
            }
          >
            <MediaCoverageForm
              onSuccess={handleFormSuccess}
              initialData={currentCoverage}
              onCancel={handleCancel}
            />
          </SidebarForm>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader inline size={110} text="Loading media coverage..." />
          </div>
        ) : coverages.length === 0 ? (
          <div
            className={`rounded-2xl p-12 text-center border ${
              isDarkMode
                ? "bg-zinc-900/40 border-zinc-800/80"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                isDarkMode ? "bg-zinc-800/80 text-zinc-500" : "bg-gray-100 text-gray-400"
              }`}
            >
              <Newspaper className="h-7 w-7" />
            </div>
            <h3
              className={`text-base font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No media coverages found
            </h3>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              Get started by adding a new media coverage item above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {coverages.map((coverage) => (
              <div
                key={coverage.id}
                className={`group rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl ${
                  isDarkMode
                    ? "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Image */}
                <div
                  className={`relative h-48 flex items-center justify-center overflow-hidden ${
                    isDarkMode ? "bg-zinc-950/80" : "bg-gray-100"
                  }`}
                >
                  <img
                    src={getImageUrl(coverage.imageUrl)}
                    alt={coverage.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleStatusToggle(coverage.id)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer border ${
                        coverage.isActive
                          ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/80"
                          : "bg-zinc-900/80 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800"
                      }`}
                      title={
                        coverage.isActive
                          ? "Active - Click to deactivate"
                          : "Inactive - Click to activate"
                      }
                    >
                      {coverage.isActive ? (
                        <Eye size={15} />
                      ) : (
                        <EyeOff size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      className={`text-base font-semibold truncate transition-colors ${
                        isDarkMode
                          ? "text-white group-hover:text-amber-400"
                          : "text-gray-900 group-hover:text-amber-600"
                      }`}
                      title={coverage.title}
                    >
                      {coverage.title}
                    </h3>
                    <div className="mt-2">
                      <a
                        href={coverage.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          isDarkMode
                            ? "text-amber-400 hover:text-amber-300"
                            : "text-amber-600 hover:text-amber-700"
                        }`}
                      >
                        <ExternalLink size={13} />
                        View Article
                      </a>
                    </div>
                  </div>

                  <div
                    className={`pt-3 border-t flex justify-between items-center ${
                      isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                    }`}
                  >
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                        coverage.isActive
                          ? isDarkMode
                            ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/60"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isDarkMode
                          ? "bg-zinc-800/60 text-zinc-400 border-zinc-700/50"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {coverage.isActive ? "Active" : "Inactive"}
                    </span>

                    <div className="flex items-center gap-1">
                      <SidebarForm
                        title="Edit Media Coverage"
                        trigger={
                          <button
                            onClick={() => handleEdit(coverage)}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              isDarkMode
                                ? "text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/80"
                                : "text-gray-500 hover:text-amber-600 hover:bg-gray-100"
                            }`}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        }
                      >
                        <MediaCoverageForm
                          onSuccess={handleFormSuccess}
                          initialData={currentCoverage}
                          onCancel={handleCancel}
                          isEditMode={true}
                        />
                      </SidebarForm>

                      <button
                        onClick={() => handleDelete(coverage.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isDarkMode
                            ? "text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40"
                            : "text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCoveragePage;

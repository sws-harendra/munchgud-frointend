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
import { Plus, Trash2, Edit, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import MediaCoverageForm from "./components/MediaCoverageForm";
import SidebarForm from "../../components/SidebarForm";

const MediaCoveragePage = () => {
  const dispatch = useAppDispatch();
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Media Coverage
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage media coverage items that appear on the website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
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

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : coverages.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No media coverages
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new media coverage item.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {coverages.map((coverage) => (
                  <div
                    key={coverage.id}
                    className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 flex flex-col"
                  >
                    <div className="relative pb-3/4 h-48 bg-gray-100">
                      <img
                        src={getImageUrl(coverage.imageUrl)}
                        alt={coverage.title}
                        className="absolute h-full w-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleStatusToggle(coverage.id)}
                          className={`p-1.5 rounded-full ${
                            coverage.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          title={
                            coverage.isActive
                              ? "Active - Click to deactivate"
                              : "Inactive - Click to activate"
                          }
                        >
                          {coverage.isActive ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {coverage.title}
                      </h3>
                      <div className="mt-2 flex-1">
                        <a
                          href={coverage.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          View Link
                        </a>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            coverage.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {coverage.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex space-x-2">
                          <SidebarForm
                            title={
                              currentCoverage
                                ? "Edit Media Coverage"
                                : "Add New Media Coverage"
                            }
                            trigger={
                              <button
                                onClick={() => handleEdit(coverage)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit size={18} />
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
                            className="text-green-700 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={18} />
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
      </div>
    </div>
  );
};

export default MediaCoveragePage;

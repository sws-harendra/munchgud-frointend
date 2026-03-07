"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchSections,
  deleteSection,
} from "@/app/lib/store/features/sectionSlice";
import {
  Plus,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  Edit3,
  Grid3X3,
  Package,
  AlertTriangle,
} from "lucide-react";
import AddSectionForm from "../../components/addSection";
import SidebarForm from "../../components/SidebarForm";
import EditSectionForm from "../../components/editSection";

export default function SectionManager() {
  const dispatch = useAppDispatch();
  const { sections, loading } = useAppSelector((state) => state.section);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleDelete = (sectionId: number) => {
    dispatch(deleteSection(sectionId));
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-2xl">
                <Grid3X3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Section Manager
                </h1>
                <p className="text-gray-600 mt-1">
                  Organize and manage your product sections
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                <span className="text-sm font-medium text-gray-600">
                  {sections.length} Section{sections.length !== 1 ? "s" : ""}
                </span>
              </div>
              <SidebarForm
                title="Add Section"
                trigger={
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Plus size={20} />
                    Add Section
                  </button>
                }
              >
                <AddSectionForm />
              </SidebarForm>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading sections...</p>
              </div>
            </div>
          )}

          {!loading && sections.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No sections yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first section to start organizing products
              </p>
            </div>
          )}

          {!loading && sections.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold truncate">
                            {section.title}
                          </h3>
                          {section.isActive ? (
                            <Eye className="h-4 w-4 text-green-300" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-300" />
                          )}
                        </div>
                        <p className="text-indigo-100 text-sm line-clamp-2">
                          {section.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-indigo-700 uppercase">
                            {section.type}
                          </span>
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-gray-600">
                            Section Oder: {section.order}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-3 h-3 rounded-full ${
                          section.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${
                        section.isActive
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {section.isActive ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          section.isActive ? "text-green-700" : "text-gray-600"
                        }`}
                      >
                        {section.isActive ? "Active & Visible" : "Hidden"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <SidebarForm
                        title="Add Section"
                        trigger={
                          <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                          >
                            <Plus size={20} />
                            Edit
                          </button>
                        }
                      >
                        <EditSectionForm section={section} />
                      </SidebarForm>

                      {deleteConfirm === section.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(section.id)}
                            className="bg-green-700 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors"
                          >
                            <AlertTriangle size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-3 rounded-lg transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(section.id)}
                          className="bg-red-100 hover:bg-red-200 text-green-700 py-2 px-3 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

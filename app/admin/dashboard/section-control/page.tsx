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
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import Loader from "@/app/commonComponents/loader";

export default function SectionManager() {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

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
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-200 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-slate-50/70 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
              : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center">
              <Grid3X3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Section Manager
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Homepage
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Organize and manage your product sections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                  : "bg-gray-100 border-gray-200/60 text-gray-700"
              }`}
            >
              <span>
                {sections.length} Section{sections.length !== 1 ? "s" : ""}
              </span>
            </div>

            <SidebarForm
              title="Add Section"
              trigger={
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-xl font-medium cursor-pointer"
                >
                  <Plus size={19} />
                  <span>Add Section</span>
                </button>
              }
            >
              <AddSectionForm />
            </SidebarForm>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading && (
            <Loader size={110} text="Loading sections..." />
          )}

          {!loading && sections.length === 0 && (
            <div
              className={`rounded-3xl border p-12 sm:p-16 text-center transition-all ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
                  : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
              }`}
            >
              <div
                className={`p-6 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl border flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                }`}
              >
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-400" />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                No sections yet
              </h3>
              <p
                className={`max-w-md mx-auto text-sm mb-6 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Create your first section to start organizing products
              </p>
              <SidebarForm
                title="Add Section"
                trigger={
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 font-medium cursor-pointer">
                    <Plus size={18} />
                    <span>Add First Section</span>
                  </button>
                }
              >
                <AddSectionForm />
              </SidebarForm>
            </div>
          )}

          {!loading && sections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`rounded-3xl border overflow-hidden group transition-all duration-300 ${
                    isDarkMode
                      ? "bg-zinc-950 border-zinc-800/90 shadow-xl shadow-black/40 hover:border-zinc-700"
                      : "bg-white border-slate-200/80 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold truncate">
                            {section.title}
                          </h3>
                          {section.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                              <Eye className="h-3 w-3" /> Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/70 border border-white/20">
                              <EyeOff className="h-3 w-3" /> Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-indigo-100 text-sm line-clamp-2">
                          {section.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            isDarkMode
                              ? "bg-indigo-950/70 border border-indigo-800/60 text-indigo-300"
                              : "bg-indigo-50 border border-indigo-200 text-indigo-700"
                          }`}
                        >
                          {section.type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? "bg-zinc-900 border border-zinc-800 text-zinc-400"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          Order: {section.order}
                        </span>
                      </div>

                      <div
                        className={`w-3 h-3 rounded-full ${
                          section.isActive
                            ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                            : "bg-zinc-500"
                        }`}
                      />
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${
                        section.isActive
                          ? isDarkMode
                            ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                            : "bg-green-50 border-green-200 text-green-700"
                          : isDarkMode
                          ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {section.isActive ? (
                        <Eye className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-zinc-400" />
                      )}
                      <span>
                        {section.isActive ? "Active & Visible" : "Hidden"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div
                      className={`flex items-center justify-between pt-3 border-t ${
                        isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                      }`}
                    >
                      <SidebarForm
                        title="Edit Section"
                        trigger={
                          <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              isDarkMode
                                ? "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                          >
                            <Edit3 size={15} />
                            <span>Edit</span>
                          </button>
                        }
                      >
                        <EditSectionForm section={section} />
                      </SidebarForm>

                      {deleteConfirm === section.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(section.id)}
                            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                          >
                            <AlertTriangle size={14} />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className={`text-xs py-2 px-3 rounded-xl border transition-colors cursor-pointer ${
                              isDarkMode
                                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(section.id)}
                          title="Delete Section"
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                            isDarkMode
                              ? "bg-zinc-900 border-zinc-800 text-rose-400 hover:bg-rose-950/40 hover:border-rose-900"
                              : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                          }`}
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

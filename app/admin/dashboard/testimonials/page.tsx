"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchTestimonials,
  deleteTestimonial,
  Testimonial,
} from "@/app/lib/store/features/testimonialSlice";
import { Plus, Trash2, Edit, Eye, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import SidebarForm from "../../components/SidebarForm";
import TestimonialForm from "../../components/testimonialForm";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";

export default function AdminTestimonialsPage() {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { testimonials } = useAppSelector((state) => state.testimonial);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      dispatch(deleteTestimonial(id))
        .unwrap()
        .then(() => toast.success("Testimonial deleted successfully"))
        .catch(() => toast.error("Failed to delete testimonial"));
    }
  };

  const handleEdit = (t: Testimonial) => setEditing(t);
  const handleClose = () => setEditing(null);

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
              <MessageSquareQuote className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Testimonial Management
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Reviews
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Manage user feedback and customer reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                  : "bg-gray-100 border-gray-200/60 text-gray-700"
              }`}
            >
              <span>{testimonials.length} Testimonials</span>
            </div>

            <SidebarForm
              title="Add Testimonial"
              trigger={
                <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 font-medium cursor-pointer transition-all">
                  <Plus size={18} />
                  <span>Add Testimonial</span>
                </button>
              }
            >
              <TestimonialForm onSuccess={handleClose} />
            </SidebarForm>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((t) => (
            <div
              key={t.id}
              className={`rounded-3xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800/90 shadow-xl shadow-black/40 hover:border-zinc-700 text-white"
                  : "bg-white border-slate-200/80 shadow-sm hover:shadow-md text-gray-900"
              }`}
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {t.image ? (
                    <img
                      src={getImageUrl(t.image)}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {t.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-base">{t.name}</h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      {t.designation || "Customer"}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm italic line-clamp-4 ${
                    isDarkMode ? "text-zinc-300" : "text-gray-600"
                  }`}
                >
                  "{t.message}"
                </p>
              </div>

              <div
                className={`flex items-center justify-end gap-2 mt-6 pt-4 border-t ${
                  isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                }`}
              >
                <SidebarForm
                  title="Edit Testimonial"
                  trigger={
                    <button
                      onClick={() => handleEdit(t)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800 text-indigo-400 hover:bg-zinc-800"
                          : "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                      }`}
                    >
                      <Edit size={16} />
                    </button>
                  }
                >
                  <TestimonialForm
                    testimonial={editing}
                    onSuccess={handleClose}
                  />
                </SidebarForm>

                <button
                  onClick={() => handleDelete(t.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-rose-400 hover:bg-rose-950/40 hover:border-rose-900"
                      : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

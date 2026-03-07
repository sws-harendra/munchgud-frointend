"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchTestimonials,
  deleteTestimonial,
  createTestimonial,
  updateTestimonial,
  Testimonial,
} from "@/app/lib/store/features/testimonialSlice";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";
import SidebarForm from "../../components/SidebarForm";
import TestimonialForm from "../../components/testimonialForm";

export default function AdminTestimonialsPage() {
  const dispatch = useAppDispatch();
  const { testimonials, status } = useAppSelector((state) => state.testimonial);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Testimonial Management
          </h1>

          <SidebarForm
            title="Add Testimonial"
            trigger={
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-700 hover:to-purple-700">
                <Plus size={18} />
                Add Testimonial
              </button>
            }
          >
            <TestimonialForm onSuccess={handleClose} />
          </SidebarForm>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{testimonials.length}</p>
                <p className="text-sm text-gray-600">Total Testimonials</p>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
            >
              {t.image && (
                <img
                  src={getImageUrl(t.image)}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
              )}
              <h3 className="font-bold text-lg">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.designation}</p>
              <p className="mt-2 text-gray-700 text-sm">{t.message}</p>

              <div className="flex gap-3 mt-4">
                <SidebarForm
                  title="Add Testimonial"
                  trigger={
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                    >
                      <Edit size={16} className="text-blue-600" />
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
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100"
                >
                  <Trash2 size={16} className="text-green-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Sidebar */}
    </div>
  );
}

"use client";

import React from "react";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  toggleTopicStatusThunk,
  deleteTopicThunk,
} from "@/app/lib/store/features/communitySlice";
import { CommunityTopicItem } from "@/app/sercices/user/community.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { Plus, Eye, XCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TopicsTabProps {
  topics: CommunityTopicItem[];
  onOpenCreate: () => void;
  onOpenEdit: (item: CommunityTopicItem) => void;
}

export default function TopicsTab({
  topics,
  onOpenCreate,
  onOpenEdit,
}: TopicsTabProps) {
  const dispatch = useAppDispatch();
  const { isDark } = useAdminTheme();

  return (
    <div className="space-y-4">
      <div
        className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
        }`}
      >
        <div>
          <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-neutral-950"}`}>
            Category Topic Filters
          </h2>
          <p className={`text-xs ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
            Topic pills dynamically rendered on storefront header and feed filters.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category Topic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              isDark
                ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                : "bg-white border-neutral-200 shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isDark ? "text-amber-400" : "text-amber-800"
                  }`}
                >
                  Slug: {t.slug || t.topicId}
                </span>
                <h4 className={`text-base font-bold ${isDark ? "text-zinc-100" : "text-neutral-900"}`}>
                  {t.title}
                </h4>
                <p className={`text-xs ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
                  {t.desc}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  (t.isActive ?? t.status === "active")
                    ? isDark
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                      : "bg-emerald-100 text-emerald-800"
                    : isDark
                    ? "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {(t.isActive ?? t.status === "active") ? "Active" : "Hidden"}
              </span>
            </div>

            <div
              className={`flex items-center justify-between pt-2 border-t text-xs font-mono ${
                isDark ? "border-zinc-800 text-zinc-400" : "border-neutral-100 text-neutral-500"
              }`}
            >
              <span>Order: #{t.displayOrder}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={async () => {
                    try {
                      await dispatch(toggleTopicStatusThunk(t.id)).unwrap();
                      toast.success("Topic status updated");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to update");
                    }
                  }}
                  className={`p-1.5 rounded-lg cursor-pointer transition ${
                    isDark ? "hover:text-zinc-100 hover:bg-zinc-800" : "hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                  title="Toggle Topic Status"
                >
                  {(t.isActive ?? t.status === "active") ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onOpenEdit(t)}
                  className={`p-1.5 rounded-lg cursor-pointer transition ${
                    isDark ? "hover:text-zinc-100 hover:bg-zinc-800" : "hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                  title="Edit Topic"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm(`Delete topic ${t.title}?`)) {
                      try {
                        await dispatch(deleteTopicThunk(t.id)).unwrap();
                        toast.success("Topic deleted");
                      } catch (err: any) {
                        toast.error(err.message || "Failed to delete");
                      }
                    }
                  }}
                  className={`p-1.5 rounded-lg cursor-pointer transition ${
                    isDark
                      ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                      : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  }`}
                  title="Delete Topic"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

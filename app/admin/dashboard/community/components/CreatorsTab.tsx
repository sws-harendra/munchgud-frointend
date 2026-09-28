"use client";

import React from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  toggleCreatorStatusThunk,
  deleteCreatorThunk,
} from "@/app/lib/store/features/communitySlice";
import { CommunityCreatorItem } from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CreatorsTabProps {
  creators: CommunityCreatorItem[];
  onOpenCreate: () => void;
  onOpenEdit: (item: CommunityCreatorItem) => void;
}

export default function CreatorsTab({
  creators,
  onOpenCreate,
  onOpenEdit,
}: CreatorsTabProps) {
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
            Creator Spotlight Polaroids
          </h2>
          <p className={`text-xs ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
            Featured ambassadors and creators showcased in rotating Polaroid cards on the community storefront.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Featured Creator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {creators.map((c) => (
          <div
            key={c.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
              isDark
                ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                : "bg-white border-neutral-200 shadow-xs hover:shadow-lg"
            }`}
          >
            <div className="space-y-3">
              {/* Polaroid Image */}
              <div
                className={`relative aspect-[4/5] rounded-xl overflow-hidden border ${
                  isDark ? "bg-zinc-900 border-zinc-800" : "bg-neutral-900 border-neutral-100"
                }`}
              >
                <Image
                  src={getImageUrl(c.img)}
                  alt={c.handle}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.isActive
                        ? "bg-emerald-600 text-white"
                        : isDark
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-neutral-700 text-white"
                    }`}
                  >
                    {c.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-black ${isDark ? "text-zinc-100" : "text-neutral-900"}`}>
                  {c.handle}
                </h3>
                <p className={`text-xs font-medium ${isDark ? "text-amber-400" : "text-amber-800"}`}>
                  {c.role}
                </p>
                <p className={`text-[10px] font-mono mt-0.5 ${isDark ? "text-zinc-500" : "text-neutral-400"}`}>
                  Order: #{c.displayOrder}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center justify-between pt-3 mt-3 border-t ${
                isDark ? "border-zinc-800" : "border-neutral-100"
              }`}
            >
              <button
                onClick={async () => {
                  try {
                    await dispatch(toggleCreatorStatusThunk(c.id)).unwrap();
                    toast.success("Creator status updated");
                  } catch (err: any) {
                    toast.error(err.message || "Failed to toggle status");
                  }
                }}
                className={`text-xs font-bold cursor-pointer transition ${
                  isDark ? "text-zinc-400 hover:text-zinc-200" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {c.isActive ? "Deactivate" : "Activate"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenEdit(c)}
                  className={`p-1.5 rounded-lg cursor-pointer transition ${
                    isDark
                      ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                  title="Edit Creator"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete creator ${c.handle}?`)) {
                      try {
                        await dispatch(deleteCreatorThunk(c.id)).unwrap();
                        toast.success("Creator deleted");
                      } catch (err: any) {
                        toast.error(err.message || "Failed to delete creator");
                      }
                    }
                  }}
                  className={`p-1.5 rounded-lg cursor-pointer transition ${
                    isDark
                      ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                      : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  }`}
                  title="Delete Creator"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

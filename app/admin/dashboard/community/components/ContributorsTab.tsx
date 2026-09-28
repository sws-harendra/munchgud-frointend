"use client";

import React from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  toggleContributorStatusThunk,
  deleteContributorThunk,
} from "@/app/lib/store/features/communitySlice";
import { CommunityContributorItem } from "@/app/sercices/user/community.service";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ContributorsTabProps {
  contributors: CommunityContributorItem[];
  onOpenCreate: () => void;
  onOpenEdit: (item: CommunityContributorItem) => void;
}

export default function ContributorsTab({
  contributors,
  onOpenCreate,
  onOpenEdit,
}: ContributorsTabProps) {
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
            Top Contributors Leaderboard
          </h2>
          <p className={`text-xs ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
            Hall-of-fame community members displayed in the sidebar leaderboard with points and role badges.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contributor</span>
        </button>
      </div>

      <div
        className={`rounded-2xl border transition-colors overflow-hidden ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
        }`}
      >
        <div className={`divide-y ${isDark ? "divide-zinc-800/80" : "divide-neutral-100"}`}>
          {contributors.map((member) => (
            <div
              key={member.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                isDark ? "hover:bg-zinc-900/60" : "hover:bg-neutral-50/80"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black font-mono text-sm ${
                    isDark
                      ? "bg-amber-950/70 border-amber-800/60 text-amber-300"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  #{member.rank}
                </div>

                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-full overflow-hidden relative shrink-0 border ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900 text-amber-300"
                      : "border-neutral-200 bg-neutral-100 text-amber-900"
                  }`}
                >
                  {member.avatar ? (
                    <Image
                      src={getImageUrl(member.avatar)}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center font-bold text-xs ${
                        isDark ? "bg-zinc-800 text-amber-300" : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h4
                    className={`text-sm font-bold flex items-center gap-2 ${
                      isDark ? "text-zinc-100" : "text-neutral-900"
                    }`}
                  >
                    <span>{member.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        member.badgeClass ||
                        (isDark
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800/50"
                          : "bg-amber-100 text-amber-900")
                      }`}
                    >
                      {member.role}
                    </span>
                  </h4>
                  <p
                    className={`text-xs font-mono font-bold ${
                      isDark ? "text-amber-400" : "text-amber-800"
                    }`}
                  >
                    {member.points}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      await dispatch(toggleContributorStatusThunk(member.id)).unwrap();
                      toast.success("Contributor status updated");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to toggle");
                    }
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition ${
                    member.isActive
                      ? isDark
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                        : "bg-emerald-50 text-emerald-700"
                      : isDark
                      ? "bg-zinc-900 text-zinc-400 border border-zinc-800"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {member.isActive ? "Active" : "Hidden"}
                </button>

                <button
                  onClick={() => onOpenEdit(member)}
                  className={`p-2 rounded-lg cursor-pointer transition ${
                    isDark
                      ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm(`Delete contributor ${member.name}?`)) {
                      try {
                        await dispatch(deleteContributorThunk(member.id)).unwrap();
                        toast.success("Contributor deleted");
                      } catch (err: any) {
                        toast.error(err.message || "Failed to delete");
                      }
                    }
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition ${
                    isDark
                      ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                      : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

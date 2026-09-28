"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  contactService,
  ContactInquiryItem,
  InquiriesStats,
} from "@/app/sercices/user/contact.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import {
  Mail,
  Search,
  RefreshCw,
  MessageSquare,
  Sparkles,
  UserCheck,
  UserX,
  Phone,
  Clock,
  Trash2,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock3,
  Archive,
  Save,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminInquiriesPage() {
  const { isDark } = useAdminTheme();

  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [stats, setStats] = useState<InquiriesStats>({
    total: 0,
    newCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
    conciergeCount: 0,
    contactFormCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Editing Note State
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getAllInquiriesAdmin({
        status: statusFilter,
        source: sourceFilter,
        search: searchQuery,
      });
      if (res.success) {
        setInquiries(res.inquiries);
        if (res.stats) setStats(res.stats);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load customer inquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter, sourceFilter]);

  // Handle Search Debounce / Trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadInquiries();
  };

  // Status Change Handler
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await contactService.updateInquiryStatusAdmin(id, { status: newStatus });
      toast.success(`Inquiry marked as ${newStatus.replace("_", " ")}`);
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
      );
      // Refresh stats
      loadInquiries();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Save Admin Note
  const handleSaveNote = async (id: number) => {
    try {
      await contactService.updateInquiryStatusAdmin(id, { adminNotes: noteText });
      toast.success("Admin note saved");
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, adminNotes: noteText } : item))
      );
      setEditingNoteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save note");
    }
  };

  // Delete Inquiry
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;
    try {
      await contactService.deleteInquiryAdmin(id);
      toast.success("Inquiry deleted successfully");
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      loadInquiries();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete inquiry");
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        isDark ? "bg-black text-zinc-100" : "bg-[#FDFCFB] text-neutral-900"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP CONTROLS
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`border-b sticky top-0 z-30 shadow-xs transition-colors ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200/80"
        }`}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-800/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h1
                  className={`text-xl sm:text-2xl font-serif font-black tracking-tight ${
                    isDark ? "text-white" : "text-neutral-950"
                  }`}
                >
                  Customer Inquiries & Concierge Hub
                </h1>
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-zinc-400" : "text-neutral-500"
                  }`}
                >
                  Unified inbox for Contact Us messages and Live Concierge chat requests with user identity tracking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadInquiries}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                    : "text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                }`}
                title="Reload Inquiries"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* KPI Stats Bar */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t ${
              isDark ? "border-zinc-800" : "border-neutral-100"
            }`}
          >
            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-zinc-400" : "text-neutral-500"
                }`}
              >
                Total Inquiries
              </span>
              <span className={`text-lg font-black ${isDark ? "text-white" : "text-neutral-950"}`}>
                {stats.total}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-zinc-400">All channels</span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-amber-400" : "text-amber-700"
                }`}
              >
                New / Unread
              </span>
              <span className={`text-lg font-black ${isDark ? "text-amber-400" : "text-amber-800"}`}>
                {stats.newCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-amber-500">Needs review</span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-sky-400" : "text-sky-700"
                }`}
              >
                In Progress
              </span>
              <span className={`text-lg font-black ${isDark ? "text-sky-400" : "text-sky-800"}`}>
                {stats.inProgressCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-sky-500">Responding</span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                Resolved
              </span>
              <span className={`text-lg font-black ${isDark ? "text-emerald-400" : "text-emerald-800"}`}>
                {stats.resolvedCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-emerald-500">Closed</span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-purple-400" : "text-purple-700"
                }`}
              >
                Live Concierge
              </span>
              <span className={`text-lg font-black ${isDark ? "text-purple-400" : "text-purple-800"}`}>
                {stats.conciergeCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-purple-400">Chat tickets</span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-zinc-400" : "text-neutral-500"
                }`}
              >
                Contact Form
              </span>
              <span className={`text-lg font-black ${isDark ? "text-zinc-200" : "text-neutral-900"}`}>
                {stats.contactFormCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-zinc-400">Web submissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER & SEARCH CONTROLS
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 mt-6 space-y-4">
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
          }`}
        >
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-zinc-500" : "text-neutral-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by customer name, email, phone, order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500"
                    : "bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600"
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition shrink-0"
            >
              Search
            </button>
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className={`text-xs px-3 py-2 rounded-xl border font-medium focus:outline-none cursor-pointer transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-200 focus:border-amber-500"
                  : "bg-neutral-50/50 border-neutral-200 text-neutral-700 focus:border-amber-600"
              }`}
            >
              <option value="all">All Sources</option>
              <option value="contact_form">Contact Form</option>
              <option value="live_concierge">Live Concierge</option>
              <option value="support_warranty">Warranty Page</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`text-xs px-3 py-2 rounded-xl border font-medium focus:outline-none cursor-pointer transition-colors ${
                isDark
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-200 focus:border-amber-500"
                  : "bg-neutral-50/50 border-neutral-200 text-neutral-700 focus:border-amber-600"
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="new">New ({stats.newCount})</option>
              <option value="in_progress">In Progress ({stats.inProgressCount})</option>
              <option value="resolved">Resolved ({stats.resolvedCount})</option>
            </select>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. INQUIRIES LIST
           ───────────────────────────────────────────────────────────── */}
        <div
          className={`rounded-2xl border transition-colors overflow-hidden ${
            isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-neutral-200 shadow-xs"
          }`}
        >
          {inquiries.length === 0 ? (
            <div className={`p-16 text-center ${isDark ? "text-zinc-500" : "text-neutral-400"}`}>
              <Mail
                className={`w-12 h-12 mx-auto stroke-1 mb-3 ${
                  isDark ? "text-zinc-600" : "text-neutral-300"
                }`}
              />
              <p className="text-sm font-semibold">No inquiries found matching your filters.</p>
              <p className="text-xs mt-1">Customer messages from the website and live chat concierge will appear here.</p>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? "divide-zinc-800/80" : "divide-neutral-100"}`}>
              {inquiries.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 transition-colors space-y-3 ${
                    isDark ? "hover:bg-zinc-900/50" : "hover:bg-neutral-50/60"
                  }`}
                >
                  {/* Top Row: User Identity, Badges & Time */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 border ${
                          item.user
                            ? isDark
                              ? "bg-amber-950/80 border-amber-800/70 text-amber-300"
                              : "bg-amber-100 border-amber-200 text-amber-900"
                            : isDark
                            ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                            : "bg-neutral-100 border-neutral-200 text-neutral-600"
                        }`}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name & Identity */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm font-black ${
                              isDark ? "text-zinc-100" : "text-neutral-900"
                            }`}
                          >
                            {item.name}
                          </h3>

                          {/* USER IDENTITY BADGE */}
                          {item.user || item.userId ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                isDark
                                  ? "bg-amber-950/80 border border-amber-800/70 text-amber-300"
                                  : "bg-amber-100 border border-amber-300 text-amber-900"
                              }`}
                              title={`Registered User ID: #${item.user?.id || item.userId}`}
                            >
                              <UserCheck className="w-3 h-3" />
                              Registered Member
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                                isDark
                                  ? "bg-zinc-900 border border-zinc-800 text-zinc-400"
                                  : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              <UserX className="w-3 h-3" />
                              Guest Visitor
                            </span>
                          )}

                          {/* SOURCE BADGE */}
                          {item.source === "live_concierge" ? (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                                isDark
                                  ? "bg-purple-950/70 border border-purple-800/60 text-purple-300"
                                  : "bg-purple-100 text-purple-900"
                              }`}
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              Live Concierge Chat
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                                isDark
                                  ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                  : "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              <Mail className="w-2.5 h-2.5" />
                              Contact Form
                            </span>
                          )}

                          {/* Order ID */}
                          {item.orderId && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                isDark
                                  ? "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              Order #{item.orderId}
                            </span>
                          )}
                        </div>

                        {/* Contact details row */}
                        <div
                          className={`flex flex-wrap items-center gap-3 text-xs mt-0.5 ${
                            isDark ? "text-zinc-400" : "text-neutral-500"
                          }`}
                        >
                          <a
                            href={`mailto:${item.email}?subject=Regarding your Flazo inquiry`}
                            className="hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-amber-500" />
                            <span>{item.email}</span>
                          </a>

                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-500" />
                              <span>{item.phone}</span>
                            </a>
                          )}

                          <span className="flex items-center gap-1 text-[11px] font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Dropdown & Actions */}
                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold focus:outline-none cursor-pointer transition ${
                          item.status === "new"
                            ? isDark
                              ? "bg-amber-950/70 border-amber-800/60 text-amber-300"
                              : "bg-amber-100 border-amber-300 text-amber-900"
                            : item.status === "in_progress"
                            ? isDark
                              ? "bg-sky-950/70 border-sky-800/60 text-sky-300"
                              : "bg-sky-100 border-sky-300 text-sky-900"
                            : item.status === "resolved"
                            ? isDark
                              ? "bg-emerald-950/70 border-emerald-800/60 text-emerald-300"
                              : "bg-emerald-100 border-emerald-300 text-emerald-900"
                            : isDark
                            ? "bg-zinc-800 text-zinc-300"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        <option value="new">● New</option>
                        <option value="in_progress">● In Progress</option>
                        <option value="resolved">● Resolved</option>
                        <option value="closed">● Closed</option>
                      </select>

                      <a
                        href={`mailto:${item.email}?subject=Flazo Support - Re: ${item.subject || "Your Inquiry"}&body=Hi ${item.name},%0D%0A%0D%0AThank you for contacting Flazo Support.`}
                        className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          isDark
                            ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                        title="Reply via Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reply</span>
                      </a>

                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className={`p-2 rounded-lg transition cursor-pointer ${
                          isDark
                            ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        }`}
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message Bubble Box */}
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-colors ${
                      isDark
                        ? "bg-zinc-900/60 border-zinc-800/80 text-zinc-200"
                        : "bg-neutral-50/70 border-neutral-200 text-neutral-800"
                    }`}
                  >
                    {item.subject && (
                      <p className={`font-bold mb-1 ${isDark ? "text-amber-400" : "text-amber-800"}`}>
                        Subject: {item.subject}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{item.message}</p>
                  </div>

                  {/* Admin Notes Section */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    {editingNoteId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add internal admin note regarding this customer..."
                          className={`flex-1 px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
                            isDark
                              ? "bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-amber-500"
                              : "bg-white border-neutral-200 text-neutral-900 focus:border-amber-600"
                          }`}
                        />
                        <button
                          onClick={() => handleSaveNote(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-neutral-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        {item.adminNotes ? (
                          <p
                            className={`text-xs italic flex items-center gap-1.5 ${
                              isDark ? "text-amber-400/90" : "text-amber-800"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Note: {item.adminNotes}</span>
                          </p>
                        ) : null}

                        <button
                          onClick={() => {
                            setEditingNoteId(item.id);
                            setNoteText(item.adminNotes || "");
                          }}
                          className={`text-[11px] font-medium underline cursor-pointer ${
                            isDark ? "text-zinc-500 hover:text-zinc-300" : "text-neutral-400 hover:text-neutral-700"
                          }`}
                        >
                          {item.adminNotes ? "Edit Note" : "+ Add Internal Note"}
                        </button>
                      </div>
                    )}

                    {item.ipAddress && (
                      <span className={`text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-neutral-400"}`}>
                        IP: {item.ipAddress}
                      </span>
                    )}
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

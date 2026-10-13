"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  warrantyService,
  WarrantyItem,
  WarrantyStats,
} from "@/app/sercices/user/warranty.service";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import {
  ShieldCheck,
  Shield,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  Clock3,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Copy,
  Trash2,
  ExternalLink,
  MessageCircle,
  Calendar,
  Sparkles,
  Download,
  Filter,
  Eye,
  Check,
  X,
  UserCheck,
  UserX,
  Package,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminWarrantyClaimsPage() {
  const { isDark } = useAdminTheme();

  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [stats, setStats] = useState<WarrantyStats>({
    total: 0,
    approvedCount: 0,
    pendingCount: 0,
    inReviewCount: 0,
    resolvedCount: 0,
    rejectedCount: 0,
    expiredCount: 0,
    registrationsCount: 0,
    claimsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Selected item for Detailed Modal
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyItem | null>(null);
  const [modalAdminNotes, setModalAdminNotes] = useState("");
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Load warranties from backend
  const loadWarranties = async () => {
    setIsLoading(true);
    try {
      const res = await warrantyService.getAllWarrantiesAdmin({
        status: statusFilter,
        claimType: typeFilter,
        search: searchQuery,
      });
      if (res.success) {
        setWarranties(res.warranties);
        if (res.stats) setStats(res.stats);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load warranty claims");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWarranties();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadWarranties();
  };

  // Status Change Handler
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await warrantyService.updateWarrantyStatusAdmin(id, { status: newStatus });
      toast.success(`Warranty marked as ${newStatus.replace("_", " ")}`);
      setWarranties((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
      );
      if (selectedWarranty?.id === id) {
        setSelectedWarranty((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      loadWarranties();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Save Admin Note
  const handleSaveModalNotes = async () => {
    if (!selectedWarranty) return;
    setIsUpdatingNotes(true);
    try {
      await warrantyService.updateWarrantyStatusAdmin(selectedWarranty.id, {
        adminNotes: modalAdminNotes,
      });
      toast.success("Internal note saved successfully");
      setWarranties((prev) =>
        prev.map((item) =>
          item.id === selectedWarranty.id ? { ...item, adminNotes: modalAdminNotes } : item
        )
      );
      setSelectedWarranty((prev) =>
        prev ? { ...prev, adminNotes: modalAdminNotes } : null
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to save note");
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  // Delete Warranty Record
  const handleDelete = async (id: number, serial: string) => {
    if (!window.confirm(`Are you sure you want to delete warranty record for serial ${serial}?`)) {
      return;
    }
    try {
      await warrantyService.deleteWarrantyAdmin(id);
      toast.success("Warranty record deleted successfully");
      setWarranties((prev) => prev.filter((item) => item.id !== id));
      if (selectedWarranty?.id === id) setSelectedWarranty(null);
      loadWarranties();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete warranty record");
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!warranties.length) {
      toast.error("No data to export");
      return;
    }
    const headers = [
      "Claim ID",
      "Type",
      "Customer Name",
      "Phone",
      "Email",
      "Model",
      "Serial Number",
      "Order ID",
      "Status",
      "Start Date",
      "End Date",
      "Created At",
    ];
    const rows = warranties.map((w) => [
      w.claimId,
      w.claimType,
      `"${w.fullName.replace(/"/g, '""')}"`,
      w.phone,
      w.email || "",
      `"${w.productModel.replace(/"/g, '""')}"`,
      w.serialNumber,
      w.orderId || "",
      w.status,
      w.warrantyStartDate ? new Date(w.warrantyStartDate).toLocaleDateString() : "",
      w.warrantyEndDate ? new Date(w.warrantyEndDate).toLocaleDateString() : "",
      new Date(w.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flazo-warranties-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported warranty claims to CSV");
  };

  // Helper for status badge colors
  const getStatusBadge = (status: string, endDate?: string) => {
    const isExpired = endDate ? new Date(endDate) < new Date() : false;
    if (isExpired) {
      return {
        label: "Expired",
        className: isDark
          ? "bg-neutral-800 text-neutral-400 border-neutral-700"
          : "bg-neutral-100 text-neutral-600 border-neutral-200",
      };
    }
    switch (status) {
      case "approved":
        return {
          label: "Active / Approved",
          className: isDark
            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
            : "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "pending":
        return {
          label: "Pending Review",
          className: isDark
            ? "bg-amber-950/80 text-amber-400 border-amber-800"
            : "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "in_review":
        return {
          label: "In Review / Service",
          className: isDark
            ? "bg-blue-950/80 text-blue-400 border-blue-800"
            : "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "resolved":
        return {
          label: "Resolved / Replaced",
          className: isDark
            ? "bg-teal-950/80 text-teal-400 border-teal-800"
            : "bg-teal-50 text-teal-700 border-teal-200",
        };
      case "rejected":
        return {
          label: "Rejected",
          className: isDark
            ? "bg-rose-950/80 text-rose-400 border-rose-800"
            : "bg-rose-50 text-rose-700 border-rose-200",
        };
      default:
        return {
          label: status,
          className: isDark
            ? "bg-zinc-800 text-zinc-300 border-zinc-700"
            : "bg-neutral-100 text-neutral-700 border-neutral-200",
        };
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        isDark ? "bg-black text-zinc-100" : "bg-[#FDFCFB] text-neutral-900"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & CONTROLS
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
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1
                  className={`text-xl sm:text-2xl font-serif font-black tracking-tight ${
                    isDark ? "text-white" : "text-neutral-950"
                  }`}
                >
                  Warranty Registrations & Claims Hub
                </h1>
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-zinc-400" : "text-neutral-500"
                  }`}
                >
                  Live management for 1-Year Flazo product warranties, serial numbers, and customer service claims.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                    : "text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                }`}
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={loadWarranties}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                    : "text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                }`}
                title="Reload Data"
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
            {/* Total */}
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
                Total Records
              </span>
              <span className={`text-lg font-black ${isDark ? "text-white" : "text-neutral-950"}`}>
                {stats.total}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-zinc-400">All submissions</span>
            </div>

            {/* Active / Approved */}
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
                Active Warranties
              </span>
              <span className={`text-lg font-black ${isDark ? "text-emerald-400" : "text-emerald-800"}`}>
                {stats.approvedCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-emerald-500">1-Year Protected</span>
            </div>

            {/* Pending Review */}
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
                Pending Review
              </span>
              <span className={`text-lg font-black ${isDark ? "text-amber-400" : "text-amber-800"}`}>
                {stats.pendingCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-amber-500">Awaiting action</span>
            </div>

            {/* In Review / Service */}
            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-blue-400" : "text-blue-700"
                }`}
              >
                In Review / Service
              </span>
              <span className={`text-lg font-black ${isDark ? "text-blue-400" : "text-blue-800"}`}>
                {stats.inReviewCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-blue-500">Processing</span>
            </div>

            {/* Resolved */}
            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-[#FAF7F2] border-amber-900/10"
              }`}
            >
              <span
                className={`text-[11px] font-mono uppercase tracking-wider block ${
                  isDark ? "text-teal-400" : "text-teal-700"
                }`}
              >
                Resolved / Replaced
              </span>
              <span className={`text-lg font-black ${isDark ? "text-teal-400" : "text-teal-800"}`}>
                {stats.resolvedCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-teal-500">Completed</span>
            </div>

            {/* Claims vs Registrations */}
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
                Claim Requests
              </span>
              <span className={`text-lg font-black ${isDark ? "text-purple-400" : "text-purple-800"}`}>
                {stats.claimsCount}
              </span>
              <span className="text-[10px] font-medium ml-1.5 text-purple-500">
                {stats.registrationsCount} Registered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER & SEARCH CONTROLS
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 py-5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Phone, Serial #, Order ID, Model, or Claim ID..."
              className={`w-full pl-9 pr-20 py-2.5 rounded-xl text-xs font-medium border transition focus:outline-hidden ${
                isDark
                  ? "bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-600"
                  : "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-700"
              }`}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold rounded-lg transition"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                    : "bg-white border-neutral-200 text-neutral-800"
                }`}
              >
                <option value="all">All Statuses ({stats.total})</option>
                <option value="approved">Active / Approved ({stats.approvedCount})</option>
                <option value="pending">Pending Review ({stats.pendingCount})</option>
                <option value="in_review">In Review / Service ({stats.inReviewCount})</option>
                <option value="resolved">Resolved / Replaced ({stats.resolvedCount})</option>
                <option value="rejected">Rejected ({stats.rejectedCount})</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
                Type:
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                    : "bg-white border-neutral-200 text-neutral-800"
                }`}
              >
                <option value="all">All Types</option>
                <option value="registration">Product Registrations ({stats.registrationsCount})</option>
                <option value="claim">Warranty Claims ({stats.claimsCount})</option>
                <option value="replacement">Replacement Requests</option>
              </select>
            </div>

            {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  loadWarranties();
                }}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN TABLE OF WARRANTY CLAIMS
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8">
        <div
          className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-neutral-200/90"
          }`}
        >
          {isLoading ? (
            <div className="p-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-600" />
              <p className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
                Fetching dynamic warranty data...
              </p>
            </div>
          ) : warranties.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  No Warranty Claims Found
                </h3>
                <p className={`text-xs max-w-md mx-auto ${isDark ? "text-zinc-400" : "text-neutral-500"}`}>
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters or search keywords."
                    : "No product registrations or warranty claims have been submitted yet. They will appear here dynamically as users register on the Support & Warranty page."}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800 text-zinc-400"
                        : "bg-[#FAF7F2] border-neutral-200 text-neutral-600"
                    }`}
                  >
                    <th className="py-3.5 px-4 font-bold">Warranty / Claim ID</th>
                    <th className="py-3.5 px-4 font-bold">Customer Details</th>
                    <th className="py-3.5 px-4 font-bold">Product & Serial No.</th>
                    <th className="py-3.5 px-4 font-bold">Coverage Validity</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-zinc-800/80" : "divide-neutral-100"
                  }`}
                >
                  {warranties.map((item) => {
                    const badge = getStatusBadge(item.status, item.warrantyEndDate);
                    const isClaim = item.claimType === "claim" || item.claimType === "replacement";

                    return (
                      <tr
                        key={item.id}
                        className={`transition hover:bg-amber-500/5 ${
                          selectedWarranty?.id === item.id
                            ? isDark
                              ? "bg-amber-500/10"
                              : "bg-amber-50"
                            : ""
                        }`}
                      >
                        {/* 1. Claim ID & Type */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                                #{item.claimId}
                              </span>
                              <button
                                onClick={() => handleCopy(item.claimId, "Claim ID")}
                                className="text-neutral-400 hover:text-amber-700 transition"
                                title="Copy ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isClaim
                                  ? isDark
                                    ? "bg-purple-950/80 text-purple-300 border-purple-800"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                  : isDark
                                  ? "bg-amber-950/80 text-amber-300 border-amber-800"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {isClaim ? (
                                <>
                                  <Wrench className="w-2.5 h-2.5" />
                                  <span>Service Claim</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-2.5 h-2.5" />
                                  <span>1-Yr Warranty Reg</span>
                                </>
                              )}
                            </span>

                            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Customer Details */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-[#1A1A1A] dark:text-white">
                              {item.fullName}
                            </p>

                            <div className="flex items-center gap-2 text-xs">
                              <a
                                href={`tel:${item.phone}`}
                                className="text-neutral-600 dark:text-neutral-300 hover:text-amber-600 flex items-center gap-1 font-mono"
                              >
                                <Phone className="w-3 h-3 text-neutral-400" />
                                <span>{item.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 text-[11px] font-bold flex items-center gap-0.5"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>

                            {item.email && (
                              <p className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1 text-[11px]">
                                <Mail className="w-3 h-3 text-neutral-400" />
                                <span>{item.email}</span>
                              </p>
                            )}

                            {item.user ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                <UserCheck className="w-3 h-3" />
                                <span>Registered Account #{item.user.id}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400">
                                <UserX className="w-3 h-3" />
                                <span>Guest Registration</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Product & Serial */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1">
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{item.productModel}</span>
                            </p>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono uppercase bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-700 text-neutral-700 dark:text-neutral-300 font-bold">
                                S/N: {item.serialNumber}
                              </span>
                              <button
                                onClick={() => handleCopy(item.serialNumber, "Serial Number")}
                                className="text-neutral-400 hover:text-neutral-700"
                                title="Copy Serial"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            {item.orderId && item.orderId !== item.serialNumber && (
                              <p className="text-[11px] text-neutral-500">
                                Order: <span className="font-mono font-medium">{item.orderId}</span>
                              </p>
                            )}

                            {item.issueDescription && (
                              <div className="mt-1.5 p-2 rounded-lg bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/50 text-[11px] text-purple-900 dark:text-purple-200">
                                <span className="font-bold block">Issue Description:</span>
                                <p className="line-clamp-2">{item.issueDescription}</p>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Coverage Validity */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1">
                            <div className="text-[11px]">
                              <span className="text-neutral-400">From: </span>
                              <span className="font-medium">
                                {item.warrantyStartDate
                                  ? new Date(item.warrantyStartDate).toLocaleDateString()
                                  : "Instant"}
                              </span>
                            </div>

                            <div className="text-[11px]">
                              <span className="text-neutral-400">Expires: </span>
                              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                {item.warrantyEndDate
                                  ? new Date(item.warrantyEndDate).toLocaleDateString()
                                  : "1 Year"}
                              </span>
                            </div>

                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                              ✓ 100% Pan-India Service
                            </p>
                          </div>
                        </td>

                        {/* 5. Status Selector */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1.5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.className}`}
                            >
                              {badge.label}
                            </span>

                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className={`block w-full py-1 px-2 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                                isDark
                                  ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                                  : "bg-white border-neutral-200 text-neutral-800"
                              }`}
                            >
                              <option value="approved">Approved / Active</option>
                              <option value="pending">Pending</option>
                              <option value="in_review">In Review</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </td>

                        {/* 6. Actions */}
                        <td className="py-4 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedWarranty(item);
                                setModalAdminNotes(item.adminNotes || "");
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="View Full Certificate & Notes"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={() => handleDelete(item.id, item.serialNumber)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                              title="Delete Warranty Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. DETAILS & WARRANTY CERTIFICATE MODAL
         ───────────────────────────────────────────────────────────── */}
      {selectedWarranty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border shadow-2xl relative p-6 sm:p-8 ${
              isDark ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-[#E6D7BE] text-neutral-900"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedWarranty(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Certificate Badge */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9E6B20] to-[#784E11] text-white flex items-center justify-center shadow-lg shadow-amber-900/20 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9E6B20]">
                  Official Flazo Warranty Certificate
                </span>
                <h3 className="text-xl font-serif font-black">
                  #{selectedWarranty.claimId}
                </h3>
              </div>
            </div>

            {/* Certificate Details Card */}
            <div
              className={`p-5 rounded-2xl border space-y-4 mb-6 ${
                isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-[#FAF7F2] border-[#E8DAC2]"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Product Model
                  </span>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">
                    {selectedWarranty.productModel}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Serial Number / Order ID
                  </span>
                  <p className="text-sm font-mono font-bold text-[#9E6B20]">
                    {selectedWarranty.serialNumber}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Customer Name
                  </span>
                  <p className="text-sm font-bold">{selectedWarranty.fullName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Phone & WhatsApp
                  </span>
                  <p className="text-sm font-bold font-mono">{selectedWarranty.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Warranty Start Date
                  </span>
                  <p className="text-xs font-semibold">
                    {selectedWarranty.warrantyStartDate
                      ? new Date(selectedWarranty.warrantyStartDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Instant"}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Warranty Expiry Date
                  </span>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedWarranty.warrantyEndDate
                      ? new Date(selectedWarranty.warrantyEndDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "1-Year Coverage"}
                  </p>
                </div>
              </div>

              {selectedWarranty.issueDescription && (
                <div className="pt-3 border-t border-neutral-200 dark:border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                    Customer Issue Description
                  </span>
                  <p className="text-xs p-3 rounded-xl bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 leading-relaxed">
                    {selectedWarranty.issueDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Status Control */}
            <div className="mb-6 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                Change Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { key: "approved", label: "Approved / Active" },
                  { key: "pending", label: "Pending" },
                  { key: "in_review", label: "In Review" },
                  { key: "resolved", label: "Resolved" },
                  { key: "rejected", label: "Rejected" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleStatusChange(selectedWarranty.id, s.key)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      selectedWarranty.status === s.key
                        ? "bg-[#9E6B20] text-white border-[#9E6B20] shadow-sm"
                        : isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                Internal Verification Notes (Admin Only):
              </label>
              <textarea
                rows={3}
                value={modalAdminNotes}
                onChange={(e) => setModalAdminNotes(e.target.value)}
                placeholder="e.g. Serial verified via Amazon invoice #98124. Product replaced on 14 Oct..."
                className={`w-full p-3.5 rounded-xl text-xs border transition focus:outline-hidden ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-[#9E6B20]"
                    : "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-[#9E6B20]"
                }`}
              />
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedWarranty(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-neutral-300 dark:border-zinc-700 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalNotes}
                  disabled={isUpdatingNotes}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#9E6B20] hover:bg-[#8A5B17] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingNotes ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Notes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

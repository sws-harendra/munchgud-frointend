"use client";
import React, { useEffect, useState } from "react";
import axios from "@/app/utils/axiosinterceptor";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldAlert,
  Sparkles,
  Filter,
  RefreshCw,
  Map,
} from "lucide-react";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import Loader from "@/app/commonComponents/loader";

interface Pincode {
  id: number;
  code: string;
  city: string;
  state: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceAreaPage() {
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "code-asc" | "code-desc">("newest");

  // Form state
  const [form, setForm] = useState({
    code: "",
    city: "",
    state: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch all pincodes
  const getPincodes = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await axios.get("/pincode/all");
      if (response.data && response.data.data) {
        setPincodes(response.data.data);
      } else {
        setPincodes([]);
      }
    } catch (error: any) {
      console.error("Error fetching pincodes:", error);
      toast.error(error.response?.data?.message || "Failed to load service areas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPincodes();
  }, []);

  // Form submit (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Pincode is required");
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        // Update existing pincode
        const response = await axios.put(`/pincode/update/${editId}`, form);
        toast.success(response.data?.message || "Service area updated successfully");
        setEditId(null);
      } else {
        // Add new pincode
        const response = await axios.post("/pincode/add", form);
        toast.success(response.data?.message || "Service area added successfully");
      }
      setForm({ code: "", city: "", state: "" });
      getPincodes(true); // reload list silently
    } catch (error: any) {
      console.error("Error saving pincode:", error);
      toast.error(error.response?.data?.message || "Failed to save service area");
    } finally {
      setSaving(false);
    }
  };

  // Toggle delivery active status
  const handleToggleStatus = async (pincode: Pincode) => {
    setTogglingId(pincode.id);
    const newStatus = !pincode.isActive;

    // Optimistic UI update
    setPincodes((prev) =>
      prev.map((p) => (p.id === pincode.id ? { ...p, isActive: newStatus } : p))
    );

    try {
      await axios.put(`/pincode/update/${pincode.id}`, {
        isActive: newStatus,
      });
      toast.success(
        `Delivery is now ${newStatus ? "enabled" : "disabled"} for ${pincode.code}`
      );
    } catch (error: any) {
      console.error("Error toggling pincode status:", error);
      // Revert optimistic UI
      setPincodes((prev) =>
        prev.map((p) => (p.id === pincode.id ? { ...p, isActive: !newStatus } : p))
      );
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // Load pincode details into form for editing
  const handleEdit = (pincode: Pincode) => {
    setEditId(pincode.id);
    setForm({
      code: pincode.code,
      city: pincode.city || "",
      state: pincode.state || "",
    });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ code: "", city: "", state: "" });
  };

  // Delete pincode
  const handleDelete = async (id: number, code: string) => {
    if (!window.confirm(`Are you sure you want to delete pincode ${code} from your delivery areas?`)) {
      return;
    }

    try {
      await axios.delete(`/pincode/delete/${id}`);
      toast.success(`Service area ${code} deleted successfully`);
      // Update local state directly
      setPincodes((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Error deleting pincode:", error);
      toast.error(error.response?.data?.message || "Failed to delete service area");
    }
  };

  // Process search, filters and sorting
  const filteredPincodes = pincodes
    .filter((p) => {
      const matchesSearch =
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.state && p.state.toLowerCase().includes(searchQuery.toLowerCase()));

      if (statusFilter === "active") return matchesSearch && p.isActive;
      if (statusFilter === "inactive") return matchesSearch && !p.isActive;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "code-asc") return a.code.localeCompare(b.code);
      if (sortBy === "code-desc") return b.code.localeCompare(a.code);
      return 0;
    });

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-200 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-slate-50/70 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Section */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
              : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-3.5 rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center text-zinc-950 font-bold">
              <MapPin className="h-7 w-7 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Service Area Management
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Delivery
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Configure and manage regional delivery pincodes, states, and city availability.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => getPincodes()}
              disabled={loading}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50 ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                  : "bg-gray-100 border-gray-200/60 text-gray-600 hover:text-amber-600 hover:bg-gray-200"
              }`}
              title="Refresh Areas"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                  : "bg-gray-100 border-gray-200/60 text-gray-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{pincodes.length} Total Areas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Panel */}
          <div className="lg:col-span-4">
            <div
              className={`rounded-3xl border p-6 sm:p-7 transition-all duration-200 sticky top-6 ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
                  : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-4 mb-6 border-b ${
                  isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  <h2
                    className={`text-lg font-bold tracking-tight ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {editId ? "Edit Service Area" : "Add Service Area"}
                  </h2>
                </div>
                {editId && (
                  <button
                    onClick={handleCancelEdit}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDarkMode
                        ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    title="Cancel edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="code"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-zinc-400" : "text-gray-600"
                    }`}
                  >
                    Pincode / Zipcode *
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    placeholder="Enter pincode (e.g. 110001)"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border transition-all font-mono text-sm ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-zinc-400" : "text-gray-600"
                    }`}
                  >
                    City Name (Optional)
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter city (e.g. New Delhi)"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border transition-all text-sm ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-zinc-400" : "text-gray-600"
                    }`}
                  >
                    State / Region (Optional)
                  </label>
                  <input
                    id="state"
                    type="text"
                    placeholder="Enter state (e.g. Delhi)"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border transition-all text-sm ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                    }`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : editId ? (
                      <Check className="w-4 h-4 text-zinc-950" />
                    ) : (
                      <Plus className="w-4 h-4 text-zinc-950" />
                    )}
                    <span>{saving ? "Saving..." : editId ? "Update Area" : "Add Area"}</span>
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={`px-4 py-2.5 rounded-xl border font-semibold text-sm transition-colors cursor-pointer ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                          : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Search, Filters & List Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search & Filters Card */}
            <div
              className={`rounded-2xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
                  : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
              }`}
            >
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? "text-zinc-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search by pincode, city, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-9 py-2 border rounded-xl text-sm transition-all ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500"
                      : "bg-white border-gray-200 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors cursor-pointer ${
                      isDarkMode
                        ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Sort Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`flex items-center space-x-1 border rounded-xl p-1 ${
                    isDarkMode
                      ? "bg-zinc-900/90 border-zinc-800"
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === "all"
                        ? isDarkMode
                          ? "bg-amber-500 text-zinc-950 shadow-sm"
                          : "bg-white text-gray-900 shadow-sm"
                        : isDarkMode
                        ? "text-zinc-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === "active"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : isDarkMode
                        ? "text-zinc-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setStatusFilter("inactive")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === "inactive"
                        ? "bg-rose-500 text-white shadow-sm"
                        : isDarkMode
                        ? "text-zinc-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Suspended
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`pl-8 pr-4 py-2 border rounded-xl text-xs font-medium appearance-none cursor-pointer transition-all ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700 focus:outline-none focus:border-amber-500"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 focus:outline-none focus:border-amber-500"
                    }`}
                  >
                    <option value="newest" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>Newest First</option>
                    <option value="oldest" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>Oldest First</option>
                    <option value="code-asc" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>Pincode (Asc)</option>
                    <option value="code-desc" className={isDarkMode ? "bg-zinc-900 text-white" : ""}>Pincode (Desc)</option>
                  </select>
                  <Filter
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
                      isDarkMode ? "text-zinc-500" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Main Delivery Areas List */}
            {loading ? (
              <div
                className={`rounded-3xl border p-12 flex flex-col items-center justify-center ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
                    : "bg-white border-slate-200/80 shadow-sm"
                }`}
              >
                <Loader inline size={110} text="Fetching active delivery areas..." />
              </div>
            ) : filteredPincodes.length === 0 ? (
              <div
                className={`rounded-3xl border p-12 text-center ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
                    : "bg-white border-slate-200/80 shadow-sm"
                }`}
              >
                <div
                  className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isDarkMode ? "bg-zinc-900 text-zinc-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Map className="w-8 h-8" />
                </div>
                <h3
                  className={`text-base font-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No Delivery Areas Match
                </h3>
                <p
                  className={`text-sm max-w-sm mx-auto mb-4 ${
                    isDarkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search terms or filter criteria."
                    : "Configure your first regional delivery area using the form on the left to start taking orders."}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="inline-flex items-center text-xs font-semibold text-amber-500 hover:text-amber-400 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`rounded-3xl border overflow-hidden ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800/90 shadow-xl shadow-black/40"
                    : "bg-white border-slate-200/80 shadow-sm"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                      <tr
                        className={`border-b text-xs font-bold uppercase tracking-wider ${
                          isDarkMode
                            ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                            : "bg-gray-50 border-gray-200/60 text-gray-500"
                        }`}
                      >
                        <th className="px-6 py-4">Pincode</th>
                        <th className="px-6 py-4">City</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode
                          ? "divide-zinc-800/80 bg-zinc-950"
                          : "divide-gray-100 bg-white"
                      }`}
                    >
                      {filteredPincodes.map((pincode) => (
                        <tr
                          key={pincode.id}
                          className={`transition-colors ${
                            isDarkMode
                              ? editId === pincode.id
                                ? "bg-amber-500/10"
                                : "hover:bg-zinc-900/50"
                              : editId === pincode.id
                              ? "bg-amber-50/50"
                              : "hover:bg-gray-50/50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`font-mono font-bold text-sm tracking-wide rounded-lg px-2.5 py-1 border ${
                                isDarkMode
                                  ? "bg-zinc-900 border-zinc-800 text-amber-400"
                                  : "bg-gray-100 border-gray-200/60 text-gray-900"
                              }`}
                            >
                              {pincode.code}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-zinc-300" : "text-gray-700"
                            }`}
                          >
                            {pincode.city || (
                              <span className="text-zinc-500 italic">Not set</span>
                            )}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-zinc-300" : "text-gray-700"
                            }`}
                          >
                            {pincode.state || (
                              <span className="text-zinc-500 italic">Not set</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleToggleStatus(pincode)}
                              disabled={togglingId === pincode.id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border transition-all cursor-pointer ${
                                pincode.isActive
                                  ? isDarkMode
                                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-950/70"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70"
                                  : isDarkMode
                                  ? "bg-rose-950/40 text-rose-300 border-rose-800/50 hover:bg-rose-950/70"
                                  : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/70"
                              } ${togglingId === pincode.id ? "opacity-50 cursor-wait" : ""}`}
                              title={
                                pincode.isActive
                                  ? "Click to suspend delivery"
                                  : "Click to activate delivery"
                              }
                            >
                              {togglingId === pincode.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : pincode.isActive ? (
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              ) : (
                                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                              )}
                              {pincode.isActive ? "Active" : "Suspended"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(pincode)}
                                className={`p-2 rounded-xl transition-all border ${
                                  isDarkMode
                                    ? editId === pincode.id
                                      ? "text-amber-400 bg-amber-500/15 border-amber-500/30"
                                      : "text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border-transparent hover:border-zinc-800"
                                    : editId === pincode.id
                                    ? "text-amber-600 bg-amber-50 border-amber-200"
                                    : "text-gray-500 hover:text-amber-600 hover:bg-amber-50 border-transparent hover:border-amber-100"
                                }`}
                                title="Edit location details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(pincode.id, pincode.code)}
                                className={`p-2 rounded-xl transition-all border ${
                                  isDarkMode
                                    ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border-transparent hover:border-rose-900/50"
                                    : "text-gray-500 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-100"
                                }`}
                                title="Delete delivery area"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick Helper Tip Alert */}
            <div
              className={`rounded-2xl border p-4 flex items-start space-x-3 transition-colors ${
                isDarkMode
                  ? "bg-zinc-900/70 border-zinc-800/80 shadow-md"
                  : "bg-blue-50/70 border-blue-200/80 shadow-sm"
              }`}
            >
              <ShieldAlert
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  isDarkMode ? "text-amber-400" : "text-blue-600"
                }`}
              />
              <div
                className={`text-xs leading-relaxed ${
                  isDarkMode ? "text-zinc-300" : "text-blue-800"
                }`}
              >
                <span
                  className={`font-semibold mr-1 ${
                    isDarkMode ? "text-amber-400" : "text-blue-900"
                  }`}
                >
                  Operations Safety Guarantee:
                </span>
                Deleting pincodes does not erase older purchase order details. The system soft-deletes records behind the scenes so that order history graphs remain accurate while instantly removing the region from user delivery selection options.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

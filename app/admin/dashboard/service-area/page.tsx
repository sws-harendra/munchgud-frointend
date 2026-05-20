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
      const response = await axios.put(`/pincode/update/${pincode.id}`, {
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
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Top Header Section */}
      <div className="bg-white border-b border-gray-200/80 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <MapPin className="w-6 h-6 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Service Area Management
                </h1>
              </div>
              <p className="mt-1.5 text-sm text-gray-500">
                Configure and manage regional delivery pincodes, states, and city availability.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => getPincodes()}
                disabled={loading}
                className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-200 bg-white transition-all cursor-pointer disabled:opacity-50"
                title="Refresh Areas"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
                {pincodes.length} Total Areas
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h2 className="text-lg font-bold text-gray-900">
                    {editId ? "Edit Service Area" : "Add Service Area"}
                  </h2>
                </div>
                {editId && (
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                    title="Cancel edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="code" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Pincode / Zipcode *
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    placeholder="Enter pincode (e.g. 110001)"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    City Name (Optional)
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter city (e.g. New Delhi)"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    State / Region (Optional)
                  </label>
                  <input
                    id="state"
                    type="text"
                    placeholder="Enter state (e.g. Delhi)"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm shadow-blue-500/10 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : editId ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{saving ? "Saving..." : editId ? "Update Area" : "Add Area"}</span>
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
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
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by pincode, city, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-950 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Sort Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      statusFilter === "all"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      statusFilter === "active"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setStatusFilter("inactive")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      statusFilter === "inactive"
                        ? "bg-amber-500 text-white shadow-sm"
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
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:border-gray-300 focus:outline-none transition-all text-xs font-medium appearance-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="code-asc">Pincode (Asc)</option>
                    <option value="code-desc">Pincode (Desc)</option>
                  </select>
                  <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Main Delivery Areas List */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-12 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="text-gray-500 text-sm font-medium">Fetching active delivery areas...</span>
              </div>
            ) : filteredPincodes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Map className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No Delivery Areas Match</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-4">
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
                    className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Pincode</th>
                        <th className="px-6 py-4">City</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredPincodes.map((pincode) => (
                        <tr
                          key={pincode.id}
                          className={`hover:bg-gray-50/50 transition-colors ${
                            editId === pincode.id ? "bg-blue-50/30" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-gray-900 text-sm tracking-wide bg-gray-100 border border-gray-200/60 rounded px-2 py-1">
                              {pincode.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {pincode.city || <span className="text-gray-400 italic">Not set</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {pincode.state || <span className="text-gray-400 italic">Not set</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleToggleStatus(pincode)}
                              disabled={togglingId === pincode.id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border transition-all cursor-pointer ${
                                pincode.isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70"
                                  : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/70"
                              } ${togglingId === pincode.id ? "opacity-50 cursor-wait" : ""}`}
                              title={pincode.isActive ? "Click to suspend delivery" : "Click to activate delivery"}
                            >
                              {togglingId === pincode.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : pincode.isActive ? (
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              ) : (
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              )}
                              {pincode.isActive ? "Active" : "Suspended"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(pincode)}
                                className={`p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 ${
                                  editId === pincode.id ? "text-blue-600 bg-blue-50 border-blue-100" : ""
                                }`}
                                title="Edit location details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(pincode.id, pincode.code)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
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
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold">Operations Safety Guarantee:</span> Deleting pincodes does not erase older purchase order details. The system soft-deletes records behind the scenes so that order history graphs remain accurate while instantly removing the region from user delivery selection options.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

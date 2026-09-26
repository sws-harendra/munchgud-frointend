"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { deleteUser, fetchUsers } from "@/app/lib/store/features/userSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";
import SidebarForm from "../../components/SidebarForm";
import AddUsers from "../../components/addUser";
import EditUser from "../../components/editUser";
import {
  Users,
  UserCheck,
  ShieldCheck,
  UserPlus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAdminTheme } from "../../context/AdminThemeContext";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const { users, status, totalUsers, currentPage, totalPages } = useAppSelector(
    (state) => state.users
  );

  const [filters, setFilters] = useState({
    role: "", // admin, user, driver
    search: "",
    page: 1,
    limit: 10,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch users whenever filters change
  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchUsers(filters)).unwrap();
      toast.success("Users list updated");
    } catch {
      toast.error("Failed to refresh users list");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseAdd = () => {
    dispatch(fetchUsers(filters));
  };

  // Pagination handlers
  const handlePrev = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (filters.page < totalPages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (user.role === "admin" && totalUsers <= 1) {
      toast.error("Cannot delete the only administrative account!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${user.fullname}" (${user.email})? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteUser(user.id)).unwrap();
      toast.success(`User "${user.fullname}" deleted successfully`);
      dispatch(fetchUsers(filters));
    } catch (err: any) {
      console.error("Delete user error:", err);
      toast.error(err?.message || "Failed to delete user");
    }
  };

  // Quick stats computed from current list + totalUsers
  const stats = useMemo(() => {
    const adminCount = users.filter((u) => u.role === "admin").length;
    const customerCount = users.filter((u) => u.role === "user").length;
    const driverCount = users.filter((u) => u.role === "driver").length;
    return {
      adminCount,
      customerCount,
      driverCount,
    };
  }, [users]);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return isDark
          ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
          : "bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/10";
      case "driver":
        return isDark
          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10";
      default:
        return isDark
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 transition-colors duration-200 ${
        isDark ? "bg-black text-zinc-100" : "bg-slate-50/60 text-slate-800"
      }`}
    >
      {/* Header Banner */}
      <div
        className={`rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? "bg-zinc-950 border border-zinc-800 text-white shadow-xl"
            : "bg-white shadow-sm border border-slate-200/80 text-slate-900"
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Directory
            </span>
          </div>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            Manage customers, administrators, addresses, and track real-time
            platform registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || status === "loading"}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 ${
              isDark
                ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-200"
                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
            }`}
            title="Refresh Users"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-emerald-500" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <SidebarForm
            title="Create New User"
            trigger={
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-sm font-semibold shadow-sm shadow-emerald-700/20 transition-all">
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            }
          >
            <AddUsers onSuccess={handleCloseAdd} />
          </SidebarForm>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          className={`rounded-2xl p-5 border shadow-xs flex items-center justify-between transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-slate-900"
          }`}
        >
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Total Users
            </p>
            <h3 className="text-3xl font-extrabold mt-1">
              {totalUsers}
            </h3>
            <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Platform accounts count
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark
                ? "bg-zinc-900 border border-zinc-800 text-emerald-400"
                : "bg-emerald-50 border border-emerald-100 text-emerald-700"
            }`}
          >
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Regular Customers */}
        <div
          className={`rounded-2xl p-5 border shadow-xs flex items-center justify-between transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-slate-900"
          }`}
        >
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Customers
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-500 mt-1">
              {filters.role === "user" ? totalUsers : stats.customerCount}
            </h3>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Active shopper accounts
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark
                ? "bg-zinc-900 border border-zinc-800 text-teal-400"
                : "bg-teal-50 border border-teal-100 text-teal-700"
            }`}
          >
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Admins */}
        <div
          className={`rounded-2xl p-5 border shadow-xs flex items-center justify-between transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-slate-900"
          }`}
        >
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Admins
            </p>
            <h3 className="text-3xl font-extrabold text-purple-500 mt-1">
              {filters.role === "admin" ? totalUsers : stats.adminCount}
            </h3>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Full admin dashboard access
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark
                ? "bg-zinc-900 border border-zinc-800 text-purple-400"
                : "bg-purple-50 border border-purple-100 text-purple-700"
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Directory Status */}
        <div
          className={`rounded-2xl p-5 border shadow-xs flex items-center justify-between transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-white border-slate-200/80 text-slate-800"
          }`}
        >
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Current Page
            </p>
            <h3 className="text-3xl font-extrabold mt-1">
              {currentPage} / {totalPages || 1}
            </h3>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              {filters.limit} items per page
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark
                ? "bg-zinc-900 border border-zinc-800 text-zinc-400"
                : "bg-slate-100 border border-slate-200 text-slate-600"
            }`}
          >
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filters Card */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
          isDark
            ? "bg-zinc-950 border-zinc-800 shadow-xl"
            : "bg-white shadow-xs border border-slate-200/80"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className={`h-4 w-4 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
            </div>
            <input
              type="text"
              placeholder="Search by full name or email address..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className={`w-full pl-10 pr-9 py-2.5 text-sm rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                isDark
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                  : "bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, search: "", page: 1 })}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark ? "text-zinc-400 hover:text-zinc-200" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Role Filter */}
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters({ ...filters, role: e.target.value, page: 1 })
              }
              className={`px-3.5 py-2.5 text-sm font-medium border rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <option value="">All Roles</option>
              <option value="user">Customers (User)</option>
              <option value="admin">Administrators</option>
              <option value="driver">Drivers</option>
            </select>

            {/* Limit Selector */}
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  limit: parseInt(e.target.value),
                  page: 1,
                })
              }
              className={`px-3 py-2.5 text-sm font-medium border rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {status === "loading" && (
        <div
          className={`rounded-2xl border p-12 text-center shadow-xs ${
            isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border border-slate-200"
          }`}
        >
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Loading users directory...
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {status === "failed" && (
        <div
          className={`rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 border ${
            isDark
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "bg-rose-50 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <div>
              <h4 className={`text-sm font-semibold ${isDark ? "text-rose-400" : "text-rose-900"}`}>
                Failed to load users
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-rose-400/80" : "text-rose-700"}`}>
                Could not connect to the backend server. Please verify your
                network or try refreshing.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-rose-400 hover:bg-zinc-850"
                : "text-rose-800 bg-white border border-rose-300 hover:bg-rose-50"
            }`}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users Table */}
      {status !== "loading" && status !== "failed" && users.length > 0 && (
        <div
          className={`rounded-2xl border overflow-hidden shadow-xs ${
            isDark ? "bg-zinc-950 border-zinc-800 shadow-xl" : "bg-white border border-slate-200/80"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`border-b text-xs uppercase tracking-wider font-semibold ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-400"
                    : "bg-slate-50/80 border-slate-200 text-slate-600"
                }`}
              >
                <tr>
                  <th scope="col" className="px-6 py-4">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Contact Details
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Saved Addresses
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Date Joined
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-zinc-850" : "divide-slate-100"}`}>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-zinc-900/60" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* User Profile */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        {u.avatar ? (
                          <img
                            src={getImageUrl(u.avatar)}
                            alt={u.fullname}
                            className={`w-10 h-10 rounded-full object-cover border shadow-xs ${
                              isDark ? "border-zinc-800" : "border-slate-200"
                            }`}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-700 to-green-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {getInitials(u.fullname)}
                          </div>
                        )}
                        <div>
                          <p className={`font-semibold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {u.fullname}
                          </p>
                          <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                            ID: #{u.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                          <Mail className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                          <span>{u.email}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                          <Phone className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                          <span>{u.phoneNumber || "No phone provided"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleBadgeStyle(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Addresses */}
                    <td className="px-6 py-4">
                      {u.addresses && u.addresses.length > 0 ? (
                        <div className="space-y-1 max-w-xs">
                          {u.addresses.slice(0, 1).map((a: any) => (
                            <div
                              key={a.id}
                              className={`text-xs flex items-start gap-1.5 ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                            >
                              <MapPin className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                              <span className="truncate">
                                <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>
                                  {a.addressType}:
                                </span>{" "}
                                {a.address1}, {a.city} {a.zipCode}
                              </span>
                            </div>
                          ))}
                          {u.addresses.length > 1 && (
                            <span className="text-[11px] text-emerald-500 font-medium pl-5 block">
                              +{u.addresses.length - 1} more address(es)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={`text-xs italic ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                          No address on file
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className={`px-6 py-4 whitespace-nowrap text-xs ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit User */}
                        <SidebarForm
                          title={`Edit ${u.fullname}`}
                          trigger={
                            <button
                              className={`p-2 rounded-lg transition-colors ${
                                isDark
                                  ? "text-zinc-400 hover:text-amber-400 hover:bg-zinc-900"
                                  : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                              }`}
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          }
                        >
                          <EditUser
                            user={{ ...u, id: String(u.id) }}
                            onSuccess={() => dispatch(fetchUsers(filters))}
                          />
                        </SidebarForm>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "text-zinc-400 hover:text-rose-400 hover:bg-zinc-900"
                              : "text-slate-600 hover:text-rose-700 hover:bg-rose-50"
                          }`}
                          title="Delete User"
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

          {/* Pagination Footer */}
          <div
            className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark
                ? "bg-zinc-900/90 border-zinc-800"
                : "bg-slate-50/60 border-slate-200"
            }`}
          >
            <p className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Showing{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {(currentPage - 1) * filters.limit + 1}
              </span>{" "}
              to{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {Math.min(currentPage * filters.limit, totalUsers)}
              </span>{" "}
              of{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {totalUsers}
              </span>{" "}
              users
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={filters.page <= 1}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-2xs transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <span className={`text-xs font-semibold px-2 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={handleNext}
                disabled={filters.page >= totalPages}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-2xs transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDark
                    ? "text-zinc-200 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {status !== "loading" && users.length === 0 && (
        <div
          className={`rounded-2xl shadow-xs border p-12 text-center ${
            isDark ? "bg-zinc-950 border-zinc-800 shadow-xl" : "bg-white border-slate-200"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? "bg-zinc-900 text-zinc-500" : "bg-slate-100 text-slate-400"
            }`}
          >
            <Users className="w-8 h-8" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            No users found
          </h3>
          <p className={`text-sm mt-1 max-w-sm mx-auto ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            {filters.search || filters.role
              ? "No matching users were found for your search criteria. Try clearing filters or adjusting your query."
              : "No users have registered on the platform yet."}
          </p>
          {(filters.search || filters.role) && (
            <button
              onClick={() =>
                setFilters({ search: "", role: "", page: 1, limit: 10 })
              }
              className={`mt-4 px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                isDark
                  ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30"
                  : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200"
              }`}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

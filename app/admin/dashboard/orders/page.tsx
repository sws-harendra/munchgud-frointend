// app/admin/dashboard/orders/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Calendar,
  X,
  Pencil,
  Package,
  TrendingUp,
  Clock,
  CreditCard,
  Users,
  RefreshCcw,
  IndianRupee,
  Download,
  CheckCircle,
  Truck,
  ShieldCheck,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Sparkles,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import {
  fetchOrders,
  updateOrder,
  deleteOrder,
} from "@/app/lib/store/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { useAdminTheme } from "../../context/AdminThemeContext";
import OrderDetailsModal from "../../components/orderDetailModal";
import SidebarForm from "../../components/SidebarForm";
import EditOrder from "../../components/editOrder";
import Loader from "@/app/commonComponents/loader";
import { toast } from "sonner";
import { getImageUrl } from "@/app/utils/getImageUrl";

export interface Order {
  id: number;
  userId: number;
  driverId?: number | null;
  addressId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
  OrderAddress: OrderAddress;
  Payments: Payment[];
  User?: {
    id: number;
    fullname?: string;
    email?: string;
    phoneNumber?: string | number;
    avatar?: string;
  };
  driver?: {
    id: number;
    fullname?: string;
    phoneNumber?: string | number;
  };
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  variantId?: number;
  variantname?: string;
  createdAt: string;
  updatedAt: string;
  Product: Product;
  variant?: {
    id: number;
    sku?: string;
    price?: number;
    image?: string;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  tags: string[];
  originalPrice: string;
  discountPrice: string;
  stock: number;
  images: string[];
  reviews: any;
  ratings: any;
  sold_out: number;
  max_quantity_to_order: number;
  trending_product: boolean;
  paymentMethods: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderAddress {
  id: number;
  orderId: number;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  country: string | null;
  addressType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  page: number;
  limit: number;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  search: string;
}

const OrderManagement = () => {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const { orders, loading, error, totalCount } = useAppSelector(
    (state: any) => state.order
  );

  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (
    key: keyof OrderFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: "",
      paymentStatus: "",
      startDate: "",
      endDate: "",
      search: "",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchOrders(filters)).unwrap();
      toast.success("Order list refreshed!");
    } catch {
      toast.error("Failed to refresh orders");
    } finally {
      setIsRefreshing(false);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Quick Inline Status Update
  const handleQuickStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await dispatch(
        updateOrder({
          orderId: orderId.toString(),
          orderData: { status: newStatus },
        })
      ).unwrap();
      toast.success(`Order #${orderId} marked as ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete Order
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteOrder(orderToDelete.id.toString())).unwrap();
      toast.success(`Order #${orderToDelete.id} deleted successfully`);
      setOrderToDelete(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error("No orders available to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Address",
      "City",
      "Zipcode",
      "Total Amount (INR)",
      "Order Status",
      "Payment Status",
      "Payment Method",
      "Items Count",
    ];

    const rows = orders.map((o: Order) => [
      `#${o.id}`,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.User?.fullname || `Customer #${o.userId}`}"`,
      `"${o.User?.email || "N/A"}"`,
      `"${o.User?.phoneNumber || "N/A"}"`,
      `"${o.OrderAddress ? `${o.OrderAddress.address1} ${o.OrderAddress.address2 || ""}`.trim() : "N/A"}"`,
      `"${o.OrderAddress?.city || "N/A"}"`,
      `"${o.OrderAddress?.zipCode || "N/A"}"`,
      o.totalAmount,
      o.status,
      o.paymentStatus,
      o.paymentMethod,
      o.OrderItems?.length || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e: any[]) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `FLAZO_Orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders CSV exported successfully!");
  };

  const totalPages = Math.ceil(totalCount / filters.limit);

  // Status Counts
  const counts = useMemo(() => {
    let pending = 0;
    let confirmed = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;
    let revenue = 0;

    orders.forEach((o: Order) => {
      revenue += Number(o.totalAmount || 0);
      switch (o.status?.toLowerCase()) {
        case "pending":
          pending++;
          break;
        case "confirmed":
          confirmed++;
          break;
        case "shipped":
          shipped++;
          break;
        case "delivered":
          delivered++;
          break;
        case "cancelled":
        case "refunded":
          cancelled++;
          break;
      }
    });

    return { pending, confirmed, shipped, delivered, cancelled, revenue };
  }, [orders]);

  const stats = [
    {
      title: "Total Volume",
      value: totalCount.toLocaleString(),
      subtitle: "All orders recorded",
      icon: Package,
      badge: "LIVE",
      badgeColor: isDark
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-amber-100 text-amber-800 border-amber-200",
      iconBg: isDark
        ? "bg-zinc-900 border border-zinc-800 text-amber-400"
        : "bg-amber-50 text-amber-600 border border-amber-100",
      filterStatus: "",
    },
    {
      title: "Gross Sales",
      value: `₹${counts.revenue.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: "Current batch total",
      icon: IndianRupee,
      badge: "REVENUE",
      badgeColor: isDark
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        : "bg-emerald-100 text-emerald-800 border-emerald-200",
      iconBg: isDark
        ? "bg-zinc-900 border border-zinc-800 text-emerald-400"
        : "bg-emerald-50 text-emerald-600 border border-emerald-100",
      filterStatus: "",
    },
    {
      title: "Pending Action",
      value: counts.pending.toString(),
      subtitle: "Awaiting dispatch",
      icon: Clock,
      badge: "ACTION REQ",
      badgeColor: isDark
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-amber-100 text-amber-800 border-amber-200",
      iconBg: isDark
        ? "bg-zinc-900 border border-zinc-800 text-amber-400"
        : "bg-amber-50 text-amber-600 border border-amber-100",
      filterStatus: "pending",
    },
    {
      title: "In Transit",
      value: counts.shipped.toString(),
      subtitle: "Dispatched & out",
      icon: Truck,
      badge: "DISPATCHED",
      badgeColor: isDark
        ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
        : "bg-sky-100 text-sky-800 border-sky-200",
      iconBg: isDark
        ? "bg-zinc-900 border border-zinc-800 text-sky-400"
        : "bg-sky-50 text-sky-600 border border-sky-100",
      filterStatus: "shipped",
    },
    {
      title: "Fulfilled",
      value: counts.delivered.toString(),
      subtitle: "Successfully delivered",
      icon: ShieldCheck,
      badge: "COMPLETE",
      badgeColor: isDark
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        : "bg-emerald-100 text-emerald-800 border-emerald-200",
      iconBg: isDark
        ? "bg-zinc-900 border border-zinc-800 text-emerald-400"
        : "bg-emerald-50 text-emerald-600 border border-emerald-100",
      filterStatus: "delivered",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return isDark
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10";
      case "shipped":
        return isDark
          ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
          : "bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/10";
      case "confirmed":
        return isDark
          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
          : "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/10";
      case "pending":
        return isDark
          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10";
      case "cancelled":
      case "refunded":
        return isDark
          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
          : "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10";
      default:
        return isDark
          ? "bg-zinc-800 text-zinc-400 border-zinc-700"
          : "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return isDark
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return isDark
          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200";
      case "failed":
      case "refunded":
        return isDark
          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
          : "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return isDark
          ? "bg-zinc-800 text-zinc-400 border-zinc-700"
          : "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const statusTabs = [
    { label: "All Orders", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 transition-colors duration-200 ${
        isDark ? "bg-black text-zinc-100" : "bg-slate-50/60 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
            isDark
              ? "bg-zinc-950 border-zinc-800/90 text-white shadow-2xl"
              : "bg-white border-slate-200/80 text-slate-900 shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span
                className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                  isDark
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                }`}
              >
                FLAZO™ ORDER HUB
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Dispatch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Order Management & Fulfillment
            </h1>
            <p className={`text-sm mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Real-time monitoring, customer order verification, fulfillment status, and logistics dispatch
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                isDark
                  ? "bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border-zinc-800 hover:border-zinc-700"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs"
              }`}
              title="Download Orders CSV"
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>Export CSV</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 ${
                isDark
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20"
              }`}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh Live</span>
            </button>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isActive = filters.status === stat.filterStatus && stat.filterStatus !== "";

            return (
              <div
                key={index}
                onClick={() =>
                  stat.filterStatus !== ""
                    ? handleFilterChange("status", stat.filterStatus)
                    : null
                }
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isDark
                    ? `bg-zinc-950 ${
                        isActive
                          ? "border-amber-400 ring-2 ring-amber-400/20 shadow-lg scale-[1.02]"
                          : "border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/60 shadow-md"
                      }`
                    : `bg-white ${
                        isActive
                          ? "border-amber-400 ring-2 ring-amber-400/20 shadow-md scale-[1.02]"
                          : "border-slate-200/80 hover:border-amber-300 shadow-xs"
                      }`
                } ${stat.filterStatus !== "" ? "cursor-pointer" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${stat.badgeColor}`}
                  >
                    {stat.badge}
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-black tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {stat.value}
                  </h3>
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                      isDark ? "text-zinc-400" : "text-slate-500"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 truncate ${
                      isDark ? "text-zinc-500" : "text-slate-400"
                    }`}
                  >
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Tab Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statusTabs.map((tab) => {
            const active = filters.status === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => handleFilterChange("status", tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  active
                    ? isDark
                      ? "bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-amber-500 text-white font-bold border-amber-500 shadow-sm shadow-amber-500/20"
                    : isDark
                    ? "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 border-zinc-800 hover:text-white"
                    : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-xs"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Advanced Filters Bar */}
        <div
          className={`border rounded-2xl p-4 sm:p-5 space-y-4 transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800/90 shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search orders by Order ID (e.g. 12)..."
                className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs transition-all focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  isDark
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:bg-zinc-950 focus:border-amber-500"
                    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500"
                }`}
                value={filters.search}
                onChange={handleSearch}
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-zinc-400 hover:text-zinc-200" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? showFilters
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                  : showFilters
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Filter className="w-4 h-4 text-amber-500" />
              <span>More Filters</span>
              {showFilters && <X className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>

          {/* Advanced Filter Drawer */}
          {showFilters && (
            <div
              className={`pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs ${
                isDark ? "border-zinc-800/90 text-zinc-300" : "border-slate-200 text-slate-700"
              }`}
            >
              <div>
                <label className={`block font-medium mb-1.5 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  Payment Status
                </label>
                <select
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    handleFilterChange("paymentStatus", e.target.value)
                  }
                >
                  <option value="">All Payment Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-1.5 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  From Date
                </label>
                <input
                  type="date"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={`block font-medium mb-1.5 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  To Date
                </label>
                <input
                  type="date"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className={`w-full p-2.5 rounded-xl font-semibold transition-all border ${
                    isDark
                      ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table Container */}
        <div
          className={`border rounded-2xl overflow-hidden transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800/90 shadow-2xl"
              : "bg-white border-slate-200/80 shadow-sm"
          }`}
        >
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent mx-auto" />
              <p className={`text-xs font-semibold ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                Fetching live order dispatch stream...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div
                className={`max-w-md mx-auto p-4 rounded-xl border text-xs ${
                  isDark
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                <p className="font-bold">Error loading orders</p>
                <p className="mt-1 text-rose-500/90">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px]"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div
                className={`p-4 rounded-2xl border w-16 h-16 mx-auto flex items-center justify-center ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-600"
                    : "bg-slate-100 border-slate-200 text-slate-400"
                }`}
              >
                <Package className="w-8 h-8" />
              </div>
              <p
                className={`text-base font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                No Orders Found
              </p>
              <p
                className={`text-xs max-w-sm mx-auto ${
                  isDark ? "text-zinc-500" : "text-slate-500"
                }`}
              >
                No orders match your active filter criteria. Clear filters or check back when new orders are placed.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b uppercase text-[10px] tracking-wider font-bold ${
                      isDark
                        ? "bg-zinc-900/90 text-zinc-400 border-zinc-800"
                        : "bg-slate-50/80 text-slate-500 border-slate-200"
                    }`}
                  >
                    <tr>
                      <th className="px-5 py-4 font-semibold">Order</th>
                      <th className="px-5 py-4 font-semibold">Customer Details</th>
                      <th className="px-5 py-4 font-semibold">Ordered Items</th>
                      <th className="px-5 py-4 font-semibold">Amount & Mode</th>
                      <th className="px-5 py-4 font-semibold">Payment</th>
                      <th className="px-5 py-4 font-semibold">Status (Quick Update)</th>
                      <th className="px-5 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDark
                        ? "divide-zinc-800/80 text-zinc-200"
                        : "divide-slate-100 text-slate-700"
                    }`}
                  >
                    {orders.map((order: Order) => {
                      const isUpdatingThis = updatingOrderId === order.id;
                      const customerName =
                        order.User?.fullname || `Customer #${order.userId}`;
                      const customerEmail = order.User?.email;
                      const customerPhone = order.User?.phoneNumber;
                      const totalQty =
                        order.OrderItems?.reduce(
                          (sum, item) => sum + (item.quantity || 1),
                          0
                        ) || 0;

                      return (
                        <tr
                          key={order.id}
                          className={`transition-colors ${
                            isDark
                              ? "hover:bg-zinc-900/60"
                              : "hover:bg-amber-50/30"
                          }`}
                        >
                          {/* Order ID & Date */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div
                              className={`font-bold text-sm tracking-tight ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              #{order.id.toString().padStart(6, "0")}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 flex items-center gap-1 ${
                                isDark ? "text-zinc-400" : "text-slate-500"
                              }`}
                            >
                              <Calendar
                                className={`w-3 h-3 ${
                                  isDark ? "text-zinc-500" : "text-slate-400"
                                }`}
                              />
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div
                              className={`text-[10px] font-mono ${
                                isDark ? "text-zinc-500" : "text-slate-400"
                              }`}
                            >
                              {new Date(order.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </td>

                          {/* Customer Information */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                  isDark
                                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                                    : "bg-amber-100 border-amber-200 text-amber-800"
                                }`}
                              >
                                {customerName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 max-w-[180px]">
                                <p
                                  className={`font-bold truncate text-xs ${
                                    isDark ? "text-white" : "text-slate-900"
                                  }`}
                                >
                                  {customerName}
                                </p>
                                {customerEmail && (
                                  <p
                                    className={`text-[11px] truncate flex items-center gap-1 ${
                                      isDark ? "text-zinc-400" : "text-slate-500"
                                    }`}
                                  >
                                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{customerEmail}</span>
                                  </p>
                                )}
                                {customerPhone && (
                                  <p
                                    className={`text-[11px] truncate flex items-center gap-1 ${
                                      isDark ? "text-zinc-400" : "text-slate-500"
                                    }`}
                                  >
                                    <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span>{customerPhone}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Items Preview */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <div className="flex -space-x-2 overflow-hidden">
                                {order.OrderItems?.slice(0, 3).map((item, idx) => {
                                  const img =
                                    item.variant?.image ||
                                    item.Product?.images?.[0];
                                  return (
                                    <div
                                      key={idx}
                                      className={`inline-block h-8 w-8 rounded-lg border overflow-hidden flex-shrink-0 ${
                                        isDark
                                          ? "bg-zinc-800 border-zinc-700"
                                          : "bg-slate-100 border-slate-200"
                                      }`}
                                      title={item.Product?.name}
                                    >
                                      {img ? (
                                        <img
                                          src={getImageUrl(img)}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div
                                          className={`h-full w-full flex items-center justify-center text-[10px] ${
                                            isDark ? "text-zinc-500" : "text-slate-400"
                                          }`}
                                        >
                                          P
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="text-xs">
                                <span
                                  className={`font-semibold ${
                                    isDark ? "text-zinc-200" : "text-slate-800"
                                  }`}
                                >
                                  {order.OrderItems?.length || 0} SKU
                                </span>
                                <span
                                  className={`text-[10px] block ${
                                    isDark ? "text-zinc-500" : "text-slate-400"
                                  }`}
                                >
                                  ({totalQty} items total)
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Amount & Mode */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div
                              className={`font-black text-sm ${
                                isDark ? "text-amber-400" : "text-slate-900"
                              }`}
                            >
                              ₹{order.totalAmount.toFixed(2)}
                            </div>
                            <span
                              className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${
                                isDark
                                  ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                                  : "bg-slate-100 border-slate-200 text-slate-700"
                              }`}
                            >
                              {order.paymentMethod || "COD"}
                            </span>
                          </td>

                          {/* Payment Status */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-lg border uppercase tracking-wider ${getPaymentStatusColor(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus || "Pending"}
                            </span>
                          </td>

                          {/* Quick Status Dropdown */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="relative inline-block">
                              <select
                                disabled={isUpdatingThis}
                                value={order.status}
                                onChange={(e) =>
                                  handleQuickStatusUpdate(
                                    order.id,
                                    e.target.value
                                  )
                                }
                                className={`text-[11px] font-bold py-1.5 px-2.5 rounded-lg border capitalize cursor-pointer focus:outline-none transition-all ${getStatusColor(
                                  order.status
                                )} ${
                                  isDark ? "bg-zinc-900" : "bg-white"
                                } disabled:opacity-50`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {isUpdatingThis && (
                                <span className="ml-1.5 text-[10px] text-amber-500 animate-pulse font-medium">
                                  Saving...
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => viewOrderDetails(order)}
                                className={`p-2 rounded-xl border transition-all ${
                                  isDark
                                    ? "border-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 hover:border-amber-500/30"
                                    : "border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                                }`}
                                title="Inspect Full Order"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {/* Edit Order & Driver Drawer */}
                              <SidebarForm
                                title={`Edit Order #${order.id}`}
                                trigger={
                                  <button
                                    className={`p-2 rounded-xl border transition-all ${
                                      isDark
                                        ? "border-zinc-800 text-zinc-400 hover:text-sky-400 hover:bg-zinc-900 hover:border-sky-500/30"
                                        : "border-slate-200 text-slate-500 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-300"
                                    }`}
                                    title="Edit Details / Assign Driver"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                }
                              >
                                <EditOrder orderId={order.id.toString()} />
                              </SidebarForm>

                              {/* Delete Order */}
                              <button
                                onClick={() => setOrderToDelete(order)}
                                className={`p-2 rounded-xl border transition-all ${
                                  isDark
                                    ? "border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 hover:border-rose-500/30"
                                    : "border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                                }`}
                                title="Delete Order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                className={`px-5 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800/90 text-zinc-400"
                    : "bg-slate-50/80 border-slate-200 text-slate-500"
                }`}
              >
                <div>
                  Showing{" "}
                  <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                    {(filters.page - 1) * filters.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                    {Math.min(filters.page * filters.limit, totalCount)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-amber-500">
                    {totalCount}
                  </span>{" "}
                  orders
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = filters.page === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                            isCurrent
                              ? isDark
                                ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                                : "bg-amber-500 text-white shadow-xs"
                              : isDark
                              ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= totalPages}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowDetailsModal(false)}
            onStatusUpdated={(updated) => {
              setSelectedOrder(updated);
              dispatch(fetchOrders(filters));
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className={`border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl ${
                isDark
                  ? "bg-zinc-950 border-rose-500/30 text-zinc-100"
                  : "bg-white border-rose-200 text-slate-900"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold">
                  Delete Order #{orderToDelete.id}?
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-zinc-400" : "text-slate-500"
                  }`}
                >
                  This action is permanent and cannot be undone. Are you sure you want to remove this record from the database?
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setOrderToDelete(null)}
                  disabled={isDeleting}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteOrder}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

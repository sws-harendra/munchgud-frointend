"use client";
import React, { useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  AlertCircle,
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { toast } from "sonner";
import { fetchdashboard } from "@/app/lib/store/features/dashboardSlice";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import Link from "next/link";

// Define types for the data
interface OrderStats {
  total?: number;
  delivered?: number;
  pending?: number;
  confirmed?: number;
  shipped?: number;
  cancelled?: number;
  returned?: number;
  rejected?: number;
}

interface Stats {
  totalEarnings: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

interface SalesData {
  totalSales: number;
  avgSalesPerDay: number;
}

interface TrendData {
  earnings: string;
  earningsValue: string;
  orders: string;
  ordersValue: string;
  customers: string;
  customersValue: string;
  products: string;
  productsValue: string;
}

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface Customer {
  id: string;
  name: string;
  orders: number;
  spent: number;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface DashboardData {
  stats: Stats;
  orderStats: OrderStats;
  salesData: SalesData;
  topProducts: Product[];
  topCustomers: Customer[];
  recentOrders: Order[];
  trends: TrendData;
}

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const { dashboardData, dashboardStatus, error } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(fetchdashboard());
  }, [dispatch]);

  const loading = dashboardStatus === "loading";

  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 flex items-center justify-center transition-colors ${
          isDark ? "bg-black text-zinc-100" : "bg-gray-50 text-slate-800"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className={`mt-4 text-sm font-medium ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div
        className={`min-h-screen p-6 flex items-center justify-center transition-colors ${
          isDark ? "bg-black text-zinc-100" : "bg-gray-50 text-slate-800"
        }`}
      >
        <div className="text-center">
          <p className="text-rose-500 font-semibold">Error loading dashboard data</p>
          <button
            onClick={() => dispatch(fetchdashboard())}
            className="mt-4 px-4 py-2 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Safely extract data with defaults
  const {
    stats = {
      totalEarnings: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
    },
    orderStats = {},
    salesData = {
      totalSales: 0,
      avgSalesPerDay: 0,
    },
    topProducts = [],
    topCustomers = [],
    recentOrders = [],
    trends = {
      earnings: "up",
      earningsValue: "0%",
      orders: "up",
      ordersValue: "0%",
      customers: "up",
      customersValue: "0%",
      products: "up",
      productsValue: "0%",
    },
  } = dashboardData as DashboardData;

  // Map backend status to frontend status
  const mapStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      shipped: "ongoing",
      cancelled: "canceled",
    };
    return statusMap[status] || status;
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    trendValue?: string;
  }) => (
    <div
      className={`rounded-2xl border p-6 transition-all duration-200 ${
        isDark
          ? "bg-zinc-950 border-zinc-800 shadow-xl hover:border-zinc-700"
          : "bg-white border-slate-200/80 shadow-xs hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2.5">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500 mr-1" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trend === "up" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3.5 rounded-xl border ${
            isDark
              ? "bg-zinc-900 border-zinc-800 text-amber-400"
              : "bg-amber-50/80 border-amber-200/60 text-amber-700"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const OrderStatCard = ({
    label,
    value,
    icon: Icon,
    color,
  }: {
    label: string;
    value: number;
    icon: any;
    color?: string;
  }) => (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        isDark
          ? "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
          : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium mb-1 ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${color || (isDark ? "text-white" : "text-gray-900")}`}>
            {value}
          </p>
        </div>
        <Icon className={`w-5 h-5 ${color || (isDark ? "text-zinc-400" : "text-gray-500")}`} />
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    if (isDark) {
      const darkColors: Record<string, string> = {
        delivered: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        confirmed: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        ongoing: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
        canceled: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        returned: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
        shipped: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
        cancelled: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
      };
      return darkColors[status] || "bg-zinc-800 text-zinc-300 border border-zinc-700";
    }
    const colors: Record<string, string> = {
      delivered: "bg-emerald-100 text-emerald-800",
      pending: "bg-amber-100 text-amber-800",
      confirmed: "bg-blue-100 text-blue-800",
      ongoing: "bg-purple-100 text-purple-800",
      canceled: "bg-rose-100 text-rose-800",
      returned: "bg-orange-100 text-orange-800",
      shipped: "bg-purple-100 text-purple-800",
      cancelled: "bg-rose-100 text-rose-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Calculate order percentages for the summary with safe defaults
  const totalOrdersCount = orderStats.total || 1; // Avoid division by zero
  const deliveredPercentage = Math.round(
    ((orderStats.delivered || 0) / totalOrdersCount) * 100
  );
  const canceledPercentage = Math.round(
    ((orderStats.cancelled || 0) / totalOrdersCount) * 100
  );
  const rejectedPercentage = Math.round(
    ((orderStats.rejected || 0) / totalOrdersCount) * 100
  );

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-200 ${
        isDark ? "bg-black text-zinc-100" : "bg-slate-50/60 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div
          className={`rounded-2xl p-6 border transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs text-slate-900"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                Admin Dashboard
              </h1>
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                Welcome back! Here&#39;s what&#39;s happening with your store today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Storefront
              </span>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}.00`}
            icon={IndianRupee}
            trend={trends.earnings}
            trendValue={trends.earningsValue}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={trends.orders}
            trendValue={trends.ordersValue}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            trend={trends.customers}
            trendValue={trends.customersValue}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend={trends.products}
            trendValue={trends.productsValue}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Statistics */}
          <div
            className={`rounded-2xl border p-6 transition-colors ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
                : "bg-white border-slate-200/80 shadow-xs text-slate-900"
            }`}
          >
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Order Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <OrderStatCard
                label="Total"
                value={orderStats.total || 0}
                icon={ShoppingCart}
              />
              <OrderStatCard
                label="Pending"
                value={orderStats.pending || 0}
                icon={Clock}
                color={isDark ? "text-amber-400" : "text-amber-600"}
              />
              <OrderStatCard
                label="Confirmed"
                value={orderStats.confirmed || 0}
                icon={CheckCircle}
                color={isDark ? "text-blue-400" : "text-blue-600"}
              />
              <OrderStatCard
                label="Ongoing"
                value={orderStats.shipped || 0}
                icon={Truck}
                color={isDark ? "text-purple-400" : "text-purple-600"}
              />
              <OrderStatCard
                label="Delivered"
                value={orderStats.delivered || 0}
                icon={CheckCircle}
                color={isDark ? "text-emerald-400" : "text-emerald-600"}
              />
              <OrderStatCard
                label="Canceled"
                value={orderStats.cancelled || 0}
                icon={XCircle}
                color={isDark ? "text-rose-400" : "text-rose-600"}
              />
              <OrderStatCard
                label="Returned"
                value={orderStats.returned || 0}
                icon={RotateCcw}
                color={isDark ? "text-orange-400" : "text-orange-600"}
              />
              <OrderStatCard
                label="Rejected"
                value={orderStats.rejected || 0}
                icon={AlertCircle}
                color={isDark ? "text-rose-400" : "text-rose-600"}
              />
            </div>
          </div>

          {/* Sales Summary */}
          <div
            className={`rounded-2xl border p-6 transition-colors ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
                : "bg-white border-slate-200/80 shadow-xs text-slate-900"
            }`}
          >
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Sales Summary
            </h2>
            <div className="space-y-4">
              <div
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800"
                    : "bg-emerald-50/70 border-emerald-200/60"
                }`}
              >
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                    Total Sales
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-emerald-900"}`}>
                    ₹{salesData.totalSales.toLocaleString()}.00
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800"
                    : "bg-blue-50/70 border-blue-200/60"
                }`}
              >
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                    Avg Sales Per Day
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-blue-900"}`}>
                    ₹{salesData.avgSalesPerDay.toLocaleString()}.00
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Order Summary Percentage Representation */}
              <div className={`pt-2 border-t ${isDark ? "border-zinc-800/80" : "border-slate-200"}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  Fulfillment Ratios
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className={isDark ? "text-zinc-300" : "text-gray-600"}>Delivered</span>
                    </div>
                    <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {deliveredPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      <span className={isDark ? "text-zinc-300" : "text-gray-600"}>Canceled</span>
                    </div>
                    <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {canceledPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className={isDark ? "text-zinc-300" : "text-gray-600"}>Rejected</span>
                    </div>
                    <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {rejectedPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div
            className={`rounded-2xl border p-6 transition-colors ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
                : "bg-white border-slate-200/80 shadow-xs text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Top Products
              </h2>
              <Eye className={`w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
            </div>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-zinc-900/70 border-zinc-800 hover:bg-zinc-900"
                        : "bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                          {product.name}
                        </p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                          {product.sales} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${isDark ? "text-amber-400" : "text-gray-900"}`}>
                        ₹{product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm text-center py-6 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                  No products data available
                </p>
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div
            className={`rounded-2xl border p-6 transition-colors ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
                : "bg-white border-slate-200/80 shadow-xs text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Top Customers
              </h2>
              <Star className={`w-4 h-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
            </div>
            <div className="space-y-3">
              {topCustomers.length > 0 ? (
                topCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-zinc-900/70 border-zinc-800 hover:bg-zinc-900"
                        : "bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-lg w-7 h-7 flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                          {customer.name}
                        </p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                          {customer.orders} orders placed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${isDark ? "text-emerald-400" : "text-gray-900"}`}>
                        ₹{customer.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm text-center py-6 ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                  No customers data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div
          className={`rounded-2xl border overflow-hidden transition-colors ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-white shadow-xl"
              : "bg-white border-slate-200/80 shadow-xs text-slate-900"
          }`}
        >
          <div className="p-6 border-b border-inherit flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Recent Orders
            </h2>
            <Link
              href="/admin/dashboard/orders"
              className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 hover:underline"
            >
              <span>Manage All Orders</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
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
                  <th className="py-3.5 px-6 font-semibold">Order ID</th>
                  <th className="py-3.5 px-6 font-semibold">Customer</th>
                  <th className="py-3.5 px-6 font-semibold">Amount</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-zinc-850" : "divide-slate-100"}`}>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-zinc-900/60" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="py-3.5 px-6 font-semibold font-mono text-xs text-amber-500">
                        #{order.id}
                      </td>
                      <td className={`py-3.5 px-6 font-medium ${isDark ? "text-zinc-200" : "text-gray-900"}`}>
                        {order.customer}
                      </td>
                      <td className={`py-3.5 px-6 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        ₹{order.amount}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {mapStatus(order.status).charAt(0).toUpperCase() +
                            mapStatus(order.status).slice(1)}
                        </span>
                      </td>
                      <td className={`py-3.5 px-6 text-xs ${isDark ? "text-zinc-400" : "text-gray-600"}`}>
                        {order.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className={`py-8 px-6 text-center text-sm ${isDark ? "text-zinc-500" : "text-gray-500"}`}
                    >
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

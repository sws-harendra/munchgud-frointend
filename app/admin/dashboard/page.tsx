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
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-green-700">Error loading dashboard data</p>
          <button
            onClick={() => dispatch(fetchdashboard())}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
    bgColor = "bg-white",
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    trendValue?: string;
    bgColor?: string;
  }) => (
    <div
      className={`${bgColor} rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-green-600 mr-1" />
              )}
              <span
                className={`text-sm ${
                  trend === "up" ? "text-green-600" : "text-green-700"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const OrderStatCard = ({
    label,
    value,
    icon: Icon,
    color = "text-gray-600",
  }: {
    label: string;
    value: number;
    icon: any;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      ongoing: "bg-purple-100 text-purple-800",
      canceled: "bg-red-100 text-green-800",
      returned: "bg-orange-100 text-orange-800",
      shipped: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-green-800",
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&#39;s what&#39;s happening with your store today.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <OrderStatCard
                label="Total Orders"
                value={orderStats.total || 0}
                icon={ShoppingCart}
              />
              <OrderStatCard
                label="Pending"
                value={orderStats.pending || 0}
                icon={Clock}
                color="text-green-700"
              />
              <OrderStatCard
                label="Confirmed"
                value={orderStats.confirmed || 0}
                icon={CheckCircle}
                color="text-blue-600"
              />
              <OrderStatCard
                label="Ongoing"
                value={orderStats.shipped || 0}
                icon={Truck}
                color="text-purple-600"
              />
              <OrderStatCard
                label="Delivered"
                value={orderStats.delivered || 0}
                icon={CheckCircle}
                color="text-green-600"
              />
              <OrderStatCard
                label="Canceled"
                value={orderStats.cancelled || 0}
                icon={XCircle}
                color="text-green-700"
              />
              <OrderStatCard
                label="Returned"
                value={orderStats.returned || 0}
                icon={RotateCcw}
                color="text-orange-600"
              />
              <OrderStatCard
                label="Rejected"
                value={orderStats.rejected || 0}
                icon={AlertCircle}
                color="text-green-700"
              />
            </div>
          </div>

          {/* Sales Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Sales Summary
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600 mb-1">Total Sales</p>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{salesData.totalSales.toLocaleString()}.00
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600 mb-1">
                    Avg Sales Per Day
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{salesData.avgSalesPerDay.toLocaleString()}.00
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>

              {/* Order Summary Pie Chart Representation */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Orders Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Delivered</span>
                    </div>
                    <span className="text-sm font-medium">
                      {deliveredPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                      <span className="text-sm text-gray-600">Canceled</span>
                    </div>
                    <span className="text-sm font-medium">
                      {canceledPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                      <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <span className="text-sm font-medium">
                      {rejectedPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
              <Eye className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No products data available
                </p>
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Customers</h2>
              <Star className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {topCustomers.length > 0 ? (
                topCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{customer.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No customers data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-blue-600">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {order.customer}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₹{order.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {mapStatus(order.status).charAt(0).toUpperCase() +
                            mapStatus(order.status).slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-gray-500"
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

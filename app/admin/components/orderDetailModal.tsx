// components/OrderDetailsModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
  Layers,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Order } from "../dashboard/orders/page";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAppDispatch } from "@/app/lib/store/store";
import { updateOrder } from "@/app/lib/store/features/orderSlice";
import { useAdminTheme } from "../context/AdminThemeContext";
import { toast } from "sonner";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdated?: (updatedOrder: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order: initialOrder,
  onClose,
  onStatusUpdated,
}) => {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const [order, setOrder] = useState<Order>(initialOrder);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statuses = [
    { key: "pending", label: "Pending", desc: "Awaiting confirmation" },
    { key: "confirmed", label: "Confirmed", desc: "Order confirmed & packed" },
    { key: "shipped", label: "Shipped", desc: "Handed to courier" },
    { key: "delivered", label: "Delivered", desc: "Successfully delivered" },
    { key: "cancelled", label: "Cancelled", desc: "Order cancelled" },
  ];

  const handleQuickStatusChange = async (newStatus: string) => {
    if (newStatus === order.status) return;
    setIsUpdatingStatus(true);
    try {
      const res = await dispatch(
        updateOrder({
          orderId: order.id.toString(),
          orderData: { status: newStatus },
        })
      ).unwrap();

      const updated = res.order || { ...order, status: newStatus };
      setOrder(updated);
      if (onStatusUpdated) onStatusUpdated(updated);
      toast.success(`Order #${order.id} status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStepIndex = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
      case "refunded":
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status.toLowerCase() === "cancelled" || order.status.toLowerCase() === "refunded";

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return isDark
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return isDark
          ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
          : "bg-sky-50 text-sky-700 border-sky-200";
      case "confirmed":
        return isDark
          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
          : "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "pending":
        return isDark
          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
      case "refunded":
        return isDark
          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
          : "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return isDark
          ? "bg-zinc-800 text-zinc-400 border-zinc-700"
          : "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Printable Invoice Styling Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 24px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-invoice"
        className={`relative border rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
          isDark
            ? "bg-zinc-950 border-zinc-800 text-zinc-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border-b ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800"
              : "bg-slate-50/80 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-amber-50 border-amber-200 text-amber-600"
              }`}
            >
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-amber-100 border-amber-200 text-amber-800"
                  }`}
                >
                  FLAZO™ ORDER
                </span>
                <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  #{order.id.toString().padStart(6, "0")}
                </span>
              </div>
              <p className={`text-xs flex items-center gap-1 mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 no-print">
            {/* Quick Status Dropdown */}
            <div className="relative">
              <select
                disabled={isUpdatingStatus}
                value={order.status}
                onChange={(e) => handleQuickStatusChange(e.target.value)}
                className={`text-xs font-semibold py-2 px-3 rounded-xl border capitalize cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                  order.status
                )} ${isDark ? "bg-zinc-900" : "bg-white"}`}
              >
                {statuses.map((s) => (
                  <option key={s.key} value={s.key} className={isDark ? "bg-zinc-900 text-zinc-100" : "bg-white text-slate-800"}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-xl transition-all shadow-xs ${
                isDark
                  ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
              title="Print Order Invoice"
            >
              <Printer className="w-4 h-4 text-amber-500" />
              <span>Print Invoice</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Order Lifecycle Stepper */}
          <div
            className={`border rounded-xl p-4 sm:p-5 ${
              isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDark ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              <Truck className="w-4 h-4 text-amber-500" />
              Order Fulfillment Lifecycle
            </h4>

            {isCancelled ? (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  isDark
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                <XCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-sm">Order Cancelled / Refunded</h5>
                  <p className="text-xs opacity-80 mt-0.5">
                    This order was cancelled and processing has been terminated.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Connecting Line */}
                <div
                  className={`absolute top-5 left-6 right-6 h-0.5 -z-0 hidden sm:block ${
                    isDark ? "bg-zinc-800" : "bg-slate-200"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStep) / 3) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                  {[
                    { label: "Placed", desc: "Received", icon: Clock },
                    { label: "Confirmed", desc: "Processed", icon: CheckCircle },
                    { label: "Shipped", desc: "In Transit", icon: Truck },
                    { label: "Delivered", desc: "Completed", icon: ShieldCheck },
                  ].map((step, idx) => {
                    const isDone = currentStep >= idx;
                    const isCurrent = currentStep === idx;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className={`flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                          isCurrent
                            ? isDark
                              ? "bg-amber-500/10 border border-amber-500/40"
                              : "bg-amber-50/80 border border-amber-300 ring-2 ring-amber-400/20"
                            : isDark
                            ? "bg-zinc-900/40 border border-zinc-800"
                            : "bg-white border border-slate-200 shadow-xs"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all shadow-xs ${
                            isDone
                              ? "bg-amber-500 text-zinc-950 shadow-amber-500/20"
                              : isDark
                              ? "bg-zinc-800 text-zinc-500 border border-zinc-700"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            isDone
                              ? isDark
                                ? "text-amber-400"
                                : "text-amber-800"
                              : isDark
                              ? "text-zinc-500"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className={`text-[11px] ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Customer & Address Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info Card */}
            <div
              className={`border rounded-xl p-4 sm:p-5 ${
                isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3 text-amber-500">
                <User className="w-4 h-4" />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-zinc-300" : "text-slate-700"
                  }`}
                >
                  Customer Profile
                </h4>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm ${
                      isDark
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                        : "bg-amber-100 border-amber-200 text-amber-800"
                    }`}
                  >
                    {order.User?.fullname ? order.User.fullname.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {order.User?.fullname || `Customer #${order.userId}`}
                    </p>
                    <p className={`text-xs ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                      Account ID: #{order.userId}
                    </p>
                  </div>
                </div>

                <div
                  className={`pt-2 border-t space-y-1.5 text-xs ${
                    isDark ? "border-zinc-800 text-zinc-300" : "border-slate-200 text-slate-700"
                  }`}
                >
                  {order.User?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                      <a
                        href={`mailto:${order.User.email}`}
                        className="hover:underline hover:text-amber-500"
                      >
                        {order.User.email}
                      </a>
                    </div>
                  )}
                  {order.User?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      <a
                        href={`tel:${order.User.phoneNumber}`}
                        className="hover:underline hover:text-amber-500"
                      >
                        {order.User.phoneNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div
              className={`border rounded-xl p-4 sm:p-5 ${
                isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3 text-amber-500">
                <MapPin className="w-4 h-4" />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-zinc-300" : "text-slate-700"
                  }`}
                >
                  Delivery Destination
                </h4>
              </div>

              {order.OrderAddress ? (
                <div className={`space-y-1.5 text-xs ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize border ${
                        isDark
                          ? "bg-zinc-800 text-amber-400 border-zinc-700"
                          : "bg-white text-amber-700 border-slate-200 shadow-xs"
                      }`}
                    >
                      {order.OrderAddress.addressType || "Standard"} Address
                    </span>
                  </div>
                  <p className={`font-medium text-sm pt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {order.OrderAddress.address1}
                  </p>
                  {order.OrderAddress.address2 && (
                    <p className={isDark ? "text-zinc-400" : "text-slate-500"}>{order.OrderAddress.address2}</p>
                  )}
                  <p>
                    {order.OrderAddress.city}, {order.OrderAddress.zipCode}
                  </p>
                  {order.OrderAddress.country && (
                    <p className={isDark ? "text-zinc-400" : "text-slate-500"}>{order.OrderAddress.country}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No address snapshot recorded.</p>
              )}
            </div>
          </div>

          {/* Ordered Products Table */}
          <div
            className={`border rounded-xl overflow-hidden shadow-xs ${
              isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-2 text-amber-500">
                <Layers className="w-4 h-4" />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-zinc-300" : "text-slate-700"
                  }`}
                >
                  Order Items ({order.OrderItems?.length || 0})
                </h4>
              </div>
            </div>

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
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-zinc-800/80 text-zinc-200" : "divide-slate-100 text-slate-700"
                  }`}
                >
                  {order.OrderItems?.map((item: any) => {
                    const img =
                      item.variant?.image || item.Product?.images?.[0] || "";
                    const price = parseFloat(item.variant?.price || item.price || 0);
                    const subtotal = parseFloat(item.subtotal || price * item.quantity);

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isDark ? "hover:bg-zinc-900/40" : "hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-lg border overflow-hidden flex-shrink-0 flex items-center justify-center ${
                                isDark
                                  ? "bg-zinc-800 border-zinc-700"
                                  : "bg-slate-100 border-slate-200"
                              }`}
                            >
                              {img ? (
                                <img
                                  src={getImageUrl(img)}
                                  alt={item.Product?.name || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-zinc-500" />
                              )}
                            </div>
                            <div>
                              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                                {item.Product?.name || `Product #${item.productId}`}
                              </p>
                              {item.variantname && (
                                <p className="text-[11px] text-amber-500 font-medium">
                                  Variant: {item.variantname}
                                </p>
                              )}
                              <p className="text-[10px] text-zinc-500">
                                SKU: {item.variant?.sku || item.Product?.id || item.productId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3.5 text-center font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                          x{item.quantity}
                        </td>
                        <td className={`px-4 py-3.5 text-right font-medium ${isDark ? "text-zinc-300" : "text-slate-600"}`}>
                          ₹{price.toFixed(2)}
                        </td>
                        <td className={`px-4 py-3.5 text-right font-bold ${isDark ? "text-amber-400" : "text-slate-900"}`}>
                          ₹{subtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Financial Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Details */}
            <div
              className={`border rounded-xl p-4 sm:p-5 ${
                isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3 text-amber-500">
                <CreditCard className="w-4 h-4" />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-zinc-300" : "text-slate-700"
                  }`}
                >
                  Payment Verification
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div
                  className={`flex justify-between py-1 border-b ${
                    isDark ? "border-zinc-800" : "border-slate-200"
                  }`}
                >
                  <span className={isDark ? "text-zinc-400" : "text-slate-500"}>Payment Method:</span>
                  <span className={`font-semibold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-800"}`}>
                    {order.paymentMethod || "COD"}
                  </span>
                </div>
                <div
                  className={`flex justify-between py-1 border-b ${
                    isDark ? "border-zinc-800" : "border-slate-200"
                  }`}
                >
                  <span className={isDark ? "text-zinc-400" : "text-slate-500"}>Payment Status:</span>
                  <span
                    className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] border ${
                      order.paymentStatus === "paid"
                        ? isDark
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : order.paymentStatus === "failed" || order.paymentStatus === "refunded"
                        ? isDark
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                        : isDark
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                {order.Payments && order.Payments.length > 0 && (
                  <div className={`pt-2 space-y-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                    <p className={`font-medium ${isDark ? "text-zinc-300" : "text-slate-700"}`}>Gateway Log:</p>
                    {order.Payments.map((p) => (
                      <div
                        key={p.id}
                        className={`text-[11px] p-2 rounded border ${
                          isDark
                            ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                            : "bg-white border-slate-200 text-slate-700 shadow-xs"
                        }`}
                      >
                        <p className="text-amber-500 font-mono">
                          Txn ID: {p.transactionId || "N/A"}
                        </p>
                        <p className="opacity-70">
                          Provider: {p.method || p.status} • Amount: ₹{p.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div
              className={`border rounded-xl p-4 sm:p-5 flex flex-col justify-between ${
                isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                  <IndianRupee className="w-4 h-4" />
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Billing Total
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className={`flex justify-between ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                    <span>Items Subtotal:</span>
                    <span className={isDark ? "text-zinc-200 font-medium" : "text-slate-800 font-medium"}>
                      ₹
                      {(
                        order.OrderItems?.reduce(
                          (acc, item: any) =>
                            acc + (parseFloat(item.subtotal) || item.price * item.quantity),
                          0
                        ) || order.totalAmount
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                    <span>Shipping Fee:</span>
                    <span className="text-emerald-500 font-medium">FREE</span>
                  </div>
                  <div className={`flex justify-between ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                    <span>Taxes & Duties:</span>
                    <span className={isDark ? "text-zinc-200" : "text-slate-800"}>Included</span>
                  </div>
                </div>
              </div>

              <div
                className={`pt-4 mt-3 border-t flex items-baseline justify-between ${
                  isDark ? "border-zinc-800" : "border-slate-200"
                }`}
              >
                <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  Grand Total:
                </span>
                <span className="text-2xl font-black text-amber-500">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-between no-print ${
            isDark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-slate-50/80"
          }`}
        >
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>FLAZO™ Secure Order System</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold border rounded-xl transition-all shadow-xs ${
                isDark
                  ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

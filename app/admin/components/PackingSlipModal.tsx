// app/admin/components/PackingSlipModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Check,
  Package,
  Layers,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Order } from "../dashboard/orders/page";
import { useAdminTheme } from "../context/AdminThemeContext";
import {
  generateBarcodeSvg,
  printPackingSlip,
} from "../utils/printPackingSlip";

interface PackingSlipModalProps {
  order: Order;
  onClose: () => void;
}

export default function PackingSlipModal({
  order,
  onClose,
}: PackingSlipModalProps) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const [labelSize, setLabelSize] = useState<"a4" | "4x6">("a4");

  const orderIdStr = order.id.toString().padStart(6, "0");
  const storeName = "FLAZO";
  const customerName = order.User?.fullname || `Customer #${order.userId}`;
  const customerPhone = order.User?.phoneNumber
    ? `+91 ${order.User.phoneNumber}`
    : "N/A";
  const address = order.OrderAddress;
  const address1 = address?.address1 || "Address not recorded";
  const address2 = address?.address2 || "";
  const city = address?.city || "";
  const zipCode = address?.zipCode || "000000";
  const country = address?.country || "India";
  const addressType = address?.addressType || "Standard";

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCod =
    order.paymentMethod?.toLowerCase() === "cod" ||
    order.paymentMethod?.toLowerCase().includes("cash");
  const isPaid =
    order.paymentStatus?.toLowerCase() === "paid" ||
    order.paymentStatus?.toLowerCase() === "completed";

  const items = order.OrderItems || [];
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const barcodeSvg = generateBarcodeSvg(orderIdStr, 38, 2, 5);

  const handlePrint = () => {
    printPackingSlip(order, { labelSize });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto font-sans">
      <div
        className={`relative w-full max-w-3xl my-auto rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? "bg-zinc-950 border-zinc-800 text-zinc-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Packing Slip & Box Label
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                  #{orderIdStr}
                </span>
              </div>
              <p
                className={`text-xs ${
                  isDark ? "text-zinc-400" : "text-slate-500"
                }`}
              >
                Parcel sticker format for packing boxes • Simple black & white
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Size Switcher */}
            <div
              className={`inline-flex p-1 rounded-xl border text-xs font-semibold ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <button
                type="button"
                onClick={() => setLabelSize("a4")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  labelSize === "a4"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                    : "hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                A4 Sheet
              </button>
              <button
                type="button"
                onClick={() => setLabelSize("4x6")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  labelSize === "4x6"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                    : "hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                4x6" Thermal Sticker
              </button>
            </div>

            {/* Print / Save PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950 shadow-md transition-all active:scale-[0.98]"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                  : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div
          className={`p-4 sm:p-6 max-h-[75vh] overflow-y-auto ${
            isDark ? "bg-zinc-900/40" : "bg-slate-100/70"
          }`}
        >
          {/* Printable Packing Box Label Paper */}
          <div
            className={`mx-auto bg-white text-black border-2 border-black shadow-lg font-sans transition-all ${
              labelSize === "4x6" ? "max-w-[420px]" : "max-w-[680px]"
            }`}
            style={{ color: "#000000" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b-2 border-black">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wider leading-none m-0">
                  {storeName}
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1">
                  E-Commerce Packing Slip & Shipping Label
                </p>
              </div>
              <div className="border-2 border-black px-2.5 py-1 text-right">
                <div className="text-xs font-black">ORDER #{orderIdStr}</div>
                <div className="text-[10px] font-semibold text-neutral-600">
                  {orderDate}
                </div>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="py-2.5 px-3 text-center border-b-2 border-black bg-white">
              <div
                dangerouslySetInnerHTML={{ __html: barcodeSvg }}
                className="flex justify-center"
              />
              <div className="font-mono text-xs font-bold tracking-[3px] mt-1">
                * {orderIdStr} *
              </div>
            </div>

            {/* Ship To & Payment / Routing Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b-2 border-black">
              {/* Delivery Destination (SHIP TO) */}
              <div className="sm:col-span-7 p-3 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                <div className="text-[10px] font-black uppercase tracking-wider pb-1 mb-2 border-b border-dashed border-neutral-400">
                  DELIVER TO (CUSTOMER DETAILS)
                </div>
                <div className="text-sm font-extrabold uppercase text-black">
                  {customerName}
                </div>
                <div className="text-xs font-extrabold text-black my-1">
                  Mobile: {customerPhone}
                </div>
                <div className="text-xs text-neutral-900 leading-snug">
                  <strong>Address:</strong> {address1}
                </div>
                {address2 && (
                  <div className="text-xs text-neutral-800 leading-snug">
                    {address2}
                  </div>
                )}
                <div className="text-xs text-neutral-900 leading-snug mt-0.5">
                  <strong>City/State:</strong> {city}, {country}
                </div>

                {/* Big Bold Pincode Box for Couriers */}
                <div className="inline-block mt-2 px-2.5 py-1 border-2 border-black bg-neutral-100 font-mono text-sm font-black tracking-wider">
                  PIN: {zipCode}
                </div>
                <div className="text-[9px] font-semibold text-neutral-600 mt-1">
                  Type: {addressType.toUpperCase()} ADDRESS
                </div>
              </div>

              {/* Payment & Order Summary */}
              <div className="sm:col-span-5 p-3 flex flex-col justify-between">
                <div>
                  {/* Payment Callout Box */}
                  <div
                    className={`border-2 border-black p-2 text-center mb-2.5 ${
                      isCod
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-black"
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-wider">
                      {isCod
                        ? "CASH ON DELIVERY (COD)"
                        : "PREPAID - DO NOT COLLECT CASH"}
                    </div>
                    <div className="text-base font-black mt-0.5">
                      {isCod
                        ? `COLLECT: ₹${order.totalAmount.toFixed(2)}`
                        : `PAID: ₹${order.totalAmount.toFixed(2)}`}
                    </div>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-dashed border-neutral-400">
                    ORDER SUMMARY
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Payment Mode:</span>
                      <span className="font-bold">
                        {(order.paymentMethod || "ONLINE").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Payment Status:</span>
                      <span className="font-bold">
                        {(
                          order.paymentStatus || (isCod ? "Pending" : "Paid")
                        ).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Items:</span>
                      <span className="font-bold">
                        {totalQuantity} Units ({items.length} SKU)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-dotted border-neutral-400 text-[9px] text-neutral-600 leading-tight">
                  <strong>RETURN TO / DISPATCHED BY:</strong>
                  <br />
                  {storeName} Fulfillment Hub, Warehouse Dept
                  <br />
                  Support: support@flazo.in
                </div>
              </div>
            </div>

            {/* Package Contents Items Table */}
            <div className="border-b border-black">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black text-[10px] font-black uppercase">
                    <th className="py-1.5 px-2.5 border-r border-black w-8 text-center">
                      #
                    </th>
                    <th className="py-1.5 px-2.5 border-r border-black">
                      Item Description
                    </th>
                    <th className="py-1.5 px-2.5 border-r border-black w-24">
                      Variant / SKU
                    </th>
                    <th className="py-1.5 px-2.5 border-r border-black w-12 text-center">
                      Qty
                    </th>
                    <th className="py-1.5 px-2.5 border-r border-black w-16 text-right">
                      Price
                    </th>
                    <th className="py-1.5 px-2.5 w-18 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {items.length > 0 ? (
                    items.map((item, idx) => {
                      const title =
                        item.Product?.name || `Product #${item.productId}`;
                      const variant =
                        item.variantname || item.variant?.sku || "-";
                      const qty = item.quantity || 1;
                      const price = item.price || 0;
                      const subtotal = item.subtotal || price * qty;
                      return (
                        <tr key={idx}>
                          <td className="py-1.5 px-2.5 border-r border-black text-center font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-2.5 border-r border-black">
                            <span className="font-bold text-xs">{title}</span>
                          </td>
                          <td className="py-1.5 px-2.5 border-r border-black text-[10px] text-neutral-700">
                            {variant}
                          </td>
                          <td className="py-1.5 px-2.5 border-r border-black text-center font-black">
                            {qty}
                          </td>
                          <td className="py-1.5 px-2.5 border-r border-black text-right">
                            ₹{Number(price).toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-black">
                            ₹{Number(subtotal).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-3 text-center text-neutral-500 italic"
                      >
                        No item snapshots recorded for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Bar */}
            <div className="flex justify-between items-center p-2.5 border-b border-dashed border-black bg-neutral-50 text-xs font-bold">
              <div>
                Total Items in Box: <strong>{totalQuantity} Units</strong>
              </div>
              <div className="text-sm font-black">
                GRAND TOTAL: ₹{order.totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 text-[9px] text-neutral-600 text-center leading-tight">
              * Please verify package condition before accepting • Affix this
              label securely on the packing box.
              <br />
              This is a system generated packing slip & shipping document. No
              signature required.
            </div>
          </div>

          {/* Cut Line Guide */}
          <div className="mt-4 text-center text-xs text-neutral-500 font-mono">
            - - - - - - - - - - - - - - - - ✂ FOLD OR CUT HERE TO AFFIX ON
            PACKING BOX ✂ - - - - - - - - - - - - - - - -
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-t text-xs ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800 text-zinc-400"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              Ready for direct A4 printer or 4x6" thermal label printers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                isDark
                  ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                  : "border-slate-300 hover:bg-slate-100 text-slate-700"
              }`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/admin/utils/printPackingSlip.ts
import { Order } from "../dashboard/orders/page";

/**
 * Standard Code 39 Barcode character patterns
 * ISO/IEC 16388 compliant barcode generator in pure SVG
 */
const CODE39_MAP: Record<string, string> = {
  "0": "000110100",
  "1": "100100001",
  "2": "001100001",
  "3": "101100000",
  "4": "000110001",
  "5": "100110000",
  "6": "001110000",
  "7": "000100101",
  "8": "100100100",
  "9": "001100100",
  A: "100001001",
  B: "001001001",
  C: "101001000",
  D: "000011001",
  E: "100011000",
  F: "001011000",
  G: "000001101",
  H: "100001100",
  I: "001001100",
  J: "000011100",
  K: "100000011",
  L: "001000011",
  M: "101000010",
  N: "000010011",
  O: "100010010",
  P: "001010010",
  Q: "000000111",
  R: "100000110",
  S: "001000110",
  T: "000010110",
  U: "110000001",
  V: "011000001",
  W: "111000000",
  X: "010010001",
  Y: "110010000",
  Z: "011010000",
  "-": "010000101",
  ".": "110000100",
  " ": "011000100",
  "*": "010010100",
  $: "010101000",
  "/": "010100010",
  "+": "010001010",
  "%": "000101010",
};

/**
 * Generates an authentic Code 39 Barcode SVG for high-resolution printing
 */
export function generateBarcodeSvg(
  text: string,
  height: number = 42,
  narrowWidth: number = 2,
  wideWidth: number = 5
): string {
  const clean = text.toUpperCase().replace(/[^0-9A-Z\-.$/+% ]/g, "") || "000000";
  const encodedText = `*${clean}*`;

  let totalWidth = 0;
  for (const char of encodedText) {
    const pattern = CODE39_MAP[char] || CODE39_MAP["-"];
    for (let i = 0; i < 9; i++) {
      totalWidth += pattern[i] === "1" ? wideWidth : narrowWidth;
    }
    totalWidth += narrowWidth; // Inter-character gap
  }

  let x = 0;
  let rects = "";

  for (const char of encodedText) {
    const pattern = CODE39_MAP[char] || CODE39_MAP["-"];
    for (let i = 0; i < 9; i++) {
      const isBar = i % 2 === 0;
      const w = pattern[i] === "1" ? wideWidth : narrowWidth;
      if (isBar) {
        rects += `<rect x="${x}" y="0" width="${w}" height="${height}" fill="#000000" />`;
      }
      x += w;
    }
    x += narrowWidth; // gap
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height}" width="${totalWidth}" height="${height}" style="display:block;margin:0 auto;max-width:100%;">${rects}</svg>`;
}

export interface PackingSlipOptions {
  labelSize?: "a4" | "4x6";
  storeName?: string;
  storePhone?: string;
  storeEmail?: string;
  returnAddress?: string;
}

/**
 * Generates clean, industrial black & white HTML for pasting on a packing box.
 * Standard e-commerce packing slip / shipping label format (Flipkart/Amazon/Shiprocket style).
 */
export function generatePackingSlipHtml(
  order: Order,
  options: PackingSlipOptions = {}
): string {
  const orderIdStr = order.id.toString().padStart(6, "0");
  const storeName = options.storeName || "FLAZO";
  const storeEmail = options.storeEmail || "support@flazo.in";
  const storePhone = options.storePhone || "+91 98765 43210";
  const returnAddress =
    options.returnAddress ||
    "Flazo Fulfillment Center, Plot 14, Industrial Area, Phase-2, India";

  const customerName =
    order.User?.fullname || `Customer #${order.userId}`;
  const customerPhone =
    order.User?.phoneNumber ? `+91 ${order.User.phoneNumber}` : "N/A";
  const customerEmail = order.User?.email || "N/A";

  const address = order.OrderAddress;
  const address1 = address?.address1 || "Address not provided";
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

  const barcodeSvg = generateBarcodeSvg(orderIdStr, 40, 2, 5);

  const items = order.OrderItems || [];
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const is4x6 = options.labelSize === "4x6";
  const containerWidth = is4x6 ? "380px" : "740px";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Packing_Slip_Order_${orderIdStr}</title>
  <style>
    @page {
      size: ${is4x6 ? "100mm 150mm" : "A4 portrait"};
      margin: ${is4x6 ? "4mm" : "8mm"};
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 11px;
      line-height: 1.35;
    }
    .slip-container {
      width: 100%;
      max-width: ${containerWidth};
      margin: 0 auto;
      border: 2px solid #000000;
      background: #ffffff;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 2px solid #000000;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      font-size: 9px;
      font-weight: 600;
      color: #333333;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 1px;
    }
    .badge-box {
      border: 2px solid #000000;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: right;
    }
    .barcode-section {
      text-align: center;
      padding: 8px 10px 6px;
      border-bottom: 2px solid #000000;
      background: #ffffff;
    }
    .barcode-caption {
      font-family: "Courier New", Courier, monospace;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 3px;
      margin-top: 3px;
    }
    .grid-row {
      display: flex;
      border-bottom: 2px solid #000000;
    }
    .col-left {
      flex: 1.15;
      padding: 8px 10px;
      border-right: 2px solid #000000;
    }
    .col-right {
      flex: 0.85;
      padding: 8px 10px;
    }
    .section-title {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 3px;
      margin-bottom: 4px;
      border-bottom: 1px dashed #666666;
    }
    .customer-name {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      margin: 2px 0 3px;
    }
    .phone-highlight {
      font-size: 12px;
      font-weight: 800;
      margin: 2px 0 4px;
    }
    .address-text {
      font-size: 11px;
      margin: 2px 0;
      color: #111111;
    }
    .pincode-pill {
      display: inline-block;
      margin-top: 6px;
      border: 2px solid #000000;
      padding: 3px 8px;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1px;
      background: #f0f0f0;
    }
    .payment-callout {
      border: 2px solid #000000;
      padding: 6px 8px;
      text-align: center;
      margin-bottom: 8px;
      background: ${isCod ? "#000000" : "#f8f8f8"};
      color: ${isCod ? "#ffffff" : "#000000"};
    }
    .payment-type {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .payment-amount {
      font-size: 15px;
      font-weight: 900;
      margin-top: 2px;
    }
    .info-list {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 10px;
    }
    .info-list li {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      border-bottom: 1px dotted #cccccc;
    }
    .info-label {
      font-weight: 600;
      color: #333333;
    }
    .info-val {
      font-weight: 800;
      text-align: right;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    .items-table th {
      background: #eeeeee;
      border-bottom: 1px solid #000000;
      border-right: 1px solid #000000;
      padding: 4px 6px;
      text-align: left;
      font-weight: 800;
      text-transform: uppercase;
    }
    .items-table th:last-child {
      border-right: none;
    }
    .items-table td {
      border-bottom: 1px solid #dddddd;
      border-right: 1px solid #000000;
      padding: 5px 6px;
      vertical-align: top;
    }
    .items-table td:last-child {
      border-right: none;
    }
    .items-table tr:last-child td {
      border-bottom: 2px solid #000000;
    }
    .item-title {
      font-weight: 700;
      font-size: 11px;
    }
    .item-sku {
      font-size: 9px;
      color: #444444;
      margin-top: 1px;
    }
    .table-totals {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 800;
      border-bottom: 1px dashed #000000;
      background: #fafafa;
    }
    .footer-note {
      padding: 6px 10px;
      font-size: 8.5px;
      color: #333333;
      text-align: center;
      line-height: 1.3;
    }
    .cut-line {
      margin-top: 14px;
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #555555;
      border-top: 1px dashed #666666;
      padding-top: 4px;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="slip-container">
    <!-- Header -->
    <div class="header-row">
      <div>
        <h1 class="brand-title">${storeName}</h1>
        <div class="brand-sub">E-Commerce Packing Slip & Shipping Label</div>
      </div>
      <div class="badge-box">
        <div>ORDER #${orderIdStr}</div>
        <div style="font-size:9px;font-weight:600;margin-top:1px;">${orderDate}</div>
      </div>
    </div>

    <!-- Scannable Barcode for Logistics Scanning -->
    <div class="barcode-section">
      ${barcodeSvg}
      <div class="barcode-caption">* ${orderIdStr} *</div>
    </div>

    <!-- Ship To & Payment / Routing Grid -->
    <div class="grid-row">
      <!-- Left: Delivery Address (SHIP TO) -->
      <div class="col-left">
        <div class="section-title">DELIVER TO (CUSTOMER DETAILS)</div>
        <div class="customer-name">${customerName}</div>
        <div class="phone-highlight">Mobile: ${customerPhone}</div>
        <div class="address-text"><strong>Address:</strong> ${address1}</div>
        ${address2 ? `<div class="address-text">${address2}</div>` : ""}
        <div class="address-text"><strong>City/State:</strong> ${city}, ${country}</div>
        <div class="pincode-pill">PIN: ${zipCode}</div>
        <div style="margin-top:4px;font-size:9px;color:#555555;">Type: ${addressType.toUpperCase()} ADDRESS</div>
      </div>

      <!-- Right: Payment & Return Info -->
      <div class="col-right">
        <div class="payment-callout">
          <div class="payment-type">
            ${isCod ? "CASH ON DELIVERY (COD)" : "PREPAID - DO NOT COLLECT CASH"}
          </div>
          <div class="payment-amount">
            ${isCod ? `COLLECT: ₹${order.totalAmount.toFixed(2)}` : `PAID: ₹${order.totalAmount.toFixed(2)}`}
          </div>
        </div>

        <div class="section-title">ORDER & RETURN DETAILS</div>
        <ul class="info-list">
          <li>
            <span class="info-label">Payment Mode:</span>
            <span class="info-val">${(order.paymentMethod || "ONLINE").toUpperCase()}</span>
          </li>
          <li>
            <span class="info-label">Payment Status:</span>
            <span class="info-val">${(order.paymentStatus || (isCod ? "Pending" : "Paid")).toUpperCase()}</span>
          </li>
          <li>
            <span class="info-label">Total Items:</span>
            <span class="info-val">${totalQuantity} Pcs (${items.length} SKU)</span>
          </li>
        </ul>

        <div style="margin-top:6px;font-size:9px;line-height:1.3;color:#333333;border-top:1px dotted #999999;padding-top:4px;">
          <strong>RETURN TO / DISPATCHED BY:</strong><br />
          ${storeName} Fulfillment Hub<br />
          ${returnAddress}<br />
          Help: ${storeEmail} | ${storePhone}
        </div>
      </div>
    </div>

    <!-- Package Contents Table -->
    <div style="border-bottom:1px solid #000000;">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width:30px;text-align:center;">#</th>
            <th>Item Description</th>
            <th style="width:110px;">Variant / SKU</th>
            <th style="width:45px;text-align:center;">Qty</th>
            <th style="width:65px;text-align:right;">Price</th>
            <th style="width:75px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${
            items.length > 0
              ? items
                  .map((item, idx) => {
                    const title = item.Product?.name || `Product #${item.productId}`;
                    const variant = item.variantname || item.variant?.sku || "-";
                    const qty = item.quantity || 1;
                    const price = item.price || 0;
                    const subtotal = item.subtotal || price * qty;
                    return `<tr>
                      <td style="text-align:center;font-weight:700;">${idx + 1}</td>
                      <td>
                        <div class="item-title">${title}</div>
                      </td>
                      <td>
                        <div class="item-sku">${variant}</div>
                      </td>
                      <td style="text-align:center;font-weight:800;font-size:11px;">${qty}</td>
                      <td style="text-align:right;">₹${Number(price).toFixed(2)}</td>
                      <td style="text-align:right;font-weight:800;">₹${Number(subtotal).toFixed(2)}</td>
                    </tr>`;
                  })
                  .join("")
              : `<tr><td colspan="6" style="text-align:center;padding:12px;">No item snapshots recorded for this order.</td></tr>`
          }
        </tbody>
      </table>
    </div>

    <!-- Totals Bar -->
    <div class="table-totals">
      <div>Total Items in Box: <strong>${totalQuantity} units</strong></div>
      <div style="font-size:13px;">GRAND TOTAL: <strong>₹${order.totalAmount.toFixed(2)}</strong></div>
    </div>

    <!-- Footer Instructions -->
    <div class="footer-note">
      * Check package seal before acceptance • Handle With Care • Affix this label securely on the packing box.<br />
      This is a system generated packing slip & shipping document. No signature required.
    </div>
  </div>

  <div class="cut-line no-print">
    - - - - - - - - - - - - - - - - - - ✂ FOLD OR CUT HERE TO AFFIX ON PACKAGE BOX ✂ - - - - - - - - - - - - - - - - - -
  </div>
</body>
</html>`;
}

/**
 * Triggers clean native print dialog (or Save as PDF) in an isolated iframe
 */
export function printPackingSlip(
  order: Order,
  options: PackingSlipOptions = {}
): void {
  const htmlContent = generatePackingSlipHtml(order, options);

  // Create isolated invisible iframe for printing to avoid leaking main UI styling
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.zIndex = "-9999";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback: open print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Print iframe error:", e);
    } finally {
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }
  }, 350);
}

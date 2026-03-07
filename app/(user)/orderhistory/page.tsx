"use client";
import {
  fetchUserOrders,
  selectOrders,
  fetchOrderById,
  clearCurrentOrder,
} from "@/app/lib/store/features/orderSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Eye,
  X,
  CheckCircle,
  Clock,
  Truck,
  Loader,
} from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useAppDispatch } from "@/app/lib/store/store";

const OrderHistoryPage = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, status, error } = useSelector(selectOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatedCards, setAnimatedCards] = useState([]);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    // Animate cards in sequence when orders are loaded
    if (orders && orders.length > 0) {
      setAnimatedCards([]); // Reset animations
      orders.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => [...prev, index]);
        }, index * 200);
      });
    }
  }, [orders]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatAmount = (amount) => {
    // Check if amount is already in correct format (assuming it's in paisa/cents)
    // If amount is like 29998, it should display as ₹299.98
    // If amount is already like 299.98, it should display as ₹299.98

    if (!amount || isNaN(amount)) return "₹0.00";

    // If amount is greater than 1000 and seems to be in paisa format

    const finalAmount = parseFloat(amount);

    return `₹${finalAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusIcon = (status) => {
    if (!status || typeof status !== "string") {
      return <Package className="w-5 h-5 text-gray-500" />;
    }

    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-green-600" />;
      case "confirmed":
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== "string") {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }

    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-red-100 text-green-800 border-red-200";
      case "shipped":
        return "bg-red-100 text-green-800 border-red-200";
      case "confirmed":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodIcon = (method) => {
    if (!method || typeof method !== "string") {
      return "💰";
    }

    switch (method.toLowerCase()) {
      case "cod":
        return "💵";
      case "card":
        return "💳";
      case "upi":
        return "📱";
      default:
        return "💰";
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      await dispatch(fetchOrderById(orderId.toString()));
      setSelectedOrderId(orderId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    dispatch(clearCurrentOrder());
  };

  // Get the selected order data - use currentOrder from Redux
  const selectedOrder = currentOrder;

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-700 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-green-700 mb-4">{error || "Something went wrong"}</p>
          <button
            onClick={() => dispatch(fetchUserOrders())}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Wait for orders to be properly loaded
  if (!orders) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-700 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-green-700 bg-clip-text text-transparent">
                Order History
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          {orders &&
            orders.map((order, index) => (
              <div
                key={order.id}
                className={`transform transition-all duration-500 ${
                  animatedCards.includes(index)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status && typeof order.status === "string"
                                ? order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-semibold text-gray-900">
                              #{(order.id || 0).toString().padStart(6, "0")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Total Amount
                            </p>
                            <p className="font-bold text-lg text-green-700">
                              {formatAmount(order.totalAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getPaymentMethodIcon(order.paymentMethod)}
                              </span>
                              <span className="text-sm font-medium capitalize">
                                {order.paymentMethod || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Items</p>
                            <p className="font-semibold">
                              {order.OrderItems?.length || 0} item(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="group/btn flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Eye className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Product Preview */}
                    {order.OrderItems && order.OrderItems.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center space-x-4 overflow-x-auto">
                          {order.OrderItems &&
                            order.OrderItems.slice(0, 3).map(
                              (item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 min-w-max"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                    {item.Product?.images?.[0] ? (
                                      <img
                                        src={getImageUrl(
                                          item.Product.images[0]
                                        )}
                                        alt={item.Product.name || "Product"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                          e.target.nextElementSibling.style.display =
                                            "flex";
                                        }}
                                      />
                                    ) : null}
                                    <Package
                                      className={`w-6 h-6 text-gray-500 ${
                                        item.Product?.images?.[0]
                                          ? "hidden"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-gray-900">
                                      {item.Product?.name || "Product"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity || 0}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          {order.OrderItems && order.OrderItems.length > 3 && (
                            <div className="text-sm text-gray-500 px-3">
                              +{order.OrderItems.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {(!orders || orders.length === 0) && status !== "loading" && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600">
                You haven't placed any orders yet.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <div>
          {!selectedOrder ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
                <div className="flex items-center justify-center">
                  <Loader className="w-8 h-8 text-green-700 animate-spin mr-3" />
                  <span>Loading order details...</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`fixed inset-0 z-50 transition-all duration-300 ${
                isModalOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={handleCloseDetails}
              ></div>
              <div className="flex items-center justify-center min-h-screen p-4">
                <div
                  className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
                    isModalOpen
                      ? "scale-100 translate-y-0"
                      : "scale-95 translate-y-10"
                  }`}
                >
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white relative">
                    <button
                      onClick={handleCloseDetails}
                      className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        {getStatusIcon(selectedOrder.status)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Order #
                          {(selectedOrder.id || 0).toString().padStart(6, "0")}
                        </h2>
                        <p className="opacity-90">
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Order Status
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(selectedOrder.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                selectedOrder.status
                              )}`}
                            >
                              {selectedOrder.status &&
                              typeof selectedOrder.status === "string"
                                ? selectedOrder.status.charAt(0).toUpperCase() +
                                  selectedOrder.status.slice(1)
                                : "Unknown"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Payment
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getPaymentMethodIcon(
                                selectedOrder.paymentMethod
                              )}
                            </span>
                            <div>
                              <p className="font-medium capitalize">
                                {selectedOrder.paymentMethod || "N/A"}
                              </p>
                              <p className="text-sm text-green-700 font-medium">
                                {selectedOrder.paymentStatus || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Total Amount
                          </h3>
                          <p className="text-2xl font-bold text-green-700">
                            {formatAmount(selectedOrder.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Delivery Address
                          </h3>
                          {selectedOrder.OrderAddress ? (
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                <div>
                                  <p>
                                    {selectedOrder.OrderAddress.address1 ||
                                      "N/A"}
                                  </p>
                                  {selectedOrder.OrderAddress.address2 && (
                                    <p>{selectedOrder.OrderAddress.address2}</p>
                                  )}
                                  <p>
                                    {selectedOrder.OrderAddress.city || "N/A"} -{" "}
                                    {selectedOrder.OrderAddress.zipCode ||
                                      "N/A"}
                                  </p>
                                  {selectedOrder.OrderAddress.addressType && (
                                    <p className="text-xs text-green-700 font-medium capitalize">
                                      {selectedOrder.OrderAddress.addressType}{" "}
                                      Address
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No address available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.OrderItems &&
                        selectedOrder.OrderItems.length > 0 ? (
                          selectedOrder.OrderItems.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                            >
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                {item.variant?.image ||
                                item.Product?.images?.[0] ? (
                                  <img
                                    src={getImageUrl(
                                      item.variant?.image ||
                                        item.Product.images[0]
                                    )}
                                    alt={item.Product?.name || "Product"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      e.currentTarget.nextElementSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : null}

                                <Package
                                  className={`w-8 h-8 text-gray-500 ${
                                    item.Product?.images?.[0] ? "hidden" : ""
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {item.Product?.name || "Product"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity || 0}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-lg font-bold text-green-700">
                                    {formatAmount(item.price)}
                                  </span>
                                  {item.Product?.originalPrice &&
                                    item.Product?.discountPrice &&
                                    parseFloat(item.Product.originalPrice) !==
                                      parseFloat(
                                        item.Product.discountPrice
                                      ) && (
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatAmount(
                                          parseFloat(
                                            item.Product.originalPrice
                                          ) * 100
                                        )}
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {formatAmount(item.subtotal)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No items found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;

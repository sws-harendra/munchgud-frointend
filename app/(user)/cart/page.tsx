"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Tag,
  Truck,
  CreditCard,
  Shield,
  Star,
} from "lucide-react";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  selectCart,
  selectCartItemsCount,
} from "@/app/lib/store/features/cartSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Link from "next/link";
import { RootState, useAppSelector } from "@/app/lib/store/store";

const CartPage = () => {
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(selectCart);
  const totalItems = useSelector(selectCartItemsCount);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  const {
    isAuthenticated,
    user,
    status: authStatus,
  } = useAppSelector(
    (state: RootState) => state.auth // ✅ typed state
  );

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const tax = (subtotal - discount) * 0.08;
  // const total = subtotal + shipping - discount + tax;
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 99) {
      setAnimatingItems((prev) => new Set([...prev, id]));
      dispatch(updateQuantity({ id, quantity: newQuantity }));
      setTimeout(() => {
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300);
    }
  };

  const handleRemoveItem = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item && confirm(`Remove ${item.name} from cart?`)) {
      dispatch(removeFromCart(id));
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your entire cart?")) {
      dispatch(clearCart());
      setAppliedPromo(null);
      setPromoCode("");
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === "SAVE10") {
      setAppliedPromo({ code: "SAVE10", discount: 0.1 });
    } else if (code === "WELCOME15") {
      setAppliedPromo({ code: "WELCOME15", discount: 0.15 });
    } else if (code === "FIRST20") {
      setAppliedPromo({ code: "FIRST20", discount: 0.2 });
    } else {
      alert("Invalid promo code. Try SAVE10, WELCOME15, or FIRST20");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Order placed successfully! Redirecting to payment...");
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-200 rounded-full animate-ping mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Loading your cart
          </h2>
          <p className="text-gray-600 text-lg">
            Preparing your shopping experience...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-red-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">⚠️</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto pt-20 px-6">
          <div className="text-center">
            {/* Animated Cart Icon */}
            <div className="relative mb-12">
              <div className="animate-bounce">
                <div className="relative mx-auto w-44 h-44 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                  <ShoppingBag className="w-24 h-24 text-green-700" />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xl font-bold">0</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 border-4 border-indigo-200/30 rounded-full animate-spin"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-8 animate-pulse">
              Your Cart is Empty
            </h1>

            <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover amazing products and start building your perfect
              collection with our curated selection of premium items.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link href="/">
                <button className="group relative px-10 py-5 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" />
                    Continue Shopping
                  </div>
                </button>
              </Link>
            </div>

            {/* Feature Cards */}
            {/* <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Truck,
                  title: "Free Shipping",
                  desc: "On orders over $100",
                  color: "from-blue-500 to-blue-600",
                  bg: "from-blue-50 to-blue-100",
                },
                {
                  icon: Shield,
                  title: "Secure Checkout",
                  desc: "Your data is protected",
                  color: "from-green-500 to-green-600",
                  bg: "from-green-50 to-green-100",
                },
                {
                  icon: Star,
                  title: "Quality Guaranteed",
                  desc: "30-day return policy",
                  color: "from-purple-500 to-purple-600",
                  bg: "from-purple-50 to-purple-100",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`relative p-6 bg-gradient-to-br ${feature.bg} rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50 backdrop-blur-sm`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="group p-2 hover:bg-indigo-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-indigo-200">
                  <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-all" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-green-600 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 text-sm font-medium">
                  {totalItems} items in your cart
                </p>
              </div>
            </div>
            <button
              onClick={handleClearCart}
              className="group px-4 py-2 text-green-700 hover:text-white hover:bg-green-600 font-medium transition-all duration-200 rounded-lg border border-red-200 hover:border-green-600 text-sm"
            >
              <div className="flex items-center">
                <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                Clear All
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  animatingItems.has(item.id) ? "scale-105 shadow-xl" : ""
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideInUp 0.8s ease-out forwards",
                }}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative group/image flex-shrink-0">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                        // onError={(e) => {
                        //   e.currentTarget.src = `https://via.placeholder.com/112x112/f3f4f6/9ca3af?text=${item.name.charAt(
                        //     0
                        //   )}`;
                        // }}
                      />
                    </div>
                    <button className="absolute -top-2 -right-2 w-8 h-8 bg-white hover:bg-red-50 rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 shadow-md border border-gray-100">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-green-600 transition-colors" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">
                          Unit price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="group/delete p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-green-700 transition-all duration-200 border border-gray-200 hover:border-red-200"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/minus"
                        >
                          <Minus className="w-4 h-4 text-gray-600 group-hover/minus:scale-110 transition-transform" />
                        </button>
                        <div className="px-4 py-2 font-bold text-lg min-w-[80px] text-center bg-white border-x border-gray-200">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= 99}
                          className="p-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/plus"
                        >
                          <Plus className="w-4 h-4 text-gray-600 group-hover/plus:scale-110 transition-transform" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800 mb-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-500 font-medium">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Section */}
            {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                Promo Code
              </h3>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-3">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-green-800 text-sm">
                        Code "{appliedPromo.code}" applied!
                      </p>
                      <p className="text-green-600 text-xs">
                        {appliedPromo.discount * 100}% discount - Save $
                        {discount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="px-4 py-2 text-green-700 hover:text-white hover:bg-green-500 font-medium rounded-lg border border-green-200 hover:border-green-500 transition-all duration-200 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (SAVE10, WELCOME15, FIRST20)"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-200 text-sm font-medium"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:shadow-md transition-all duration-200 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Apply Code
                  </button>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    code: "SAVE10",
                    discount: "10% off",
                    color: "from-blue-500 to-blue-600",
                    bg: "from-blue-50 to-blue-100",
                  },
                  {
                    code: "WELCOME15",
                    discount: "15% off",
                    color: "from-purple-500 to-purple-600",
                    bg: "from-purple-50 to-purple-100",
                  },
                  {
                    code: "FIRST20",
                    discount: "20% off",
                    color: "from-green-500 to-green-600",
                    bg: "from-green-50 to-green-100",
                  },
                ].map((promo, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 bg-gradient-to-r ${promo.bg} rounded-lg text-center font-medium border border-white/50 text-xs`}
                  >
                    <div
                      className={`text-transparent bg-clip-text bg-gradient-to-r ${promo.color}`}
                    >
                      {promo.code} - {promo.discount}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span className="font-medium">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-bold"> ₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600 text-sm">
                  <span className="flex items-center font-medium">
                    <Truck className="w-4 h-4 mr-1" />
                    Shipping
                  </span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* <div className="flex justify-between text-gray-600 text-sm">
                  <span className="font-medium">Tax (8%)</span>
                  <span className="font-bold">{tax.toFixed(2)}</span>
                </div> */}

                {appliedPromo && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span className="flex items-center font-medium">
                      <Tag className="w-4 h-4 mr-1" />
                      Discount ({appliedPromo.discount * 100}%)
                    </span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span> ₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {/* {shipping > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Truck className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="font-bold text-blue-800 text-sm">
                      Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )} */}
              <Link
                href={`${
                  isAuthenticated ? "/checkout" : "/authentication/login"
                }`}
              >
                <button
                  // onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-6"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </div>
                  )}
                </button>
              </Link>
              {/* Security Features */}
              <div className="space-y-3 text-center mb-6">
                <div className="flex items-center justify-center text-gray-600 text-xs font-medium">
                  <Star className="w-4 h-4 mr-2 text-green-600" />
                  30-day money back guarantee
                </div>
              </div>

              {/* Payment Methods */}
              {/* <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-center mb-3 font-medium text-sm">
                  We accept
                </p>
                <div className="flex justify-center space-x-3">
                  <div className="w-12 h-7 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold shadow-md">
                    VISA
                  </div>
                  <div className="w-12 h-7 bg-gradient-to-r from-orange-500 to-green-600 rounded text-white text-xs flex items-center justify-center font-bold shadow-md">
                    MC
                  </div>
                  <div className="w-12 h-7 bg-gradient-to-r from-blue-800 to-blue-900 rounded text-white text-xs flex items-center justify-center font-bold shadow-md">
                    AMEX
                  </div>
                  <div className="w-12 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold shadow-md">
                    PP
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 8px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }

        /* Glassmorphism effect */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }

        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default CartPage;

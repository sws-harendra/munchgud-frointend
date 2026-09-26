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
  Lock,
  ArrowRight,
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
import { toast } from "sonner";

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
  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping for luxury brand
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
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
      toast.success("Item removed from cart");
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your entire cart?")) {
      dispatch(clearCart());
      setAppliedPromo(null);
      setPromoCode("");
      toast.success("Cart cleared");
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === "SAVE10") {
      setAppliedPromo({ code: "SAVE10", discount: 0.1 });
      toast.success("Promo code applied successfully!");
    } else if (code === "WELCOME15") {
      setAppliedPromo({ code: "WELCOME15", discount: 0.15 });
      toast.success("Promo code applied successfully!");
    } else if (code === "FIRST20") {
      setAppliedPromo({ code: "FIRST20", discount: 0.2 });
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code. Try SAVE10, WELCOME15, or FIRST20");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.success("Promo code removed.");
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent mb-2">
            Loading your cart
          </h2>
          <p className="text-gray-500 text-sm">
            Preparing your luxury shopping experience...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-amber-100 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 relative overflow-hidden flex items-center justify-center py-20 px-6">
        <div className="relative z-10 max-w-lg mx-auto text-center bg-white rounded-3xl shadow-xl border border-amber-100/80 p-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl flex items-center justify-center shadow-inner border border-amber-200/60">
              <ShoppingBag className="w-12 h-12 text-amber-600" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
            Discover our premium acoustic gold audio gear and add items to your collection.
          </p>

          <Link href="/">
            <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-neutral-50 relative pb-16">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-amber-200/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header Bar */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-amber-100/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="p-2.5 bg-white hover:bg-amber-50 rounded-2xl transition-all duration-200 border border-amber-200/60 shadow-sm hover:shadow text-amber-700">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-700 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-gray-500 text-xs font-semibold">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>

            <button
              onClick={handleClearCart}
              className="group px-4 py-2.5 text-amber-700 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 font-semibold transition-all duration-200 rounded-xl border border-amber-200/80 hover:border-transparent text-xs sm:text-sm shadow-sm hover:shadow-md hover:shadow-amber-500/20 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`group bg-white rounded-3xl shadow-md hover:shadow-xl border border-amber-100/80 p-5 sm:p-6 transition-all duration-300 hover:border-amber-200 ${
                  animatingItems.has(item.id) ? "scale-[1.01]" : ""
                }`}
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <div className="flex gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-100/80 p-1 shadow-inner">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="pr-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 hover:text-amber-700 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-xs font-semibold mt-1">
                            Unit price: ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-amber-50/40 border border-amber-200/60 rounded-xl overflow-hidden shadow-inner">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 sm:p-2.5 hover:bg-amber-100/60 text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <div className="px-3 sm:px-4 py-1.5 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[65px] text-center bg-white border-x border-amber-200/60 text-gray-900">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= 99}
                          className="p-2 sm:p-2.5 hover:bg-amber-100/60 text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-black text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[11px] text-gray-500 font-medium">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl shadow-amber-950/5 border border-amber-100/80 p-6 sm:p-7 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-amber-500/25">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span className="font-medium">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 text-sm items-center">
                  <span className="flex items-center font-medium">
                    <Truck className="w-4 h-4 mr-1.5 text-amber-600" />
                    Shipping
                  </span>
                  <span className="text-amber-700 font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 text-xs tracking-wider">
                    FREE
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-amber-700 text-sm">
                    <span className="flex items-center font-medium">
                      <Tag className="w-4 h-4 mr-1 text-amber-600" />
                      Discount ({appliedPromo.discount * 100}%)
                    </span>
                    <span className="font-bold">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-gray-100 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-amber-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Action Button */}
              <Link
                href={isAuthenticated ? "/checkout" : "/authentication/login"}
              >
                <button
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl font-bold text-base sm:text-lg transform hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-5 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              {/* Security & Guarantee Badges */}
              <div className="space-y-2.5 text-center">
                <div className="flex items-center justify-center text-gray-600 text-xs font-semibold py-2 px-3 bg-amber-50/50 rounded-xl border border-amber-100/70">
                  <Star className="w-4 h-4 mr-2 text-amber-500 fill-amber-500 flex-shrink-0" />
                  30-day money back guarantee
                </div>
                <div className="flex items-center justify-center text-gray-500 text-[11px] font-medium">
                  <Lock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Bank-grade 256-bit SSL encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

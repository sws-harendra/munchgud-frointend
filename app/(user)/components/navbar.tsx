"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Star,
  Gift,
  Zap,
  Crown,
} from "lucide-react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/lib/store/store";
import Link from "next/link";
import Image from 'next/image'
import { logout } from "@/app/lib/store/features/authSlice";
import { useRouter } from "next/navigation";
import { selectCartItemsCount } from "@/app/lib/store/features/cartSlice";
import { brandName, serverurl } from "@/app/contants";
import { fetchCategories } from "@/app/lib/store/features/categorySlice";
import DropdownCategory from "@/app/commonComponents/renderCategory";
import { link } from "fs";
import { Cagliostro } from "next/font/google";

export default function EcommerceNavbar() {
  const dispatch = useAppDispatch(); // ✅ typed dispatch
  const { isAuthenticated, user, status } = useAppSelector(
    (state: RootState) => state.auth, // ✅ typed state
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const cartCount = useAppSelector(selectCartItemsCount);

  const router = useRouter();

  const [isSearchClicked, setisSearchClicked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [wishlistCount] = useState(7);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchInput.trim().length > 1) {
      fetchSuggestions(searchInput);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchInput]);
  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      router.push(`/products?search=${encodeURIComponent(searchInput)}`);
    }
  };
  const { categories } = useAppSelector((state: RootState) => state.category);
  const array = ["About Us", "Contact Us"];

  const fetchSuggestions = async (query) => {
    try {
      setLoading(true);

      const BASE_URL = serverurl || "http://localhost:5000";
      const res = await fetch(
        `${BASE_URL}/products?search=${query}`
      );

      const data = await res.json();

      const products = data.products || [];

      // 🔥 MATCH ANYWHERE LOGIC
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions(filtered);
    } catch (err) {
      console.log("Suggestion error", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <nav className=" shadow-lg sticky top-0 z-50 border-b bg-white border-gray-100">
      {/* Top Bar */}
      {/* <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm py-2">
        <div className=" mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Free shipping on orders 5000+</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>Help & Support</span>
          </div>
        </div>
      </div> */}
      <div className="bg-black text-yellow-400 text-sm text-center  py-2">
        <div className="mx-auto px-4 font-semibold ">
          <span >
            🚚 Free Shipping on All Orders | No COD Charges on Prepaid Payments/
          </span>
        </div>
      </div>
      {/* <div className="text-[13px]  flex gap-2 md:gap-4 px-4">
          <span>Track Package</span>
          <span>Return & Exchange</span>
          <span>Contact Us</span>
      </div> */}

      {/* Main Navbar */}
      <div className=" mx-auto py-2 px-2 md:px-4 drop-shadow-lg">
        <div className=" flex items-center justify-between h-16">

          {/* Logo */}
          <div className="">
            <Link href="/">
              <Image
                src="/logo.png"
                width={210}
                height={110}
                alt="Logo"
                priority
              />
            </Link>
          </div>

          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.map((category: any) => (
              <DropdownCategory key={category.id} category={category} />
            ))}
            {/* Additional AboutUs and ContactUs Links */}
            {array.map((item) => (
              <Link key={item} href={`/${item.replace(/\s+/g, '').toLowerCase()}`} className="text-black hover:text-green-700 transition-colors">
                {item}
              </Link>
            ))}
          </div>



          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (searchInput.trim().length > 1) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-12 pr-4 py-3 border border-green-600 rounded-full focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {showSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl mt-3 z-50 max-h-72 overflow-y-auto border border-gray-100">

                  {/* Loading */}
                  {loading ? (
                    <div className="p-4 text-gray-400 animate-pulse">
                      Searching...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="p-4 text-gray-400 text-sm">
                      No results found
                    </div>
                  ) : (
                    suggestions.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSearchInput(item.name);
                          setShowSuggestions(false);
                          router.push(`/products?search=${item.name}`);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-green-50 group border-b last:border-none"
                      >

                        {/* Content */}
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                            {item.name}
                          </span>

                          {/* Optional category */}
                          {item.category?.name && (
                            <span className="text-xs text-gray-400">
                              in {item.category.name}
                            </span>
                          )}
                        </div>

                        {/* Arrow */}
                        <span className="text-gray-300 group-hover:text-green-600 transition">
                          →
                        </span>
                      </div>
                    ))
                  )}

                </div>
              )}

              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-700 via-green-600 to-lime-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>



          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {/* Mobile Search */}
            {/* <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
              {isSearchClicked ? <input
                type="text"
                placeholder="Search products..."
                className="hidden lg:block w-full pl-10 pr-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-green-700 focus:border-transparent"
              /> : null}
              <Search className="w-6 h-6" onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                setisSearchClicked(!isSearchClicked)
                }} />
            </button> */}

            {/* Wishlist */}
            {/* <div className="relative hidden sm:block">
              <button className="text-gray-600 hover:text-green-600 transition-colors duration-200 group">
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div> */}

            {/* Cart */}
            <div className="relative">
              <Link href={"/cart"}>
                <button
                  aria-label="View cart"
                  className="text-gray-600 hover:text-lime-500 transition-colors duration-200 group"
                >
                  <img
                    src="/trolley.png"
                    alt="Shopping cart"
                    className="w-12 h-auto" />
                  {/* <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" /> */}
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            <div className="flex items-center space-x-1 md:space-x-8">
              {/* Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-700 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:block font-medium">
                      {user?.fullname}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 hidden lg:block transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-green-700 transition-colors"
                      >
                        My Account
                      </a>
                      <Link
                        href="/orderhistory"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-green-700 transition-colors"
                      >
                        Order History
                      </Link>

                      {user?.role == "driver" && (
                        <Link
                          href="/orderhistory/rider"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-green-700 transition-colors"
                        >
                          Order for you (Associate)
                        </Link>
                      )}
                      {/* <a
                        href="#"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-lime-500 transition-colors"
                      >
                        Settings
                      </a> */}
                      <hr className="my-2" />
                      <button
                        onClick={() => dispatch(logout())}
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-green-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {" "}
                  <Link href="/authentication/login">
                    <button className="px-5 py-2 text-white bg-green-700 rounded-full">
                      Login
                    </button>
                  </Link>
                </div>
              )}
            </div>


            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-green-700 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Mobile Categories */}
            {categories.map((category: any) => (
              <div key={category.id} className="space-y-2">
                <Link
                  href={`/products?category=${category.id}`}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                >
                  <span className="font-medium">{category.name}</span>
                </Link>

                {category.subcategories?.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {category.subcategories.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/products?category=${sub.id}`}
                        className="block text-gray-600 hover:text-green-700"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Wishlist */}
            {/* <a
              href="#"
              className="flex items-center space-x-3 py-3 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist ({wishlistCount})</span>
            </a> */}
          </div>
        </div>
      )}
    </nav>
  );
}

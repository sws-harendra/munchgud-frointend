"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Headphones,
} from "lucide-react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/lib/store/store";
import Link from "next/link";
import { logout } from "@/app/lib/store/features/authSlice";
import { useRouter } from "next/navigation";
import { selectCartItemsCount } from "@/app/lib/store/features/cartSlice";

export default function EcommerceNavbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth
  );
  const cartCount = useAppSelector(selectCartItemsCount);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Earbuds", href: "/earbuds" },
    { name: "Support & Warranty", href: "/support-warranty" },
    { name: "Blogs", href: "/blogs" },
    { name: "Flazo Community", href: "/community" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs transition-all">
      {/* Top Announcement Bar - Boult & boAt Inspired */}
      <div className="bg-neutral-950 text-amber-300 text-xs py-2 px-4 border-b border-amber-900/30">
        <div className="w-full max-w-[1560px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto md:mx-0 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>FLAZO SIGNATURE GOLD SERIES • 13mm BoomBass™ Drivers • Free Express Delivery in India</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-400 text-xs">
            <Link href="/support-warranty" className="hover:text-amber-300 transition-colors cursor-pointer">1-Year Flazo Warranty</Link>
            <span>•</span>
            <Link href="/support-warranty" className="hover:text-amber-300 transition-colors cursor-pointer">Customer Support</Link>
          </div>
        </div>
      </div>

      {/* Main Clean & Simple Navbar */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">

          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 flex items-center justify-center text-white font-black text-lg shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Headphones className="w-5 h-5 text-neutral-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-widest text-neutral-950 group-hover:text-amber-700 transition-colors">
                FLAZO<span className="text-amber-500">.</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-amber-700 font-semibold -mt-1 uppercase">
                Acoustic Gold
              </span>
            </div>
          </Link>

          {/* Simple Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-neutral-700 hover:text-amber-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Search Trigger */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    autoFocus
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search Flazo earbuds..."
                    className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-amber-50/50 border border-amber-300 rounded-full focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-neutral-800"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-neutral-600 hover:text-amber-600 transition-colors rounded-full hover:bg-amber-50"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart with Golden Badge */}
            <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-amber-600 transition-colors rounded-full hover:bg-amber-50 group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {mounted && cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 bg-amber-100 text-amber-800 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              )}
            </Link>

            {/* Auth / Profile */}
            {mounted && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-neutral-700 hover:text-amber-600 transition-colors py-1.5 px-3 rounded-full border border-amber-200 bg-amber-50/40"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[90px] truncate">
                    {user?.fullname || "VIP User"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-amber-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-xs font-bold text-neutral-900 truncate">{user?.fullname || "Audiophile"}</p>
                    </div>
                    <Link
                      href="/orderhistory"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-xs text-neutral-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      Orders & Tracking
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/authentication/login">
                <button className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold tracking-wide text-neutral-900 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-500 hover:to-yellow-400 rounded-full shadow-sm hover:shadow-md transition-all">
                  <span>Sign In</span>
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-700 hover:text-amber-600 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-neutral-800 hover:text-amber-600 transition-colors py-2 border-b border-neutral-100"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-neutral-800"
            >
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              <span>Cart ({mounted ? cartCount : 0})</span>
            </Link>

            {(!mounted || !isAuthenticated) && (
              <Link
                href="/authentication/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

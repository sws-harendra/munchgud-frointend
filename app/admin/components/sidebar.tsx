"use strict";
"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  Banknote,
  Section,
  SeparatorVertical,
  Menu,
  X,
  LogOut,
  PackagePlusIcon,
  Video,
  Pen,
  Camera,
  Star,
  ChartNoAxesGanttIcon,
  Instagram,
  LocateIcon,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Flame,
  FolderTree,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { brandName } from "@/app/contants";
import { useAppDispatch } from "@/app/lib/store/store";
import { logout } from "@/app/lib/store/features/authSlice";

interface SubMenuItem {
  name: string;
  href: string;
  icon?: any;
  badge?: string;
}

interface MenuItem {
  name: string;
  icon: any;
  href?: string;
  isLogout?: boolean;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { name: "Products", icon: Package, href: "/admin/dashboard/products" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/dashboard/orders" },
  { name: "Users", icon: Users, href: "/admin/dashboard/users" },
  {
    name: "Video Management",
    icon: Video,
    href: "/admin/dashboard/video-management",
  },
  {
    name: "Banners",
    icon: Banknote,
    href: "/admin/dashboard/banner-management",
  },
  {
    name: "Images",
    icon: ImageIcon,
    subItems: [
      {
        name: "Hero Section",
        href: "/admin/dashboard/hero-images",
        icon: Sparkles,
        badge: "Slides",
      },
      {
        name: "Trending Images",
        href: "/admin/dashboard/trending-images",
        icon: Flame,
        badge: "Hot",
      },
    ],
  },
  {
    name: "Section Control",
    icon: Section,
    href: "/admin/dashboard/section-control",
  },
  {
    name: "Category",
    icon: SeparatorVertical,
    href: "/admin/dashboard/category",
  },
  {
    name: "Instargram",
    icon: Instagram,
    href: "/admin/dashboard/instagram",
  },
  {
    name: "Service Area",
    icon: LocateIcon,
    href: "/admin/dashboard/service-area",
  },
  {
    name: "Add Pages",
    icon: PackagePlusIcon,
    href: "/admin/dashboard/staticpages",
  },
  {
    name: "Media Coverage",
    icon: Camera,
    href: "/admin/dashboard/media-coverage",
  },
  {
    name: "Blogs",
    icon: Pen,
    href: "/admin/dashboard/blogs",
  },
  {
    name: "Testimonial",
    icon: Star,
    href: "/admin/dashboard/testimonials",
  },
  {
    name: "Social Media Management",
    icon: Video,
    href: "/admin/dashboard/socialmedia",
  },
  {
    name: "Varients",
    icon: ChartNoAxesGanttIcon,
    href: "/admin/dashboard/varient",
  },
  {
    name: "Logout",
    icon: LogOut,
    href: "/authentication/login",
    isLogout: true,
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Images: true, // Default open so tree view is immediately visible
  });

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Auto-expand tree if navigating to a child page
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(
          (sub) => pathname === sub.href
        );
        if (hasActiveChild) {
          setExpandedMenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleSubmenu = (menuName: string) => {
    if (!open) {
      setOpen(true);
      setExpandedMenus((prev) => ({ ...prev, [menuName]: true }));
      return;
    }
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.push("/authentication/login");
      router.refresh();
      window.location.reload();
    }
  };

  return (
    <div className="flex overflow-y-auto overflow-x-hidden h-full bg-gray-900 select-none">
      {/* Sidebar Container */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-gray-900 text-gray-100 h-screen p-4 pt-6 relative duration-300 flex flex-col justify-between`}
      >
        <div>
          {/* Toggle Expand/Collapse Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Sidebar"
            className="absolute -right-3 top-8 w-7 h-7 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition cursor-pointer z-20"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Brand Logo */}
          <h1
            className={`text-xl font-bold mb-8 text-center duration-300 tracking-wider text-amber-400 ${
              !open && "scale-0"
            }`}
          >
            {brandName}
          </h1>

          {/* Menu Items List */}
          <ul className="space-y-2 pb-6">
            {menuItems.map((item, idx) => {
              // 1. Logout Action
              if (item.isLogout) {
                return (
                  <li key={idx}>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 p-2 rounded-xl hover:bg-red-950/40 text-red-400 hover:text-red-300 transition text-left cursor-pointer"
                    >
                      <item.icon size={20} className="shrink-0" />
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200 text-sm font-medium`}
                      >
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              }

              // 2. Tree Dropdown (e.g. Images -> Hero Section, Trending Images)
              if (item.subItems) {
                const isExpanded = !!expandedMenus[item.name];
                const hasActiveChild = item.subItems.some(
                  (sub) => pathname === sub.href
                );

                return (
                  <li key={idx} className="relative">
                    {/* Parent Toggle Button */}
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`flex w-full items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer group ${
                        hasActiveChild
                          ? "bg-gray-800 text-amber-400 font-semibold border border-amber-500/30 shadow-xs"
                          : "hover:bg-gray-800 text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon
                          size={20}
                          className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                            hasActiveChild ? "text-amber-400" : "text-gray-400 group-hover:text-amber-400"
                          }`}
                        />
                        <span
                          className={`${
                            !open && "hidden"
                          } origin-left duration-200 text-sm font-medium truncate`}
                        >
                          {item.name}
                        </span>
                      </div>

                      {open && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700/60 group-hover:border-amber-500/30 group-hover:text-amber-400 transition-colors">
                            {item.subItems.length}
                          </span>
                          <span
                            className={`text-gray-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-90 text-amber-400" : ""
                            }`}
                          >
                            <ChevronRight size={15} />
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Tree Submenu Items */}
                    {open && isExpanded && (
                      <div className="mt-1 ml-5 relative space-y-1 py-1">
                        {/* Continuous Vertical Guide Line for Tree */}
                        <div className="absolute left-0 top-0 bottom-3 w-[2px] bg-gradient-to-b from-amber-500/50 via-gray-700 to-transparent" />

                        {item.subItems.map((sub, sIdx) => {
                          const isChildActive = pathname === sub.href;
                          const SubIcon = sub.icon || Sparkles;

                          return (
                            <div key={sIdx} className="relative pl-5 group">
                              {/* Horizontal Tree Branch Connector */}
                              <div
                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] transition-colors ${
                                  isChildActive
                                    ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                                    : "bg-gray-700 group-hover:bg-amber-500/50"
                                }`}
                              />
                              {/* Connector Node Dot */}
                              <div
                                className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all ${
                                  isChildActive
                                    ? "bg-amber-400 ring-2 ring-amber-400/30 scale-125"
                                    : "bg-gray-600 group-hover:bg-amber-400"
                                }`}
                              />

                              <Link
                                href={sub.href}
                                className={`flex items-center justify-between py-2 px-3 rounded-lg text-xs transition-all ${
                                  isChildActive
                                    ? "bg-gradient-to-r from-amber-500/20 to-transparent text-amber-300 font-semibold border-l-2 border-amber-400 shadow-sm"
                                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/60"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <SubIcon
                                    size={14}
                                    className={`shrink-0 transition-transform ${
                                      isChildActive
                                        ? "text-amber-400 fill-amber-400/40"
                                        : "text-gray-500 group-hover:text-amber-400"
                                    }`}
                                  />
                                  <span className="truncate">{sub.name}</span>
                                </div>
                                {sub.badge && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                      isChildActive
                                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                        : "bg-gray-800 text-gray-500 group-hover:text-gray-300"
                                    }`}
                                  >
                                    {sub.badge}
                                  </span>
                                )}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              }

              // 3. Regular Menu Link
              const isActive = pathname === item.href;

              return (
                <li key={idx}>
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center gap-3 p-2 rounded-xl transition ${
                      isActive
                        ? "bg-gray-800 text-amber-400 font-semibold border-l-4 border-amber-500"
                        : "hover:bg-gray-800 text-gray-200"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`shrink-0 ${
                        isActive ? "text-amber-400" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200 text-sm`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

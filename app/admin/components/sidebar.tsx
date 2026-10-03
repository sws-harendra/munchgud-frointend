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
  MessagesSquare,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { brandName } from "@/app/contants";
import { useAppDispatch } from "@/app/lib/store/store";
import { logout, resetAuthState } from "@/app/lib/store/features/authSlice";
import { useAdminTheme } from "../context/AdminThemeContext";
import FlazoLogo from "@/app/commonComponents/FlazoLogo";

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
    name: "Customer Inquiries",
    icon: Mail,
    href: "/admin/dashboard/inquiries",
  },
  {
    name: "Video Management",
    icon: Video,
    href: "/admin/dashboard/video-management",
  },
  // {
  //   name: "Banners",
  //   icon: Banknote,
  //   href: "/admin/dashboard/banner-management",
  // },
  {
    name: "Hero Section",
    icon: Sparkles,
    href: "/admin/dashboard/hero-images",
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
    name: "Community",
    icon: MessagesSquare,
    href: "/admin/dashboard/community",
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
  const { settings, updateSetting, isSidebarDark, resolvedTheme, effectiveSidebarColor } = useAdminTheme();
  const open = !settings.sidebarCollapsed;

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Images: true,
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
      updateSetting("sidebarCollapsed", false);
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
        sessionStorage.clear();
      }
      await dispatch(logout());
      dispatch(resetAuthState());
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/authentication/login";
      }
    }
  };

  // Helper for active styling
  const getActiveItemStyles = (isActive: boolean) => {
    if (!isActive) return {};
    switch (settings.sidebarActiveStyle) {
      case "border":
        return {
          borderLeft: `4px solid ${settings.accentColor}`,
          backgroundColor: isSidebarDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.05)",
          color: settings.accentColor,
        };
      case "glow":
        return {
          border: `1px solid ${settings.accentColor}`,
          boxShadow: `0 0 12px ${settings.accentColor}44`,
          backgroundColor: `${settings.accentColor}18`,
          color: settings.accentColor,
        };
      case "minimal":
        return {
          color: settings.accentColor,
          backgroundColor: isSidebarDark
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(0, 0, 0, 0.04)",
        };
      case "pill":
      default:
        return {
          backgroundColor: `${settings.accentColor}25`,
          borderColor: `${settings.accentColor}50`,
          color: settings.accentColor,
        };
    }
  };

  const sidebarBg = effectiveSidebarColor;

  return (
    <aside
      className="flex overflow-y-auto overflow-x-hidden h-full select-none shrink-0 transition-all duration-300 border-r z-30"
      style={{
        background: sidebarBg,
        color: isSidebarDark ? "#f4f4f5" : "#0f172a",
        borderColor: isSidebarDark ? "#27272a" : "#e2e8f0",
      }}
    >
      {/* Sidebar Container */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } h-screen p-4 pt-6 relative duration-300 flex flex-col justify-between`}
      >
        <div>
          {/* Toggle Expand/Collapse Button */}
          <button
            onClick={() =>
              updateSetting("sidebarCollapsed", !settings.sidebarCollapsed)
            }
            aria-label="Toggle Sidebar"
            className="absolute -right-3 top-8 w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer z-20 shadow-md border"
            style={{
              backgroundColor: isSidebarDark ? "#09090b" : "#ffffff",
              borderColor: isSidebarDark ? "#27272a" : "#cbd5e1",
              color: isSidebarDark ? "#f4f4f5" : "#334155",
            }}
          >
            {open ? <X size={15} /> : <Menu size={15} />}
          </button>

          {/* Brand Logo */}
          <div
            className={`mb-6 flex justify-center items-center duration-300 transition-all ${
              !open ? "scale-90 mb-4 px-1" : "px-2"
            }`}
          >
            {open ? (
              <FlazoLogo size="sm" align="center" />
            ) : (
              <span className="font-black text-amber-500 text-lg tracking-widest">
                F
              </span>
            )}
          </div>

          {/* Menu Items List */}
          <ul className="space-y-1.5 pb-6">
            {menuItems.map((item, idx) => {
              // 1. Logout Action
              if (item.isLogout) {
                return (
                  <li key={idx} className="pt-2">
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center gap-3 p-2.5 rounded-xl transition text-left cursor-pointer group ${
                        isSidebarDark
                          ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                          : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      <item.icon size={19} className="shrink-0 transition-transform group-hover:scale-110" />
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200 text-sm font-semibold`}
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
                      className={`flex w-full items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer group border ${
                        hasActiveChild
                          ? "font-semibold shadow-xs"
                          : isSidebarDark
                          ? "border-transparent hover:bg-white/10 text-slate-300 hover:text-white"
                          : "border-transparent hover:bg-slate-100 text-slate-800 hover:text-slate-950"
                      }`}
                      style={hasActiveChild ? getActiveItemStyles(true) : {}}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon
                          size={19}
                          className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                            hasActiveChild
                              ? ""
                              : isSidebarDark
                              ? "text-slate-400 group-hover:text-slate-200"
                              : "text-slate-600 group-hover:text-slate-950"
                          }`}
                          style={{
                            color: hasActiveChild ? settings.accentColor : undefined,
                          }}
                        />
                        <span
                          className={`${
                            !open && "hidden"
                          } origin-left duration-200 text-sm font-medium truncate ${
                            !hasActiveChild
                              ? isSidebarDark
                                ? "text-slate-300 group-hover:text-white"
                                : "text-slate-800 group-hover:text-slate-950"
                              : ""
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      {open && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border transition-colors"
                            style={{
                              backgroundColor: isSidebarDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                              borderColor: isSidebarDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
                              color: hasActiveChild ? settings.accentColor : (isSidebarDark ? "#94a3b8" : "#334155"),
                            }}
                          >
                            {item.subItems.length}
                          </span>
                          <span
                            className={`transition-transform duration-200 ${
                              isSidebarDark ? "opacity-60 text-slate-400" : "opacity-80 text-slate-600"
                            } ${isExpanded ? "rotate-90" : ""}`}
                            style={{
                              color: isExpanded ? settings.accentColor : undefined,
                            }}
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
                        <div
                          className="absolute left-0 top-0 bottom-3 w-[2px]"
                          style={{
                            background: `linear-gradient(to bottom, ${settings.accentColor}99, ${
                              isSidebarDark ? "#475569" : "#cbd5e1"
                            }, transparent)`,
                          }}
                        />

                        {item.subItems.map((sub, sIdx) => {
                          const isChildActive = pathname === sub.href;
                          const SubIcon = sub.icon || Sparkles;

                          return (
                            <div key={sIdx} className="relative pl-5 group">
                              {/* Horizontal Tree Branch Connector */}
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] transition-colors"
                                style={{
                                  backgroundColor: isChildActive
                                    ? settings.accentColor
                                    : isSidebarDark
                                    ? "#475569"
                                    : "#cbd5e1",
                                }}
                              />
                              {/* Connector Node Dot */}
                              <div
                                className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all ${
                                  isChildActive ? "ring-2 scale-125" : ""
                                }`}
                                style={{
                                  backgroundColor: isChildActive
                                    ? settings.accentColor
                                    : isSidebarDark
                                    ? "#64748b"
                                    : "#94a3b8",
                                  boxShadow: isChildActive
                                    ? `0 0 0 2px ${settings.accentColor}40`
                                    : undefined,
                                }}
                              />

                              <Link
                                href={sub.href}
                                className={`flex items-center justify-between py-2 px-3 rounded-lg text-xs transition-all ${
                                  isChildActive
                                    ? "font-bold shadow-xs"
                                    : isSidebarDark
                                    ? "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium"
                                }`}
                                style={
                                  isChildActive
                                    ? {
                                        backgroundColor: `${settings.accentColor}20`,
                                        color: settings.accentColor,
                                        borderLeft: `2px solid ${settings.accentColor}`,
                                      }
                                    : {}
                                }
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <SubIcon
                                    size={14}
                                    className={`shrink-0 transition-transform ${
                                      isChildActive
                                        ? ""
                                        : isSidebarDark
                                        ? "text-slate-400 group-hover:text-slate-200"
                                        : "text-slate-600 group-hover:text-slate-950"
                                    }`}
                                    style={{
                                      color: isChildActive
                                        ? settings.accentColor
                                        : undefined,
                                    }}
                                  />
                                  <span
                                    className={`truncate ${
                                      !isChildActive
                                        ? isSidebarDark
                                          ? "text-slate-400 group-hover:text-slate-100"
                                          : "text-slate-700 group-hover:text-slate-950 font-medium"
                                        : ""
                                    }`}
                                  >
                                    {sub.name}
                                  </span>
                                </div>
                                {sub.badge && (
                                  <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border"
                                    style={
                                      isChildActive
                                        ? {
                                            backgroundColor: `${settings.accentColor}25`,
                                            borderColor: `${settings.accentColor}40`,
                                            color: settings.accentColor,
                                          }
                                        : {
                                            backgroundColor: isSidebarDark
                                              ? "rgba(255,255,255,0.06)"
                                              : "#f1f5f9",
                                            borderColor: isSidebarDark ? "transparent" : "#e2e8f0",
                                            color: isSidebarDark ? "#94a3b8" : "#475569",
                                            opacity: 1,
                                          }
                                    }
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
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer group border ${
                      isActive
                        ? "font-semibold shadow-xs"
                        : isSidebarDark
                        ? "border-transparent hover:bg-white/10 text-slate-300 hover:text-white"
                        : "border-transparent hover:bg-slate-100 text-slate-800 hover:text-slate-950"
                    }`}
                    style={isActive ? getActiveItemStyles(true) : {}}
                  >
                    <item.icon
                      size={19}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive
                          ? ""
                          : isSidebarDark
                          ? "text-slate-400 group-hover:text-slate-200"
                          : "text-slate-600 group-hover:text-slate-950"
                      }`}
                      style={{
                        color: isActive ? settings.accentColor : undefined,
                      }}
                    />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200 text-sm ${
                        !isActive
                          ? isSidebarDark
                            ? "text-slate-300 group-hover:text-white font-medium"
                            : "text-slate-800 group-hover:text-slate-950 font-medium"
                          : ""
                      }`}
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
    </aside>
  );
}

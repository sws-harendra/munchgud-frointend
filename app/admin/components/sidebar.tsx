"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ for navigation
import { brandName } from "@/app/contants";
import { useAppDispatch } from "@/app/lib/store/store";
import { logout } from "@/app/lib/store/features/authSlice";

const menuItems = [
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
  }, // ✅ mark logout
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.push("/authentication/login"); // move to login
      router.refresh(); // reloads data / clears cache
      window.location.reload(); // full reload to clear client state
    }
  };

  return (
    <div className="flex overflow-y-auto overflow-x-hidden h-full bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${open ? "w-64" : "w-20"
          } bg-gray-900 text-gray-100 h-screen p-4 pt-6 relative duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-8 w-7 h-7 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Logo */}
        <h1
          className={`text-xl font-bold mb-8 text-center duration-300 ${!open && "scale-0"
            }`}
        >
          {brandName}
        </h1>

        {/* Menu Items */}
        <ul className="space-y-4 ">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              {item.isLogout ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition text-left"
                >
                  <item.icon size={20} />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {item.name}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition"
                >
                  <item.icon size={20} />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {item.name}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

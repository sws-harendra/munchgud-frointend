"use client";

import { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { getUserDetails } from "../lib/store/features/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "../lib/store/store";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch(); // ✅ typed dispatch
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user, status } = useAppSelector(
    (state: RootState) => state.auth, // ✅ typed state
  );

  // Check authentication on app load
  useEffect(() => {
    const publicPages = ["/authentication/login", "/authentication/register"];

    if (publicPages.includes(pathname)) return;

    if (status === "loading") return;

    if (!isAuthenticated && !user && status === "idle") {
      console.log("---> Checking authentication on page load");
      dispatch(getUserDetails());
    }
  }, [dispatch, isAuthenticated, user, status, pathname]);
  useEffect(() => {
    const publicPages = [
      "/authentication/login",
      "/authentication/register",
      "/",
      "/cart",
      "/artists",
      "/products",
      "/terms&conditions"
    ];

    // also allow dynamic product pages
    const publicPatterns = [
      /^\/products\/.*/,
      /^\/artists\/.*/,
      /^\/activation\/.*/,
      /^\/blogs\/\d+\/?.*$/,
    ];

    const isPublic =
      publicPages.includes(pathname) ||
      publicPatterns.some((pattern) => pattern.test(pathname));

    if (isPublic) return;

    if (status === "loading") return;

    if (!isAuthenticated && !user && status === "idle") {
      console.log("---> Checking authentication on page load");
      dispatch(getUserDetails());
    }
    if (status === "failed" || (!isAuthenticated && status === "succeeded")) {
      console.log("---> Authentication failed, redirecting to login");
      router.push("/authentication/login");
      return;
    }
  }, [dispatch, isAuthenticated, user, status, pathname]);

  // Handle redirects based on authentication state
  // useEffect(() => {
  //   const publicPages = [
  //     "/authentication/login",
  //     "/authentication/register",
  //     "/",
  //     "/cart",
  //   ];

  //   if (publicPages.includes(pathname)) return;

  //   if (status === "failed" || (!isAuthenticated && status === "succeeded")) {
  //     console.log("---> Authentication failed, redirecting to login");
  //     router.push("/authentication/login");
  //     return;
  //   }

  //   // if (isAuthenticated && user?.role) {
  //   //   const rolePath: Record<string, string> = {
  //   //     admin: "/admin",
  //   //     instructor: "/instructor",
  //   //     user: "/",
  //   //   };

  //   //   const dashboardPath: Record<string, string> = {
  //   //     admin: "/admin/dashboard",
  //   //     instructor: "/instructor/dashboard",
  //   //     user: "/user/dashboard",
  //   //   };

  //   //   const userRole = user.role as keyof typeof rolePath;
  //   //   const allowedBasePath = rolePath[userRole];
  //   //   const defaultDashboard = dashboardPath[userRole];

  //   //   const isAccessingWrongRoleArea = Object.values(rolePath)
  //   //     .filter((path) => path !== allowedBasePath)
  //   //     .some((path) => pathname.startsWith(path));

  //   //   if (isAccessingWrongRoleArea) {
  //   //     console.log(
  //   //       "---> User accessing wrong role area, redirecting to dashboard:",
  //   //       defaultDashboard
  //   //     );
  //   //     router.push(defaultDashboard);
  //   //     return;
  //   //   }

  //   //   if (pathname === allowedBasePath) {
  //   //     console.log(
  //   //       "---> Redirecting to dashboard from role root:",
  //   //       defaultDashboard
  //   //     );
  //   //     router.push(defaultDashboard);
  //   //     return;
  //   //   }

  //   //   if (pathname === "/" && status === "succeeded") {
  //   //     console.log(
  //   //       "---> Authenticated user on home page, redirecting to dashboard:",
  //   //       defaultDashboard
  //   //     );
  //   //     router.push(defaultDashboard);
  //   //   }
  //   // }
  // // }, [isAuthenticated, user, status, router, pathname]);

  return children;
}

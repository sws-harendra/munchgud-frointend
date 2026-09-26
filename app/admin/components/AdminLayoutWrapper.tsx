"use client";

import React from "react";
import Sidebar from "./sidebar";
import AdminTopBar from "./AdminTopBar";
import AdminSettingsDrawer from "./AdminSettingsDrawer";
import { AdminThemeProvider, useAdminTheme } from "../context/AdminThemeContext";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, settings } = useAdminTheme();

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        resolvedTheme === "dark"
          ? "dark bg-black text-zinc-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* 1. FIXED HEIGHT SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* TOPBAR */}
        <AdminTopBar />

        {/* PAGE CONTENT CONTAINER (SCROLLABLE) */}
        <main
          className={`flex-1 overflow-y-auto min-w-0 transition-colors ${
            resolvedTheme === "dark" ? "bg-black text-zinc-100" : "bg-slate-50/70 text-slate-800"
          }`}
        >
          {children}
        </main>

        {/* CUSTOMIZATION SETTINGS DRAWER */}
        <AdminSettingsDrawer />
      </div>
    </div>
  );
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}

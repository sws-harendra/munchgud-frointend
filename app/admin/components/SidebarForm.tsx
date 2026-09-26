"use client";
import React, { useState, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useAdminTheme } from "../context/AdminThemeContext";

interface SidebarFormProps {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
}

export default function SidebarForm({
  title,
  trigger,
  children,
}: SidebarFormProps) {
  const [open, setOpen] = useState(false);
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  return (
    <>
      {/* Trigger button */}
      <span onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </span>

      {open &&
        createPortal(
          <div className={`fixed inset-0 z-50 flex ${isDarkMode ? "dark" : ""}`}>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div
              className={`relative ml-auto w-full sm:w-[680px] lg:w-[780px] h-full flex flex-col shadow-2xl transition-colors duration-200 animate-slide-in ${
                isDarkMode
                  ? "bg-black border-l border-zinc-800 text-white shadow-black"
                  : "bg-white border-l border-gray-200 text-gray-900 shadow-2xl"
              }`}
            >
              {/* Header */}
              <div
                className={`flex justify-between items-center px-6 py-4 border-b sticky top-0 z-10 ${
                  isDarkMode
                    ? "bg-black/95 border-zinc-800/80 backdrop-blur-md"
                    : "bg-white/95 border-gray-200 backdrop-blur-md"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  <h2
                    className={`text-lg font-bold tracking-tight ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {title}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
                  isDarkMode ? "bg-black text-white" : "bg-gray-50/50 text-gray-900"
                }`}
              >
                {children}
              </div>
            </div>

            {/* Animation */}
            <style jsx>{`
              .animate-slide-in {
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              @keyframes slideIn {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(0);
                }
              }
            `}</style>
          </div>,
          document.body // render at root
        )}
    </>
  );
}

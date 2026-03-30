"use client";
import React, { useState, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

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

  return (
    <>
      {/* Trigger button */}
      <span onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </span>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <div className="ml-auto w-full sm:w-[550px] h-full bg-white shadow-xl flex flex-col animate-slide-in">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">{children}

              </div>
            </div>

            {/* Animation */}
            <style jsx>{`
              .animate-slide-in {
                animation: slideIn 0.3s ease-out forwards;
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
          document.body // 👈 render at root, not inside the card
        )}
    </>
  );
}

"use client";

import React from "react";

interface LoaderProps {
  size?: number | string;
  className?: string;
  text?: string;
  fullscreen?: boolean;
  inline?: boolean;
}

export default function Loader({
  size = 140,
  className = "",
  text,
  fullscreen = false,
  inline = false,
}: LoaderProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        <img
          src="/videos/original-bd2eb132a275b6021481449c4a5ba932.gif"
          alt="Loading..."
          className="object-contain select-none pointer-events-none"
          style={{
            width: typeof size === "number" ? `${size}px` : size,
            height: "auto",
          }}
        />
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-medium text-neutral-600 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  if (inline) {
    return content;
  }

  return (
    <div className="flex items-center justify-center min-h-[40vh] w-full py-8">
      {content}
    </div>
  );
}

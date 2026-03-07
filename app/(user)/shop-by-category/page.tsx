"use client";
import React from "react";

// Example: categories will come from backend later
const categories = Array.from({ length: 6 }).map((_, i) => ({
  name: `Category ${i + 1}`,
  description: `Description for category ${i + 1}`,
}));

// 🎨 Define a pool of gradient+pattern styles
const bgStyles = [
  "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] before:bg-[length:20px_20px]",
  "bg-gradient-to-r from-pink-500 via-green-600 to-orange-500 before:bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.15)_75%)] before:bg-[length:20px_20px]",
  "bg-gradient-to-r from-green-400 via-teal-500 to-emerald-600 before:bg-[radial-gradient(circle,rgba(255,255,255,0.15)_2px,transparent_2px)] before:bg-[length:25px_25px]",
  "bg-gradient-to-r from-green-700 via-orange-400 to-pink-500 before:bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] before:bg-[length:20px_20px]",
  "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 before:bg-[radial-gradient(circle,rgba(255,255,255,0.15)_3px,transparent_3px)] before:bg-[length:30px_30px]",
  "bg-gradient-to-r from-rose-400 via-fuchsia-500 to-purple-600 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_10%,transparent_10%)] before:bg-[length:25px_25px]",
];

export default function ShopByCategory() {
  return (
    <div className="py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg cursor-pointer group transform transition duration-300 hover:scale-105 ${
              bgStyles[i % bgStyles.length] // cycle styles
            }`}
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 before:absolute before:inset-0"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-start space-y-3">
              <h3 className="text-xl font-semibold">{cat.name}</h3>
              <p className="text-sm opacity-90">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

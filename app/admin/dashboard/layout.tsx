import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../components/sidebar";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Dashboard section for users",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`h-screen overflow-hidden ${geistSans.variable} ${geistMono.variable}`}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <main className="flex h-full">
        {/* Sidebar stays fixed height */}
        <Sidebar />

        {/* Right content gets its own scroll */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

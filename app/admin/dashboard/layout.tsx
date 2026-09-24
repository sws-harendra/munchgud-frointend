import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdminLayoutWrapper from "../components/AdminLayoutWrapper";
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
  title: "Admin Dashboard | Flazo Control Center",
  description: "Administrative dashboard and store control center",
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
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </div>
  );
}


import type { Metadata } from "next";
import { Geist, Geist_Mono, Edu_NSW_ACT_Foundation } from "next/font/google";
import EcommerceNavbar from "./components/navbar";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const eduCursive = Edu_NSW_ACT_Foundation({
  variable: "--font-edu-cursive",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MunchGud Makhana",
  description: "Dashboard section for users",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://munchgud.com",
    siteName: "MunchGud",
    title: "MunchGud Makhana",
    description: "Dashboard section for users",
    images: [
      {
        url: "/logo.png",
        width: 210,
        height: 110,
        alt: "MunchGud logo",
      },
    ],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={` ${geistSans.variable} ${geistMono.variable} ${eduCursive.variable}`}
    >
      <EcommerceNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "FLAZO",
  description: "Official FLAZO Store. Shop online at Flazo.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://flazo.in",
    siteName: "FLAZO",
    title: "FLAZO",
    description: "Official FLAZO Store. Shop online at Flazo.",
    images: [
      {
        url: "/images/hero-earbuds.jpg",
        width: 1200,
        height: 675,
        alt: "FLAZO",
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
      className={` ${geistSans.variable} ${geistMono.variable}`}
    >
      <EcommerceNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

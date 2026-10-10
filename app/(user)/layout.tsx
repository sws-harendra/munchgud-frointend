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
  title: "Flazo™ | Luxury Wireless Earbuds & Audio Store",
  description: "Shop Flazo flagship wireless earbuds in India. Featuring 13mm BoomBass™ drivers, 50dB Hybrid ANC, 100-hour battery life & signature gold acoustics. Free express shipping.",
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
    siteName: "Flazo Audio",
    title: "Flazo™ | Luxury Wireless Earbuds & Audio Store",
    description: "Shop Flazo flagship wireless earbuds in India. Featuring 13mm BoomBass™ drivers, 50dB Hybrid ANC, 100-hour battery life & signature gold acoustics. Free express shipping.",
    images: [
      {
        url: "/images/hero-earbuds.jpg",
        width: 1200,
        height: 675,
        alt: "Flazo Luxury Earbuds",
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

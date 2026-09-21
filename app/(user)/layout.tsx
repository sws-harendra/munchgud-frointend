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
  title: "Flazo™ | Luxury Wireless Earbuds & Audio",
  description: "Immerse yourself in signature gold acoustics with Flazo flagship earbuds.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://flazo.com",
    siteName: "Flazo",
    title: "Flazo™ | Luxury Wireless Earbuds & Audio",
    description: "Immerse yourself in signature gold acoustics with Flazo flagship earbuds.",
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
      className={` ${geistSans.variable} ${geistMono.variable} ${eduCursive.variable}`}
    >
      <EcommerceNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

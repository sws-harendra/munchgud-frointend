import type { Metadata } from "next";
import { Geist, Geist_Mono, Edu_NSW_ACT_Foundation } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./lib/provider/StoreProvider";
import AuthProvider from "./hooks/authProvider";
import { Toaster } from "sonner";

const siteUrl = "https://munchgud.com";

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
  weight: ["400", "500", "600", "700"], // optional
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Flazo™ | Premium Wireless Earbuds & Luxury Audio",
    template: "%s | Flazo™",
  },
  description: "Experience acoustic perfection with Flazo wireless earbuds. Featuring 50dB Hybrid ANC, 70H battery life, and signature gold acoustics.",
  applicationName: "Flazo",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Flazo",
    title: "Flazo™ | Premium Wireless Earbuds & Luxury Audio",
    description: "Experience acoustic perfection with Flazo wireless earbuds. Featuring 50dB Hybrid ANC, 70H battery life, and signature gold acoustics.",
    images: [
      {
        url: "/images/hero-earbuds.jpg",
        width: 1200,
        height: 675,
        alt: "Flazo Wireless Earbuds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flazo™ | Premium Wireless Earbuds & Luxury Audio",
    description: "Experience acoustic perfection with Flazo wireless earbuds.",
    images: ["/images/hero-earbuds.jpg"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${eduCursive.variable} antialiased`}
      >
        {" "}
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider> <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}

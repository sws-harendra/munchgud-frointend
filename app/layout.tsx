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
    default: "MunchGud Makhana",
    template: "%s | MunchGud",
  },
  description: "Dashboard section for users",
  applicationName: "MunchGud",
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
  twitter: {
    card: "summary_large_image",
    title: "MunchGud Makhana",
    description: "Dashboard section for users",
    images: ["/logo.png"],
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

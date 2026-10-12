import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./lib/provider/StoreProvider";
import AuthProvider from "./hooks/authProvider";
import { Toaster } from "sonner";

const siteUrl = "https://flazo.in";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "FLAZO",
  description: "Official FLAZO Store. Shop online at Flazo.",
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
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
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
  twitter: {
    card: "summary_large_image",
    title: "FLAZO",
    description: "Official FLAZO Store. Shop online at Flazo.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider> <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}

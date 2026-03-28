import type { Metadata } from "next";
import { Geist, Geist_Mono, Edu_NSW_ACT_Foundation } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./lib/provider/StoreProvider";
import AuthProvider from "./hooks/authProvider";
import { Toaster } from "sonner";

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

export const metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
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

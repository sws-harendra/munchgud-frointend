import type { NextConfig } from "next";

const imageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.pexels.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
  },
];

if (process.env.NEXT_PUBLIC_serverurl) {
  const uploadUrl = new URL(process.env.NEXT_PUBLIC_serverurl);

  imageRemotePatterns.push({
    protocol: uploadUrl.protocol.replace(":", "") as "http" | "https",
    hostname: uploadUrl.hostname,
    port: uploadUrl.port,
  });
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/Sitemap.html",
        destination: "/sitemap.html",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.munchgud.com",
          },
        ],
        destination: "https://munchgud.com/:path*",
        permanent: true,
      },
    ];
  },
  typescript: {
    // ✅ Skip type checking at build time
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Skip ESLint checks at build time
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;

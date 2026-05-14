import type { MetadataRoute } from "next";

const siteUrl = "https://munchgud.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/products",
    "/shop-by-category",
    "/aboutus",
    "/contactus",
    "/blogs",
    "/artists",
    "/refund-policy",
    "/privacy-policy",
    "/terms&conditions",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

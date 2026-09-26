// utils/getImageUrl.ts

import { serverurl } from "../contants";

export const getImageUrl = (path?: string | null): string => {
  if (!path) return "/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) return path;

  const BASE_URL = serverurl || "http://localhost:8008";

  // If path is in uploads folder, route to backend server
  if (path.startsWith("/uploads/")) {
    return `${BASE_URL}${encodeURI(path)}`;
  }
  if (path.startsWith("uploads/")) {
    return `${BASE_URL}/${encodeURI(path)}`;
  }

  // Next.js local static assets in /public folder (e.g. /images/...)
  if (path.startsWith("/")) return encodeURI(path);

  const normalizedPath = path.replace(/^uploads\//, "");
  return `${BASE_URL}/uploads/${encodeURI(normalizedPath)}`;
};

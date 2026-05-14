// utils/getImageUrl.ts

import { serverurl } from "../contants";

export const getImageUrl = (path?: string): string => {
  if (!path) return "/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;

  const BASE_URL = serverurl || "http://localhost:5000";
  const normalizedPath = path.replace(/^uploads\//, "");

  return `${BASE_URL}/uploads/${normalizedPath}`;
};

export const brandName = "MunchGud™";
export const serverurl =
  typeof window === "undefined"
    ? (process.env.INTERNAL_SERVER_URL || process.env.NEXT_PUBLIC_serverurl || "http://localhost:8008")
    : (process.env.NEXT_PUBLIC_serverurl || "http://localhost:8008");
export const clienturl = process.env.CLIENT_URL || "http://localhost:3000";
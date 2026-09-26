import axios from "axios";
import { serverurl } from "@/app/contants";

const instance = axios.create({
  withCredentials: true, // Crucial for sending cookies
  baseURL: `${serverurl}`,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "";

    const response = await axios.post(
      `${serverurl}/user/refreshtoken`,
      { refreshToken },
      {
        withCredentials: true,
      }
    );

    if (response.data?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data?.accessToken;
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
    }
    throw new Error("Failed to refresh token");
  }
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh on auth endpoints to prevent loops
    const authEndpoints = ["/user/login-user", "/user/create-user", "/user/refreshtoken"];
    const isAuthRequest = authEndpoints.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or failed
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

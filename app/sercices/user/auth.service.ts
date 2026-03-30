import { EmailLoginRequest, RegisterUserRequest } from "@/app/types/auth.types";
import axiosInstance from "@/app/utils/axiosinterceptor";

export const authService = {
  // Email login
  emailLogin: async (credentials: EmailLoginRequest) => {
    try {
      const response = await axiosInstance.post("/user/login-user", credentials);
      return response.data;
    } catch (error: any) {
      console.log("SERVICE ERROR 👉", error);

      // 🔥 FORCE EXTRACT MESSAGE
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Invalid credentials";

      throw { message };
    }
  },

  activateAccount: async (activation_token: any) => {
    const response = await axiosInstance.post(
      "/user/activation",
      {
        activation_token: activation_token,
      },
      {
        withCredentials: true, // 🔥 MUST ADD
      }
    );
    return response.data;
  },
  // Send OTP to phone
  sendOtpToPhone: async (phoneNumber: string) => {
    const response = await axiosInstance.post("/user/auth/send-otp", {
      phoneNumber,
    });
    return response.data;
  },

  // Verify phone OTP
  verifyPhoneOtp: async (phoneNumber: string, otp: string) => {
    const response = await axiosInstance.post("/user/auth/verify-otp", {
      phoneNumber,
      otp,
    });
    return response.data;
  },

  // Resend OTP
  resendOtp: async (phoneNumber: string) => {
    const response = await axiosInstance.post("/user/auth/resend-otp", {
      phone: phoneNumber,
    });
    return response.data;
  },

  // Get user details
  getUserDetails: async () => {
    const response = await axiosInstance.get("/user/getuser");
    return response.data;
  },
  updateUserInfo: async (data: {
    fullname?: string;
    email?: string;
    phoneNumber?: string;
    secondaryNumber?: string;
    password?: string;
  }) => {
    const response = await axiosInstance.put("/user/update-user-info", data);
    return response.data;
  },
  addUserAddress: async (address: {
    addressType: string;
    address1: string;
    address2?: string;
    landmark: string;
    city: string;
    state?: string;
    zipCode: string;
  }) => {
    const response = await axiosInstance.put(
      "/user/update-user-addresses",
      address,
    );
    console.log("resssppinse==>", response.data, response.data);
    return response.data; // { success, address }
  },

  deleteUserAddress: async (id: string) => {
    const response = await axiosInstance.delete(
      `/user/delete-user-address/${id}`,
    );
    return response.data; // { success, addresses }
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axiosInstance.post("/user/refreshtoken");
    return response.data;
  },

  registerUser: async (userData: RegisterUserRequest) => {
    const response = await axiosInstance.post("user/create-user", userData);
    return response.data;
  },
  getAllUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axiosInstance.get("/user/admin-all-users", {
      params,
    });
    return response.data; // { success, totalUsers, currentPage, totalPages, users }
  },
  deleteUser: async (id: any) => {
    const response = await axiosInstance.delete(`/user/delete-user/${id}`);
    return response.data; // { success, totalUsers, currentPage, totalPages, users }
  },

  getAllDrivers: async (params: { search?: string }) => {
    const response = await axiosInstance.get("/driver/admin-all-drivers", {
      params,
    });
    return response.data; // { success, totalUsers, currentPage, totalPages, users }
  },
  registerUseradmin: async (userData: FormData) => {
    const response = await axiosInstance.post(
      "/user/admin-create-user",
      userData,
    );
    return response.data;
  },
  updateUser: async (userId: string, data: FormData) => {
    const response = await axiosInstance.put(
      `/user/admin-update-user/${userId}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};

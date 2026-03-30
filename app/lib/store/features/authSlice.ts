import { authService } from "@/app/sercices/user/auth.service";
import {
  AuthState,
  EmailLoginRequest,
  RegisterUserRequest,
  VerifyOtpRequest,
} from "@/app/types/auth.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await authService.registerUser(userData);
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Invalid credentials"
      );
    }
  },
);
export const registerUserbyAdmin = createAsyncThunk(
  "auth/register/admin",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await authService.registerUseradmin(userData);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const emailLogin = createAsyncThunk(
  "auth/emailLogin",
  async (credentials: EmailLoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.emailLogin(credentials);
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err?.message || err?.response?.data?.message || "Invalid credentials"
      );
    }
  },
);

export const sendOtpToPhone = createAsyncThunk(
  "auth/sendOtpToPhone",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtpToPhone(phoneNumber);
      return { ...response, phoneNumber };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email login failed");
    }
  },
);

export const verifyPhoneOtp = createAsyncThunk(
  "auth/verifyPhoneOtp",
  async ({ phoneNumber, otp }: VerifyOtpRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyPhoneOtp(phoneNumber, otp);
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("OTP verification failed");
    }
  },
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(phoneNumber);
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email login failed");
    }
  },
);
// auth.slice.ts
export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async (
    data: {
      fullname?: string;
      email?: string;
      phoneNumber?: string;
      secondaryNumber?: string;
      password?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateUserInfo(data);
      return response.user; // backend returns { success, user }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("User update failed");
    }
  },
);

export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUserDetails();
      console.log(response);
      return response.user;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email login failed");
    }
  },
);

export const addUserAddress = createAsyncThunk(
  "auth/addUserAddress",
  async (
    address: {
      addressType: string;
      address1: string;
      address2?: string;
      city: string;
      landmark: string;
      state?: string;
      zipCode: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.addUserAddress(address);
      return response.address; // backend returns { success, address }
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to add address");
    }
  },
);

export const deleteUserAddress = createAsyncThunk(
  "auth/deleteUserAddress",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await authService.deleteUserAddress(id);
      return response.addresses; // backend returns updated addresses
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete address");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      if (typeof window !== "undefined") {
        window.location.href = "/authentication/login";
      }

      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email login failed");
    }
  },
);

export const getAllDriversforAdmin = createAsyncThunk(
  "auth/getDrivers",
  async (
    data: {
      search?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getAllDrivers(data);
      console.log(response);
      return response.users;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email login failed");
    }
  },
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  loginMethod: "email", // "email" | "phone" | "otp"
  phoneNumber: "",
  otpSent: false,
  role: "user",
  addressStatus: "idle",
  addressError: null,
  allDrivers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoginMethod: (state, action) => {
      state.loginMethod = action.payload;
      state.error = null;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    resetAuthState: (state) => {
      state.status = "idle";
      state.error = null;
      state.otpSent = false;
      state.role = "user";
    },
  },
  extraReducers: (builder) => {
    builder
      // Email Login
      .addCase(emailLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(emailLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;

        state.isAuthenticated = true;

        state.error = null;
      })
      .addCase(emailLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          "Invalid credentials";
        state.isAuthenticated = false;
      })

      // Send OTP to Phone
      .addCase(sendOtpToPhone.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtpToPhone.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.otpSent = true;
        state.loginMethod = "otp";
        state.phoneNumber = action.payload.phoneNumber;
        state.error = null;
      })
      .addCase(sendOtpToPhone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.otpSent = false;
      })

      // Verify Phone OTP
      .addCase(verifyPhoneOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyPhoneOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.otpSent = false;
        state.error = null;
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get User Details
      .addCase(getUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.status = "failed";
        // state.error = action.payload;
        state.isAuthenticated = false;
      })
      // for updating profile

      .addCase(addUserAddress.pending, (state) => {
        state.addressStatus = "loading";
        state.addressError = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        console.log("actionpayload", action.payload);
        if (state.user) {
          // append the new address to user.addresses
          state.user.addresses = [
            ...(state.user.addresses || []),
            action.payload,
          ];
        }
        state.addressStatus = "succeeded";
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.addressStatus = "failed";
        state.addressError = action.payload as string;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // update local state with updated user
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUserAddress.pending, (state) => {
        state.addressStatus = "loading";
        state.addressError = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
        state.addressStatus = "succeeded";
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.addressStatus = "failed";
        state.addressError = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loginMethod = "email";
        state.phoneNumber = "";
        state.otpSent = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // state.user = action.payload;
        state.registerStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload;
      })
      .addCase(getAllDriversforAdmin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllDriversforAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allDrivers = action.payload;
      })
      .addCase(getAllDriversforAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUserbyAdmin.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(registerUserbyAdmin.fulfilled, (state, action) => {
        // state.user = action.payload;
        state.registerStatus = "succeeded";
      })
      .addCase(registerUserbyAdmin.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload;
      });

  },
});

export const { clearError, setLoginMethod, setPhoneNumber, resetAuthState } =
  authSlice.actions;
export default authSlice.reducer;

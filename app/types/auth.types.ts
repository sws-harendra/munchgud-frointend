// Request DTOs
export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface RegisterUserRequest {
  email?: string;
  phoneNumber: string;
  password: string;
  fullname: string;
  file?: string;
}

export interface AuthState {
  user: User | null; // replace 'any' with proper User type
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown; // ✅ allow string or null
  loginMethod: "email" | "phone" | "otp";
  phoneNumber: string;
  otpSent: boolean;
  registerStatus?: "idle" | "loading" | "succeeded" | "failed";
  role: "user" | "admin" | "driver";
  addressStatus?: "idle" | "loading" | "succeeded" | "failed";
  addressError?: string | null;
  allDrivers: User[];
}

// Response DTOs
export interface Address {
  id: string;
  addressType: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  country?: string;
  zipCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email?: string;
  fullname: string;
  role: "user" | "admin" | "driver";
  phoneNumber?: string;
  secondaryNumber?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  addresses: Address[]; // ✅ include addresses
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

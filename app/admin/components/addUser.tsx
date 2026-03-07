"use client";
import React, { useState } from "react";
import { Mail, Lock, User, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  registerUser,
  registerUserbyAdmin,
} from "@/app/lib/store/features/authSlice";

const AddUsers = ({ onSuccess }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (!fullname || !email || !password) {
        setError("All fields are required");
        return;
      }

      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("password", password);

      // 👇 mapped role
      formData.append("role", role);

      if (profileImage) {
        formData.append("file", profileImage);
      }

      const response = await dispatch(registerUserbyAdmin(formData)).unwrap();

      if (response?.success) {
        onSuccess?.();
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>

      {/* Full Name */}
      <div className="mb-4">
        <label className="text-sm font-medium">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-10 p-2 border rounded-lg"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="email"
            className="w-full pl-10 p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="password"
            className="w-full pl-10 p-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Role Dropdown */}
      <div className="mb-4">
        <label className="text-sm font-medium">User Type</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="driver">Associate</option>
        </select>
      </div>

      {/* Image Upload */}
      {profileImage ? (
        <div className="mb-4">
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
        </div>
      ) : null}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
        <label className="flex flex-col items-center space-y-4 cursor-pointer">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ImagePlus className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xl font-medium text-gray-700 group-hover:text-blue-600">
              Upload Product Images & Videos
            </span>
            <p className="text-gray-500 mt-1">
              PNG, JPG, WEBP, MP4, MKV up to 10MB
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-green-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="my-4 w-full bg-lime-600 text-white py-2 rounded-lg hover:bg-lime-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </div>
  );
};

export default AddUsers;

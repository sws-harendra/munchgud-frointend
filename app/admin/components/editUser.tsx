"use client";
import React, { useState, useEffect } from "react";
import { Mail, User, ImagePlus, Phone } from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/store";
import { updateUser } from "@/app/lib/store/features/userSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "react-hot-toast";

interface EditUserProps {
  user: {
    id: string | number;
    fullname: string;
    email: string;
    phoneNumber?: string | null;
    avatar?: string | null;
    role: string;
  };
  onSuccess: () => void;
}

const EditUser = ({ user, onSuccess }: EditUserProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "user",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      role: user.role,
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setProfileImage(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fullname", form.fullname);
      fd.append("email", form.email);
      fd.append("phoneNumber", form.phoneNumber);
      fd.append("role", form.role);
      if (profileImage) {
        fd.append("file", profileImage);
      }

      await dispatch(updateUser({ userId: String(user.id), data: fd })).unwrap();
      toast.success("User updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Image Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Current Profile Image
        </label>
        <div className="relative">
          <img
            src={`${getImageUrl(user.avatar)}`}
            alt={user.fullname}
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-200 mx-auto"
          />
          <div className="text-center mt-2 text-sm text-gray-600">
            {user.fullname}
          </div>
        </div>
      </div>

      {/* New Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Upload New Profile Image (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="edit-profile-upload"
          />
          <label
            htmlFor="edit-profile-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">
              {profileImage ? profileImage.name : "Click to upload new image"}
            </span>
          </label>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">User Type *</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="user">User</option>
          <option value="driver">Associate</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={loading || !form.fullname || !form.email}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/25"
      >
        {loading ? "Updating..." : "Update User"}
      </button>
    </div>
  );
};

export default EditUser;

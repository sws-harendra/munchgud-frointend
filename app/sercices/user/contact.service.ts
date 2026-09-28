import axiosInstance from "@/app/utils/axiosinterceptor";

export interface ContactInquiryItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  orderId?: string;
  subject?: string;
  message: string;
  source: "contact_form" | "live_concierge" | "support_warranty" | string;
  status: "new" | "in_progress" | "resolved" | "closed";
  userId?: number;
  adminNotes?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullname: string;
    email: string;
    phoneNumber?: number;
    role?: string;
    avatar?: string;
  };
}

export interface InquiriesStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  conciergeCount: number;
  contactFormCount: number;
}

export interface InquiriesResponse {
  success: boolean;
  inquiries: ContactInquiryItem[];
  stats: InquiriesStats;
}

export const contactService = {
  // Public/Customer: Submit Inquiry or Concierge message
  sendContactInquiry: async (data: {
    name?: string;
    email?: string;
    phone?: string;
    orderId?: string;
    subject?: string;
    message: string;
    source?: string;
  }) => {
    const response = await axiosInstance.post("/contact", data);
    return response.data;
  },

  // Admin: Get all inquiries
  getAllInquiriesAdmin: async (params?: {
    status?: string;
    source?: string;
    search?: string;
  }): Promise<InquiriesResponse> => {
    const response = await axiosInstance.get("/contact/admin", { params });
    return response.data;
  },

  // Admin: Update status or internal notes
  updateInquiryStatusAdmin: async (
    id: number,
    data: { status?: string; adminNotes?: string }
  ) => {
    const response = await axiosInstance.patch(`/contact/admin/${id}`, data);
    return response.data;
  },

  // Admin: Delete inquiry
  deleteInquiryAdmin: async (id: number) => {
    const response = await axiosInstance.delete(`/contact/admin/${id}`);
    return response.data;
  },
};

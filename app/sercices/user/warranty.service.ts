import axiosInstance from "@/app/utils/axiosinterceptor";

export interface WarrantyItem {
  id: number;
  claimId: string;
  fullName: string;
  phone: string;
  email?: string;
  serialNumber: string;
  orderId?: string;
  productModel: string;
  claimType: "registration" | "claim" | "replacement";
  issueDescription?: string;
  purchaseDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  status: "approved" | "pending" | "in_review" | "rejected" | "resolved";
  source: string;
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

export interface WarrantyStats {
  total: number;
  approvedCount: number;
  pendingCount: number;
  inReviewCount: number;
  resolvedCount: number;
  rejectedCount: number;
  expiredCount?: number;
  registrationsCount: number;
  claimsCount: number;
}

export interface WarrantyAdminResponse {
  success: boolean;
  warranties: WarrantyItem[];
  stats: WarrantyStats;
  message?: string;
}

export interface WarrantyCheckResponse {
  success: boolean;
  found: boolean;
  message?: string;
  data?: {
    claimId: string;
    productModel: string;
    serialNumber: string;
    status: string;
    isExpired: boolean;
    warrantyStartDate?: string;
    warrantyEndDate?: string;
    coverage: string;
    createdAt?: string;
  };
}

export const warrantyService = {
  // Public/Customer: Register Product or Submit Warranty Claim
  registerWarranty: async (data: {
    fullName: string;
    phone: string;
    email?: string;
    serialNumber: string;
    orderId?: string;
    productModel: string;
    claimType?: "registration" | "claim" | "replacement";
    issueDescription?: string;
    purchaseDate?: string;
    source?: string;
  }) => {
    const response = await axiosInstance.post("/warranty", data);
    return response.data;
  },

  // Public/Customer: Check Warranty Status by Serial Number, Order ID, or Claim ID
  checkWarranty: async (query: string): Promise<WarrantyCheckResponse> => {
    const response = await axiosInstance.get("/warranty/check", {
      params: { q: query },
    });
    return response.data;
  },

  // Admin: Get all warranties with filters, search, and live stats
  getAllWarrantiesAdmin: async (params?: {
    status?: string;
    claimType?: string;
    search?: string;
  }): Promise<WarrantyAdminResponse> => {
    const response = await axiosInstance.get("/warranty/admin", { params });
    return response.data;
  },

  // Admin: Update warranty status, admin notes, or end date
  updateWarrantyStatusAdmin: async (
    id: number,
    data: {
      status?: string;
      adminNotes?: string;
      warrantyEndDate?: string;
      claimType?: string;
    }
  ) => {
    const response = await axiosInstance.patch(`/warranty/admin/${id}`, data);
    return response.data;
  },

  // Admin: Delete warranty record
  deleteWarrantyAdmin: async (id: number) => {
    const response = await axiosInstance.delete(`/warranty/admin/${id}`);
    return response.data;
  },
};

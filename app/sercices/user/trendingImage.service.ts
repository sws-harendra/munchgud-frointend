import axiosInstance from "@/app/utils/axiosinterceptor";

export interface TrendingImageItem {
  id: number;
  name: string;
  badge: string;
  badgeBg: string;
  imageUrl: string;
  featureBar: string;
  rating: number;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  colors: string; // JSON string of hex array
  extraColorsCount: number;
  link: string | null;
  productId: number | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  product?: {
    id: number;
    name: string;
    discountPrice?: number;
    originalPrice?: number;
    images?: any;
  } | null;
}

export interface TrendingImageStats {
  total: number;
  active: number;
  inactive: number;
  avgPrice: number;
}

export const trendingImageService = {
  // Public - fetch active trending items for storefront
  getActiveTrendingImages: async (): Promise<TrendingImageItem[]> => {
    const response = await axiosInstance.get("/trending-images");
    return response.data?.data || [];
  },

  // Admin - fetch all trending items with stats
  getAllTrendingImagesAdmin: async (): Promise<{
    data: TrendingImageItem[];
    stats: TrendingImageStats;
  }> => {
    const response = await axiosInstance.get("/trending-images/admin/all");
    return {
      data: response.data?.data || [],
      stats: response.data?.stats || { total: 0, active: 0, inactive: 0, avgPrice: 0 },
    };
  },

  // Admin - get by id
  getTrendingImageById: async (id: number): Promise<TrendingImageItem> => {
    const response = await axiosInstance.get(`/trending-images/${id}`);
    return response.data?.data;
  },

  // Admin - create
  createTrendingImage: async (formData: FormData): Promise<TrendingImageItem> => {
    const response = await axiosInstance.post("/trending-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  },

  // Admin - update
  updateTrendingImage: async (
    id: number,
    formData: FormData
  ): Promise<TrendingImageItem> => {
    const response = await axiosInstance.put(`/trending-images/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  },

  // Admin - toggle active status
  toggleTrendingImageStatus: async (id: number): Promise<TrendingImageItem> => {
    const response = await axiosInstance.patch(`/trending-images/${id}/status`);
    return response.data?.data;
  },

  // Admin - bulk reorder
  reorderTrendingImages: async (
    items: { id: number; displayOrder: number }[]
  ): Promise<TrendingImageItem[]> => {
    const response = await axiosInstance.put("/trending-images/reorder/bulk", {
      items,
    });
    return response.data?.data || [];
  },

  // Admin - delete
  deleteTrendingImage: async (id: number): Promise<number> => {
    const response = await axiosInstance.delete(`/trending-images/${id}`);
    return response.data?.deletedId || id;
  },
};

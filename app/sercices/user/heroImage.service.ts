import axiosInstance from "@/app/utils/axiosinterceptor";

export interface HeroImageItem {
  id: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  mobileImageUrl?: string | null;
  link: string | null;
  ctaText: string | null;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroImageStats {
  total: number;
  active: number;
  inactive: number;
}

export const heroImageService = {
  // Public - fetch active slides for homepage
  getActiveHeroImages: async (): Promise<HeroImageItem[]> => {
    const response = await axiosInstance.get("/hero-images");
    return response.data?.data || [];
  },

  // Admin - fetch all slides with stats
  getAllHeroImagesAdmin: async (): Promise<{
    data: HeroImageItem[];
    stats: HeroImageStats;
  }> => {
    const response = await axiosInstance.get("/hero-images/admin/all");
    return {
      data: response.data?.data || [],
      stats: response.data?.stats || { total: 0, active: 0, inactive: 0 },
    };
  },

  // Admin - get by id
  getHeroImageById: async (id: number): Promise<HeroImageItem> => {
    const response = await axiosInstance.get(`/hero-images/${id}`);
    return response.data?.data;
  },

  // Admin - create
  createHeroImage: async (formData: FormData): Promise<HeroImageItem> => {
    const response = await axiosInstance.post("/hero-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  },

  // Admin - update
  updateHeroImage: async (
    id: number,
    formData: FormData
  ): Promise<HeroImageItem> => {
    const response = await axiosInstance.put(`/hero-images/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  },

  // Admin - toggle active status
  toggleHeroImageStatus: async (id: number): Promise<HeroImageItem> => {
    const response = await axiosInstance.patch(`/hero-images/${id}/status`);
    return response.data?.data;
  },

  // Admin - bulk reorder
  reorderHeroImages: async (
    items: { id: number; displayOrder: number }[]
  ): Promise<HeroImageItem[]> => {
    const response = await axiosInstance.put("/hero-images/reorder/bulk", {
      items,
    });
    return response.data?.data || [];
  },

  // Admin - delete
  deleteHeroImage: async (id: number): Promise<number> => {
    const response = await axiosInstance.delete(`/hero-images/${id}`);
    return response.data?.deletedId || id;
  },
};

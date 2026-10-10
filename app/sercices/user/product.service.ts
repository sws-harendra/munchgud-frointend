// src/app/services/product/product.service.ts
import axiosInstance from "@/app/utils/axiosinterceptor";

export const productService = {
  // Create product
  createProduct: async (formData: FormData) => {
    const response = await axiosInstance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Get all products
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    trending?: boolean;
  }) => {
    const response = await axiosInstance.get("/products", { params });
    return response.data;
  },
  getAllProductsforAdmin: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    trending?: boolean;
  }) => {
    const response = await axiosInstance.get("/products/forAdmin", { params });
    return response.data;
  },
  // Get single product by ID
  getProductById: async (id: string | number) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string | number, data: unknown) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string | number) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  // Get trending products
  getTrendingProducts: async () => {
    const response = await axiosInstance.get("/products/trending-products");
    return response.data;
  },
 addReview: async (reviewData: {
  productId: number;
  rating: number;
  comment: string;
  }) => {
    const response = await axiosInstance.post(
      `/review-rating/add-review`,
      reviewData
    );
    return response.data;
  },
  getProductReviews: async (productId: number) => {
    const response = await axiosInstance.get(
      `/review-rating/product-reviews/${productId}`
    );
    return response.data;
  },

  getAverageRating: async (productId: number) => {
    const response = await axiosInstance.get(
      `/review-rating/average-rating/${productId}`
    );
    return response.data;
  },
};

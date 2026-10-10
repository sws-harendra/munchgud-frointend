import axiosInstance from "@/app/utils/axiosinterceptor";

export const variantService = {
  // Variant Categories
  async getAllVariantCategories() {
    const response = await axiosInstance.get("/variants/categories");
    return response.data;
  },

  async createVariantCategory(data: { name: string; description: string }) {
    const response = await axiosInstance.post("/variants/categories", data);
    return response.data;
  },

  // Variant Options
  async getAllVariantOptions() {
    const response = await axiosInstance.get("/variants/options");
    return response.data;
  },

  async createVariantOption(data: {
    name: string;
    categoryId: number;
    additionalPrice?: number;
  }) {
    const response = await axiosInstance.post("/variants/options", data);
    return response.data;
  },

  // Product Variants
  async getProductVariants(productId: number) {
    const response = await axiosInstance.get(
      `/variants/products/${productId}/variants`
    );
    return response.data;
  },

  async createProductVariant(
    productId: number,
    data: {
      optionId: number;
      sku: string;
      price: number;
      originalPrice?: number;
      stock: number;
      image?: File;
      images?: File[];
    }
  ) {
    const formData = new FormData();
    formData.append("optionIds", data.optionId.toString());
    if (data.sku) formData.append("sku", data.sku);
    formData.append("price", data.price.toString());
    if (data.originalPrice !== undefined)
      formData.append("originalPrice", data.originalPrice.toString());
    formData.append("stock", data.stock.toString());

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    } else if (data.image) {
      formData.append("images", data.image);
    }

    const response = await axiosInstance.post(
      `/variants/products/${productId}/variants`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async deleteProductVariant(variantId: number) {
    const response = await axiosInstance.delete(
      `/variants/variants/${variantId}`
    );
    return response.data;
  },
  async updateProductVariant(
    variantId: number,
    data: {
      sku?: string;
      price?: number;
      originalPrice?: number;
      stock?: number;
      isActive?: boolean;
      image?: File;
      images?: File[];
    }
  ) {
    const formData = new FormData();
    if (data.sku !== undefined) formData.append("sku", data.sku);
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.originalPrice !== undefined)
      formData.append("originalPrice", data.originalPrice.toString());
    if (data.stock !== undefined)
      formData.append("stock", data.stock.toString());
    if (data.isActive !== undefined)
      formData.append("isActive", data.isActive.toString());

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    } else if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.put(
      `/variants/variants/${variantId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }, // Variant Categories
  async deleteVariantCategory(id: number) {
    const response = await axiosInstance.delete(`/variants/categories/${id}`);
    return response.data;
  },

  // Variant Options
  async deleteVariantOption(id: number) {
    const response = await axiosInstance.delete(`/variants/options/${id}`);
    return response.data;
  },
};

import axiosInstance from "@/app/utils/axiosinterceptor";

export interface BlogPostItem {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  readTime?: string;
  views?: number;
  authorName?: string;
  tags?: string;
  status?: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: number;
    fullname: string;
    email: string;
  };
}

export const blogService = {
  // Get all blog posts
  getAllBlogs: async (): Promise<BlogPostItem[]> => {
    const response = await axiosInstance.get("/blogs");
    return response.data;
  },

  // Get single blog post by slug or ID
  getBlogById: async (slugOrId: string | number): Promise<BlogPostItem> => {
    const response = await axiosInstance.get(`/blogs/${slugOrId}`);
    return response.data;
  },

  // Create a new blog post
  createBlog: async (data: FormData): Promise<BlogPostItem> => {
    const response = await axiosInstance.post("/blogs", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update an existing blog post
  updateBlog: async (
    id: string | number,
    data: FormData
  ): Promise<BlogPostItem> => {
    const response = await axiosInstance.put(`/blogs/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Toggle blog status (draft <-> published)
  toggleBlogStatus: async (
    id: string | number
  ): Promise<{ message: string; blog: BlogPostItem }> => {
    const response = await axiosInstance.patch(`/blogs/${id}/status`);
    return response.data;
  },

  // Toggle featured status
  toggleBlogFeatured: async (
    id: string | number
  ): Promise<{ message: string; blog: BlogPostItem }> => {
    const response = await axiosInstance.patch(`/blogs/${id}/featured`);
    return response.data;
  },

  // Toggle trending status
  toggleBlogTrending: async (
    id: string | number
  ): Promise<{ message: string; blog: BlogPostItem }> => {
    const response = await axiosInstance.patch(`/blogs/${id}/trending`);
    return response.data;
  },

  // Delete a blog post
  deleteBlog: async (id: string | number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/blogs/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Upload media
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/upload-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

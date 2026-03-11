import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { blogService } from "@/app/sercices/user/blog.service";

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  featuredImage?: string;
  status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  status: "idle",
  error: null,
};

// Helper function to convert BlogPost to FormData
const createFormDataFromPost = (postData: Partial<BlogPost>): FormData => {
  const formData = new FormData();

  Object.entries(postData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
};

// Async thunks
export const fetchBlogPosts = createAsyncThunk("blog/fetchPosts", async () => {
  return await blogService.getAllBlogs();
});

export const fetchBlogPostById = createAsyncThunk(
  "blog/fetchPostById",
  async (id: string) => {
    return await blogService.getBlogById(id);
  },
);

export const addBlogPost = createAsyncThunk(
  "blog/addPost",
  async (postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    const formData = createFormDataFromPost(postData);
    return await blogService.createBlog(formData);
  },
);

export const updateBlogPost = createAsyncThunk(
  "blog/updatePost",
  async (postData: BlogPost) => {
    if (!postData.id) throw new Error("Post ID is required for update");
    const formData = createFormDataFromPost(postData);
    return await blogService.updateBlog(postData.id, formData);
  },
);

export const deleteBlogPost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string) => {
    await blogService.deleteBlog(postId);
    return postId;
  },
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder.addCase(fetchBlogPosts.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchBlogPosts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.posts = action.payload;
    });
    builder.addCase(fetchBlogPosts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch posts";
    });

    // Fetch single post
    builder.addCase(fetchBlogPostById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchBlogPostById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentPost = action.payload;
    });
    builder.addCase(fetchBlogPostById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch post";
    });

    // Add post
    builder.addCase(addBlogPost.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(addBlogPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.posts.unshift(action.payload);
      state.currentPost = action.payload;
    });
    builder.addCase(addBlogPost.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to add post";
    });

    // Update post
    builder.addCase(updateBlogPost.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(updateBlogPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id,
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    });

    // Delete post
    builder.addCase(deleteBlogPost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      if (state.currentPost?.id === action.payload) {
        state.currentPost = null;
      }
    });
    builder.addCase(updateBlogPost.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to update post";
    });

    // Delete post
    builder.addCase(deleteBlogPost.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
  },
});

export const { setCurrentPost, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;

// Selectors
export const selectAllPosts = (state: { blog: BlogState }) => state.blog.posts;
export const selectCurrentPost = (state: { blog: BlogState }) =>
  state.blog.currentPost;
export const selectBlogStatus = (state: { blog: BlogState }) =>
  state.blog.status;
export const selectBlogError = (state: { blog: BlogState }) => state.blog.error;

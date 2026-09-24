import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { blogService, BlogPostItem } from "@/app/sercices/user/blog.service";

export type BlogPost = BlogPostItem;

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  status: "idle",
  actionStatus: "idle",
  deleteStatus: "idle",
  error: null,
};

// Async thunks
export const fetchBlogPosts = createAsyncThunk("blog/fetchPosts", async () => {
  return await blogService.getAllBlogs();
});

export const fetchBlogPostById = createAsyncThunk(
  "blog/fetchPostById",
  async (slugOrId: string | number) => {
    return await blogService.getBlogById(slugOrId);
  }
);

export const addBlogPost = createAsyncThunk(
  "blog/addPost",
  async (payload: FormData | Record<string, any>) => {
    let fd: FormData;
    if (payload instanceof FormData) {
      fd = payload;
    } else {
      fd = new FormData();
      Object.keys(payload).forEach((key) => {
        const val = payload[key];
        if (val !== undefined && val !== null) {
          if (val instanceof File) {
            fd.append(key, val);
          } else {
            fd.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
          }
        }
      });
    }
    return await blogService.createBlog(fd);
  }
);

export const updateBlogPost = createAsyncThunk(
  "blog/updatePost",
  async (payload: { id: string | number; formData?: FormData; [key: string]: any }) => {
    const id = payload.id;
    let fd: FormData;
    if (payload.formData instanceof FormData) {
      fd = payload.formData;
    } else {
      fd = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === "id" || key === "formData") return;
        const val = payload[key];
        if (val !== undefined && val !== null) {
          if (val instanceof File) {
            fd.append(key, val);
          } else {
            fd.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
          }
        }
      });
    }
    return await blogService.updateBlog(id, fd);
  }
);

export const toggleBlogStatus = createAsyncThunk(
  "blog/toggleStatus",
  async (id: string | number) => {
    const res = await blogService.toggleBlogStatus(id);
    return res.blog;
  }
);

export const toggleBlogFeatured = createAsyncThunk(
  "blog/toggleFeatured",
  async (id: string | number) => {
    const res = await blogService.toggleBlogFeatured(id);
    return res.blog;
  }
);

export const toggleBlogTrending = createAsyncThunk(
  "blog/toggleTrending",
  async (id: string | number) => {
    const res = await blogService.toggleBlogTrending(id);
    return res.blog;
  }
);

export const deleteBlogPost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string | number) => {
    await blogService.deleteBlog(postId);
    return postId;
  }
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
      state.actionStatus = "loading";
      state.error = null;
    });
    builder.addCase(addBlogPost.fulfilled, (state, action) => {
      state.actionStatus = "succeeded";
      state.posts.unshift(action.payload);
      state.currentPost = action.payload;
    });
    builder.addCase(addBlogPost.rejected, (state, action) => {
      state.actionStatus = "failed";
      state.error = action.error.message || "Failed to add post";
    });

    // Update post
    builder.addCase(updateBlogPost.pending, (state) => {
      state.actionStatus = "loading";
      state.error = null;
    });
    builder.addCase(updateBlogPost.fulfilled, (state, action) => {
      state.actionStatus = "succeeded";
      const index = state.posts.findIndex(
        (post) => String(post.id) === String(action.payload.id)
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost && String(state.currentPost.id) === String(action.payload.id)) {
        state.currentPost = action.payload;
      }
    });
    builder.addCase(updateBlogPost.rejected, (state, action) => {
      state.actionStatus = "failed";
      state.error = action.error.message || "Failed to update post";
    });

    // Toggle Status
    builder.addCase(toggleBlogStatus.fulfilled, (state, action) => {
      const idx = state.posts.findIndex((p) => String(p.id) === String(action.payload.id));
      if (idx !== -1) {
        state.posts[idx] = action.payload;
      }
    });

    // Toggle Featured
    builder.addCase(toggleBlogFeatured.fulfilled, (state, action) => {
      const idx = state.posts.findIndex((p) => String(p.id) === String(action.payload.id));
      if (idx !== -1) {
        state.posts[idx] = action.payload;
      }
    });

    // Toggle Trending
    builder.addCase(toggleBlogTrending.fulfilled, (state, action) => {
      const idx = state.posts.findIndex((p) => String(p.id) === String(action.payload.id));
      if (idx !== -1) {
        state.posts[idx] = action.payload;
      }
    });

    // Delete post
    builder.addCase(deleteBlogPost.pending, (state) => {
      state.deleteStatus = "loading";
      state.error = null;
    });
    builder.addCase(deleteBlogPost.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
      state.posts = state.posts.filter((post) => String(post.id) !== String(action.payload));
      if (state.currentPost && String(state.currentPost.id) === String(action.payload)) {
        state.currentPost = null;
      }
    });
    builder.addCase(deleteBlogPost.rejected, (state, action) => {
      state.deleteStatus = "failed";
      state.error = action.error.message || "Failed to delete post";
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

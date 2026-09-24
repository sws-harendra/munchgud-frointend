import {
  trendingImageService,
  TrendingImageItem,
  TrendingImageStats,
} from "@/app/sercices/user/trendingImage.service";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface TrendingImageState {
  items: TrendingImageItem[];
  stats: TrendingImageStats;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedItem: TrendingImageItem | null;
}

const initialState: TrendingImageState = {
  items: [],
  stats: { total: 0, active: 0, inactive: 0, avgPrice: 0 },
  status: "idle",
  actionStatus: "idle",
  error: null,
  selectedItem: null,
};

// 1. Fetch active trending items (public storefront)
export const fetchActiveTrendingImages = createAsyncThunk(
  "trendingImages/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      return await trendingImageService.getActiveTrendingImages();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 2. Fetch all trending items (admin dashboard)
export const fetchAllTrendingImagesAdmin = createAsyncThunk(
  "trendingImages/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await trendingImageService.getAllTrendingImagesAdmin();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 3. Create trending item
export const createTrendingImage = createAsyncThunk(
  "trendingImages/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await trendingImageService.createTrendingImage(formData);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 4. Update trending item
export const updateTrendingImage = createAsyncThunk(
  "trendingImages/update",
  async (
    { id, formData }: { id: number; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      return await trendingImageService.updateTrendingImage(id, formData);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 5. Toggle active status
export const toggleTrendingImageStatus = createAsyncThunk(
  "trendingImages/toggleStatus",
  async (id: number, { rejectWithValue }) => {
    try {
      return await trendingImageService.toggleTrendingImageStatus(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 6. Bulk reorder
export const reorderTrendingImages = createAsyncThunk(
  "trendingImages/reorder",
  async (items: { id: number; displayOrder: number }[], { rejectWithValue }) => {
    try {
      return await trendingImageService.reorderTrendingImages(items);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 7. Delete trending item
export const deleteTrendingImage = createAsyncThunk(
  "trendingImages/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await trendingImageService.deleteTrendingImage(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const trendingImageSlice = createSlice({
  name: "trendingImages",
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<TrendingImageItem | null>) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    optimisticReorder: (state, action: PayloadAction<TrendingImageItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Active (Public)
      .addCase(fetchActiveTrendingImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveTrendingImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchActiveTrendingImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch All Admin
      .addCase(fetchAllTrendingImagesAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTrendingImagesAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAllTrendingImagesAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Create
      .addCase(createTrendingImage.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createTrendingImage.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items.push(action.payload);
        state.stats.total += 1;
        if (action.payload.isActive) state.stats.active += 1;
        else state.stats.inactive += 1;
      })
      .addCase(createTrendingImage.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateTrendingImage.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateTrendingImage.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(updateTrendingImage.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })

      // Toggle Status
      .addCase(toggleTrendingImageStatus.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          item.isActive = action.payload.isActive;
          state.stats.active = state.items.filter((i) => i.isActive).length;
          state.stats.inactive = state.items.filter((i) => !i.isActive).length;
        }
      })

      // Reorder
      .addCase(reorderTrendingImages.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      // Delete
      .addCase(deleteTrendingImage.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const item = state.items.find((i) => i.id === deletedId);
        if (item) {
          if (item.isActive) state.stats.active -= 1;
          else state.stats.inactive -= 1;
          state.stats.total -= 1;
        }
        state.items = state.items.filter((i) => i.id !== deletedId);
      });
  },
});

export const { setSelectedItem, clearError, optimisticReorder } =
  trendingImageSlice.actions;
export default trendingImageSlice.reducer;

import {
  heroImageService,
  HeroImageItem,
  HeroImageStats,
} from "@/app/sercices/user/heroImage.service";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface HeroImageState {
  items: HeroImageItem[];
  stats: HeroImageStats;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedImage: HeroImageItem | null;
}

const initialState: HeroImageState = {
  items: [],
  stats: { total: 0, active: 0, inactive: 0 },
  status: "idle",
  actionStatus: "idle",
  error: null,
  selectedImage: null,
};

// 1. Fetch active hero images (public homepage)
export const fetchActiveHeroImages = createAsyncThunk(
  "heroImages/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      return await heroImageService.getActiveHeroImages();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 2. Fetch all hero images (admin dashboard)
export const fetchAllHeroImagesAdmin = createAsyncThunk(
  "heroImages/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await heroImageService.getAllHeroImagesAdmin();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 3. Create hero image
export const createHeroImage = createAsyncThunk(
  "heroImages/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await heroImageService.createHeroImage(formData);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 4. Update hero image
export const updateHeroImage = createAsyncThunk(
  "heroImages/update",
  async (
    { id, formData }: { id: number; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      return await heroImageService.updateHeroImage(id, formData);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 5. Toggle active status
export const toggleHeroImageStatus = createAsyncThunk(
  "heroImages/toggleStatus",
  async (id: number, { rejectWithValue }) => {
    try {
      return await heroImageService.toggleHeroImageStatus(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 6. Bulk reorder
export const reorderHeroImages = createAsyncThunk(
  "heroImages/reorder",
  async (
    items: { id: number; displayOrder: number }[],
    { rejectWithValue }
  ) => {
    try {
      return await heroImageService.reorderHeroImages(items);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 7. Delete hero image
export const deleteHeroImage = createAsyncThunk(
  "heroImages/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await heroImageService.deleteHeroImage(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const heroImageSlice = createSlice({
  name: "heroImages",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<HeroImageItem | null>) => {
      state.selectedImage = action.payload;
    },
    clearHeroImageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Active
      .addCase(fetchActiveHeroImages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActiveHeroImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchActiveHeroImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch All Admin
      .addCase(fetchAllHeroImagesAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllHeroImagesAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAllHeroImagesAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Create
      .addCase(createHeroImage.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createHeroImage.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items.push(action.payload);
        state.stats.total += 1;
        if (action.payload.isActive) {
          state.stats.active += 1;
        } else {
          state.stats.inactive += 1;
        }
      })
      .addCase(createHeroImage.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateHeroImage.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateHeroImage.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Recalculate stats
        state.stats.active = state.items.filter((i) => i.isActive).length;
        state.stats.inactive = state.items.length - state.stats.active;
      })
      .addCase(updateHeroImage.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })

      // Toggle status
      .addCase(toggleHeroImageStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.stats.active = state.items.filter((i) => i.isActive).length;
        state.stats.inactive = state.items.length - state.stats.active;
      })

      // Reorder
      .addCase(reorderHeroImages.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      // Delete
      .addCase(deleteHeroImage.fulfilled, (state, action) => {
        const deletedItem = state.items.find(
          (item) => item.id === action.payload
        );
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.stats.total = Math.max(0, state.stats.total - 1);
        if (deletedItem?.isActive) {
          state.stats.active = Math.max(0, state.stats.active - 1);
        } else {
          state.stats.inactive = Math.max(0, state.stats.inactive - 1);
        }
      });
  },
});

export const { setSelectedImage, clearHeroImageError } =
  heroImageSlice.actions;
export default heroImageSlice.reducer;

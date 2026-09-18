import { bannerService } from "@/app/sercices/user/banner.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Banner {
  createdAt: any;
  id: number;
  categoryId: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  ctaText: string;
  Category?: {
    id: number;
    name: string;
    description: string;
  };
}

interface BannerState {
  banners: Banner[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  status: "idle",
  error: null,
};

// ✅ Fetch Banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await bannerService.getAllBanners();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// bannerSlice.ts
export const createBanner = createAsyncThunk(
  "banners/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await bannerService.createBanner(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banners/update",
  async (
    { id, data }: { id: number; data: Partial<Banner> },
    { rejectWithValue }
  ) => {
    try {
      return await bannerService.updateBanner(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await bannerService.deleteBanner(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      // update
      .addCase(updateBanner.fulfilled, (state, action) => {
        const idx = state.banners.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.banners[idx] = action.payload;
      })
      // delete
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b.id !== action.meta.arg);
      });
  },
});

export default bannerSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { variantService } from "@/app/services/admin/variant.service";

export interface VariantCategory {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface VariantOption {
  id: number;
  name: string;
  categoryId: number;
  additionalPrice: number;
  category: VariantCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  optionId?: number;
  sku?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image?: string;
  images?: string[];
  options?: any[];
  option?: VariantOption;
  createdAt?: string;
  updatedAt?: string;
}

interface VariantState {
  categories: VariantCategory[];
  options: VariantOption[];
  productVariants: Record<number, ProductVariant[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VariantState = {
  categories: [],
  options: [],
  productVariants: {},
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchVariantCategories = createAsyncThunk(
  "variants/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await variantService.getAllVariantCategories();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addVariantCategory = createAsyncThunk(
  "variants/addCategory",
  async (data: { name: string; description: string }, { rejectWithValue }) => {
    try {
      return await variantService.createVariantCategory(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchVariantOptions = createAsyncThunk(
  "variants/fetchOptions",
  async (_, { rejectWithValue }) => {
    try {
      return await variantService.getAllVariantOptions();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addVariantOption = createAsyncThunk(
  "variants/addOption",
  async (
    data: { name: string; categoryId: number; additionalPrice?: number },
    { rejectWithValue }
  ) => {
    try {
      return await variantService.createVariantOption(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProductVariants = createAsyncThunk(
  "variants/fetchProductVariants",
  async (productId: number, { rejectWithValue }) => {
    try {
      return {
        productId,
        data: await variantService.getProductVariants(productId),
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createProductVariant = createAsyncThunk(
  "variants/createProductVariant",
  async (
    { productId, data }: { productId: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      return {
        productId,
        data: await variantService.createProductVariant(productId, data),
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteProductVariant = createAsyncThunk(
  "variants/deleteProductVariant",
  async (variantId: number, { rejectWithValue }) => {
    try {
      await variantService.deleteProductVariant(variantId);
      return variantId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const deleteVariantCategory = createAsyncThunk(
  "variants/deleteCategory",
  async (id: number, { rejectWithValue }) => {
    try {
      await variantService.deleteVariantCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteVariantOption = createAsyncThunk(
  "variants/deleteOption",
  async (id: number, { rejectWithValue }) => {
    try {
      await variantService.deleteVariantOption(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const variantSlice = createSlice({
  name: "variants",
  initialState,
  reducers: {
    clearVariantState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder.addCase(fetchVariantCategories.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchVariantCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.categories = action.payload.data;
    });
    builder.addCase(fetchVariantCategories.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // Add Category
    builder.addCase(addVariantCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload.data);
    });

    // Fetch Options
    builder.addCase(fetchVariantOptions.fulfilled, (state, action) => {
      state.options = action.payload.data;
    });

    // Add Option
    builder.addCase(addVariantOption.fulfilled, (state, action) => {
      state.options.push(action.payload.data);
    });

    // Fetch Product Variants
    builder.addCase(fetchProductVariants.fulfilled, (state, action) => {
      const { productId, data } = action.payload;
      const list = Array.isArray(data) ? data : (data?.data || []);
      state.productVariants[productId] = list;
    });

    // Create Product Variant
    builder.addCase(createProductVariant.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { productId, data } = action.payload;
      const newVar = data?.data || data;
      if (newVar && newVar.id) {
        if (!Array.isArray(state.productVariants[productId])) {
          state.productVariants[productId] = [];
        }
        const exists = state.productVariants[productId].some(
          (v: any) => v.id === newVar.id
        );
        if (!exists) {
          state.productVariants[productId].push(newVar);
        }
      }
    });

    // Delete Product Variant
    builder.addCase(deleteProductVariant.fulfilled, (state, action) => {
      const variantId = action.payload;
      Object.keys(state.productVariants).forEach((productId) => {
        const list = state.productVariants[parseInt(productId)];
        if (Array.isArray(list)) {
          state.productVariants[parseInt(productId)] = list.filter(
            (variant) => variant.id !== variantId
          );
        }
      });
    });
    builder.addCase(deleteVariantCategory.fulfilled, (state, action) => {
      const id = action.payload;
      state.categories = state.categories.filter((c) => c.id !== id);
    });

    // Delete Option
    builder.addCase(deleteVariantOption.fulfilled, (state, action) => {
      const id = action.payload;
      state.options = state.options.filter((o) => o.id !== id);
    });
  },
});

export const { clearVariantState } = variantSlice.actions;

export default variantSlice.reducer;

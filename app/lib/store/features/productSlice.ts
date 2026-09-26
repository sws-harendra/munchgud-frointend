// src/app/store/product.slice.ts
import { productService } from "@/app/sercices/user/product.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, Category, ProductState } from "@/app/types/product.types";
// Thunks
// productSlice.ts
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    params:
      | {
          page?: number;
          limit?: number;
          search?: string;
          categoryId?: number;
          minPrice?: number;
          maxPrice?: number;
          trending?: boolean;
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      return await productService.getAllProducts(params);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Fetching products failed");
    }
  }
);

export const fetchProductsforadmin = createAsyncThunk(
  "products/fetchAllforadmin",
  async (
    params:
      | {
          page?: number;
          limit?: number;
          search?: string;
          categoryId?: number;
          minPrice?: number;
          maxPrice?: number;
          trending?: boolean;
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      return await productService.getAllProductsforAdmin(params);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Fetching products failed");
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await productService.getProductById(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email register failed");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await productService.createProduct(formData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email register failed");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: { id: string; data: unknown }, { rejectWithValue }) => {
    try {
      return await productService.updateProduct(id, data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Email register failed");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      return await productService.deleteProduct(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to delete product");
    }
  }
);

export const getTrendingProduct = createAsyncThunk(
  "products/trending-products",
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getTrendingProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to get trending products");
    }
  }
);

const normalizeProduct = (product: any): any => {
  if (!product) return product;
  
  let images = product.images;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      images = Array.isArray(parsed) ? parsed : [images];
    } catch {
      if (images.trim()) {
        images = images.split(",").map((img: string) => img.trim());
      } else {
        images = [];
      }
    }
  } else if (!images) {
    images = [];
  }
  
  let tags = product.tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      tags = Array.isArray(parsed) ? parsed : [tags];
    } catch {
      if (tags.trim()) {
        tags = tags.split(",").map((tag: string) => tag.trim());
      } else {
        tags = [];
      }
    }
  } else if (!tags) {
    tags = [];
  }

  return {
    ...product,
    images,
    tags,
  };
};

const normalizePayload = (payload: any): any => {
  if (!payload) return payload;
  if (Array.isArray(payload)) {
    return payload.map(normalizeProduct);
  }
  if (payload.products && Array.isArray(payload.products)) {
    return {
      ...payload,
      products: payload.products.map(normalizeProduct),
    };
  }
  if (payload.product) {
    return {
      ...payload,
      product: normalizeProduct(payload.product),
    };
  }
  if (payload.id) {
    return normalizeProduct(payload);
  }
  return payload;
};

// Initial State
const initialState: ProductState = {
  products: [],
  product: null,
  trendingProducts: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log(action.payload);

        state.status = "succeeded";
        state.products = normalizePayload(action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProductsforadmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsforadmin.fulfilled, (state, action) => {
        console.log(action.payload);

        state.status = "succeeded";
        state.products = normalizePayload(action.payload);
      })
      .addCase(fetchProductsforadmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(getTrendingProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTrendingProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trendingProducts = normalizePayload(action.payload.products);
      })
      .addCase(getTrendingProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch one
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = normalizePayload(action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newProduct = normalizeProduct(action.payload.product);

        if (Array.isArray(state.products)) {
          // case: state.products is just an array
          state.products.push(newProduct);
        } else if (state.products && Array.isArray(state.products.products)) {
          // case: state.products is object { products: [], total: X }
          state.products.products = [newProduct, ...state.products.products];
        } else {
          // first product ever
          state.products = { products: [newProduct], total: 1 };
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update
      // ✅ Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = normalizeProduct(action.payload);

        if (Array.isArray(state.products)) {
          // case: products is just an array
          state.products = state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          );
        } else if (state.products && Array.isArray(state.products.products)) {
          // case: products is object { products: [], total: X }
          state.products.products = state.products.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          );
        }
      })

      // ✅ Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (state.products && Array.isArray(state.products.products)) {
          state.products.products = state.products.products.filter(
            (p) => String(p.id) !== String(action.meta.arg)
          );
          state.products.totalItems = Math.max(0, (state.products.totalItems || 1) - 1);
        }
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;

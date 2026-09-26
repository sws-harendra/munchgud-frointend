import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { orderService } from "@/app/sercices/user/order.service";
import { OrderFilters } from "@/app/admin/dashboard/orders/page";

interface OrderItem {
  productId: number;
  quantity: number;
  price?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  userId: number;
  addressId: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt?: string;
}

interface OrderState {
  orders: any;
  currentOrder: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalCount: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  status: "idle",
  error: null,
  totalCount: 0,
};

// Thunks
export const placeOrder = createAsyncThunk(
  "orders/place",
  async (
    orderData: {
      userId: string;
      addressId: string;
      items: {
        productId: number;
        quantity: number;
        variantId: number;
        variantName: string;
      }[];
      paymentMethod: string;
      paymentProvider?: string;
      transactionId?: string; 
    },
    { rejectWithValue }
  ) => {
    try {
      return await orderService.placeOrder(orderData);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getOrdersByUser();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchRidersOrders = createAsyncThunk(
  "orders/fetchRiderser",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getOrderForRider();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
); // In your orderSlice.ts
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters: OrderFilters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      // Use the orderService with query parameters
      const data = await orderService.getAllOrders(`?${queryParams}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch orders");
    }
  }
);
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (
    { orderId, orderData }: { orderId: string; orderData: any },
    { rejectWithValue }
  ) => {
    try {
      const data = await orderService.updateOrder(orderId, orderData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      await orderService.deleteOrder(orderId);
      return orderId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch single order
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload.order;
        // Also update the order in the orders list if it exists there
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.order.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.orders = state.orders.filter(
          (order: any) => order.id.toString() !== action.payload.toString()
        );
        state.totalCount = Math.max(0, state.totalCount - 1);
      })

      .addCase(fetchRidersOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRidersOrders.fulfilled, (state, action: PayloadAction) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
      })
      .addCase(fetchRidersOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export const selectOrders = (state: RootState) => state.order;
export default orderSlice.reducer;

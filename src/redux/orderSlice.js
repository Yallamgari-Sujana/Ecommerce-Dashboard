import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders, deleteOrder } from './orderApi';
import { fetchProducts } from './productApi';

// Fetch orders
export const fetchOrdersAsync = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await fetchOrders();
  return response;
});

// Fetch all products
export const fetchProductsAsync = createAsyncThunk("orders/fetchProducts", async () => {
  const response = await fetchProducts();
  return response;
});

// Delete order
export const deleteOrderAsync = createAsyncThunk("orders/deleteOrder", async (orderId) => {
  await deleteOrder(orderId);
  return orderId;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    products: [],
    status: "idle",
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.id !== action.payload);
      });
  },
});

export default orderSlice.reducer;

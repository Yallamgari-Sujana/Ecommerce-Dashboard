import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from "./customerApi";

// Fetch customers
export const fetchCustomersAsync = createAsyncThunk("customers/fetchCustomers", async () => {
  return await fetchCustomers();
});

// Add a customer
export const addCustomerAsync = createAsyncThunk("customers/addCustomer", async (customer) => {
  return await addCustomer(customer);
});

// Update a customer
export const updateCustomerAsync = createAsyncThunk("customers/updateCustomer", async (customer) => {
  return await updateCustomer(customer);
});

// Delete a customer
export const deleteCustomerAsync = createAsyncThunk("customers/deleteCustomer", async (customerId) => {
  return await deleteCustomer(customerId);
});

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomersAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addCustomerAsync.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
        const index = state.customers.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.customers[index] = action.payload;
      })
      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {
        state.customers = state.customers.filter((c) => c.id !== action.payload);
      });
  },
});

export default customerSlice.reducer;

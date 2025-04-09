import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "./productApi";

// Async thunk to fetch products
export const fetchProductsAsync = createAsyncThunk("products/fetchProducts", async () => {
  const products = await fetchProducts();
  return products;
});

// Async thunk to add a product
export const addProductAsync = createAsyncThunk("products/addProduct", async (product) => {
  const newProduct = await addProduct(product);
  return newProduct;
});

// Async thunk to update a product
export const updateProductAsync = createAsyncThunk("products/updateProduct", async (product) => {
  const updatedProduct = await updateProduct(product);
  return updatedProduct;
});

// Async thunk to delete a product
export const deleteProductAsync = createAsyncThunk("products/deleteProduct", async (productId) => {
  await deleteProduct(productId);
  return productId;
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;

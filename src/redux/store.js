import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import ordersReducer from "./orderSlice";
import customerReducer from "./customerSlice"

export const store = configureStore({
  reducer: {
    products: productReducer,
    orders: ordersReducer,
    customers: customerReducer
  },
});

export default store;

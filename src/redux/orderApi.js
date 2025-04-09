import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

// Fetch all orders
export const fetchOrders = async () => {
    const response = await axios.get(`${BASE_URL}/carts`);
    return response.data;
};

// Delete a order
export const deleteOrder = async (orderId) => {
  await axios.delete(`${BASE_URL}/carts/${orderId}`);
  return orderId;
};

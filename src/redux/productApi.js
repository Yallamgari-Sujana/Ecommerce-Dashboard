import axios from "axios";

const API_BASE_URL = "https://fakestoreapi.com/products";

// Fetch all products
export const fetchProducts = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Fetch a single product by ID
export const fetchProductById = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/${productId}`);
  return response.data;
};

// Add a new product
export const addProduct = async (product) => {
  const response = await axios.post(API_BASE_URL, product);
  return response.data;
};

// Update a product
export const updateProduct = async (product) => {
  const response = await axios.put(`${API_BASE_URL}/${product.id}`, product);
  return response.data;
};

// Delete a product
export const deleteProduct = async (productId) => {
  await axios.delete(`${API_BASE_URL}/${productId}`);
  return productId;
};

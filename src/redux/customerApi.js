import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

// Fetch all customers
export const fetchCustomers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Add a new customer
export const addCustomer = async (customer) => {
  const response = await axios.post(BASE_URL, customer);
  return response.data;
};

// Update customer details
export const updateCustomer = async (customer) => {
  const response = await axios.put(`${BASE_URL}/${customer.id}`, customer);
  return response.data;
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
  await axios.delete(`${BASE_URL}/${customerId}`);
  return customerId;
};

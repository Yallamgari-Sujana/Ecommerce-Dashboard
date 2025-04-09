import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCustomersAsync,
  deleteCustomerAsync,
} from "../redux/customerSlice";
import Loader from "../components/Loader";

const CUSTOMERS_PER_PAGE = 15;

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, status } = useSelector((state) => state.customers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCustomersAsync());
  }, [dispatch]);

  if (status === "loading") {
    return <Loader />;
  }

  // Handle deleting a customer
  const handleDeleteCustomer = (customerId) => {
    dispatch(deleteCustomerAsync(customerId));
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCustomer = currentPage * CUSTOMERS_PER_PAGE;
  const indexOfFirstCustomer = indexOfLastCustomer - CUSTOMERS_PER_PAGE;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE);

  return (
    <div className="h-screen overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white px-4 py-3 z-10 shadow-md flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-64 mt-2 md:mt-0"
        />
      </div>

      {/* Scrollable Table Container with Margin */}
      <div className="relative overflow-auto max-h-[75vh] border border-gray-300 rounded-lg mt-6 mx-auto w-full md:w-[90%]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id} className="border">
                  <td className="border p-2">{customer.id}</td>
                  <td className="border p-2">{customer.name}</td>
                  <td className="border p-2">{customer.email}</td>
                  <td className="border p-2">{customer.phone}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages >1 &&
        <div className="flex justify-center my-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 border rounded text-lg ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      }
    </div>
  );
};

export default Customers;

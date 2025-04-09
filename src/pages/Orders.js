import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchOrdersAsync, fetchProductsAsync, deleteOrderAsync } from "../redux/orderSlice";
import Loader from "../components/Loader";
import { debounce } from "lodash";

const ORDERS_PER_PAGE = 6;

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, products, status } = useSelector((state) => state.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUserId, setFilterUserId] = useState("");

  useEffect(() => {
    dispatch(fetchOrdersAsync());
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  if (status === "loading") {
    return <Loader />;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getProductDetails = (productId) => {
    return products.find((p) => p.id === productId) || {};
  };

  const handleDeleteOrder = (orderId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
    if (isConfirmed) {
      dispatch(deleteOrderAsync(orderId));
    }
  };

  const handleFilterChange = debounce((value) => {
    setFilterUserId(value);
    setCurrentPage(1);
  }, 500);

  const filteredOrders = filterUserId
    ? orders.filter((order) => order.userId.toString().includes(filterUserId))
    : orders;

  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Fixed Header */}
      <div className="sticky top-0 bg-white px-4 py-3 z-10 shadow-md flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <input
          type="text"
          placeholder="Filter by User ID"
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-64 mt-2 md:mt-0 shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>

      {/* ✅ Scrollable Content */}
      <div className="flex-grow overflow-y-auto px-6 pb-20">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-10">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg p-5 rounded-xl border relative transition-transform hover:scale-105 duration-300 flex flex-col justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">Order ID: {order.id}</p>
                  <p className="text-gray-600">User ID: {order.userId}</p>
                  <p className="font-semibold text-gray-800 mt-3">Products:</p>
                  <ul className="list-none pl-0 text-gray-700 space-y-1">
                    {order.products.map(({ productId, quantity }) => {
                      const product = getProductDetails(productId);
                      return (
                        <li key={productId} className="flex justify-between items-center">
                          <span className="font-medium">{product.title || "Unknown Product"}</span>
                          <span>₹{product.price || 0} (Qty: {quantity})</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="font-bold text-green-600 mt-4 text-lg">
                    Total Price: ₹
                    {order.products.reduce((total, { productId, quantity }) => {
                      const product = getProductDetails(productId);
                      return total + (product.price || 0) * quantity;
                    }, 0)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
                >
                  Delete Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Fixed Bottom Pagination */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-white shadow-md py-4">
          <div className="flex justify-center items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-full flex items-center gap-1 text-lg transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FaChevronLeft />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition text-lg ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded-full flex items-center gap-1 text-lg transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

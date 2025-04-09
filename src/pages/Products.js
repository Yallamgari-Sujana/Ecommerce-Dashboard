import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddProductModal from "../components/AddProductModal";
import { FaTrash, FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { deleteProductAsync, updateProductAsync, addProductAsync, fetchProductsAsync } from "../redux/productSlice";
import Loader from '../components/Loader';

const PRODUCTS_PER_PAGE = 8;
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const Products = () => {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddProduct = (newProduct) => {
    dispatch(addProductAsync({ ...newProduct, id: Date.now() }));
  };

  const handleUpdateProduct = (updatedProduct) => {
    dispatch(updateProductAsync(updatedProduct));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Filtering the products
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Sorting the filtered products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });
  }, [filteredProducts, sortBy]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(fetchProductsAsync());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white px-4 py-3 z-10 shadow-md flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            + Add Product
          </button>
          <AddProductModal 
            isOpen={isModalOpen} 
            onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
            onAdd={handleAddProduct} 
            editingProduct={editingProduct}
            onUpdate={handleUpdateProduct}
          />
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-[150px] md:w-[200px]"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="title">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="grid gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 items-stretch grid-auto-rows-[1fr]">
        {currentProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3 min-h-[300px] flex-grow 
                       transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <img 
              src={product.image || PLACEHOLDER_IMAGE} 
              alt={product.title} 
              className="w-20 h-20 object-cover rounded-md mx-auto"
            />
            <h3 className="text-lg font-semibold break-words">{product.title}</h3>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-green-600 font-semibold">₹{product.price}</p>
            <div className="flex justify-between items-center mt-auto">
              <button 
                className="text-blue-500 hover:text-blue-700 transition duration-200"
                onClick={() => handleEditProduct(product)}
              >
                <FaEdit size={20} />
              </button>
              <button 
                className="text-red-500 hover:text-red-700 transition duration-200" 
                onClick={() => dispatch(deleteProductAsync(product.id))}
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination moved to the bottom */}
      <div className="flex justify-center items-center gap-2 mt-6 py-4">
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
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, index) => (
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
  );
};

export default Products;

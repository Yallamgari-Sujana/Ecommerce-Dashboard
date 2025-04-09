import React, { useEffect, useState } from "react";

const AddProductModal = ({ isOpen, onClose, onAdd, editingProduct,  onUpdate}) => {
  const [product, setProduct] = useState({ title: "", price: "", stock: "", image: "", category: "Electronics" });
  const [showEdit, setShowEdit ] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setShowEdit(true);
      setProduct({
        id: editingProduct.id || "",
        title: editingProduct.title || "",
        price: editingProduct.price || "",
        description: editingProduct.description || "",
        image: editingProduct.image || "",
        category: editingProduct.category || "Electronics",
        rating: editingProduct.rating || {}
      });
    } else {
      setShowEdit(false);
      setProduct({ id: "",title: "", price: "", description: "", image: "", category: "Electronics", rating: "" }); // Reset form for new product
    }
  }, [editingProduct]);


  if (!isOpen) return null;


  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: ["price", "stock"].includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = () => {
    if (!product.title || !product.price) return;

    if(showEdit) {
      onUpdate(product);
    } else {
    onAdd(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{showEdit ? 'Edit Product' : 'Add Product'}</h2>
        <label className="block mb-2">Product Name:</label>
        <input
          type="text"
          name="title"
          placeholder="Product Name"
          value={product.title}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <label className="block mb-2">Product Price:</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        <label className="block mb-2">Category:</label>
        <select
          name="category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Sports">Sports</option>
        </select>

        <label className="block mt-5 mb-2">Product Image:</label>
        <input
          type="text"
          name="image"
          placeholder="Enter image URL"
          value={product.image}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />


        <div className="flex justify-center space-x-2 mt-5">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            {showEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;

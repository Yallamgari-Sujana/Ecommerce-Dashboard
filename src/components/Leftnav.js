import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            Products
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            Orders
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            Customers
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

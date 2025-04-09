import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leftnav from "./components/Leftnav";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Leftnav />
        <div className="flex-1">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

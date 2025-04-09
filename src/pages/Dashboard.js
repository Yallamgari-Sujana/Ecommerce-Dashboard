import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersAsync } from "../redux/orderSlice";
import { fetchProductsAsync } from "../redux/productSlice";
import { fetchCustomersAsync } from "../redux/customerSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { FaShoppingCart, FaBox, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import Loader from "../components/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders, status: orderStatus } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const { customers } = useSelector((state) => state.customers);
  const [salesData, setSalesData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    dispatch(fetchOrdersAsync());
    dispatch(fetchProductsAsync());
    dispatch(fetchCustomersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0 && products.length > 0) {
      let revenue = 0;
      const salesDataMap = {};
      const bestSellerMap = {};
      const monthlySalesMap = {};

      orders.forEach((order) => {
        const orderMonth = new Date(order.date).toLocaleString("default", { month: "short" });

        order.products.forEach(({ productId, quantity }) => {
          const product = products.find((p) => p.id === productId);
          if (!product) return;

          revenue += product.price * quantity;

          salesDataMap[product.title] = (salesDataMap[product.title] || 0) + quantity;
          bestSellerMap[product.title] = (bestSellerMap[product.title] || 0) + quantity;
          monthlySalesMap[orderMonth] = (monthlySalesMap[orderMonth] || 0) + product.price * quantity;
        });
      });

      setTotalRevenue(revenue);

      setSalesData(
        Object.keys(salesDataMap).map((key) => ({
          name: key,
          sales: salesDataMap[key],
        }))
      );

      setBestSellers(
        Object.keys(bestSellerMap)
          .map((key) => ({ name: key, sales: bestSellerMap[key] }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5)
      );

      setMonthlySales(
        Object.keys(monthlySalesMap).map((key) => ({
          month: key,
          revenue: monthlySalesMap[key],
        }))
      );
    }
  }, [orders, products]);

  const formattedRevenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(totalRevenue);
  

  if (orderStatus === "loading") {
    return <Loader />;
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 z-10 shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8 mx-4">
        <StatCard icon={<FaShoppingCart />} title="Total Orders" value={orders.length} color="bg-blue-500" />
        <StatCard icon={<FaBox />} title="Total Products" value={products.length} color="bg-green-500" />
        <StatCard icon={<FaUsers />} title="Total Customers" value={customers.length} color="bg-yellow-500" />
        <StatCard icon={<FaMoneyBillWave />} title="Total Revenue" value={formattedRevenue} color="bg-red-500" />
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
        <ChartCard title="Product Sales Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Sales Trend */}
        <ChartCard title="Monthly Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Best-Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TableCard title="Best Selling Products" headers={["Product", "Units Sold"]} data={bestSellers} />
        <TableCard
          title="Recent Orders"
          headers={["Order ID", "User ID", "Items"]}
          data={orders.slice(-5).map((order) => ({
            id: order.id,
            userId: order.userId,
            items: order.products.map((p) => `Product ${p.productId} (x${p.quantity})`).join(", ")
          }))}
        />
      </div>
    </div>
  );
};

export default Dashboard;

// 📌 Stats Card Component
const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} text-white p-6 rounded-lg flex items-center shadow-md`}>
    <div className="text-4xl">{icon}</div>
    <div className="ml-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// 📌 Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

// 📌 Table Card Component
const TableCard = ({ title, headers, data }) => (
  <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="border p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border">
              {Object.values(item).map((value, i) => (
                <td key={i} className="border p-2">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

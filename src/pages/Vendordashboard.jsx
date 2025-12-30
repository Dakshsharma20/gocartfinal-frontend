import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaUserCircle, FaCheckCircle, FaBoxOpen, FaListAlt, FaChartBar } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const SIDEBAR_OPTIONS = [
  { label: "Dashboard", key: "dashboard", icon: <MdDashboard className="text-lg" /> },
  { label: "Products", key: "products", icon: <FaBoxOpen className="text-lg" /> },
  { label: "Orders", key: "orders", icon: <FaListAlt className="text-lg" /> },
  { label: "Add Product", key: "add", icon: <FaPlusCircle className="text-lg" /> }
];

const VendorDashboard = () => {
  const vendorId = JSON.parse(localStorage.getItem("vendor_id"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vendorData, setVendorData] = useState(null);
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all"); // all, pending, completed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    vendorId,
    name: "",
    price: "",
    category: "",
    stock: "",
    discount: "",
    image: "",
  });

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch Vendor Info, Products, Orders
  useEffect(() => {
    if (vendorId) {
      axios.get(`https://gocart-backend-bfil.onrender.com/vendors/${vendorId}`)
        .then((res) => setVendorData(res.data.data))
        .catch((err) => console.error("Vendor fetch failed:", err));

      axios.get(`https://gocart-backend-bfil.onrender.com/products/${vendorId}`)
        .then((res) => setProductList(res.data.data))
        .catch((err) => console.error("Product fetch failed:", err));

      axios.get("https://gocart-backend-bfil.onrender.com/orders")
        .then((res) => {
          const allOrders = res.data.data;
          const vendorOrders = allOrders.filter(order => order.products.some(p => p.productId.vendorId === vendorId));
          setOrderList(vendorOrders);

          // Pending and Earnings Calculation
          const pendingOrders = vendorOrders.filter(order => order.status === "pending");
          const completedOrders = vendorOrders.filter(order => order.status === "completed");
          setPendingCount(pendingOrders.reduce((acc, order) => acc + order.products.length, 0));
          setTotalEarnings(completedOrders.reduce((acc, order) =>
            acc + order.products.reduce((total, p) => total + (p.quantity * p.productId.price), 0), 0));
        })
        .catch((err) => console.error("Order fetch failed:", err));
    }
  }, [vendorId]);

  // Order filtering for sidebar "Orders" section
  const filteredOrders = orderFilter === "all"
    ? orderList
    : orderList.filter(order => order.status === orderFilter);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleInputChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleSubmitProduct = () => {
    axios.post("https://gocart-backend-bfil.onrender.com/products", productDetails)
      .then((res) => {
        alert("Product added!");
        setProductList([...productList, res.data]);
        toggleModal();
        setProductDetails({
          vendorId,
          name: "",
          price: "",
          category: "",
          stock: "",
          discount: "",
          image: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add product.");
      });
  };

  const handleDeleteProduct = (productId) => {
    axios.delete(`https://gocart-backend-bfil.onrender.com/products/${productId}`)
      .then(() => {
        setProductList(productList.filter((p) => p._id !== productId));
        alert("Product deleted!");
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    axios.put(`https://gocart-backend-bfil.onrender.com/orders/${orderId}`, { status: newStatus })
      .then(() => {
        alert(`Order marked as ${newStatus}`);
        setOrderList(orderList.filter(o => o._id !== orderId));
      })
      .catch((err) => {
        console.error("Status update failed:", err);
        alert("Failed to update order status.");
      });
  };

  // Professional Dashboard layout
  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 via-white to-blue-50 flex">
      {/* Sidebar */}
      <aside className="bg-white/80 shadow-xl border-r border-green-100 min-h-screen w-[220px] py-6 px-3 flex flex-col justify-between sticky top-0">
        <div>
          <Link to="/" className="flex items-center mb-8 pl-2">
            <img src="/image.png" alt="GoCart Logo" className="w-10 h-10 rounded-lg shadow" />
            <span className="ml-3 text-xl font-bold text-green-700 tracking-wide">GoCart Vendor</span>
          </Link>
          <nav className="flex flex-col gap-2">
            {SIDEBAR_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveTab(opt.key)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all
                  ${activeTab === opt.key ? "bg-green-100 text-green-700 shadow" : "text-gray-700 hover:bg-green-50"}
                `}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 mt-12 pl-2 text-sm text-gray-400">
          <FaUserCircle className="text-xl" />
          {vendorData?.name || "Vendor"}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 bg-transparent">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <>
            {/* Vendor/Shop Information */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 mb-7 border border-green-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold mb-2 text-green-700">Shop Information</h2>
                <div className="flex flex-col gap-1 text-gray-700 text-sm">
                  <div><b>Shop Name:</b> {vendorData?.shopName || 'N/A'}</div>
                  <div><b>Address:</b> {vendorData?.address || 'N/A'}</div>
                  <div><b>Owner Name:</b> {vendorData?.name || 'N/A'}</div>
                  <div><b>Contact:</b> {vendorData?.mobile_number || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center mt-6 md:mt-0">
                <div className="bg-green-100 px-5 py-3 rounded-lg flex items-center gap-3 shadow-sm">
                  <FaCheckCircle className={`text-2xl ${vendorData?.paymentStatus === "Pending" ? "text-red-500" : "text-green-500"}`} />
                  <span className={`font-bold ${vendorData?.paymentStatus === "Pending" ? "text-red-500" : "text-green-600"}`}>
                    {vendorData?.paymentStatus || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">
              <div className="bg-gradient-to-tr from-red-100 via-white to-white border-l-4 border-red-400 rounded-lg p-5 shadow group">
                <div className="flex items-center gap-3 text-red-500 mb-2 font-semibold"><FaListAlt /> Pending Orders</div>
                <div className="text-3xl font-extrabold text-red-500">{pendingCount}</div>
              </div>
              <div className="bg-gradient-to-tr from-green-100 via-white to-white border-l-4 border-green-400 rounded-lg p-5 shadow group">
                <div className="flex items-center gap-3 text-green-600 mb-2 font-semibold"><FaCheckCircle /> Total Completed</div>
                <div className="text-3xl font-extrabold text-green-600">{orderList.filter(o => o.status === "completed").length}</div>
              </div>
              <div className="bg-gradient-to-tr from-blue-100 via-white to-white border-l-4 border-blue-400 rounded-lg p-5 shadow group">
                <div className="flex items-center gap-3 text-blue-500 mb-2 font-semibold"><FaChartBar /> Earnings</div>
                <div className="text-3xl font-extrabold text-blue-600">₹{totalEarnings}</div>
              </div>
              <div className="bg-gradient-to-tr from-green-50 via-white to-white rounded-lg p-5 shadow group">
                <div className="flex items-center gap-3 text-gray-500 mb-2 font-semibold"><FaBoxOpen /> Total Products</div>
                <div className="text-3xl font-extrabold text-green-700">{productList.length}</div>
              </div>
            </div>
          </>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl font-bold text-green-700">Product Listing</h3>
              <button
                onClick={toggleModal}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold text-base flex items-center gap-2 shadow"
              >
                <FaPlusCircle /> Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productList.length > 0 ? (
                productList.map((product) => (
                  <div key={product._id} className="bg-white/90 p-4 rounded-xl shadow-md border border-green-50 flex flex-col">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
                      <div className="text-green-700 font-semibold mt-1 text-sm">₹{product.price}</div>
                      <div className="text-gray-500 text-xs">Category: {product.category}</div>
                      <div className="text-gray-500 text-xs">Stock: {product.stock}</div>
                      <div className="text-gray-500 text-xs">Discount: {product.discount}%</div>
                    </div>
                    <div className="flex justify-end mt-3 space-x-2">
                      <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 text-lg"><FaTrashAlt /></button>
                      <button className="text-yellow-500 hover:text-yellow-700 text-lg" disabled title="Coming Soon"><FaEdit /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No products available.</p>
              )}
            </div>
          </>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-green-50">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl font-bold text-green-700">Order Management</h3>
              <div className="flex gap-2">
                {["all", "pending", "completed"].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold border transition-all
                      ${orderFilter === status
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"}
                    `}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {filteredOrders.length ? (
              <table className="w-full table-auto text-left border">
                <thead>
                  <tr className="bg-green-50">
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Product Name</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) =>
                    order.products.map((prod, idx) => (
                      <tr key={`${order._id}-${idx}`}>
                        <td className="p-2 border">{i + 1}.{idx + 1}</td>
                        <td className="p-2 border">{prod.productId.name}</td>
                        <td className="p-2 border">{prod.quantity}</td>
                        <td className="p-2 border">₹{prod.productId?.price * prod.quantity}</td>
                        <td className="p-2 border capitalize">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-500"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-2 border">
                          {order.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateOrderStatus(order._id, "completed")}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order._id, "cancelled")}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No orders found for this status.</p>
            )}
          </div>
        )}

        {/* Add Product (modal OR page) */}
        {activeTab === "add" && (
          <div className="bg-white/95 rounded-xl shadow-xl p-8 border border-green-50 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
              <FaPlusCircle /> Add New Product
            </h2>
            <form
              onSubmit={e => { e.preventDefault(); handleSubmitProduct(); }}
              className="flex flex-col gap-4"
            >
              {["name", "price", "category", "stock", "discount", "image"].map((field) => (
                <input
                  key={field}
                  type={["price", "stock", "discount"].includes(field) ? "number" : "text"}
                  name={field}
                  value={productDetails[field]}
                  onChange={handleInputChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-3 border rounded focus:border-green-400 outline-none bg-green-50"
                  required={["name", "price"].includes(field)}
                />
              ))}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setActiveTab("products")} className="bg-gray-300 text-gray-700 px-5 py-2 rounded font-semibold">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add Product</button>
              </div>
            </form>
          </div>
        )}

        {/* Add Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg w-96 shadow-xl border border-green-100">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Add New Product</h2>
              <form onSubmit={e => { e.preventDefault(); handleSubmitProduct(); }}>
                {["name", "price", "category", "stock", "discount", "image"].map((field) => (
                  <input
                    key={field}
                    type={["price", "stock", "discount"].includes(field) ? "number" : "text"}
                    name={field}
                    value={productDetails[field]}
                    onChange={handleInputChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full p-2 border rounded mb-3"
                    required={["name", "price"].includes(field)}
                  />
                ))}
                <div className="flex justify-between mt-3">
                  <button type="button" onClick={toggleModal} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
                  <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;

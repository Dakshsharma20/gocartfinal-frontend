import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaUserCircle,
  FaCheckCircle,
  FaBoxOpen,
  FaListAlt,
  FaChartBar
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const SIDEBAR_OPTIONS = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <MdDashboard className="text-lg" />
  },
  {
    label: "Products",
    key: "products",
    icon: <FaBoxOpen className="text-lg" />
  },
  {
    label: "Orders",
    key: "orders",
    icon: <FaListAlt className="text-lg" />
  },
  {
    label: "Add Product",
    key: "add",
    icon: <FaPlusCircle className="text-lg" />
  }
];

const VendorDashboard = () => {

  const vendorId = JSON.parse(
    localStorage.getItem("vendor_id")
  );

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [vendorData, setVendorData] =
    useState(null);

  const [productList, setProductList] =
    useState([]);

  const [orderList, setOrderList] =
    useState([]);

  const [orderFilter, setOrderFilter] =
    useState("all");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [productDetails, setProductDetails] =
    useState({
      vendorId,
      name: "",
      price: "",
      category: "",
      stock: "",
      discount: "",
      image: "",
    });

  const [totalEarnings, setTotalEarnings] =
    useState(0);

  const [pendingCount, setPendingCount] =
    useState(0);

  // FETCH DATA
  useEffect(() => {

    if (vendorId) {

      axios.get(
        `https://gocart-backend-bfil.onrender.com/vendors/${vendorId}`
      )
        .then((res) =>
          setVendorData(res.data.data)
        )
        .catch((err) =>
          console.error("Vendor fetch failed:", err)
        );

      axios.get(
        `https://gocart-backend-bfil.onrender.com/products/${vendorId}`
      )
        .then((res) =>
          setProductList(res.data.data)
        )
        .catch((err) =>
          console.error("Product fetch failed:", err)
        );

      axios.get(
        "https://gocart-backend-bfil.onrender.com/orders"
      )
        .then((res) => {

          const allOrders = res.data.data;

          const vendorOrders =
            allOrders.filter(order =>
              order.products.some(
                p => p.productId.vendorId === vendorId
              )
            );

          setOrderList(vendorOrders);

          const pendingOrders =
            vendorOrders.filter(
              order => order.status === "pending"
            );

          const completedOrders =
            vendorOrders.filter(
              order => order.status === "completed"
            );

          setPendingCount(
            pendingOrders.reduce(
              (acc, order) =>
                acc + order.products.length,
              0
            )
          );

          setTotalEarnings(
            completedOrders.reduce(
              (acc, order) =>
                acc + order.products.reduce(
                  (total, p) =>
                    total +
                    (p.quantity * p.productId.price),
                  0
                ),
              0
            )
          );

        })
        .catch((err) =>
          console.error("Order fetch failed:", err)
        );
    }

  }, [vendorId]);

  // FILTER ORDERS
  const filteredOrders =
    orderFilter === "all"
      ? orderList
      : orderList.filter(
          order => order.status === orderFilter
        );

  const toggleModal = () =>
    setIsModalOpen(!isModalOpen);

  const handleInputChange = (e) => {

    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });

  };

  // ADD PRODUCT
  const handleSubmitProduct = () => {

    axios.post(
      "https://gocart-backend-bfil.onrender.com/products",
      productDetails
    )
      .then((res) => {

        alert("Product added!");

        setProductList([
          ...productList,
          res.data
        ]);

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

  // DELETE PRODUCT
  const handleDeleteProduct = (productId) => {

    axios.delete(
      `https://gocart-backend-bfil.onrender.com/products/${productId}`
    )
      .then(() => {

        setProductList(
          productList.filter(
            (p) => p._id !== productId
          )
        );

        alert("Product deleted!");

      })
      .catch((err) =>
        console.error("Delete failed:", err)
      );

  };

  // UPDATE ORDER + STOCK
  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      const order =
        orderList.find(
          (o) => o._id === orderId
        );

      // REDUCE STOCK
      if (
        newStatus === "completed" &&
        order
      ) {

        for (const prod of order.products) {

          const currentProduct =
            productList.find(
              (p) =>
                p._id === prod.productId._id
            );

          if (currentProduct) {

            const updatedStock =
              Number(currentProduct.stock) -
              Number(prod.quantity);

            if (updatedStock < 0)
              continue;

            await axios.put(
              `https://gocart-backend-bfil.onrender.com/products/${currentProduct._id}`,
              {
                ...currentProduct,
                stock: updatedStock,
              }
            );
          }
        }
      }

      // UPDATE STATUS
      await axios.put(
        `https://gocart-backend-bfil.onrender.com/orders/${orderId}`,
        {
          status: newStatus,
        }
      );

      alert(
        `Order marked as ${newStatus}`
      );

      // REFRESH PRODUCTS
      const updatedProducts =
        await axios.get(
          `https://gocart-backend-bfil.onrender.com/products/${vendorId}`
        );

      setProductList(
        updatedProducts.data.data
      );

      // REFRESH ORDERS
      const updatedOrders =
        await axios.get(
          "https://gocart-backend-bfil.onrender.com/orders"
        );

      const vendorOrders =
        updatedOrders.data.data.filter(
          order =>
            order.products.some(
              p =>
                p.productId.vendorId ===
                vendorId
            )
        );

      setOrderList(vendorOrders);

    } catch (err) {

      console.error(
        "Status update failed:",
        err
      );

      alert(
        "Failed to update order status."
      );

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-tr from-green-50 via-white to-blue-50 flex">

      {/* SIDEBAR */}
      <aside className="bg-white/80 shadow-xl border-r border-green-100 min-h-screen w-[220px] py-6 px-3 flex flex-col justify-between sticky top-0">

        <div>

          <Link
            to="/"
            className="flex items-center mb-8 pl-2"
          >

            <img
              src="/image.png"
              alt="GoCart Logo"
              className="w-10 h-10 rounded-lg shadow"
            />

            <span className="ml-3 text-xl font-bold text-green-700 tracking-wide">
              GoCart Vendor
            </span>

          </Link>

          <nav className="flex flex-col gap-2">

            {SIDEBAR_OPTIONS.map((opt) => (

              <button
                key={opt.key}
                onClick={() =>
                  setActiveTab(opt.key)
                }
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all
                ${
                  activeTab === opt.key
                    ? "bg-green-100 text-green-700 shadow"
                    : "text-gray-700 hover:bg-green-50"
                }`}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen p-4 md:p-8 bg-transparent">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="bg-white/90 rounded-xl shadow-lg p-6 mb-7 border border-green-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

              <div>

                <h2 className="text-xl font-bold mb-2 text-green-700">
                  Shop Information
                </h2>

                <div className="flex flex-col gap-1 text-gray-700 text-sm">

                  <div>
                    <b>Shop Name:</b> {vendorData?.shopName || "N/A"}
                  </div>

                  <div>
                    <b>Address:</b> {vendorData?.address || "N/A"}
                  </div>

                  <div>
                    <b>Owner Name:</b> {vendorData?.name || "N/A"}
                  </div>

                  <div>
                    <b>Contact:</b> {vendorData?.mobile_number || "N/A"}
                  </div>

                </div>

              </div>

              <div className="flex items-center mt-6 md:mt-0">

                <div className="bg-green-100 px-5 py-3 rounded-lg flex items-center gap-3 shadow-sm">

                  <FaCheckCircle
                    className={`text-2xl ${
                      vendorData?.paymentStatus === "Pending"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  />

                  <span
                    className={`font-bold ${
                      vendorData?.paymentStatus === "Pending"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {vendorData?.paymentStatus || "Unknown"}
                  </span>

                </div>

              </div>

            </div>

            {/* METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">

              <div className="bg-gradient-to-tr from-red-100 via-white to-white border-l-4 border-red-400 rounded-lg p-5 shadow">
                <div className="flex items-center gap-3 text-red-500 mb-2 font-semibold">
                  <FaListAlt />
                  Pending Orders
                </div>

                <div className="text-3xl font-extrabold text-red-500">
                  {pendingCount}
                </div>
              </div>

              <div className="bg-gradient-to-tr from-green-100 via-white to-white border-l-4 border-green-400 rounded-lg p-5 shadow">

                <div className="flex items-center gap-3 text-green-600 mb-2 font-semibold">
                  <FaCheckCircle />
                  Total Completed
                </div>

                <div className="text-3xl font-extrabold text-green-600">
                  {orderList.filter(o => o.status === "completed").length}
                </div>

              </div>

              <div className="bg-gradient-to-tr from-blue-100 via-white to-white border-l-4 border-blue-400 rounded-lg p-5 shadow">

                <div className="flex items-center gap-3 text-blue-500 mb-2 font-semibold">
                  <FaChartBar />
                  Earnings
                </div>

                <div className="text-3xl font-extrabold text-blue-600">
                  ₹{totalEarnings}
                </div>

              </div>

              <div className="bg-gradient-to-tr from-green-50 via-white to-white rounded-lg p-5 shadow">

                <div className="flex items-center gap-3 text-gray-500 mb-2 font-semibold">
                  <FaBoxOpen />
                  Total Products
                </div>

                <div className="text-3xl font-extrabold text-green-700">
                  {productList.length}
                </div>

              </div>

            </div>
          </>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (

          <>
            <div className="flex justify-between items-center mb-5">

              <h3 className="text-2xl font-bold text-green-700">
                Product Listing
              </h3>

              <button
                onClick={toggleModal}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold text-base flex items-center gap-2 shadow"
              >
                <FaPlusCircle />
                Add Product
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {productList.length > 0 ? (

                productList.map((product) => (

                  <div
                    key={product._id}
                    className="bg-white/90 p-4 rounded-xl shadow-md border border-green-50 flex flex-col"
                  >

                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                    )}

                    <div className="flex-1">

                      <h4 className="text-lg font-bold text-gray-800">
                        {product.name}
                      </h4>

                      <div className="text-green-700 font-semibold mt-1 text-sm">
                        ₹{product.price}
                      </div>

                      <div className="text-gray-500 text-xs">
                        Category: {product.category}
                      </div>

                      <div className="text-gray-500 text-xs">
                        Remaining Stock: {product.stock} Kg
                      </div>

                      <div className="text-gray-500 text-xs">
                        Discount: {product.discount}%
                      </div>

                    </div>

                    <div className="flex justify-end mt-3 space-x-2">

                      <button
                        onClick={() =>
                          handleDeleteProduct(product._id)
                        }
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        <FaTrashAlt />
                      </button>

                      <button
                        className="text-yellow-500 hover:text-yellow-700 text-lg"
                      >
                        <FaEdit />
                      </button>

                    </div>

                  </div>
                ))

              ) : (
                <p>No products available.</p>
              )}

            </div>
          </>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (

          <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-green-50">

            <div className="flex justify-between items-center mb-5">

              <h3 className="text-2xl font-bold text-green-700">
                Order Management
              </h3>

            </div>

            {filteredOrders.length ? (

              <table className="w-full table-auto text-left border">

                <thead>

                  <tr className="bg-green-50">

                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Product</th>
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

                        <td className="p-2 border">
                          {i + 1}.{idx + 1}
                        </td>

                        <td className="p-2 border">
                          {prod.productId.name}
                        </td>

                        <td className="p-2 border">
                          {prod.quantity} Kg
                        </td>

                        <td className="p-2 border">
                          ₹{prod.productId?.price * prod.quantity}
                        </td>

                        <td className="p-2 border">
                          {order.status}
                        </td>

                        <td className="p-2 border">

                          {order.status === "pending" && (

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    "completed"
                                  )
                                }
                                className="bg-green-500 text-white px-2 py-1 rounded"
                              >
                                Complete
                              </button>

                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    "cancelled"
                                  )
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded"
                              >
                                Cancel
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    ))
                  )}

                </tbody>

              </table>

            ) : (
              <p>No orders found.</p>
            )}

          </div>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "add" && (

          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg">

            <h2 className="text-2xl font-bold mb-5 text-green-700">
              Add Product
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitProduct();
              }}
              className="space-y-4"
            >

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={productDetails.name}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={productDetails.price}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={productDetails.category}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock in Kg"
                value={productDetails.stock}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="number"
                name="discount"
                placeholder="Discount"
                value={productDetails.discount}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={productDetails.image}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                Add Product
              </button>

            </form>

          </div>
        )}

      </main>

    </div>
  );
};

export default VendorDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import Header2 from "../components/Header2";

const tabOptions = [
  { name: "Orders", value: "orders", icon: ClipboardDocumentListIcon },
  { name: "Address", value: "address", icon: HomeIcon },
  { name: "Edit Profile", value: "edit", icon: PencilSquareIcon },
];

const ConsumerProfile = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [consumer, setConsumer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    mobile_number: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  useEffect(() => {
    const consumerId = JSON.parse(localStorage.getItem("consumer_id"));
    if (!consumerId) {
      navigate("/consumer-login");
      return;
    }
    const fetchData = async () => {
      try {
        const consumerResponse = await axios.get(
          `https://gocart-backend-bfil.onrender.com/consumers/${consumerId}`
        );
        setConsumer(consumerResponse.data.data);
        setEditData({
          name: consumerResponse.data.data.name,
          mobile_number: consumerResponse.data.data.mobile_number,
          address: consumerResponse.data.data.Address,
        });
        if (activeTab === "orders") {
          const ordersResponse = await axios.get(
            `https://gocart-backend-bfil.onrender.com/orders/consumer/${consumerId}`
          );
          setOrders(ordersResponse.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [activeTab, navigate]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const consumerId = JSON.parse(localStorage.getItem("consumer_id"));
    axios
      .put(`https://gocart-backend-bfil.onrender.com/consumers/${consumerId}`, {
        ...editData,
        Address: editData.address,
      })
      .then((res) => {
        alert("Profile updated!");
        setConsumer(res.data.data);
        setSaving(false);
        setActiveTab("address");
      })
      .catch((err) => {
        setSaving(false);
        console.error(err);
      });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/consumer-auth");
    }
  };

  // Modern soft loading spinner
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f8fff8] via-[#e9fbe9] to-[#d1f8e2] font-sans">
      <Header2 />
      {consumer ? (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
          {/* Top Card Header */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-6 py-5 flex flex-col md:flex-row items-center md:justify-between gap-3 mb-7 border border-green-50 mt-5">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="h-14 w-14 text-green-400 drop-shadow" />
              <div>
                <div className="font-extrabold text-xl md:text-2xl text-green-700">
                  {consumer.name}
                </div>
                <div className="flex items-center text-green-700 mt-1 text-sm">
                  <PhoneIcon className="h-4 w-4 mr-1 text-green-400" />
                  {consumer.mobile_number}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md font-semibold shadow-sm transition"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>

          {/* Tabs navigation */}
          <div className="flex border-b border-green-100 bg-white/80 rounded-xl overflow-x-auto mb-2">
            {tabOptions.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex items-center gap-2 py-3 px-4 md:px-7 font-medium text-base border-b-2
                  ${
                    activeTab === tab.value
                      ? "text-green-700 border-green-500 bg-green-50"
                      : "text-gray-500 border-transparent hover:bg-green-50"
                  }
                  transition min-w-[120px] justify-center
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-5 md:p-8 mt-6 min-h-[320px] transition-all duration-200">
            {activeTab === "orders" && (
              <>
                <div className="font-bold text-green-700 text-lg flex items-center gap-2 mb-5">
                  <ClipboardDocumentListIcon className="h-6 w-6" /> Your Orders
                </div>
                {orders.length ? (
                  <div className="space-y-4">
                    {orders
                      .slice()
                      .reverse()
                      .map((order) => (
                        <div
                          key={order._id}
                          className="border border-green-100 shadow-sm hover:shadow-lg transition rounded-xl p-4 bg-gradient-to-br from-[#f3fff6] to-[#e7faed] relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 font-semibold">
                              {order.status === "completed" ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              ) : order.status === "cancelled" ? (
                                <XCircleIcon className="h-5 w-5 text-red-400" />
                              ) : (
                                <ClockIcon className="h-5 w-5 text-yellow-500" />
                              )}
                              <span
                                className={`${
                                  order.status === "completed"
                                    ? "text-green-600"
                                    : order.status === "cancelled"
                                    ? "text-red-500"
                                    : "text-yellow-600"
                                }`}
                              >
                                {order.status === "completed"
                                  ? "Delivered"
                                  : order.status === "pending"
                                  ? "Pending"
                                  : order.status}
                              </span>
                            </span>
                            <span className="text-[15px] font-bold text-green-700">
                              ₹{order.totalPrice}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 text-xs mt-2">
                            <HomeIcon className="h-4 w-4 mr-1 text-green-300" />
                            <span>{order.address}</span>
                          </div>
                          <ul className="text-[15px] mt-3 text-gray-700 space-y-1">
                            {order.products.map((prod, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span>•</span>
                                <span>
                                  {prod.productId.name} × {prod.quantity} &mdash; ₹
                                  {prod.productId.price}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center text-[12px] text-gray-400 mt-3">
                            <span>
                              {order.status === "completed"
                                ? `Delivered: ${formatDate(order.createdAt)}`
                                : `Ordered: ${formatDate(order.createdAt)}`}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center pt-6 pb-8 flex flex-col items-center">
                    <ClipboardDocumentListIcon className="h-10 w-10 mb-3 text-green-100" />
                    <div>No orders placed yet.</div>
                  </div>
                )}
              </>
            )}

            {activeTab === "address" && (
              <>
                <div className="font-bold text-green-700 text-lg flex items-center gap-2 mb-5">
                  <HomeIcon className="h-6 w-6" /> Your Address
                </div>
                <div className="bg-green-50 border border-green-100 rounded-md p-5 min-h-[48px] font-medium text-green-700 text-base">
                  {consumer.Address?.trim() || "No address added yet."}
                </div>
              </>
            )}

            {activeTab === "edit" && (
              <form
                onSubmit={handleEditSubmit}
                className="space-y-5 animate-fade-in"
              >
                <div className="font-bold text-green-700 text-lg flex items-center gap-2 mb-3">
                  <PencilSquareIcon className="h-6 w-6" /> Edit Profile
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-green-700 font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-green-100 focus:border-green-400 rounded-md bg-green-50 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-green-700 font-medium mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-green-100 focus:border-green-400 rounded-md bg-green-50 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition"
                      value={editData.mobile_number}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mobile_number: e.target.value,
                        })
                      }
                      placeholder="Mobile Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-green-700 font-medium mb-1">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-3 border-2 border-green-100 focus:border-green-400 rounded-md bg-green-50 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition"
                      value={editData.address}
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                      placeholder="Address"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-7 py-3 rounded-lg font-semibold shadow-md transition-all ${
                    saving ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default ConsumerProfile;

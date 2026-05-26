import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Logo from "../images/logo.jpg";

const VendorsListPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("https://gocart-backend-bfil.onrender.com/vendors");
        setVendors(res.data.data || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="bg-gradient-to-tr from-green-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <img
          src={Logo}
          onClick={() => navigate("/")}
          alt="GoCart Logo"
          className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center flex-1">
          🛒 Explore Vendors Around You
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>

      {/* Vendors Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400 border-opacity-50"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="relative bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              {/* Verified Badge */}
              <div className="absolute z-100 top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Verified
              </div>

              {/* Vendor Image */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={vendor.shop_image || "https://via.placeholder.com/300x200.png?text=No+Image"}
                  alt={vendor.shopName}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
              </div>

              {/* Vendor Details */}
              <h3 className="text-xl font-bold text-gray-800 mt-4 group-hover:text-green-600 transition-colors cursor-pointer">
                {vendor.shopName}
              </h3>

              <p className="text-gray-500 text-sm mt-2 flex items-center">
                <FaMapMarkerAlt className="text-red-400 mr-2" />
                {vendor.address}
              </p>

              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {vendor.name}
                </span>
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {vendor.mobile_number}
                </span>
              </div>

              {/* Visit Shop Button */}
              <button
                onClick={() => {
                  localStorage.setItem("vendor_id", JSON.stringify(vendor._id));
                  navigate(`/cusord?vendorId=${vendor._id}`);
                }}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-transform transform hover:scale-105"
              >
                🛒 Visit Shop
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorsListPage;

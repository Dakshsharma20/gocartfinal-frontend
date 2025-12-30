import axios from "axios";
import React, { useState } from "react";
import Header from "../components/HeaderVendor";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";

const VendorJoinPage = () => {
  const [vendorDetails, setVendorDetails] = useState({
    name: "",
    shopName: "",
    mobile_number: "",
    address: "",
    city: "",
    addhar_card: "",
    password: "",
    addhar_front_image: null,
    aadhar_back_image: null,
  });

  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Handle field change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setVendorDetails((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      // Preview
      if (name === "addhar_front_image") setPreviewFront(URL.createObjectURL(files[0]));
      if (name === "aadhar_back_image") setPreviewBack(URL.createObjectURL(files[0]));
    } else {
      setVendorDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Post with FormData for file upload
  const postData = async () => {
    setLoading(true);
    setMsg("");
    const form = new FormData();
    Object.entries(vendorDetails).forEach(([key, val]) => {
      if (val) form.append(key, val);
    });

    try {
      const res = await axios.post(
        "https://gocart-backend-bfil.onrender.com/vendors",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMsg("Vendor registration successful! You can now login.");
      setVendorDetails({
        name: "",
        shopName: "",
        mobile_number: "",
        address: "",
        city: "",
        addhar_card: "",
        password: "",
        addhar_front_image: null,
        aadhar_back_image: null,
      });
      setPreviewFront(null);
      setPreviewBack(null);
    } catch (err) {
      setMsg("Something went wrong! Please check all details and try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="bg-gradient-to-tr from-green-100 via-blue-50 to-emerald-100 min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/vegetables-fruits-shop-exterior-building_960396-248656.jpg?w=996')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      <div className="flex flex-1 items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
          className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <img
              src="/image.png"
              alt="GoCart Vendor"
              className="h-12 w-12 rounded-full shadow"
            />
            <span className="text-2xl font-bold text-green-700">
              Vendor Signup
            </span>
          </div>
          <h2 className="text-xl text-gray-700 font-semibold mb-2">
            Register your Shop on GoCart
          </h2>
          <p className="text-gray-600 mb-7 text-center max-w-xs">
            Join to sell online, manage orders, and reach more customers!
          </p>

          {/* Message */}
          {msg && (
            <div className={`mb-4 w-full text-center font-bold ${msg.includes("success") ? "text-green-700" : "text-red-500"}`}>
              {msg}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); postData(); }}
            encType="multipart/form-data"
            className="w-full space-y-4"
          >
            {/* Fields */}
            {[
              { label: "Full Name", id: "name", type: "text", placeholder: "Enter your full name" },
              { label: "Shop Name", id: "shopName", type: "text", placeholder: "Enter your shop name" },
              { label: "Mobile Number", id: "mobile_number", type: "text", placeholder: "Enter mobile number" },
              { label: "Aadhar Card Number", id: "addhar_card", type: "text", placeholder: "Enter Aadhar number" },
              { label: "Password", id: "password", type: "password", placeholder: "Create a strong password" },
              { label: "Address", id: "address", type: "text", placeholder: "Enter full address" },
              { label: "City", id: "city", type: "text", placeholder: "Enter city" },
            ].map((field) => (
              <label key={field.id} className="block text-left font-medium">
                {field.label}
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={vendorDetails[field.id]}
                  onChange={handleChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition placeholder:text-gray-400"
                  placeholder={field.placeholder}
                  required
                />
              </label>
            ))}

            {/* Aadhar Front */}
            <label className="block text-left font-medium">
              Aadhar Card (Front)
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="file"
                  id="addhar_front_image"
                  name="addhar_front_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="flex-1 border rounded-lg file:py-2 file:px-4 file:border-0 file:bg-green-200 file:font-bold"
                  required
                />
                {previewFront && (
                  <img src={previewFront} alt="Front Preview" className="h-12 w-20 object-cover rounded shadow border" />
                )}
              </div>
            </label>

            {/* Aadhar Back */}
            <label className="block text-left font-medium">
              Aadhar Card (Back)
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="file"
                  id="aadhar_back_image"
                  name="aadhar_back_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="flex-1 border rounded-lg file:py-2 file:px-4 file:border-0 file:bg-green-200 file:font-bold"
                  required
                />
                {previewBack && (
                  <img src={previewBack} alt="Back Preview" className="h-12 w-20 object-cover rounded shadow border" />
                )}
              </div>
            </label>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-lg mx-auto disabled:opacity-60"
              >
                <FaCloudUploadAlt className="inline-block text-2xl" />
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorJoinPage;

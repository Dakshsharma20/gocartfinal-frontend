import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header2 from "../components/Header2";
import { motion } from "framer-motion";
import { FaUser, FaMobileAlt, FaLock, FaEnvelope } from "react-icons/fa";

const ConsumerAuthPage = () => {
  const [authData, setAuthData] = useState({
    name: "",
    mobile_number: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://gocart-backend-bfil.onrender.com/consumers",
        authData
      );
      localStorage.setItem("consumer_id", JSON.stringify(response.data.data._id));
      localStorage.setItem("token", response.data.token);
      setMsg("Registered successfully! Redirecting...");
      setTimeout(() => navigate("/venders"), 1200);
    } catch (error) {
      setMsg("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="bg-gradient-to-tr from-green-100 via-blue-50 to-emerald-100 min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/vegetables-fruits-shop-exterior-building_1106939-193513.jpg?w=996')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header2 />
      <div className="flex flex-1 items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center"
        >
          <div className="mb-3 flex items-center gap-2">
            <img
              src="/image.png"
              alt="GoCart Consumer"
              className="h-12 w-12 rounded-full shadow"
            />
            <span className="text-2xl font-bold text-green-700">
              Consumer Signup
            </span>
          </div>
          <h2 className="text-xl text-gray-700 font-semibold mb-3">
            Create your GoCart Account
          </h2>
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Full Name */}
            <label className="block text-left w-full">
              <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaUser className="text-green-500" /> Full Name
              </span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={authData.name}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition placeholder:text-gray-400"
                required
              />
            </label>
            {/* Email */}
            <label className="block text-left w-full">
              <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaEnvelope className="text-green-500" /> Email
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={authData.email}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition placeholder:text-gray-400"
                required
              />
            </label>
            {/* Mobile Number */}
            <label className="block text-left w-full">
              <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaMobileAlt className="text-green-500" /> Mobile Number
              </span>
              <input
                type="text"
                name="mobile_number"
                placeholder="Mobile Number"
                value={authData.mobile_number}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition placeholder:text-gray-400"
                required
              />
            </label>
            {/* Password */}
            <label className="block text-left w-full">
              <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaLock className="text-green-500" /> Password
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={authData.password}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition placeholder:text-gray-400"
                required
              />
            </label>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition-all text-lg mt-2 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Continue"}
            </button>
          </form>
          {/* Registration message */}
          {msg && (
            <div className={`mt-4 w-full text-center font-semibold ${msg.includes("success") ? "text-green-700" : "text-red-500"}`}>
              {msg}
            </div>
          )}
          <p className="mt-5 text-sm text-center text-gray-700">
            Already have an account?{" "}
            <span
              className="text-green-700 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/consumer-login")}
            >
              Login here
            </span>
          </p>
        </motion.div>
      </div>
      <footer className="mt-10 bg-gray-900 text-gray-300 p-4 text-center text-xs">
        <p>© 2025 GoCart. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ConsumerAuthPage;

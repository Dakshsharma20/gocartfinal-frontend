// src/pages/VendorLoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/HeaderVendor";
import { motion } from "framer-motion";
import { FaMobileAlt, FaLock, FaArrowLeft, FaKey } from "react-icons/fa";

const VendorLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // For inline forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // For showing messages
  const [msg, setMsg] = useState("");

  // Handlers
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Login form submit (original logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("https://gocart-backend-bfil.onrender.com/vendors/login", formData)
      .then((res) => {
        const vendor = res.data.data;
        localStorage.setItem("vendor_id", JSON.stringify(vendor._id));
        localStorage.setItem("vendor_mobile", vendor.mobile_number);
        alert("Login Successful!");
        navigate("/vendordashboard");
      })
      .catch((err) => {
        setMsg("Login failed. Please check your details.");
      })
      .finally(() => setLoading(false));
  };

  // Send OTP handler
  const handleSendOtp = (e) => {
    e.preventDefault();
    setResetLoading(true);
    setMsg("");
    axios
      .post("https://gocart-backend-bfil.onrender.com/vendors/forgot", { mobile_number: forgotMobile })
      .then((res) => {
        setOtpSent(true);
        setMsg("OTP sent! Please check your SMS/email.");
      })
      .catch((err) => {
        setMsg("Failed to send OTP. Please check mobile number.");
      })
      .finally(() => setResetLoading(false));
  };

  // Reset password with OTP
  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetLoading(true);
    setMsg("");
    axios
      .post("https://gocart-backend-bfil.onrender.com/vendors/reset", {
        mobile_number: forgotMobile,
        otp,
        newPassword,
      })
      .then((res) => {
        setMsg("Password reset successful! You can now login.");
        setOtpSent(false);
        setShowForgot(false);
        setForgotMobile("");
        setOtp("");
        setNewPassword("");
      })
      .catch((err) => {
        setMsg("Failed to reset password. Please try again.");
      })
      .finally(() => setResetLoading(false));
  };

  return (
    <div
      className="bg-gradient-to-tr from-green-100 via-blue-50 to-emerald-100 min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-vector/outdoor-organic-food-grocery-market-stall-with-fruits-vegetables-horizontal-cityscape-background_48369-47984.jpg?w=996')",
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
          className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center"
        >
          {/* Logo and Heading */}
          <div className="mb-3 flex items-center justify-center gap-2">
            <img
              src="/image.png"
              alt="GoCart Vendor"
              className="h-12 w-12 rounded-full shadow"
            />
            <span className="text-2xl font-bold text-green-700">
              Vendor Login
            </span>
          </div>
          <p className="text-gray-600 mb-8 text-center max-w-xs">
            {!showForgot
              ? <>Login to manage your products, track orders, and grow your business on <b>GoCart</b>!</>
              : <>Reset your vendor account password securely via OTP.</>
            }
          </p>

          {/* --- LOGIN FORM --- */}
          {!showForgot && (
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <label className="block text-left w-full">
                <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <FaMobileAlt className="text-green-500" /> Mobile Number
                </span>
                <input
                  type="number"
                  name="mobile_number"
                  placeholder="Mobile Number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white/80 transition placeholder:text-gray-400"
                  required
                />
              </label>
              <label className="block text-left w-full">
                <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <FaLock className="text-green-500" /> Password
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white/80 transition placeholder:text-gray-400"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition-all text-lg mt-2 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* --- FORGOT PASSWORD --- */}
          {showForgot && (
            <form
              onSubmit={otpSent ? handleResetPassword : handleSendOtp}
              className="w-full space-y-5"
            >
              <label className="block text-left w-full">
                <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <FaMobileAlt className="text-green-500" /> Mobile Number
                </span>
                <input
                  type="number"
                  name="forgotMobile"
                  placeholder="Registered Mobile Number"
                  value={forgotMobile}
                  onChange={e => setForgotMobile(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white/80 transition placeholder:text-gray-400"
                  required
                  disabled={otpSent}
                />
              </label>

              {/* OTP & New Password after OTP is sent */}
              {otpSent && (
                <>
                  <label className="block text-left w-full">
                    <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                      <FaKey className="text-green-500" /> OTP
                    </span>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition"
                      required
                    />
                  </label>
                  <label className="block text-left w-full">
                    <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                      <FaLock className="text-green-500" /> New Password
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Set New Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition"
                      required
                    />
                  </label>
                </>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition-all text-lg mt-2 disabled:opacity-60"
              >
                {resetLoading
                  ? (otpSent ? "Resetting..." : "Sending OTP...")
                  : (otpSent ? "Reset Password" : "Send OTP")}
              </button>
            </form>
          )}

          {/* Success/Error Message */}
          {msg && (
            <div className={`mt-5 w-full text-center font-semibold ${msg.includes("success") ? "text-green-700" : "text-red-500"}`}>
              {msg}
            </div>
          )}

          {/* --- Switch Link --- */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-6 text-sm gap-2">
            {!showForgot ? (
              <>
                <button
                  className="text-green-700 hover:underline font-medium"
                  onClick={() => {
                    setShowForgot(true);
                    setMsg("");
                  }}
                  type="button"
                >
                  Forgot Password?
                </button>
                <button
                  className="text-green-700 hover:underline font-medium"
                  onClick={() => navigate("/vendorsignup")}
                  type="button"
                >
                  Create Account
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-1 text-green-700 hover:underline font-medium"
                onClick={() => {
                  setShowForgot(false);
                  setOtpSent(false);
                  setMsg("");
                  setForgotMobile("");
                  setOtp("");
                  setNewPassword("");
                }}
                type="button"
              >
                <FaArrowLeft /> Back to Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorLoginForm;

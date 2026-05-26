import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header2 from "../components/Header2";
import { motion, AnimatePresence } from "framer-motion";
import { FaMobileAlt, FaLock, FaEnvelope, FaKey, FaArrowLeft } from "react-icons/fa";

const ConsumerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile_number: "",
    password: "",
  });

  // Forgot password modal state
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("https://gocart-backend-bfil.onrender.com/consumers/login", formData)
      .then((res) => {
        const consumer = res.data.data;
        localStorage.setItem("consumer_id", JSON.stringify(consumer._id));
        localStorage.setItem("consumer_mobile", consumer.mobile_number);
        alert("Login Successful!");
        navigate("/venders");
      })
      .catch(() => {
        setModalMsg("Login failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  // OTP send
  const sendOtp = () => {
    setModalMsg("");
    setLoading(true);
    axios
      .post("https://gocart-backend-bfil.onrender.com/send-otp-mail", {
        to: email,
        subject: "OTP for Password Reset",
      })
      .then((res) => {
        setOtpSent(true);
        setServerOtp(res.data.otp);
        setModalMsg("OTP sent to your email!");
      })
      .catch(() => setModalMsg("Failed to send OTP."))
      .finally(() => setLoading(false));
  };

  // OTP verify
  const verifyOtp = () => {
    setModalMsg("");
    if (otpInput === serverOtp) {
      setModalMsg("OTP Verified! Redirecting to reset password...");
      setTimeout(() => {
        setShowModal(false);
        navigate("/reset-password");
      }, 1000);
    } else {
      setModalMsg("Invalid OTP, please try again.");
    }
  };

  return (
    <div
      className="bg-gradient-to-tr from-green-100 via-blue-50 to-emerald-100 min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-vector/man-seller-sells-fresh-organic-fruit-vegetable-street-shop-seasonal-outdoor-farmer-local-market_575670-344.jpg?t=st=1745676333~exp=1745679933~hmac=200fc5b83336850636e6815e29d14f087b6dc32fb3a8c5421bd63cf29ad528ca&w=826')`,
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
              Consumer Login
            </span>
          </div>
          <h2 className="text-xl text-gray-700 font-semibold mb-3">
            Welcome back! Login to shop with GoCart
          </h2>
          <form onSubmit={handleLoginSubmit} className="w-full space-y-5">
            {/* Mobile Number */}
            <label className="block text-left w-full">
              <span className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaMobileAlt className="text-green-500" /> Mobile Number
              </span>
              <input
                type="number"
                name="mobile_number"
                placeholder="Mobile Number"
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 transition placeholder:text-gray-400"
                required
              />
            </label>
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition-all text-lg mt-2 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {/* Forgot Password */}
          <div className="mt-5 w-full flex flex-col md:flex-row justify-between items-center text-sm gap-2">
            <button
              className="text-green-700 hover:underline font-medium"
              onClick={() => {
                setShowModal(true);
                setModalMsg("");
                setEmail("");
                setOtpSent(false);
                setOtpInput("");
              }}
              type="button"
            >
              Forgot Password?
            </button>
            <button
              className="text-green-700 hover:underline font-medium"
              onClick={() => navigate("/consumer-auth")}
              type="button"
            >
              Don't have an account? Sign up
            </button>
          </div>
          {/* Login error/success message */}
          {modalMsg && !showModal && (
            <div className="mt-4 w-full text-center font-semibold text-red-500">
              {modalMsg}
            </div>
          )}
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.93 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.93 }}
              className="bg-white/90 px-8 py-8 rounded-2xl shadow-xl w-full max-w-md text-center"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
                <FaEnvelope className="text-green-600" /> Reset Password
              </h3>
              <p className="text-gray-600 mb-6">We'll send an OTP to your email to reset your password.</p>
              {!otpSent ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition mb-1 disabled:opacity-60"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 mb-4"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition mb-1 disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
              {modalMsg && (
                <div className={`mt-3 text-sm font-semibold ${modalMsg.includes("success") || modalMsg.includes("Verified") ? "text-green-700" : "text-red-500"}`}>
                  {modalMsg}
                </div>
              )}
              <button
                className="mt-5 text-green-700 hover:underline font-medium flex items-center gap-1"
                onClick={() => setShowModal(false)}
              >
                <FaArrowLeft /> Back to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="mt-10 bg-gray-900 text-gray-300 p-4 text-center text-xs">
        <p>© 2025 GoCart. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ConsumerLogin;

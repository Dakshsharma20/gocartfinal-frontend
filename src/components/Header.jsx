// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/venders" },
  { name: "Vendors", path: "/vendor-auth" }
];

const Header = () => {
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg shadow-lg">
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="/image.png"
              alt="GoCart Logo"
              className="h-10 w-10 rounded-full shadow"
              initial={{ rotate: -12, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 60 }}
            />
            <span className="text-2xl font-extrabold text-green-700 tracking-tight">
              GoCart
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-8 font-bold text-emerald-700">
            {navItems.map((item) => (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.13, color: "#059669" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link to={item.path}>{item.name}</Link>
              </motion.li>
            ))}
            {/* Login (special) */}
            <motion.li
              whileHover={{ scale: 1.09 }}
              className="relative"
            >
              <button
                onClick={() => setShowLoginPanel(true)}
                className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
              >
                Login
              </button>
            </motion.li>
          </ul>
        </nav>
      </header>

      {/* Login Panel Overlay */}
      <AnimatePresence>
        {showLoginPanel && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Panel Card */}
            <motion.div
              initial={{ scale: 0.92, y: -30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="relative w-full max-w-md bg-white/70 backdrop-blur-2xl p-0 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Decorative Gradient Top Strip */}
              <div className="h-3 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />
              <button
                onClick={() => setShowLoginPanel(false)}
                className="absolute top-4 right-4 text-green-700 hover:text-green-900 transition"
                aria-label="Close"
              >
                <X size={28} />
              </button>
              {/* Main Content */}
              <div className="p-10 flex flex-col items-center">
                {/* Animated logo */}
                <motion.div
                  initial={{ y: -18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3, type: "spring" }}
                  className="mb-2"
                >
                  <img
                    src="/image.png"
                    alt="GoCart"
                    className="w-16 h-16 rounded-full border-4 border-green-300 shadow-lg"
                  />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-emerald-700 mb-2 text-center tracking-tight">
                  Welcome to GoCart!
                </h2>
                <p className="text-gray-600 mb-7 text-center max-w-xs">
                  Please choose how you'd like to login and start exploring fresh local shopping.
                </p>
                <div className="flex flex-col gap-5 w-full">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setShowLoginPanel(false);
                      navigate("/vendor-auth");
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:brightness-105 transition text-lg w-full"
                  >
                    Login as Vendor
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setShowLoginPanel(false);
                      navigate("/consumer-login");
                    }}
                    className="bg-white text-green-700 border-2 border-green-500 font-bold py-3 rounded-xl shadow hover:bg-green-50 transition text-lg w-full"
                  >
                    Login as Consumer
                  </motion.button>
                </div>
               
              </div>
            </motion.div>
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-black/30 z-[-1] cursor-pointer"
              onClick={() => setShowLoginPanel(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

// src/components/JoinGoCart.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const JoinGoCart = () => (
  <section className="py-20 bg-white text-center">
    <h2 className="text-3xl font-bold text-emerald-700 mb-10">
      Join GoCart Community!
    </h2>
    <div className="flex flex-col md:flex-row gap-10 justify-center">
      {/* Vendor */}
      <motion.div
        whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(16,185,129,0.22)" }}
        className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl shadow-xl flex flex-col items-center w-80"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Vendor" className="w-16 mb-3" />
        <h3 className="font-bold text-lg mb-2">Become a Vendor</h3>
        <p className="text-gray-500 mb-4">Sell more, reach more. Go digital with GoCart today!</p>
        <Link to="/vendor-auth" className="bg-green-600 text-white py-2 px-8 rounded-full font-bold hover:bg-green-700 transition">Join as Vendor</Link>
      </motion.div>
      {/* Consumer */}
      <motion.div
        whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(16,185,129,0.17)" }}
        className="bg-gradient-to-br from-emerald-100 to-green-100 p-8 rounded-2xl shadow-xl flex flex-col items-center w-80"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/3772/3772042.png" alt="Consumer" className="w-16 mb-3" />
        <h3 className="font-bold text-lg mb-2">Order as Customer</h3>
        <p className="text-gray-500 mb-4">Fresh groceries, doorstep delivery, pure convenience.</p>
        <Link to="/consumer-login" className="bg-white text-green-700 border-2 border-green-600 py-2 px-8 rounded-full font-bold hover:bg-green-50 transition">Login as Consumer</Link>
      </motion.div>
    </div>
  </section>
);

export default JoinGoCart;

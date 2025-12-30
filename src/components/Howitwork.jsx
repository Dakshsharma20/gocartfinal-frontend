// src/components/Howitwork.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaUserCheck, FaShoppingCart, FaTruckMoving } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserCheck className="text-emerald-500 text-2xl" />,
    title: "Sign Up / Login",
    desc: "Quick sign up for consumers and vendors both.",
  },
  {
    icon: <FaShoppingCart className="text-green-600 text-2xl" />,
    title: "Browse & Order",
    desc: "Choose from fresh local items and add to your cart.",
  },
  {
    icon: <FaTruckMoving className="text-blue-500 text-2xl" />,
    title: "Get Delivered",
    desc: "Vendor or transporter delivers it to your doorstep, fast!",
  },
];

const Howitwork = () => (
  <section className="bg-gradient-to-r from-emerald-50 to-green-100 py-20">
    <h2 className="text-3xl font-bold text-center text-emerald-700 mb-12">
      How It Works
    </h2>
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-4xl mx-auto">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.22, duration: 0.7 }}
          className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center w-64"
        >
          {step.icon}
          <h3 className="text-lg font-bold mt-4 mb-2">{step.title}</h3>
          <p className="text-gray-500">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Howitwork;

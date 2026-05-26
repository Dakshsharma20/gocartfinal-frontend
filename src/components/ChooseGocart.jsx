import React from "react";
import { motion } from "framer-motion";
import { FaTruck, FaShoppingBasket, FaMapMarkerAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaTruck className="text-white text-3xl" />,
    iconBg: "from-green-500 to-green-700",
    title: "Fast & Reliable Delivery",
    description: "Get fresh fruits, vegetables, and groceries delivered to your doorstep quickly.",
  },
  {
    icon: <FaShoppingBasket className="text-white text-3xl" />,
    iconBg: "from-blue-500 to-emerald-400",
    title: "Easy Vendor Onboarding",
    description: "Street vendors can list their items and start selling online in just a few steps.",
  },
  {
    icon: <FaMapMarkerAlt className="text-white text-3xl" />,
    iconBg: "from-red-500 to-orange-400",
    title: "Real-time Location Tracking",
    description: "Track vendors and transporters in real-time for a seamless experience.",
  },
];

const cardVariants = {
  offscreen: { opacity: 0, y: 50, scale: 0.92 },
  onscreen: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.25, duration: 0.7, delay: i * 0.13 }
  }),
};

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-white via-gray-50 to-white text-center relative z-10">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
      >
        Why Choose{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
          GoCart?
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-gray-600 max-w-2xl mx-auto mb-12 text-base md:text-lg"
      >
        We connect vendors, consumers, and transporters with a seamless digital experience — fast, easy, and efficient.
      </motion.p>

      {/* Features Grid */}
      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.6 }}
            whileHover={{ scale: 1.045, boxShadow: "0 4px 32px 0 rgba(34,197,94,0.12)" }}
            whileTap={{ scale: 0.97 }}
            className={`
              p-8 rounded-2xl shadow-xl border border-gray-100
              flex flex-col items-center text-center transition-all duration-300
              bg-white/80 backdrop-blur-xl hover:bg-white/100
              hover:shadow-emerald-200 relative
              `}
          >
            <div
              className={`
                mb-5 w-16 h-16 flex items-center justify-center rounded-full shadow-lg
                bg-gradient-to-br ${feature.iconBg} ring-2 ring-white/40 ring-offset-2 ring-offset-white
                mb-5 transition-all duration-200
              `}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
            {/* Decorative glow */}
            <div className={`absolute -z-1 -bottom-4 left-1/2 -translate-x-1/2 blur-lg rounded-full bg-gradient-to-r ${feature.iconBg} opacity-20 w-32 h-6`}></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;

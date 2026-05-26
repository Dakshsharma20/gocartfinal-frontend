import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, User, LogIn, Truck } from "lucide-react";

const HeroSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString();

  return (
    <section  className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-green-600 via-emerald-700 to-green-900 text-white px-6 overflow-hidden">
      {/* Current Time */}
      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow text-sm font-medium">
        🕒 {timeString}
      </div>

      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-xl"
      >
        Your GoCart Shopping Starts Here
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto drop-shadow-sm text-white/90"
      >
        Fast • Nearby • Direct — Browse vendors, place orders, and enjoy doorstep delivery.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5"
      >
        <CTAButton
          icon={<LogIn size={20} />}
          text="Vendor Login"
          color="bg-yellow-400"
          hover="hover:bg-yellow-500"
          link="/vendor-auth"
          textColor="text-black"
        />
        <CTAButton
          icon={<ShoppingBag size={20} />}
          text="Browse & Order"
          color="bg-white"
          hover="hover:bg-gray-200"
          link="/venders"
          textColor="text-green-700"
        />
        <CTAButton
          icon={<Truck size={20} />}
          text="Track Orders"
          color="bg-blue-500"
          hover="hover:bg-blue-600"
          link="/profile"
          textColor="text-white"
        />
        <CTAButton
          icon={<User size={20} />}
          text="Consumer Login"
          color="bg-purple-600"
          hover="hover:bg-purple-700"
          link="/consumer-login"
          textColor="text-white"
        />
      </motion.div>
    </section>
  );
};

const CTAButton = ({ icon, text, color, hover, link, textColor }) => (
  <Link
    to={link}
    className={`${color} ${textColor} ${hover} flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold shadow-md transition-all duration-200 transform hover:scale-105`}
  >
    {icon} {text}
  </Link>
);

export default HeroSection;

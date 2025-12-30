// src/components/Footer.jsx
import React from "react";

const Footer = () => (
  <footer className="bg-gradient-to-t from-emerald-100 via-green-50 to-white text-gray-700 py-8 text-center rounded-t-3xl">
    <div className="font-bold text-lg mb-2">GoCart &copy; {new Date().getFullYear()}</div>
    <div className="text-gray-500 mb-1">Empowering Local Businesses. All Rights Reserved.</div>
    <div className="flex gap-4 justify-center text-emerald-600 mt-2">
      {/* You can add social icons if needed */}
    </div>
  </footer>
);

export default Footer;

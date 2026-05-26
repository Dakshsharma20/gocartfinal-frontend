import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"

function Header2() {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur shadow-md py-3 px-4 md:px-7 flex justify-between items-center sticky top-0 z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src="/image.png"
          alt="GoCart Logo"
          className="w-10 h-10 rounded shadow-sm group-hover:scale-105 transition"
        />
        <span className="text-xl font-extrabold text-green-700 group-hover:text-green-800 transition">GoCart</span>
      </Link>
      {/* Profile Icon */}
      <button
        onClick={() => navigate("/profile")}
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 transition"
        aria-label="Profile"
      >
        <FaUserCircle className="text-gray-700 text-3xl hover:text-green-700 transition" />
      </button>
    </header>
  )
}

export default Header2;

import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"


function Header2() {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md p-3 flex justify-between items-center px-4 md:px-6">
    <Link to="/" className="flex items-center space-x-2">
      <img src="/image.png" alt="GoCart Logo" className="w-9 h-9" />
      <span className="text-lg font-bold text-green-700">GoCart</span>
    </Link>
    <FaUserCircle onClick={()=>navigate("/vendordashboard")}  className="text-gray-700 text-2xl hover:text-green-700" />
  </div>
  )
}

export default Header2
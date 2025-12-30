import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ConsumerOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const vendorId = JSON.parse(localStorage.getItem("vendor_id"));
    axios
      .get(`https://gocart-backend-bfil.onrender.com/products/${vendorId}`)
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.log(err));

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setCartCount(storedCart.length);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
  };

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    updateCart(updatedCart);
  };

  const handleRemoveOne = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  const getProductQuantity = (productId) => {
    const item = cart.find((p) => p._id === productId);
    return item ? item.quantity : 0;
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All" ? true : product.category === selectedCategory
    );

  const uniqueCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="bg-gradient-to-tr from-green-100 via-emerald-50 to-white min-h-screen">
      {/* Sticky Header */}
      <div className="bg-white/90 backdrop-blur-lg shadow-lg p-3 flex justify-between items-center px-4 md:px-8 fixed top-0 left-0 right-0 z-50 border-b border-emerald-50">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/image.png"
            alt="GoCart Logo"
            className="w-10 h-10 rounded-full shadow"
          />
          <span className="text-xl md:text-2xl font-extrabold text-green-700">GoCart</span>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-5">
          {/* Search */}
          <div className="relative w-32 sm:w-48 md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 pl-10 pr-3 py-2 rounded-xl focus:ring-2 focus:ring-green-400 outline-none w-full bg-white/80 placeholder:text-gray-500"
            />
            <IoSearch className="absolute left-3 top-3 text-emerald-400 text-lg" />
          </div>
          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
            title="Cart"
          >
            <FaShoppingCart className="text-emerald-600 text-2xl hover:text-green-700 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full shadow">
                {cartCount}
              </span>
            )}
          </div>
          {/* Profile */}
          <Link to="/profile">
            <FaUserCircle className="text-emerald-600 text-2xl hover:text-green-700 transition" title="My Profile" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 px-3 md:px-10 pb-10 max-w-7xl mx-auto">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between mb-7 gap-3">
          <h2 className="text-xl md:text-2xl font-extrabold text-emerald-700 tracking-wide">
            🛒 Products
          </h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded-lg text-emerald-700 bg-white font-semibold shadow"
          >
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center mt-16">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="No Products"
                className="w-20 mx-auto mb-3 opacity-70"
              />
              <p className="text-gray-500 font-semibold">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const quantity = getProductQuantity(product._id);
              return (
                <div
                  key={product._id}
                  className="bg-white/90 backdrop-blur-md border border-emerald-50 p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-2xl relative transform transition-all duration-300 hover:scale-105 group flex flex-col"
                >
                  {/* Discount badge */}
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow font-bold animate-pulse z-10">
                      {product.discount}% OFF
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 sm:h-36 md:h-44 object-cover rounded-xl mb-2 border"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold mt-1 text-gray-800 text-base md:text-lg truncate">{product.name}</h3>
                    <p className="text-gray-400 text-xs mb-1">{product.category}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-600 font-bold text-lg">
                        ₹{product.price}
                      </span>
                      {product.stock < 5 && (
                        <span className="ml-2 text-xs text-red-500 font-semibold animate-pulse">
                          Only {product.stock} left!
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">
                      In Stock: <span className="font-bold">{product.stock}</span>
                    </p>
                  </div>
                  {/* Add/Remove Button */}
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 mt-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      <FaShoppingCart /> ADD
                    </button>
                  ) : (
                    <div className="flex justify-between items-center mt-3 border rounded-xl overflow-hidden shadow-inner">
                      <button
                        onClick={() => handleRemoveOne(product._id)}
                        className="w-1/3 bg-gray-200 hover:bg-gray-300 py-1 font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="w-1/3 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-1/3 bg-green-600 text-white hover:bg-green-700 py-1 font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* Free Delivery Banner */}
        <div className="mt-7 mx-auto bg-blue-500/90 px-4 py-3 text-center text-white rounded-xl font-bold shadow-xl max-w-2xl">
          🚚 Get <span className="text-yellow-300">FREE delivery</span> on your order above ₹199!
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-8 bg-gray-900 text-gray-300 p-4 md:p-6 text-center text-xs md:text-sm rounded-t-2xl">
        <p>© 2025 GoCart. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ConsumerOrderPage;

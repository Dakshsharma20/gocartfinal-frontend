import React, { useEffect, useState } from "react";
import { FaTrash, FaArrowLeft, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consumerId = localStorage.getItem("consumer_id");
    if (!consumerId) {
      navigate("/consumer-login");
      return;
    }
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    const consumerProfile = JSON.parse(localStorage.getItem("consumer_profile"));
    if (consumerProfile?.address) {
      setAddress(consumerProfile.address);
    }
  }, [navigate]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateCart(updatedCart);
  };

  const itemTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const gst = itemTotal * 0.08;
  const deliveryCharge = itemTotal > 199 ? 0 : 23;
  const totalPrice = itemTotal + gst + deliveryCharge;

  const handleCheckout = async () => {
    const consumerId = JSON.parse(localStorage.getItem("consumer_id"));
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    const vendorId = cartItems[0].vendorId;

    const orderData = {
      consumerId,
      vendorId,
      address,
      status: "pending",
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      totalPrice,
    };

    try {
      setLoading(true);
      await axios.post("https://gocart-backend-bfil.onrender.com/orders", orderData);
      localStorage.removeItem("cart");
      setCart([]);
      setOrderSuccess(true);
    } catch (error) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Location
  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                format: "jsonv2",
                lat: latitude,
                lon: longitude,
              },
            }
          );
          const fullAddress = response.data.display_name;
          if (fullAddress) {
            setAddress(fullAddress);
          } else {
            alert("Unable to fetch address from location.");
          }
        } catch {
          alert("Failed to retrieve address from coordinates.");
        }
      },
      () => {
        alert("Failed to get current location.");
      }
    );
  };

  return (
    <div className="bg-gradient-to-b from-green-100 via-emerald-50 to-white min-h-screen p-4 md:p-10">
      <header className="flex flex-col items-center mb-8">
        <span className="text-4xl font-extrabold text-emerald-700 tracking-tight mb-2">GoCart 🛒</span>
        <span className="text-lg text-emerald-500 font-semibold">Fast. Fresh. Nearby.</span>
      </header>

      <Link
        to="/cusord"
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-6 font-semibold rounded-full bg-white/80 px-4 py-2 shadow transition"
      >
        <FaArrowLeft /> Continue Shopping
      </Link>

      {orderSuccess ? (
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 text-center max-w-lg mx-auto animate-fade-in-up backdrop-blur-md border border-emerald-100">
          <FaCheckCircle className="text-5xl text-emerald-600 mb-3 mx-auto animate-bounce" />
          <h2 className="text-3xl font-extrabold text-emerald-700 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-700 mb-1">Delivery at:</p>
          <p className="text-gray-800 font-semibold">{address}</p>
          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-1">Estimated Delivery:</p>
            <p className="text-xl font-bold text-green-500">⏰ 15 Minutes</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-8 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-md transition"
          >
            🔙 Back to Home
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-5 ml-2">🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <div className="text-center mt-20">
              <img
                src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                alt="Empty cart"
                className="w-32 mx-auto mb-6 opacity-70"
              />
              <p className="text-gray-500 text-lg">Oops, your cart is empty!</p>
              <Link
                to="/cusord"
                className="inline-block mt-6 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-md transition"
              >
                🛒 Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Cart Items */}
              <div className="flex-1">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-6 border border-emerald-50">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-center justify-between gap-5 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shadow"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <p className="text-emerald-600 font-semibold">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-emerald-100 rounded-l font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-white border">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-emerald-100 rounded-r font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 transition ml-2"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Address & Bill */}
              <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-emerald-50 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-emerald-500" /> Delivery Address
                    </h3>
                    <textarea
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-emerald-500"
                      placeholder="Enter delivery address..."
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <button
                      onClick={fetchCurrentLocation}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      📍 Use my current location
                    </button>
                  </div>
                  <div className="space-y-2 text-gray-700 font-semibold border-t pt-4">
                    <p>Item Total: <span className="float-right">₹{itemTotal.toFixed(2)}</span></p>
                    <p>GST (8%): <span className="float-right">₹{gst.toFixed(2)}</span></p>
                    <p>
                      Delivery:{" "}
                      <span className="float-right">
                        {deliveryCharge === 0 ? (
                          <span className="text-green-600 font-bold">FREE</span>
                        ) : (
                          `₹${deliveryCharge.toFixed(2)}`
                        )}
                      </span>
                    </p>
                    <hr />
                    <p className="text-xl font-bold text-gray-900">
                      Grand Total: <span className="float-right text-emerald-700">₹{totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`w-full py-3 rounded-full text-white font-bold shadow-md transition text-lg ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {loading ? "Placing Order..." : "✅ Confirm & Pay"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;

// src/components/Reviews.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Rohit Kumar",
    city: "Kanpur",
    text: "GoCart ne hamare street vendor ko online la diya! Ab sab easy hai.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/31.jpg"
  },
  {
    name: "Sunita Sharma",
    city: "Lucknow",
    text: "Ghar baithe fresh sabzi mil rahi hai, timing bhi best.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/36.jpg"
  },
  {
    name: "Sanjay Verma",
    city: "Delhi",
    text: "Meri theli ki sale GoCart ke baad double ho gayi!",
    rating: 4,
    img: "https://randomuser.me/api/portraits/men/76.jpg"
  },
];

const Reviews = () => (
  <section className="py-20 px-4 bg-emerald-50">
    <h2 className="text-3xl font-bold text-center text-emerald-700 mb-12">
      What People Say
    </h2>
    <div className="flex flex-wrap gap-8 justify-center">
      {reviews.map((review, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.06, boxShadow: "0 6px 32px 0 rgba(16,185,129,0.13)" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.17 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-xs w-full text-center"
        >
          <img
            src={review.img}
            alt={review.name}
            className="mx-auto rounded-full w-16 h-16 object-cover mb-4 border-4 border-emerald-200"
          />
          <div className="flex justify-center gap-1 mb-2">
            {Array(review.rating).fill().map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600 font-medium mb-3">"{review.text}"</p>
          <div className="text-sm text-emerald-700 font-bold">{review.name}</div>
          <div className="text-xs text-gray-400">{review.city}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Reviews;

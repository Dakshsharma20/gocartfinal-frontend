import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "GoCart kya hai?",
    answer: "GoCart ek digital platform hai jo street vendors, transporters aur consumers ko connect karta hai.",
  },
  {
    question: "Kaise register karein?",
    answer: "Aap 'Sign Up' page par jaakar apni category select karke easily register kar sakte hain.",
  },
  {
    question: "Delivery ka time kitna hota hai?",
    answer: "Vendors aur transporters ka depend karta hai. Generally, local delivery 30-60 minutes me ho sakti hai.",
  },
  {
    question: "Payment kaise kar sakte hain?",
    answer: "Aap cash, UPI, ya digital wallets ka use kar ke payment kar sakte hain.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 md:px-16 relative overflow-hidden">
      {/* Animated Gradient BG */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(34,197,94,0.14) 45%, #fff 100%)",
          filter: "blur(0px)",
        }}
      />
      {/* Glassy bubble accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-200/30 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-16 right-0 w-52 h-52 bg-emerald-300/30 rounded-full blur-2xl z-0" />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Aapke common sawalon ke jawab yahan hain!
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-emerald-100 transition-all duration-200"
            >
              <button
                className="w-full text-left p-5 flex justify-between items-center font-semibold text-lg text-gray-900 hover:text-green-700 transition"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? (
                  <FaMinus className="text-green-700" />
                ) : (
                  <FaPlus className="text-green-700" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-5 border-t bg-white/80 text-gray-700 animate-fade-in-down">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

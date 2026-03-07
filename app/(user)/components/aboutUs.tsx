import Heading from "@/app/commonComponents/heading";
import { brandName } from "@/app/contants";
import React from "react";
import StaticPageRenderer from "./staticPageRenderer";

const AboutUs = () => {
  return (
    <section className="relative py-20 px-6 lg:px-20 overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10"></div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 opacity-20 rounded-full blur-3xl"></div>

      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          About <span className="text-green-700">{brandName}</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Premium quality makhana sourced directly from the farms of Bihar.
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        
        {/* Left Content */}
        <div className="space-y-6">
          
          {/* Badge */}
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-green-700 font-semibold text-lg shadow-sm">
            Healthy • Natural • Nutritious
          </div>

          <h3 className="text-3xl font-bold text-gray-900 leading-snug">
            Bringing the goodness of Makhana to your everyday lifestyle.
          </h3>

          <p className="text-gray-700 text-lg leading-relaxed">
            At <span className="font-semibold text-black">{brandName}</span>, we believe snacking should be both delicious and healthy. Our journey started with a simple idea - To transform the traditional goodness of makhana into a modern, healthy and flavourful snack that everyone can enjoy without worrying about health.
            </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Makhana, which is also known as fox nuts or lotus seeds, has been a part of indian diet for centuries, naturally light, healthy and crunchy, and rich in nutrients , it is considered a healthy alternative to many conventional snacks.
            We carefully source premium-quality makhana and roast it to perfection, combining it with unique and exciting flavors. Our focus is to deliver snacks that are tasty, wholesome, and perfect for guilt-free munching anytime.
            At MunchGud, we are committed to quality, taste, and healthier snacking for everyone.
          </p>

          {/* Button */}
          <button className="mt-4 px-6 py-3 bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition">
            Explore Our products
          </button>
        </div>

        {/* Right Image Section */}
        <div className="relative">
          
          <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
            <img
              src="peri_peri.png"   // replace with your image
              alt="peri_peri makhana"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
            <p className="text-sm font-semibold text-gray-900">500K+ Happy buyers</p>
            <p className="text-xs text-gray-500">Worldwide Customers</p>
          </div>

        </div>
      </div>
    </section>

  );
};

export default AboutUs;

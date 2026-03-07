"use client";

import Image from "next/image";
import Link from "next/link";
import cream_onion from "/public/cream_onion.png";
import peri_peri from "/public/peri_peri.png";

export default function ChooseMakhanaSection() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-[#f3e7d7] via-[#e9ecef] to-[#dfe6e9]">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose your flavour
          </h2>

          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>

          <p className="text-gray-600 mt-6 text-lg">
            Wholesome snacking, roasted in olive oil
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* Peri Peri Makhana Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-2 md:p-10 shadow-lg hover:shadow-2xl transition duration-300 text-center">

            <div className="w-full h-[300px] relative rounded-xl overflow-hidden">
                <Image
                    src={peri_peri}
                    alt="Peri Peri Makhana"
                    fill
                    className="object-cover"
                />
            </div>

            <h3 className="text-2xl font-semibold my-4">
              Roasted Peri Peri Makhana
            </h3>

            <p className="text-gray-600 mb-8">
              A crunchy, healthy snack made from premium fox nuts, roasted to perfection and tossed in bold peri peri spices for a spicy, tangy flavor. Perfect for guilt-free snacking anytime. 🌶️✨
            </p>

            <Link href="/products?category=3">
              <button className="px-4 py-1 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition duration-300">
                Shop Roasted Peri Peri Makhana
              </button>
            </Link>
          </div>


          {/* Raw Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-2 md:p-10  shadow-lg hover:shadow-2xl transition duration-300 text-center">

            <div className="w-full h-[300px] relative rounded-xl overflow-hidden">
                <Image
                    src={cream_onion}
                    alt="Cream & Onion Roasted Makhana"
                    fill
                    className="object-cover"
                />
            </div>

            <h3 className="text-2xl font-semibold my-4">
              Cream & Onion Roasted Makhana
            </h3>

            <p className="text-gray-600 mb-8">
              Lightly roasted premium fox nuts coated with a rich cream and onion seasoning for a smooth, savory flavor and irresistible crunch. A delicious and healthy snack for anytime munching. 🧅✨
            </p>

            <Link href="/products?category=2">
              <button className="px-4 py-1 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition duration-300">
                Shop Cream & Onion Roasted Makhana
              </button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
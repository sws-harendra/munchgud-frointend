"use client";

import Image from "next/image";
import Link from "next/link";
import cream_onion from "/public/cream_onion.png";
import peri_peri from "/public/peri_peri.png";

export default function ChooseMakhanaSection() {
  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-r from-[#f3e7d7] via-[#e9ecef] to-[#dfe6e9] rounded-3xl overflow-hidden shadow-sm">

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Choose your flavour
          </h2>

          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>

          <p className="text-gray-600 mt-4 md:mt-6 text-base md:text-lg">
            Wholesome snacking, roasted in olive oil
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          {/* Peri Peri Makhana Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 text-center flex flex-col justify-between">

            <div>
              <div className="w-full h-[200px] sm:h-[260px] md:h-[300px] relative rounded-2xl overflow-hidden shadow-md">
                  <Image
                      src={peri_peri}
                      alt="Peri Peri Makhana"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                  />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-800 my-4 md:my-6">
                Roasted Peri Peri Makhana
              </h3>

              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
                A crunchy, healthy snack made from premium fox nuts, roasted to perfection and tossed in bold peri peri spices for a spicy, tangy flavor. Perfect for guilt-free snacking anytime. 🌶️✨
              </p>
            </div>

            <div className="mt-auto">
              <Link href="/products">
                <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition duration-300 text-sm md:text-base">
                  Shop Roasted Peri Peri Makhana
                </button>
              </Link>
            </div>
          </div>


          {/* Cream & Onion Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 text-center flex flex-col justify-between">

            <div>
              <div className="w-full h-[200px] sm:h-[260px] md:h-[300px] relative rounded-2xl overflow-hidden shadow-md">
                  <Image
                      src={cream_onion}
                      alt="Cream & Onion Roasted Makhana"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                  />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-800 my-4 md:my-6">
                Cream & Onion Roasted Makhana
              </h3>

              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
                Lightly roasted premium fox nuts coated with a rich cream and onion seasoning for a smooth, savory flavor and irresistible crunch. A delicious and healthy snack for anytime munching. 🧅✨
              </p>
            </div>

            <div className="mt-auto">
              <Link href="/products">
                <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition duration-300 text-sm md:text-base">
                  Shop Cream & Onion Roasted Makhana
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
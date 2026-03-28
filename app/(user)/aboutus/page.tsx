"use client";
import { brandName } from "@/app/contants";

export default function Page() {
  return (
    <>


      {/* Hero Section */}
      {/* <section className="bg-[url('/peri_peri.png')] bg-cover bg-center text-black  shadow-2xl  py-20 ">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl p-2  text-white text-shadow-lg text-shadow-black/80 w-max mx-auto font-bold">
            About {brandName}
          </h1>
          <p className="mt-6 text-xl   text-white text-shadow-lg text-shadow-black/80 max-w-2xl mx-auto font-semibold">
            MunchGud offers premium makhana roasted to perfection and infused with delicious flavors, delivering a crunchy, healthy, and guilt-free snacking experience.
          </p>
        </div>
      </section> */}

      <section className="relative bg-[url('/peri_peri.png')] bg-cover bg-center py-24">
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative flex justify-center items-center">
          <div className="bg-white/5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.7px] border border-white/70 px-10 py-10 text-center max-w-2xl">

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              About {brandName}
            </h1>

            <p className="mt-6 text-lg text-gray-200 font-semibold text-shadow-lg text-shadow-black/40">
              MunchGud™ offers premium makhana roasted to perfection and infused with
              delicious flavors, delivering a crunchy, healthy, and guilt-free snacking experience.
            </p>

          </div>
        </div>
      </section>







      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Who We Are
            </h2>
            <p className="mt-4 text-gray-600">
              {brandName}, we believe snacking should be both delicious and healthy. Our journey started with a simple idea - To transform the traditional goodness of makhana into a modern, healthy and flavourful snack that everyone can enjoy without worrying about health.
            </p>

            <p className="mt-4 text-gray-600">
              Makhana, which is also known as fox nuts or lotus seeds, has been a part of indian diet for centuries, naturally light, healthy and crunchy, and rich in nutrients , it is considered a healthy alternative to many conventional snacks.
              We carefully source premium-quality makhana and roast it to perfection, combining it with unique and exciting flavors. Our focus is to deliver snacks that are tasty, wholesome, and perfect for guilt-free munching anytime.
              At MunchGud, we are committed to quality, taste, and healthier snacking for everyone.
            </p>
          </div>

          <div className="bg-green-100 p-10 rounded-xl">
            <h3 className="text-2xl font-semibold text-green-700">
              Our Mission
            </h3>
            <p className="mt-3 text-gray-700">
              To create delicious and healthy roasted makhana snacks using premium ingredients and exciting flavors, making everyday snacking both enjoyable and nutritious.
            </p>

            <h3 className="text-2xl font-semibold text-green-700 mt-6">
              Our Vision
            </h3>
            <p className="mt-3 text-gray-700">
              To become a trusted and loved brand for roasted makhana, offering flavorful, high-quality snacks that promote healthier snacking choices.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose {brandName}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">

            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700">
                Premium Makhana
              </h3>
              <p className="text-gray-600 mt-3">
                We use carefully selected, high-quality makhana to ensure the best taste and crunch in every bite.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700">
                Delicious Flavours
              </h3>
              <p className="text-gray-600 mt-3">
                From classic to bold seasonings, our makhana is roasted and flavored to deliver a unique and satisfying snack experience.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700">
                Healthy Snacking
              </h3>
              <p className="text-gray-600 mt-3">
                Light, nutritious, and roasted to perfection, our makhana offers a guilt-free alternative to fried snacks.
              </p>
            </div>

          </div>
        </div>
      </section>


    </>
  );
}
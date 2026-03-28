"use client";

import { brandName } from "@/app/contants";
import { Mail, Phone, MapPin, Truck, RefreshCcw, ShieldCheck } from "lucide-react";

export default function Page() {
  return (
    <>


      {/* Hero */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Contact {brandName}</h1>
          <p className="mt-4 text-lg">
            We are here to help you with orders, delivery, and product queries.
          </p>
        </div>
      </section>

      {/* Ecommerce Support Highlights */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <Truck className="text-green-700 mb-3" size={32} />
            <h3 className="font-semibold text-lg">Delivery Support</h3>
            <p className="text-gray-600 text-sm mt-2">
              Questions about shipping, delivery tracking, or service areas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <RefreshCcw className="text-green-700 mb-3" size={32} />
            <h3 className="font-semibold text-lg">Returns & Refunds</h3>
            <p className="text-gray-600 text-sm mt-2">
              Need help with product returns or refund requests.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <ShieldCheck className="text-green-700 mb-3" size={32} />
            <h3 className="font-semibold text-lg">Secure Orders</h3>
            <p className="text-gray-600 text-sm mt-2">
              We ensure safe payment and secure shopping experience.
            </p>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Customer Support
            </h2>

            <p className="mt-4 text-gray-600">
              Our customer support team is available to help you with any
              questions about orders, delivery, products, or returns.
            </p>

            <div className="mt-8 space-y-6">

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="text-green-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">munchgud@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="text-green-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">+91 84462 74791</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="text-green-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600">
                    Kate wasti , Punawale, Pimpri-Chinchwad ,Pune ,411033
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <h3 className="text-2xl font-semibold text-gray-800">
              Send us a Message
            </h3>

            <form className="mt-6 space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <input
                type="text"
                placeholder="Order ID (Optional)"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <textarea
                rows={4}
                placeholder="Write your message..."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
              >
                Submit Request
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* FAQ Section (Ecommerce style) */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-4 text-left">

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="font-semibold">How long does delivery take?</p>
              <p className="text-gray-600 text-sm mt-2">
                Orders are typically delivered within 2-5 business days
                depending on your location.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="font-semibold">Can I return a product?</p>
              <p className="text-gray-600 text-sm mt-2">
                Due to the perishable nature of food products, MunchGud does not accept returns once the product has been delivered.However, we want you to have the best experience, so we will assist you in case of any issues.

                Damaged or Incorrect Products
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="font-semibold">How can I track my order?</p>
              <p className="text-gray-600 text-sm mt-2">
                After placing an order you will receive tracking details via
                email or SMS.
              </p>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
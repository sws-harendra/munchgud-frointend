"use client";

import React, { useState, useEffect } from "react";
import { brandName } from "@/app/contants";
import { useAppSelector } from "@/app/lib/store/store";
import { contactService } from "@/app/sercices/user/contact.service";
import {
  Mail,
  Phone,
  MapPin,
  Truck,
  RefreshCcw,
  ShieldCheck,
  Send,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.fullname || "",
        email: prev.email || user.email || "",
        phone: prev.phone || (user.phoneNumber ? String(user.phoneNumber) : ""),
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please write your message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.sendContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        orderId: formData.orderId.trim() || undefined,
        message: formData.message.trim(),
        source: "contact_form",
      });

      toast.success("Thank you! Your message has been sent to our customer support team.");
      setIsSuccess(true);
      setFormData({
        name: user?.fullname || "",
        email: user?.email || "",
        phone: user?.phoneNumber ? String(user.phoneNumber) : "",
        orderId: "",
        message: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <div className="bg-amber-100 p-3 rounded-full">
                  <Mail className="text-amber-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">support@flazo.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Phone className="text-amber-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">+91 84462 74791</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <MapPin className="text-amber-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600">
                    Kate wasti, Punawale, Pimpri-Chinchwad, Pune-411033
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

            {isSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Thank you! Your message has been received. Our team will contact you shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm"
                />

                <input
                  type="text"
                  placeholder="Order ID (Optional)"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Write your message... *"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2 cursor-pointer font-semibold disabled:opacity-50 shadow-md shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Request"}</span>
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
                Orders are typically delivered within 2-4 business days with Express Air shipping across India.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="font-semibold">Can I return or replace a product?</p>
              <p className="text-gray-600 text-sm mt-2">
                Yes! We offer a 7-day doorstep replacement guarantee for any manufacturing defects or audio issues. In addition, all Flazo earbuds come with an official 1-Year Comprehensive Warranty.
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
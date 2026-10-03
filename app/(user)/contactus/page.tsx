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
      {/* Luxury Obsidian & Gold Hero */}
      <section className="relative bg-neutral-950 text-white py-16 sm:py-20 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.2),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <span>Customer Experience &amp; Care</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Contact <span className="gold-gradient-text">{brandName}</span>
          </h1>
          
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            We are here to help you with orders, delivery tracking, acoustic recommendations, and warranty queries.
          </p>
        </div>
      </section>

      {/* Support Highlights */}
      <section className="py-12 bg-neutral-50/70 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 shadow-2xs">
              <Truck size={26} />
            </div>
            <h3 className="font-bold text-neutral-900 text-lg">Delivery Support</h3>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              Questions about shipping, delivery tracking, or service areas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 shadow-2xs">
              <RefreshCcw size={26} />
            </div>
            <h3 className="font-bold text-neutral-900 text-lg">Returns &amp; Refunds</h3>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              Need help with product returns, replacements, or refund requests.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 shadow-2xs">
              <ShieldCheck size={26} />
            </div>
            <h3 className="font-bold text-neutral-900 text-lg">Secure Orders</h3>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              We ensure safe payment and 100% verified shopping experience.
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
                  <p className="text-gray-600">care@flazo.in</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Phone className="text-amber-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">+91 9199859862</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <MapPin className="text-amber-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600">
                    A-116, URBTECH TRADE CENTER, SECTOR-132,

NOIDA, GAUTAM BUDDHA NAGAR,

UTTAR PRADESH, 201304
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
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white text-sm transition-all"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white text-sm transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white text-sm transition-all"
                />

                <input
                  type="text"
                  placeholder="Order ID (Optional)"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white text-sm transition-all"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Write your message... *"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white text-sm transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-neutral-950 font-black py-3.5 rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
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
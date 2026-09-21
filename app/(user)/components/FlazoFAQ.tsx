"use client";
import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "Warranty & Swap",
    question: "How does the 1-Year Doorstep Replacement Warranty work?",
    answer:
      "Unlike ordinary audio brands that force you into crowded third-party service centers, Flazo offers Doorstep Express Swap. If you experience any manufacturing defect or audio failure within 365 days, simply raise a ticket via WhatsApp or support@flazo.com. Our express courier partner arrives directly at your doorstep with a brand-new sealed box in exchange for the defective unit within 48 to 72 hours.",
  },
  {
    id: 2,
    category: "Acoustics & Drivers",
    question: "How is the 13mm BoomBass™ driver different from standard 10mm earbuds?",
    answer:
      "Standard wireless earbuds use cheap 9mm or 10mm plastic diaphragms that compress and distort when heavy sub-bass drops hit. Flazo engineers use customized 13mm & 13.4mm aerospace-grade titanium diaphragms. Titanium provides exceptional stiffness-to-mass ratio, moving 40% more acoustic air volume. The result is visceral, chest-thumping sub-bass (20Hz - 100Hz) with zero mud and pristine vocal clarity.",
  },
  {
    id: 3,
    category: "Compatibility",
    question: "Are Flazo earbuds compatible with Apple iPhone, Android, and Laptops?",
    answer:
      "Yes, 100%. Equipped with Bluetooth 5.3 architecture and high-definition AAC, SBC, and LDAC audio codecs, Flazo earbuds instantly pair with iPhones, iPads, Android smartphones (Samsung, OnePlus, Xiaomi, Vivo), MacBooks, and Windows PCs. Dual-Device Instant Pairing allows you to seamlessly switch between your work laptop and phone calls without reconnecting.",
  },
  {
    id: 4,
    category: "Durability & Sports",
    question: "Can I wear Flazo earbuds during intense gym sessions or heavy rain?",
    answer:
      "Absolutely. Flazo earbuds feature IPX7 and IPX5 certified nano-coating seals that safeguard internal circuit boards against corrosive sweat salts, water immersion, heavy monsoon downpours, and gym chalk dust. The ergonomic 45° angled acoustic nozzle ensures the earbuds stay securely locked in your ears even during sprinting or HIIT workouts.",
  },
  {
    id: 5,
    category: "Payments & Delivery",
    question: "Can I pay Cash on Delivery (COD)? What is the delivery timeframe?",
    answer:
      "Yes, Free Cash on Delivery (COD) is available across 19,000+ pin codes in India. All orders placed before 2:00 PM IST are dispatched on the same day via premium air couriers (BlueDart, Delhivery, Xpressbees). Metro deliveries typically arrive within 24 to 48 hours, packed inside tamper-evident armored luxury boxes with genuine GST invoices.",
  },
  {
    id: 6,
    category: "Return Policy",
    question: "What is the 7-Day Hassle-Free Swap & Return Policy?",
    answer:
      "We want you to fall in love with Flazo sound. If for any reason the acoustic fit, sound signature, or comfort does not meet your expectations, you can request an instant replacement or swap within 7 days of package delivery. No questions asked.",
  },
];

export default function FlazoFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-amber-100/80">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Buyer Assurance & FAQs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight">
            FREQUENTLY ASKED <span className="gold-gradient-text">QUESTIONS</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about Flazo 13mm acoustic engineering, doorstep warranty, and delivery assurance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-amber-50/30 border-amber-300 shadow-md"
                    : "bg-white border-neutral-200/80 hover:border-amber-300 hover:shadow-xs"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-neutral-950 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-amber-400 text-neutral-950 rotate-180 shadow-xs"
                        : "bg-white text-neutral-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-amber-200/50 animate-in fade-in slide-in-from-top-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Support Help Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border border-amber-300/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 card-lift">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-black text-neutral-950">
              Still have questions about audio fit or specs?
            </h4>
            <p className="text-xs text-neutral-600">
              Speak directly with a Flazo Sound Specialist in Mumbai • Mon–Sat (10:00 AM – 8:00 PM IST)
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919999999999?text=Hi%20Flazo%20Support%2C%20I%20have%20a%20question%20regarding%20earbuds"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href="tel:18003529646"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-amber-500 text-neutral-900 font-bold text-xs shadow-2xs hover:bg-amber-50 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>1800-FLAZO-IN</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

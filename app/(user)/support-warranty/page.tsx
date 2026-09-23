"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Headphones,
  Clock,
  Users,
  Shield,
  Search,
  Settings,
  Package,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Play,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle2,
  FileText,
  Star,
} from "lucide-react";
import { toast } from "sonner";

export default function SupportWarrantyPage() {
  // Search query for the "How can we help you today?" cards
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states for interactive actions
  const [activeModal, setActiveModal] = useState<
    "video" | "check-warranty" | "register" | "chat" | "guides" | "terms" | null
  >(null);

  // Warranty Check State
  const [warrantyInput, setWarrantyInput] = useState("");
  const [warrantyResult, setWarrantyResult] = useState<any>(null);

  // Product Registration State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    model: "Flazo Nirvana Gold Pro X",
    serial: "",
    source: "Official Flazo Store",
  });
  const [isRegistered, setIsRegistered] = useState(false);

  // Chat message simulation state
  const [chatMessages, setChatMessages] = useState<
    { sender: "bot" | "user"; text: string; time: string }[]
  >([
    {
      sender: "bot",
      text: "Namaste! Welcome to Flazo Priority Concierge. How may we assist your sound journey today?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // 5 Help Topic Cards
  const helpTopics = [
    {
      id: "setup",
      title: "Set Up & Use",
      desc: "Get step-by-step guides to set up and use your Flazo product.",
      linkText: "View Guides",
      action: () => setActiveModal("guides"),
      icon: Headphones,
    },
    {
      id: "troubleshoot",
      title: "Troubleshooting",
      desc: "Facing an issue? Find quick solutions to common problems.",
      linkText: "Get Help",
      action: () => setActiveModal("guides"),
      icon: Settings,
    },
    {
      id: "claim",
      title: "Warranty Claim",
      desc: "Register your product or raise a warranty request easily.",
      linkText: "Start Claim",
      action: () => setActiveModal("register"),
      icon: Shield,
    },
    {
      id: "care",
      title: "Product Care",
      desc: "Tips to keep your Flazo product in the best condition.",
      linkText: "Care Tips",
      action: () => {
        toast.info("Store earbuds in dry case, clean ear tips with micro-fiber cloth weekly.");
      },
      icon: Package,
    },
    {
      id: "contact",
      title: "Contact Support",
      desc: "Still need help? Our team is just a message away.",
      linkText: "Contact Us",
      action: () => setActiveModal("chat"),
      icon: MessageSquare,
    },
  ];

  const filteredTopics = helpTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warrantyInput.trim()) {
      toast.error("Please enter a valid Serial Number or Order ID.");
      return;
    }
    setWarrantyResult({
      model: "Flazo Nirvana Gold Pro X (Champagne Gold)",
      status: "Active • 1-Year Doorstep Warranty",
      expiresOn: "September 21, 2027",
      coverage: "100% Hardware Defects, Driver Issues, Charging Case",
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone || !regForm.serial) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    setIsRegistered(true);
    toast.success("1-Year Doorstep Swap Warranty registered successfully!");
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: "Just now" },
    ]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Thank you for reaching out regarding "${userMsg}". A dedicated Flazo acoustic concierge has logged your request under ticket #FLZ-${Math.floor(1000 + Math.random() * 9000)}.`,
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 pb-20 selection:bg-[#B8860B] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5ECDC] border border-[#E8D7BF] text-[#8C6016] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#9E6B20]" />
              SUPPORT & WARRANTY
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#1A1A1A] leading-[1.12]">
              We&apos;re Here <br />
              For Your{" "}
              <span className="font-serif italic text-[#C28C1A] bg-gradient-to-r from-[#B8860B] via-[#C99726] to-[#A07014] bg-clip-text text-transparent">
                Sound Journey
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed">
              From setup to troubleshooting, warranty claims to product care — Flazo Support ensures a seamless experience, always.
            </p>

            {/* 4 Feature Pills in a Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F3E7D3] border border-[#E5D2B5] flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-[#8C5E18]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1C] leading-tight">Expert Support</h4>
                  <p className="text-[11px] text-neutral-500">Direct from Flazo</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F3E7D3] border border-[#E5D2B5] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#8C5E18]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1C] leading-tight">Quick Resolution</h4>
                  <p className="text-[11px] text-neutral-500">Most solved in 24 hrs</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F3E7D3] border border-[#E5D2B5] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-[#8C5E18]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1C] leading-tight">1+ Lakh Happy Users</h4>
                  <p className="text-[11px] text-neutral-500">Across India</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F3E7D3] border border-[#E5D2B5] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#8C5E18]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1C] leading-tight">Secure & Hassle-Free</h4>
                  <p className="text-[11px] text-neutral-500">Warranty Process</p>
                </div>
              </div>
            </div>

            {/* 2 CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#help-topics"
                className="px-7 py-3 rounded-full bg-[#9E6B20] hover:bg-[#8A5B17] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-2 group hover:translate-x-0.5"
              >
                <span>Get Support Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={() => setActiveModal("video")}
                className="px-6 py-3 rounded-full bg-white hover:bg-[#F7F2E9] border border-[#D9C4A4] text-[#2A241C] font-bold text-xs transition-all flex items-center gap-2 group"
              >
                <div className="w-5 h-5 rounded-full bg-[#9E6B20] text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Support Video</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Golden Earbuds Visual Stage (Stable & Seamless, No Card Box) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] flex items-center justify-center">
              <Image
                src="/images/support_hero_earbud_seamless.png"
                alt="Flazo Acoustic Sound Stage"
                width={520}
                height={460}
                priority
                className="object-contain w-full h-auto select-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. HOW CAN WE HELP YOU TODAY? SECTION
         ───────────────────────────────────────────────────────────── */}
      <section id="help-topics" className="py-12 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        
        {/* Header with Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              How can we help you today?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Choose a topic to get started. Find quick answers, guides, or connect with our support team.
            </p>
          </div>

          {/* Search Box on Right */}
          <div className="w-full md:w-auto min-w-[320px] lg:min-w-[480px]">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help (e.g. pairing, charging, warranty, claim)"
                className="w-full pl-11 pr-28 py-3 bg-white border border-[#E2D4BF] rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#9E6B20] focus:ring-1 focus:ring-[#9E6B20] shadow-xs"
              />
              <button
                type="button"
                className="absolute right-1.5 px-5 py-2 bg-[#9E6B20] hover:bg-[#8A5B17] text-white font-bold text-xs rounded-full transition shadow-xs"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* 5 Topic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <div
                key={topic.id}
                onClick={topic.action}
                className="bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center mb-4 group-hover:bg-[#9E6B20] group-hover:text-white transition-colors duration-300 text-[#9E6B20]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-serif font-black text-[#1A1A1A] mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#8C6016] group-hover:text-[#A67324]">
                  <span className="flex items-center gap-1.5">
                    {topic.linkText}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="flex items-center text-neutral-300">
                    <span className="text-xs">|</span>
                    <ChevronRight className="w-4 h-4 ml-1 text-neutral-400 group-hover:text-[#8C6016]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WARRANTY SECTION (Split Card)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Wide Card: 1 Year Limited Warranty */}
          <div className="lg:col-span-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] rounded-3xl p-7 sm:p-9 border border-[#E6D7BE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Left Shield Emblem Image */}
            <div className="w-36 sm:w-44 shrink-0 flex items-center justify-center">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 animate-float-slow">
                <Image
                  src="/images/gold_warranty_shield.jpg"
                  alt="1 Year Warranty Shield Emblem"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain drop-shadow-md rounded-2xl"
                />
              </div>
            </div>

            {/* Middle Content */}
            <div className="flex-1 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8C6016]">
                WORRY-FREE LISTENING
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">
                1 Year Limited Warranty
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md">
                Your Flazo product is covered against manufacturing defects for 1 year from the date of purchase.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("check-warranty")}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF3E5] border border-[#D9C4A4] text-[#8C5E18] text-xs font-bold transition-all shadow-xs flex items-center gap-2 group"
                >
                  <span>Check Warranty Status</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModal("terms")}
                    className="text-[11px] text-[#8C5E18] hover:underline underline-offset-2 font-medium"
                  >
                    Warranty Terms & Conditions
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 Bullet Checklist */}
            <div className="w-full md:w-auto shrink-0 space-y-3 border-t md:border-t-0 md:border-l border-[#E6D7BE] pt-4 md:pt-0 md:pl-6 text-xs text-[#2A241C]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Manufacturing Defects Covered</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Hassle-Free Claim Process</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Pan-India Service Support</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Genuine Replacement or Repair</span>
              </div>
            </div>

          </div>

          {/* Right Card: Register Your Product */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] rounded-3xl p-7 sm:p-9 border border-[#E6D7BE] shadow-xs flex flex-col justify-between">
            <div>
              {/* QR Code & Document Icon Graphic */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 bg-white p-2 rounded-xl border border-[#E0D0B6] shadow-xs flex items-center justify-center">
                  {/* Stylized QR representation */}
                  <div className="w-full h-full border-2 border-neutral-900 border-dashed rounded flex items-center justify-center text-[9px] font-mono font-bold text-neutral-800">
                    QR CODE
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#F0E4D2] border border-[#E3D3BA] flex items-center justify-center text-[#8C5E18]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-serif font-black text-[#1A1A1A] mb-2">
                Register Your Product
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                Get faster support and important updates by registering your product.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setActiveModal("register")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-[#FAF3E5] border border-[#D9C4A4] text-[#8C5E18] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 group"
              >
                <span>Register Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. GET IN TOUCH SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
            Get in Touch
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Our support team is available to assist you through multiple channels.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Call Us */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-500">Call Us</span>
              <p className="text-base font-bold text-[#1A1A1A]">1800 123 4567</p>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Mon – Sat | 9:00 AM – 7:00 PM (IST)
              </p>
            </div>
          </div>

          {/* Card 2: Email Us */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-500">Email Us</span>
              <p className="text-base font-bold text-[#1A1A1A]">support@flazo.in</p>
              <p className="text-[11px] text-neutral-500 leading-snug">
                We usually respond within 24 hours.
              </p>
            </div>
          </div>

          {/* Card 3: Live Chat */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-500">Live Chat</span>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Chat with our support team for instant help.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal("chat")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#9E6B20] hover:underline pt-1"
              >
                Start Chat →
              </button>
            </div>
          </div>

          {/* Card 4: Service Centers */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-500">Service Centers</span>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Find an authorized service center near you.
              </p>
              <button
                type="button"
                onClick={() => {
                  toast.info("Over 450+ authorized Flazo Service Centers active across Delhi, Mumbai, Bengaluru, Chennai, and tier 1/2 cities.");
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#9E6B20] hover:underline pt-1"
              >
                Locate Now →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM BANNER ("A Promise of Better Sound")
         ───────────────────────────────────────────────────────────── */}
      <section className="pt-6 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FBF7EE] via-[#F6ECE0] to-[#EFE2D0] border border-[#E5D5BA] p-6 sm:p-10 shadow-xs">
          
          {/* Cursive Script Watermark on Far Right */}
          <div className="absolute right-6 sm:right-12 top-6 sm:top-8 pointer-events-none select-none">
            <span className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#8C6D3C]/60">
              Together <br />
              For A Brighter India
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Box and Earbuds Image on Left */}
            <div className="lg:col-span-4 flex items-center justify-center sm:justify-start">
              <div className="w-64 sm:w-80 h-44 sm:h-52 relative rounded-2xl overflow-hidden shadow-sm border border-[#E8D7BE]">
                <Image
                  src="/images/flazo_warranty_box.jpg"
                  alt="Flazo Luxury Gift Packaging & Earbuds"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content Center */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9E6B20]">
                  MORE THAN A PRODUCT
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] mt-1">
                  A Promise of Better Sound
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed mt-1.5">
                  At Flazo, support doesn&apos;t end after your purchase. We&apos;re committed to being with you at every step of your audio journey.
                </p>
              </div>

              {/* 4 Stat Badges Horizontally */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E8D7BE]/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-[#1A1A1A]">1L+</h5>
                    <p className="text-[10px] text-neutral-500">Happy Users</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-[#1A1A1A]">4.9/5</h5>
                    <p className="text-[10px] text-neutral-500">Customer Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-[#1A1A1A]">24 Hrs</h5>
                    <p className="text-[10px] text-neutral-500">Avg. Resolution Time</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE3CF] text-[#8C5E18] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-[#1A1A1A]">Pan-India</h5>
                    <p className="text-[10px] text-neutral-500">Service Network</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE MODALS
         ───────────────────────────────────────────────────────────── */}
      
      {/* 1. Watch Support Video Modal */}
      {activeModal === "video" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-neutral-950 rounded-3xl overflow-hidden border border-[#D9C4A4] max-w-3xl w-full shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />
                Flazo Support & Setup Masterclass
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                src="/videos/test.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Check Warranty Status Modal */}
      {activeModal === "check-warranty" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-7 border border-[#E5D4BC] max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setActiveModal(null);
                setWarrantyResult(null);
              }}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E6] text-[#9E6B20] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-black text-[#1A1A1A]">
                  Check Warranty Status
                </h3>
                <p className="text-xs text-neutral-500">
                  Enter your serial number or order ID
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckWarranty} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={warrantyInput}
                  onChange={(e) => setWarrantyInput(e.target.value)}
                  placeholder="e.g. FLZ-2026-98129 or Order ID"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20] focus:border-[#9E6B20]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#9E6B20] hover:bg-[#8A5B17] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Verify Warranty Coverage →
              </button>
            </form>

            {warrantyResult && (
              <div className="mt-5 p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6D7BE] text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{warrantyResult.status}</span>
                </div>
                <p className="text-neutral-800 font-semibold">{warrantyResult.model}</p>
                <p className="text-neutral-500">Valid until: <strong className="text-neutral-800">{warrantyResult.expiresOn}</strong></p>
                <p className="text-neutral-500 text-[11px]">{warrantyResult.coverage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Register Product Modal */}
      {activeModal === "register" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-7 border border-[#E5D4BC] max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveModal(null);
                setIsRegistered(false);
              }}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E6] text-[#9E6B20] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-black text-[#1A1A1A]">
                  Register Your Flazo Product
                </h3>
                <p className="text-xs text-neutral-500">
                  Activates 1-Year Doorstep Swap Warranty instantly
                </p>
              </div>
            </div>

            {isRegistered ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Warranty Activated!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your {regForm.model} is now protected with Flazo 1-Year Doorstep Swap. Confirmation has been sent to {regForm.phone}.
                </p>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Serial Number / Order ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.serial}
                      onChange={(e) => setRegForm({ ...regForm, serial: e.target.value })}
                      placeholder="Located on box or bill"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Select Product Model
                  </label>
                  <select
                    value={regForm.model}
                    onChange={(e) => setRegForm({ ...regForm, model: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20]"
                  >
                    <option>Flazo Nirvana Gold Pro X (Champagne Gold)</option>
                    <option>Flazo BassPod Extreme (13.4mm Titanium)</option>
                    <option>Flazo Aerobeat Ultralight (3.6g Workout Fit)</option>
                    <option>Flazo Acoustic Labs Pro (Dual Diaphragm)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#9E6B20] hover:bg-[#8A5B17] text-white text-xs font-bold rounded-xl transition shadow-xs mt-2"
                >
                  Activate 1-Year Doorstep Warranty →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Live Chat Modal */}
      {activeModal === "chat" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E5D4BC] max-w-md w-full shadow-2xl flex flex-col h-[520px] overflow-hidden">
            {/* Chat Header */}
            <div className="px-5 py-4 bg-[#FAF5EC] border-b border-[#E8D7BE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#9E6B20] text-white flex items-center justify-center font-bold text-xs">
                  FLZ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A]">Flazo Live Concierge</h4>
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Average reply 1 min
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCFBF8]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === "user"
                        ? "bg-[#9E6B20] text-white"
                        : "bg-white border border-[#E8D7BE] text-neutral-800 shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-[#E8D7BE] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 px-3 py-2 text-xs border border-[#E8D7BE] rounded-xl focus:outline-none focus:border-[#9E6B20]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#9E6B20] text-white text-xs font-bold rounded-xl hover:bg-[#8A5B17] transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Guides Modal */}
      {activeModal === "guides" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-7 border border-[#E5D4BC] max-w-lg w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-black text-[#1A1A1A] mb-4">
              Quick Setup & Troubleshooting Guides
            </h3>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE]">
                <h4 className="font-bold text-[#1A1A1A] mb-1">1. Bluetooth Pairing Reset</h4>
                <p className="leading-relaxed text-neutral-600">
                  Place both earbuds back in the charging case. Press and hold the case button for 10 seconds until the front golden LEDs flash three times. Remove both earbuds together.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE]">
                <h4 className="font-bold text-[#1A1A1A] mb-1">2. Switching Between 50dB ANC & Ambient Mode</h4>
                <p className="leading-relaxed text-neutral-600">
                  Long-press the right earbud touch sensor for 2 seconds. A studio chime will sound announcing &quot;ANC Active&quot;, &quot;Spatial Ambient&quot;, or &quot;Normal Mode&quot;.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE]">
                <h4 className="font-bold text-[#1A1A1A] mb-1">3. Charging & Battery Optimization</h4>
                <p className="leading-relaxed text-neutral-600">
                  Always use the provided 5V/2A USB-C fast charging cable. 10 minutes of FlashCharge supplies 10 hours of continuous playback.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Terms & Conditions Modal */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-7 border border-[#E5D4BC] max-w-lg w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-black text-[#1A1A1A] mb-3">
              1 Year Limited Warranty Terms
            </h3>

            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p>
                <strong>1. Scope of Coverage:</strong> Flazo guarantees that your audio product will be free from manufacturing, internal electrical, and component defects for a period of 1 Year (365 days) from the invoice date.
              </p>
              <p>
                <strong>2. Doorstep Swap:</strong> In case of any verified hardware failure, Flazo will arrange a doorstep courier pickup and deliver a fresh replacement unit at zero shipping charge across India.
              </p>
              <p>
                <strong>3. Exclusions:</strong> Warranty does not cover accidental physical crush damage, unauthorized third-party teardowns, liquid submersion beyond IPX7 specifications, or cosmetic scratches from normal daily wear.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

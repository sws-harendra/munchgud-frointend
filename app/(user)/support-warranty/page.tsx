"use client";

import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  AlertCircle,
  Copy,
  RefreshCw,
  Wrench,
  Sparkles,
  Paperclip,
} from "lucide-react";
import FlazoLogo from "@/app/commonComponents/FlazoLogo";
import { toast } from "sonner";
import { useAppSelector } from "@/app/lib/store/store";
import { contactService } from "@/app/sercices/user/contact.service";
import { warrantyService } from "@/app/sercices/user/warranty.service";
import {
  FadeIn,
  Stagger,
  StaggerItem,
  HoverCard,
  ScaleIn,
  Float,
  AnimatedModal,
  motion,
} from "@/app/commonComponents/motion";

export default function SupportWarrantyPage() {
  const { user } = useAppSelector((state) => state.auth);

  // Search query for the "How can we help you today?" cards
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states for interactive actions
  const [activeModal, setActiveModal] = useState<
    "video" | "check-warranty" | "register" | "chat" | "guides" | "terms" | null
  >(null);

  // Warranty Check State
  const [warrantyInput, setWarrantyInput] = useState("");
  const [warrantyResult, setWarrantyResult] = useState<any>(null);
  const [isCheckingWarranty, setIsCheckingWarranty] = useState(false);

  // Product Registration & Warranty Claim State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    model: "Flazo Nirvana Gold Pro X (Champagne Gold)",
    serial: "",
    claimType: "registration" as "registration" | "claim",
    issueDescription: "",
    source: "Official Flazo Store",
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmittingWarranty, setIsSubmittingWarranty] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  // Contact Support Modal Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    message: "",
  });
  const [contactFile, setContactFile] = useState<File | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Nu Republic Style Hero Warranty Station State
  const [heroTab, setHeroTab] = useState<"register" | "claim" | "status">("register");
  const [heroForm, setHeroForm] = useState({
    name: "",
    phone: "",
    serial: "",
    model: "Flazo Nirvana Gold Pro X",
    channel: "Official Flazo Online Store",
    issueCategory: "Audio Issue - One Earbud Silent / Low Volume",
    issueDescription: "",
  });
  const [heroSuccess, setHeroSuccess] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: prev.name || user.fullname || "",
        email: prev.email || user.email || "",
        phone: prev.phone || (user.phoneNumber ? String(user.phoneNumber) : ""),
      }));
      setRegForm((prev) => ({
        ...prev,
        name: prev.name || user.fullname || "",
        email: prev.email || user.email || "",
        phone: prev.phone || (user.phoneNumber ? String(user.phoneNumber) : ""),
      }));
      setHeroForm((prev) => ({
        ...prev,
        name: prev.name || user.fullname || "",
        phone: prev.phone || (user.phoneNumber ? String(user.phoneNumber) : ""),
      }));
    }
  }, [user]);

  // 4 Help Topic Cards
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
      action: () => {
        setRegForm((prev) => ({ ...prev, claimType: "claim" }));
        setIsRegistered(false);
        setActiveModal("register");
      },
      icon: Shield,
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

  const handleCheckWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warrantyInput.trim()) {
      toast.error("Please enter a valid Serial Number or Order ID.");
      return;
    }
    setIsCheckingWarranty(true);
    try {
      const res = await warrantyService.checkWarranty(warrantyInput.trim());
      if (res.success && res.found && res.data) {
        setWarrantyResult({
          notFound: false,
          claimId: res.data.claimId,
          model: res.data.productModel,
          status: res.data.status,
          expiresOn: res.data.warrantyEndDate
            ? new Date(res.data.warrantyEndDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Active",
          coverage: res.data.coverage,
          isExpired: res.data.isExpired,
        });
        toast.success("Warranty verified successfully!");
      } else {
        setWarrantyResult({
          notFound: true,
          query: warrantyInput.trim(),
          message: "No warranty record found matching this Serial Number or Order ID.",
        });
        toast.error("No active warranty record found. You can register it below.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify warranty coverage.");
    } finally {
      setIsCheckingWarranty(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.phone.trim() || !regForm.serial.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (regForm.claimType === "claim" && !regForm.issueDescription.trim()) {
      toast.error("Please describe the issue or problem you are facing.");
      return;
    }

    setIsSubmittingWarranty(true);
    try {
      const res = await warrantyService.registerWarranty({
        fullName: regForm.name.trim(),
        phone: regForm.phone.trim(),
        email: regForm.email?.trim() || user?.email || undefined,
        serialNumber: regForm.serial.trim(),
        orderId: regForm.serial.trim(),
        productModel: regForm.model.trim(),
        claimType: regForm.claimType || "registration",
        issueDescription: regForm.issueDescription?.trim() || undefined,
        source: "support_warranty",
      });

      if (res.success) {
        setRegisteredData(res.data);
        setIsRegistered(true);
        toast.success(res.message || "1-Year Warranty & Service registered successfully!");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to submit warranty request."
      );
    } finally {
      setIsSubmittingWarranty(false);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (heroTab === "status") {
      handleCheckWarranty(e);
      return;
    }

    if (heroTab === "register") {
      if (!heroForm.name.trim() || !heroForm.phone.trim() || !heroForm.serial.trim()) {
        toast.error("Please fill in your Name, Phone Number, and Serial # / Order ID.");
        return;
      }

      setIsSubmittingWarranty(true);
      try {
        const res = await warrantyService.registerWarranty({
          fullName: heroForm.name.trim(),
          phone: heroForm.phone.trim(),
          email: user?.email || undefined,
          serialNumber: heroForm.serial.trim(),
          orderId: heroForm.serial.trim(),
          productModel: heroForm.model,
          claimType: "registration",
          source: heroForm.channel,
        });

        if (res.success) {
          setHeroSuccess({
            type: "registration",
            title: "1-Year Warranty Activated!",
            refId: res.data?.claimId || `FLZ-WAR-${Math.floor(100000 + Math.random() * 900000)}`,
            model: heroForm.model,
            serial: heroForm.serial.trim(),
            expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          });
          toast.success("1-Year Comprehensive Warranty registered successfully!");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || "Failed to register warranty.");
      } finally {
        setIsSubmittingWarranty(false);
      }
      return;
    }

    if (heroTab === "claim") {
      if (!heroForm.phone.trim() || !heroForm.serial.trim()) {
        toast.error("Please enter your Phone Number and Serial # / Order ID.");
        return;
      }

      setIsSubmittingWarranty(true);
      try {
        const res = await warrantyService.registerWarranty({
          fullName: heroForm.name.trim() || user?.fullname || "Customer",
          phone: heroForm.phone.trim(),
          email: user?.email || undefined,
          serialNumber: heroForm.serial.trim(),
          orderId: heroForm.serial.trim(),
          productModel: heroForm.model,
          claimType: "claim",
          issueDescription: `${heroForm.issueCategory}${heroForm.issueDescription ? ` - ${heroForm.issueDescription}` : ""}`,
          source: heroForm.channel,
        });

        if (res.success) {
          setHeroSuccess({
            type: "claim",
            title: "Doorstep Claim Submitted!",
            refId: res.data?.claimId || `FLZ-CLM-${Math.floor(100000 + Math.random() * 900000)}`,
            model: heroForm.model,
            serial: heroForm.serial.trim(),
            issue: heroForm.issueCategory,
          });
          toast.success("Doorstep replacement request registered! Our team will contact you in 24h.");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || "Failed to submit replacement claim.");
      } finally {
        setIsSubmittingWarranty(false);
      }
    }
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!contactForm.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    if (!contactForm.phone.trim()) {
      toast.error("Please enter your Phone / WhatsApp number.");
      return;
    }
    if (!contactForm.message.trim()) {
      toast.error("Please write your message.");
      return;
    }

    setIsSubmittingContact(true);
    try {
      const formData = new FormData();
      formData.append("name", contactForm.name.trim());
      formData.append("email", contactForm.email.trim());
      formData.append("phone", contactForm.phone.trim());
      if (contactForm.orderId.trim()) {
        formData.append("orderId", contactForm.orderId.trim());
      }
      formData.append("subject", "Support & Warranty Inquiry");
      formData.append("message", contactForm.message.trim());
      formData.append("source", "support_warranty");
      if (contactFile) {
        formData.append("attachment", contactFile);
      }

      await contactService.sendContactInquiry(formData);

      toast.success("Thank you! Your inquiry has been sent to Flazo Support team.");
      setContactForm({
        name: user?.fullname || "",
        email: user?.email || "",
        phone: user?.phoneNumber ? String(user.phoneNumber) : "",
        orderId: "",
        message: "",
      });
      setContactFile(null);
      setActiveModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 pb-20 selection:bg-[#B8860B] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Nu Republic Style Next-Level Support & Lifestyle Collage)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        {/* Ambient Warm Golden Aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-r from-amber-200/25 via-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Manifesto & Human Support (Matches Exact Nu Republic Layout in Second Screenshot) */}
          <FadeIn direction="up" delay={0.1} className="lg:col-span-6 space-y-6 text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5ECDC] border border-[#E8D7BF] text-[#8C6016] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E6B20]" />
              <span>OFFICIAL FLAZO CARE+</span>
            </div>

            {/* Headline: Punchy Bold Lowercase Nu Republic Style */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#1A1815] tracking-tight leading-[1.08] lowercase">
              next-level support. <br />
              <span className="bg-gradient-to-r from-[#9E7324] via-[#C99726] to-[#8C6016] bg-clip-text text-transparent italic font-serif">
                for next-level you.
              </span>
            </h1>

            {/* Manifesto Body Text */}
            <div className="space-y-3 text-neutral-600 text-xs sm:text-sm leading-relaxed max-w-xl">
              <p>
                at the <strong className="text-neutral-900 font-bold">Flazo universe</strong>, we believe great acoustics deserve even better support. and great listeners? they deserve the absolute best.
              </p>
              <p>
                that&apos;s why our team shows up fast, stays reliable, and has your back at every step. from doorstep replacements to real human answers, we keep things seamless, effortless, and stress-free — so your experience stays as pure as the sound you love.
              </p>
            </div>

            {/* Staccato Value Bullet Points */}
            <div className="space-y-1.5 text-xs sm:text-sm font-bold text-neutral-900 pt-1">
              <p className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>no automated runarounds.</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>no cold waiting responses.</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>just genuine human support that moves at your speed.</span>
              </p>
              <p className="text-[#8C6016] font-extrabold italic pt-1.5 text-xs sm:text-sm">
                because when you&apos;re next-level, your support should be too.
              </p>
            </div>

            {/* 2 High-Conversion Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  setRegForm((prev) => ({ ...prev, claimType: "claim" }));
                  setIsRegistered(false);
                  setActiveModal("register");
                }}
                className="btn-shimmer px-7 py-3.5 rounded-full bg-gradient-to-r from-[#9E6B20] via-[#B8860B] to-[#D4AF37] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-900/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Claim 1-Year Warranty</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Signature Universe Strip */}
            <div className="pt-6 border-t border-[#E8DCC4] space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                from the flazo sound universe
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-black tracking-wider text-neutral-700 uppercase">
                <span className="px-2.5 py-1 rounded-md bg-[#F4ECDC] text-[#7A5314] border border-[#E5D5B8]">FLAZO CARE 365</span>
                <span className="text-neutral-300">•</span>
                <span>DOORSTEP SWAP</span>
                <span className="text-neutral-300">•</span>
                <span>PAN-INDIA LOGISTICS</span>
                <span className="text-neutral-300">•</span>
                <span>100% GENUINE</span>
              </div>
            </div>

          </FadeIn>

          {/* Right Column: Dynamic Editorial Lifestyle Photo Collage (Zero Products, Authentic Human Emotion) */}
          <FadeIn direction="left" delay={0.25} className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
            <Float amplitude={5} duration={6} className="w-full flex items-center justify-center">
              {/* Background Ambient Warm Frame */}
              <div className="relative w-full max-w-[560px] aspect-square sm:aspect-[4/3] lg:aspect-[5/4] flex items-center justify-center p-2">
                
                {/* Photo 1: Top-Left (Smiling Woman Golden Hour) - Tilted -2deg */}
                <div className="absolute top-2 left-2 sm:left-4 w-[48%] aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-amber-950/15 -rotate-2 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 group bg-neutral-100">
                  <Image
                    src="/images/flazo_support_lifestyle_1.jpg"
                    alt="Happy Indian woman enjoying golden hour sunset"
                    fill
                    priority
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    pure joy • authentic smiles
                  </span>
                </div>

                {/* Photo 2: Top-Right (Friendly Support Concierge) - Tilted +3deg */}
                <div className="absolute top-0 right-2 sm:right-4 w-[46%] aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-amber-950/15 rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 group bg-neutral-100">
                  <Image
                    src="/images/flazo_support_lifestyle_2.jpg"
                    alt="Friendly customer support concierge smiling warmly"
                    fill
                    priority
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    dedicated concierge
                  </span>
                </div>

                {/* Photo 3: Bottom-Left (Friends Laughing Balcony) - Tilted +2deg */}
                <div className="absolute bottom-2 left-4 sm:left-8 w-[45%] aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-amber-950/15 rotate-2 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 group bg-neutral-100">
                  <Image
                    src="/images/flazo_support_lifestyle_3.jpg"
                    alt="Indian friends laughing together on rooftop balcony"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    100k+ happy listeners
                  </span>
                </div>

                {/* Photo 4: Bottom-Right (Urban Confident Young Man) - Tilted -3deg */}
                <div className="absolute bottom-0 right-2 sm:right-6 w-[47%] aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-amber-950/15 -rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 group bg-neutral-100">
                  <Image
                    src="/images/flazo_support_lifestyle_4.jpg"
                    alt="Confident young man walking in urban plaza"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    19,000+ pincodes
                  </span>
                </div>

              </div>
            </Float>
          </FadeIn>

        </div>
      </section>

      {/* 2. HOW CAN WE HELP YOU TODAY? SECTION */}
      <section id="help-topics" className="py-12 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        {/* Header with Search Bar */}
        <FadeIn direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
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
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                className="absolute right-1.5 px-5 py-2 bg-[#9E6B20] hover:bg-[#8A5B17] text-white font-bold text-xs rounded-full transition shadow-xs cursor-pointer"
              >
                Search
              </motion.button>
            </div>
          </div>
        </FadeIn>

        {/* Topic Cards Grid */}
        <Stagger staggerChildren={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <StaggerItem key={topic.id}>
                <HoverCard
                  onClick={topic.action}
                  className="h-full bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
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
                </HoverCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WARRANTY SECTION (Split Card)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <Stagger staggerChildren={0.12} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Wide Card: 1 Year Limited Warranty */}
          <StaggerItem className="lg:col-span-8">
            <HoverCard yOffset={-3} scale={1.006} className="h-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] rounded-3xl p-7 sm:p-9 border border-[#E6D7BE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Left Shield Emblem Image */}
              <div className="w-36 sm:w-44 shrink-0 flex items-center justify-center">
                <Float amplitude={6} duration={4} className="relative w-36 h-36 sm:w-40 sm:h-40">
                  <Image
                    src="/images/gold_warranty_shield.jpg"
                    alt="1 Year Warranty Shield Emblem"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain drop-shadow-md rounded-2xl"
                  />
                </Float>
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
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF3E5] border border-[#D9C4A4] text-[#8C5E18] text-xs font-bold transition-all shadow-xs flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Check Warranty Status</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveModal("terms")}
                      className="text-[11px] text-[#8C5E18] hover:underline underline-offset-2 font-medium cursor-pointer"
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

            </HoverCard>
          </StaggerItem>

          {/* Right Card: Register Your Product */}
          <StaggerItem className="lg:col-span-4">
            <HoverCard yOffset={-3} scale={1.01} className="h-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] rounded-3xl p-7 sm:p-9 border border-[#E6D7BE] shadow-xs flex flex-col justify-between">
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
                  onClick={() => {
                    setRegForm((prev) => ({ ...prev, claimType: "registration" }));
                    setIsRegistered(false);
                    setActiveModal("register");
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-[#FAF3E5] border border-[#D9C4A4] text-[#8C5E18] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </HoverCard>
          </StaggerItem>

        </Stagger>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. GET IN TOUCH SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <FadeIn direction="up" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
            Get in Touch
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Our support team is available to assist you through multiple channels.
          </p>
        </FadeIn>

        {/* 4 Cards Grid */}
        <Stagger staggerChildren={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Call Us */}
          <StaggerItem>
            <HoverCard className="h-full bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500">Call Us</span>
                <p className="text-base font-bold text-[#1A1A1A]">+91 9199859862</p>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Mon – Sat | 9:00 AM – 7:00 PM (IST)
                </p>
              </div>
            </HoverCard>
          </StaggerItem>

          {/* Card 2: Email Us */}
          <StaggerItem>
            <HoverCard className="h-full bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500">Email Us</span>
                <p className="text-base font-bold text-[#1A1A1A]">care@flazo.in</p>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  We usually respond within 24 hours.
                </p>
              </div>
            </HoverCard>
          </StaggerItem>

          {/* Card 3: Quick Inquiry */}
          <StaggerItem>
            <HoverCard className="h-full bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FAF3E6] border border-[#E9D9C3] flex items-center justify-center shrink-0 text-[#9E6B20]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500">Quick Inquiry</span>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Send our customer care team a direct inquiry.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal("chat")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#9E6B20] hover:underline pt-1 cursor-pointer"
                >
                  Send Message →
                </button>
              </div>
            </HoverCard>
          </StaggerItem>

          {/* Card 4: Service Centers */}
          <StaggerItem>
            <HoverCard className="h-full bg-white rounded-2xl p-6 border border-[#EFE5D5] shadow-xs flex items-start gap-4">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#9E6B20] hover:underline pt-1 cursor-pointer"
                >
                  Locate Now →
                </button>
              </div>
            </HoverCard>
          </StaggerItem>

        </Stagger>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM BANNER ("A Promise of Better Sound")
         ───────────────────────────────────────────────────────────── */}
      <section className="pt-6 px-4 sm:px-6 lg:px-12 max-w-[1560px] mx-auto">
        <FadeIn direction="up" distance={20} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FBF7EE] via-[#F6ECE0] to-[#EFE2D0] border border-[#E5D5BA] p-6 sm:p-10 shadow-xs">
          
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
        </FadeIn>
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
                  placeholder="e.g. FLZ-WAR-261013-1024 or Serial Number or Order ID"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20] focus:border-[#9E6B20]"
                />
              </div>

              <button
                type="submit"
                disabled={isCheckingWarranty}
                className="w-full py-2.5 bg-[#9E6B20] hover:bg-[#8A5B17] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {isCheckingWarranty ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying with Database...</span>
                  </>
                ) : (
                  <span>Verify Warranty Coverage →</span>
                )}
              </button>
            </form>

            {warrantyResult && (
              warrantyResult.notFound ? (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>No Active Warranty Found</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    No active record found for &ldquo;<strong className="text-neutral-800">{warrantyResult.query}</strong>&rdquo;. If you recently purchased this product, please activate your 1-Year warranty below.
                  </p>
                  <button
                    onClick={() => {
                      setRegForm((prev) => ({
                        ...prev,
                        serial: warrantyResult.query,
                        claimType: "registration",
                      }));
                      setIsRegistered(false);
                      setActiveModal("register");
                    }}
                    className="mt-2 px-3.5 py-1.5 bg-[#9E6B20] hover:bg-[#8A5B17] text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
                  >
                    Register This Product Now →
                  </button>
                </div>
              ) : (
                <div className="mt-5 p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6D7BE] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{warrantyResult.status}</span>
                    </div>
                    {warrantyResult.claimId && (
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E6D7BE] text-[#9E6B20] font-bold">
                        #{warrantyResult.claimId}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-800 font-semibold">{warrantyResult.model}</p>
                  <p className="text-neutral-500">
                    Valid until: <strong className="text-neutral-800">{warrantyResult.expiresOn}</strong>
                  </p>
                  <p className="text-neutral-500 text-[11px]">{warrantyResult.coverage}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* 3. Register Product & Warranty Claim Modal */}
      {activeModal === "register" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-7 border border-[#E5D4BC] max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveModal(null);
                setIsRegistered(false);
              }}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E6] text-[#9E6B20] flex items-center justify-center shrink-0">
                {regForm.claimType === "claim" ? (
                  <Wrench className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-serif font-black text-[#1A1A1A]">
                  {regForm.claimType === "claim"
                    ? "Raise a Warranty Claim"
                    : "Register Your Flazo Product"}
                </h3>
                <p className="text-xs text-neutral-500">
                  {regForm.claimType === "claim"
                    ? "Submit a repair or replacement request under warranty"
                    : "Activates 1-Year Warranty and Pan-India Service instantly"}
                </p>
              </div>
            </div>

            {/* Claim Type Tabs */}
            {!isRegistered && (
              <div className="flex p-1 bg-[#FAF5EB] rounded-xl border border-[#EADBCA] mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRegForm({ ...regForm, claimType: "registration" })}
                  className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                    regForm.claimType === "registration"
                      ? "bg-white text-[#8C5E18] shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Product Registration
                </button>
                <button
                  type="button"
                  onClick={() => setRegForm({ ...regForm, claimType: "claim" })}
                  className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                    regForm.claimType === "claim"
                      ? "bg-white text-[#8C5E18] shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Warranty Claim
                </button>
              </div>
            )}

            {isRegistered ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-950">
                    {registeredData?.claimType === "claim"
                      ? "Warranty Claim Logged Successfully!"
                      : "1-Year Warranty Activated!"}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Certificate recorded under Flazo Priority Support Database.
                  </p>
                </div>

                {registeredData?.claimId && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <span className="text-neutral-500">Certificate ID:</span>
                    <span className="font-mono font-bold text-[#9E6B20]">
                      #{registeredData.claimId}
                    </span>
                  </div>
                )}

                <div className="p-3 bg-white/70 rounded-xl text-left text-xs space-y-1 text-neutral-700">
                  <p>
                    <strong className="text-neutral-900">Model:</strong> {registeredData?.productModel || regForm.model}
                  </p>
                  <p>
                    <strong className="text-neutral-900">Serial/Order ID:</strong> {registeredData?.serialNumber || regForm.serial}
                  </p>
                  {registeredData?.warrantyEndDate && (
                    <p>
                      <strong className="text-neutral-900">Valid Until:</strong>{" "}
                      {new Date(registeredData.warrantyEndDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <p>
                    <strong className="text-neutral-900">Registered Phone:</strong> {regForm.phone}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  {registeredData?.claimId && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(registeredData.claimId);
                        toast.success("Certificate ID copied!");
                      }}
                      className="flex-1 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setIsRegistered(false);
                    }}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
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
                    Select Product Model *
                  </label>
                  <input
                    type="text"
                    required
                    list="product-model-options"
                    value={regForm.model}
                    onChange={(e) => setRegForm({ ...regForm, model: e.target.value })}
                    placeholder="Type or select model (e.g. Flazo Nirvana Gold Pro X)"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20] bg-white text-neutral-800 placeholder:text-neutral-400"
                  />
                  <datalist id="product-model-options">
                    <option value="Flazo Nirvana Gold Pro X (Champagne Gold)" />
                    <option value="Flazo BassPod Extreme (13.4mm Titanium)" />
                    <option value="Flazo Aerobeat Ultralight (3.6g Workout Fit)" />
                    <option value="Flazo Acoustic Labs Pro (Dual Diaphragm)" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="e.g. customer@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20]"
                  />
                </div>

                {regForm.claimType === "claim" && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Describe Issue / Defect *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={regForm.issueDescription}
                      onChange={(e) =>
                        setRegForm({ ...regForm, issueDescription: e.target.value })
                      }
                      placeholder="e.g. Left earbud has no audio output, charging case LED blinking red..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9C4A4] text-xs focus:ring-1 focus:ring-[#9E6B20]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingWarranty}
                  className="w-full py-2.5 bg-[#9E6B20] hover:bg-[#8A5B17] text-white text-xs font-bold rounded-xl transition shadow-xs mt-2 flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmittingWarranty ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : regForm.claimType === "claim" ? (
                    <span>Submit Warranty Claim →</span>
                  ) : (
                    <span>Activate 1-Year Warranty and Service →</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Contact Support / Quick Inquiry Modal */}
      {activeModal === "chat" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E5D4BC] max-w-lg w-full shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#FAF5EC] border-b border-[#E8D7BE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center">
                  <FlazoLogo size="xs" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A]">Flazo Customer Support</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    Submit Inquiry • Quick Response
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-lg hover:bg-[#EFE4D2] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Direct Inquiry Form */}
            <form
              onSubmit={handleContactFormSubmit}
              className="p-5 overflow-y-auto space-y-3.5 bg-[#FCFBF8]"
            >
              <p className="text-xs text-neutral-600 leading-relaxed">
                Leave your inquiry details below. Our customer care team will review your request and reach out promptly.
              </p>

              {/* 1. Full Name * & Email Address * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8D7BE] rounded-xl focus:outline-none focus:border-[#9E6B20] bg-white text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8D7BE] rounded-xl focus:outline-none focus:border-[#9E6B20] bg-white text-neutral-900"
                  />
                </div>
              </div>

              {/* 2. Phone / WhatsApp Number * & Order ID (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8D7BE] rounded-xl focus:outline-none focus:border-[#9E6B20] bg-white text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="FLZ-1234"
                    value={contactForm.orderId}
                    onChange={(e) => setContactForm({ ...contactForm, orderId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8D7BE] rounded-xl focus:outline-none focus:border-[#9E6B20] bg-white text-neutral-900"
                  />
                </div>
              </div>

              {/* 3. Attach Invoice / Photo (Optional) (New) */}
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Attach Invoice / Photo (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-between px-3 py-2.5 text-xs border border-dashed border-[#D9C4A4] rounded-xl bg-white hover:bg-[#FAF6EE] cursor-pointer transition text-neutral-600">
                    <span className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-[#9E6B20] shrink-0" />
                      <span className="truncate">
                        {contactFile ? contactFile.name : "Upload invoice or photo (JPG, PNG, PDF up to 10MB)"}
                      </span>
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-[#FAF3E5] text-[#9E6B20] rounded-lg border border-[#E5D4BC] shrink-0 ml-2">
                      Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.size > 10 * 1024 * 1024) {
                          toast.error("File size must be under 10MB");
                          return;
                        }
                        setContactFile(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  {contactFile && (
                    <button
                      type="button"
                      onClick={() => setContactFile(null)}
                      className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition shrink-0"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Your Message * */}
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your question, warranty issue, or request..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E8D7BE] rounded-xl focus:outline-none focus:border-[#9E6B20] bg-white text-neutral-900 resize-none"
                />
              </div>

              {/* [ Submit Inquiry ] Button */}
              <div className="pt-2 border-t border-[#E8D7BE] flex items-center justify-between">
                <a
                  href="/contactus"
                  className="text-[11px] font-semibold text-[#9E6B20] hover:underline"
                >
                  Open full contact page →
                </a>

                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="px-5 py-2.5 bg-[#9E6B20] hover:bg-[#8A5B17] text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingContact ? "Sending..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Guides Modal */}
      {activeModal === "guides" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D4BC] max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pr-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8C6016] block mb-1">
                Help &amp; Documentation
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A]">
                Quick Setup &amp; Troubleshooting Guides
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {/* 1. Bluetooth Pairing & Factory Reset */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE] space-y-2.5">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base">
                  1. Bluetooth Pairing &amp; Factory Reset
                </h4>
                <div className="space-y-2 text-neutral-600">
                  <p>
                    <strong className="text-neutral-800">Bluetooth Pairing Reset:</strong> Place both earbuds back in the charging case. Press and hold the case button for 10 seconds until the front golden LEDs flash three times. Remove both earbuds together.
                  </p>
                  <p>
                    <strong className="text-neutral-800">Factory Reset:</strong> Tap 6 times on either earbud to trigger Factory Reset.
                  </p>
                </div>
              </div>

              {/* 2. Smart Touch Controls & Modes */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE] space-y-3">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base">
                  2. Smart Touch Controls &amp; Modes
                </h4>
                <div className="space-y-2 text-neutral-600">
                  <p>
                    <strong className="text-neutral-800">Switching Between 50dB ANC &amp; Ambient Mode:</strong> Long-press the right earbud touch sensor for 2 seconds. A studio chime will sound announcing &quot;ANC Active&quot;, &quot;Spatial Ambient&quot;, or &quot;Normal Mode&quot;.
                  </p>
                  <div className="pt-1">
                    <p className="font-bold text-neutral-800 mb-1.5">
                      Touch Operations:
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-neutral-600 marker:text-[#9E6B20]">
                      <li>
                        <strong className="text-neutral-800">Single Tap:</strong> Play/Pause, Answer/Hang Up
                      </li>
                      <li>
                        <strong className="text-neutral-800">Double Tap:</strong> Previous/Next Track, Reject Call
                      </li>
                      <li>
                        <strong className="text-neutral-800">Triple Tap:</strong> Volume Up/Down
                      </li>
                      <li>
                        <strong className="text-neutral-800">4 Taps:</strong> Game Mode
                      </li>
                      <li>
                        <strong className="text-neutral-800">Long Press:</strong> Voice Assistant
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Charging & Battery Optimization */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE] space-y-2.5">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base">
                  3. Charging &amp; Battery Optimization
                </h4>
                <div className="space-y-2 text-neutral-600">
                  <p>
                    <strong className="text-neutral-800">Charging Details:</strong> Always use the provided 5V/2.1A USB-C fast charging cable.
                  </p>
                  <p>
                    <strong className="text-neutral-800">Playtime:</strong> Total Playtime: Up to 100 Hours (with case, depends on volume). Single Charge: Max 8 Hours (at moderate volume).
                  </p>
                  <p>
                    <strong className="text-neutral-800">Smart Indicators:</strong> Dual Light Status — Buds: Pulsing white light; Case: Flashing red (charging), Solid red (full).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Terms & Conditions Modal */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D4BC] max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pr-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8C6016] block mb-1">
                Official Policy
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A]">
                FLAZO - WARRANTY &amp; REPLACEMENT POLICY
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {/* 1. 7-Day Technical Replacement Policy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE]">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base mb-2">
                  1. 7-Day Technical Replacement Policy
                </h4>
                <ul className="space-y-2 list-disc pl-5 text-neutral-600 marker:text-[#9E6B20]">
                  <li>
                    Flazo ensures a straightforward replacement window limited strictly to the first 7 days from the date of product delivery.
                  </li>
                  <li>
                    This policy applies solely to verified manufacturing or technical malfunctions, including but not limited to acoustic/speaker failure, hardware pairing disruptions, or critical charging anomalies.
                  </li>
                  <li>
                    Incidents involving physical impact, accidental drops, liquid ingress exceeding IPX5 limits, or subjective user dissatisfaction are strictly excluded.
                  </li>
                </ul>
              </div>

              {/* 2. 1-Year Comprehensive Warranty Coverage */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE]">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base mb-2">
                  2. 1-Year Comprehensive Warranty Coverage
                </h4>
                <ul className="space-y-2 list-disc pl-5 text-neutral-600 marker:text-[#9E6B20]">
                  <li>
                    Spanning from the 8th day up to 365 days (1 year) post-invoice issuance, Flazo extends an official warranty against internal electrical failures and component defects.
                  </li>
                  <li>
                    Validated hardware claims are processed via doorstep logistics, ensuring seamless pickup, professional evaluation, and service or repair under zero shipping charges across India.
                  </li>
                </ul>
              </div>

              {/* 3. Policy Exclusions & Limitations */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#E8D7BE]">
                <h4 className="font-bold text-[#1A1A1A] text-sm sm:text-base mb-2">
                  3. Policy Exclusions &amp; Limitations
                </h4>
                <p className="text-neutral-600 mb-2">
                  The warranty framework explicitly voids coverage for:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-neutral-600 marker:text-[#9E6B20]">
                  <li>
                    Physical structural damage, crushing, or fractures resulting from external mishandling.
                  </li>
                  <li>
                    Liquid damage caused by submersion beyond certified IPX5 ratings.
                  </li>
                  <li>
                    Unauthorized modifications, third-party teardowns, or user-inflicted tampering.
                  </li>
                  <li>
                    Standard cosmetic wear, fading, or superficial scratches accumulated through routine daily usage.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

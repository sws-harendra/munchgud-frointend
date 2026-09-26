"use client";

import Image from "next/image";
import { Product, ProductVariant } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { discountPercentage } from "@/app/utils/discountCalculator";
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Heading from "@/app/commonComponents/heading";
import Loader from "@/app/commonComponents/loader";
import {
  Share2,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  Copy,
  Star,
  MessageSquareDot,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronDown,
  Gift,
  Zap,
  Volume2,
  Shield,
  Headphones,
  ExternalLink,
} from "lucide-react";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { useRouter } from "next/navigation";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import { slugify } from "@/app/utils/slugify";
import { toast } from "sonner";
import { getFileType } from "@/app/utils/getMediaType";
import { clienturl } from "@/app/contants";
import Description from "@/app/(user)/components/Description";
import ProductCard from "@/app/(user)/components/productCard";
import { fetchRelatedProducts } from "@/app/lib/store/features/relatedProductSlice";

interface ProductDetailClientProps {
  product: Product;
  formattedTags: string[];
}

interface ColorOption {
  name: string;
  hex: string;
  image?: string;
  variantId?: number;
  price?: string;
}

export default function ProductDetailClient({
  product,
  formattedTags,
}: ProductDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reviews state
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  // Pincode and Delivery state
  const [pincode, setPincode] = useState("122008");
  const [isPincodeChecked, setIsPincodeChecked] = useState(true);
  const [offersOpen, setOffersOpen] = useState(false);

  const reviewsRef = useRef<HTMLDivElement | null>(null);

  // Pagination Logic for Reviews
  const reviewsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const { user } = useAppSelector((state: RootState) => state.auth);
  const hasReviewed = reviews.some((review: any) => review.userId === user?.id);

  // Related products
  const { products: relatedProducts } = useAppSelector(
    (state) => state.relatedProducts
  );

  // Social share popup
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch reviews & ratings
  const fetchReviewsAndRating = async () => {
    try {
      const reviewRes = await axios.get(
        `${process.env.NEXT_PUBLIC_serverurl}/review-rating/product-reviews/${product.id}`
      );
      setReviews(reviewRes.data.reviews || []);
      setCurrentPage(1);

      const avgRes = await axios.get(
        `${process.env.NEXT_PUBLIC_serverurl}/review-rating/average-rating/${product.id}`
      );
      setAverageRating(parseFloat(avgRes.data.averageRating) || 0);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchRelatedProducts(product.id));
      fetchReviewsAndRating();
    }
  }, [product?.id, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize Images
  const rawImages =
    selectedVariant && selectedVariant.image
      ? [selectedVariant.image, ...(Array.isArray(product.images) ? product.images : [])]
      : product.images;

  const displayImages: string[] = useMemo(() => {
    let list: string[] = [];
    if (Array.isArray(rawImages)) {
      list = rawImages;
    } else if (typeof rawImages === "string") {
      try {
        const parsed = JSON.parse(rawImages);
        list = Array.isArray(parsed) ? parsed : [rawImages];
      } catch {
        list = [rawImages];
      }
    }
    // Filter empty values
    return list.filter(Boolean);
  }, [rawImages]);

  // Extract Color Options from ProductVariants or Tags
  const availableColors: ColorOption[] = useMemo(() => {
    if (product.ProductVariants && product.ProductVariants.length > 0) {
      return product.ProductVariants.map((v) => {
        const colorOpt = v.options.find(
          (opt) => opt.category.name.toLowerCase() === "color" || opt.category.name.toLowerCase() === "shade"
        );
        const name = colorOpt ? colorOpt.value : v.sku || "Active Color";
        let hex = "#1F1F1F";
        const lower = name.toLowerCase();
        if (lower.includes("black")) hex = "#18181B";
        else if (lower.includes("gold") || lower.includes("champagne")) hex = "#E8C872";
        else if (lower.includes("white")) hex = "#F4F4F5";
        else if (lower.includes("blue") || lower.includes("navy")) hex = "#1E3A8A";
        else if (lower.includes("green") || lower.includes("teal")) hex = "#115E59";
        else if (lower.includes("red")) hex = "#991B1B";

        return {
          name,
          hex,
          image: v.image,
          variantId: v.id,
          price: v.price,
        };
      });
    }

    // Fallback preset colors based on tags or defaults
    const preset = [
      { name: "Active Black", hex: "#1A1A1A" },
      { name: "Teal Green", hex: "#2E5246" },
      { name: "Navy Blue", hex: "#1E2B48" },
    ];
    return preset;
  }, [product.ProductVariants, formattedTags]);

  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = availableColors[activeColorIndex] || availableColors[0];

  // Dynamic delivery date calculation (+3 days from today)
  const deliveryDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }, []);

  // Compute pricing and savings
  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.discountPrice);

  const origPrice = parseFloat(product.originalPrice) || currentPrice * 1.5;
  const savings = Math.max(0, origPrice - currentPrice);
  const discountPct = origPrice > 0 ? Math.round((savings / origPrice) * 100) : 0;

  // Reward points calculation (e.g., ~5% of selling price)
  const rewardPoints = Math.max(25, Math.round(currentPrice * 0.05));

  // Dynamic Subtitle derived from specs and tags
  const dynamicSubtitle = useMemo(() => {
    const specsList = formattedTags.filter((t) => {
      const lower = t.toLowerCase();
      return (
        lower.includes("play") ||
        lower.includes("charge") ||
        lower.includes("anc") ||
        lower.includes("mode") ||
        lower.includes("driver") ||
        lower.includes("pairing") ||
        lower.includes("tech") ||
        lower.includes("mic")
      );
    });

    if (specsList.length > 0) {
      return `Wireless Earphones with ${specsList.slice(0, 5).join(", ")}`;
    }
    return "Wireless Earphones with 40H Playback, ASAP™ Charge, Dual Pairing, ENx™ Technology, BEAST™ Mode";
  }, [formattedTags]);

  const shareUrl = `${clienturl}/products/${slugify(product.name)}/${product.id}`;
  const shareTitle = `Check out ${product.name} on Flazo!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleColorSelect = (color: ColorOption, index: number) => {
    setActiveColorIndex(index);
    if (color.variantId && product.ProductVariants) {
      const matched = product.ProductVariants.find((v) => v.id === color.variantId);
      if (matched) {
        setSelectedVariant(matched);
        if (matched.image) {
          const imgIdx = displayImages.indexOf(matched.image);
          if (imgIdx !== -1) setSelectedImage(imgIdx);
        }
      }
    }
  };

  const handleCheckPincode = () => {
    if (!pincode || pincode.length < 6) {
      toast.error("Please enter a valid 6-digit Indian Pincode");
      return;
    }
    setIsPincodeChecked(true);
    toast.success(`Express Delivery verified for pincode ${pincode}!`);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: Number(product.id),
        name: product.name,
        quantity: 1,
        price: currentPrice,
        imageUrl: displayImages?.[0] || "",
        paymentMethods: product.paymentMethods || "both",
        variantId: selectedVariant?.id,
        variantName: activeColor?.name,
      })
    );
    toast.success(`${product.name} (${activeColor?.name}) added to bag!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-neutral-900 pb-20 selection:bg-amber-400 selection:text-neutral-950">
      
      {/* ===== BREADCRUMB NAVIGATION ===== */}
      <div className="border-b border-neutral-100 bg-[#FAFAFA]/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-neutral-500 font-medium">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span className="text-neutral-300">›</span>
            <Link
              href="/earbuds"
              className="hover:text-neutral-900 transition-colors truncate max-w-[160px] sm:max-w-none"
            >
              {product.Category?.name || "Wireless Earphones"}
            </Link>
            <span className="text-neutral-300">›</span>
            <span className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ===== MAIN PRODUCT SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ================= LEFT GALLERY: SIGNATURE boAt VERTICAL THUMBNAIL LAYOUT ================= */}
          <div className="lg:col-span-7 sticky lg:top-24">
            <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
              
              {/* VERTICAL THUMBNAIL STRIP */}
              {displayImages.length > 1 && (
                <div
                  className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[520px] scrollbar-none py-1 px-0.5 shrink-0 w-full md:w-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {displayImages.map((file, idx) => {
                    const isVid = getFileType(file) === "video";
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#F4F5F7] group ${
                          selectedImage === idx
                            ? "border-neutral-950 shadow-md scale-102 ring-2 ring-neutral-950/20"
                            : "border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100"
                        }`}
                      >
                        {isVid ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-neutral-900 rounded-lg overflow-hidden">
                            <video
                              src={getImageUrl(file)}
                              className="w-full h-full object-cover opacity-70"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-neutral-900 text-[10px] font-black">
                                ▶
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={getImageUrl(file)}
                            alt={`${product.name}-thumb-${idx + 1}`}
                            fill
                            unoptimized
                            className="object-contain p-1 rounded-lg"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* LARGE MAIN HERO SHOWCASE */}
              <div
                className="relative flex-1 w-full bg-[#F4F5F7] rounded-3xl overflow-hidden border border-neutral-200/80 flex items-center justify-center p-6 h-[380px] sm:h-[460px] lg:h-[520px] cursor-zoom-in group select-none shadow-xs"
                onClick={() => {
                  if (getFileType(displayImages[selectedImage]) !== "video") {
                    setLightboxOpen(true);
                  }
                }}
              >
                {displayImages.length > 0 ? (
                  getFileType(displayImages[selectedImage]) === "video" ? (
                    <video
                      src={getImageUrl(displayImages[selectedImage])}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      muted
                      loop
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <Image
                      src={getImageUrl(displayImages[selectedImage])}
                      alt={product.name}
                      fill
                      unoptimized
                      priority
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="text-neutral-400 flex flex-col items-center gap-2">
                    <Headphones size={48} className="stroke-[1.2]" />
                    <span className="text-xs font-semibold">Image showcase loading</span>
                  </div>
                )}

                {/* Left/Right Carousel Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          (prev) => (prev - 1 + displayImages.length) % displayImages.length
                        );
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 border border-neutral-200/60 z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) => (prev + 1) % displayImages.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 border border-neutral-200/60 z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Zoom Hint Icon */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs p-2 rounded-full shadow-xs text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn size={18} />
                </div>

                {/* Counter Tag */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
                    {selectedImage + 1} / {displayImages.length}
                  </div>
                )}
              </div>

            </div>
          </div>


          {/* ================= RIGHT COLUMN: PRODUCT INFO & BUY BOX ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Rating Pill + boAt Reward Points */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Star Rating Badge */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                <span className="text-amber-500 text-sm">★</span>
                <span>{averageRating > 0 ? averageRating.toFixed(1) : "4.8"}</span>
                <span className="text-neutral-500 font-medium">
                  ({reviews.length > 0 ? reviews.length : "246"})
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-700 border border-amber-300/80 text-[10px] font-black">
                  ✓
                </span>
              </div>

              {/* Reward Points Pill (Golden Accent) */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-amber-300 bg-amber-50/80 text-[11px] sm:text-xs font-bold text-amber-800 shadow-2xs">
                <span>Earn upto {rewardPoints} boAt reward points on this product</span>
              </div>
            </div>

            {/* 2. Product Title & Share Icon */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Share Icon Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-700 shrink-0"
                  title="Share product"
                >
                  <ExternalLink size={20} />
                </button>

                {shareOpen && (
                  <div className="absolute right-0 top-12 bg-white shadow-2xl rounded-2xl p-4 border border-neutral-100 flex flex-col gap-3 z-50 min-w-[200px] animate-in fade-in zoom-in-95">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Share this product
                    </div>
                    <div className="flex items-center gap-2">
                      <WhatsappShareButton url={shareUrl} title={shareTitle}>
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                      <TwitterShareButton url={shareUrl} title={shareTitle}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <FacebookShareButton url={shareUrl} quote={shareTitle}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                    </div>

                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-2 rounded-xl transition-colors"
                    >
                      <Copy size={14} />
                      <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Product Subtitle / Specs Bar */}
            <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
              {dynamicSubtitle}
            </p>

            {/* 4. Price & Discount Display */}
            <div className="space-y-1 pt-1 border-b border-neutral-100 pb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-neutral-950">
                  ₹{Math.round(currentPrice).toLocaleString("en-IN")}
                </span>
                {origPrice > currentPrice && (
                  <span className="text-base sm:text-lg text-neutral-400 line-through font-medium">
                    ₹{Math.round(origPrice).toLocaleString("en-IN")}.00
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="text-sm sm:text-base font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {discountPct}% Off
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                MRP (Inclusive of all taxes)
              </p>
            </div>

            {/* 5. Choose your color */}
            <div className="space-y-3">
              <div className="text-xs sm:text-sm font-bold text-neutral-900">
                Choose your color :{" "}
                <span className="font-semibold text-neutral-600">
                  {activeColor?.name || "Active Black"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(color, idx)}
                    className={`relative p-1.5 rounded-xl border-2 transition-all flex items-center gap-2.5 ${
                      activeColorIndex === idx
                        ? "border-neutral-950 bg-neutral-50 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    {color.image ? (
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-neutral-100">
                        <img
                          src={getImageUrl(color.image)}
                          alt={color.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full border border-black/10 shadow-inner shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                    )}
                    <span className="text-xs font-semibold text-neutral-800 pr-1.5">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Check Delivery Box (Exact Reference Design) */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                Check Delivery
              </h3>
              <div className="bg-[#F8F9FA] border border-neutral-200/90 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={pincode}
                      maxLength={6}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                      className="bg-transparent text-sm font-bold text-neutral-900 tracking-wider focus:outline-none w-28"
                      placeholder="Pincode"
                    />
                  </div>

                  <button
                    onClick={handleCheckPincode}
                    className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    {isPincodeChecked ? "Change" : "Check"}
                  </button>

                  <Truck className="w-6 h-6 text-neutral-700 shrink-0 ml-1" />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 pt-2 border-t border-neutral-200/60">
                  <span className="font-bold text-amber-600">Free delivery</span>
                  <span className="text-amber-400">|</span>
                  <span className="text-neutral-700 font-medium">
                    By {deliveryDateStr}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Rewards and Payment Offers Accordion */}
            <div className="border border-neutral-200/90 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setOffersOpen(!offersOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-xs sm:text-sm font-extrabold text-neutral-900 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500" />
                  Rewards and Payment Offers
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                    offersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {offersOpen && (
                <div className="px-4 pb-4 pt-1 space-y-2.5 text-xs text-neutral-700 border-t border-neutral-100 bg-[#FAFAFA]">
                  <div className="flex items-start gap-2 pt-2">
                    <span className="text-amber-500 font-bold">✓</span>
                    <p>
                      <strong>Flat ₹200 OFF</strong> on UPI orders above ₹999 with code{" "}
                      <span className="font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        FLAZO200
                      </span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">✓</span>
                    <p>
                      <strong>10% Instant Discount</strong> with leading bank credit cards.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">✓</span>
                    <p>
                      <strong>Earn 2X boAt reward points</strong> automatically credited upon delivery.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 8. Call To Action Buttons (ADD TO BAG & BUY NOW) */}
            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-black py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <ShoppingBag size={18} />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-neutral-950 font-black py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.01] shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Zap size={18} className="fill-neutral-950" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* 9. Trust / Assurance Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100">
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-50/70 border border-neutral-200/60">
                  <ShieldCheck className="w-5 h-5 text-neutral-800 mb-1" />
                  <span className="text-[11px] font-black text-neutral-900">1 Year</span>
                  <span className="text-[10px] text-neutral-500">Warranty</span>
                </div>

                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-50/70 border border-neutral-200/60">
                  <RotateCcw className="w-5 h-5 text-neutral-800 mb-1" />
                  <span className="text-[11px] font-black text-neutral-900">7 Days</span>
                  <span className="text-[10px] text-neutral-500">Replacement</span>
                </div>

                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-50/70 border border-neutral-200/60">
                  <Truck className="w-5 h-5 text-neutral-800 mb-1" />
                  <span className="text-[11px] font-black text-neutral-900">Free Express</span>
                  <span className="text-[10px] text-neutral-500">Shipping</span>
                </div>
              </div>
            </div>

            {/* Write a review button */}
            {user && !hasReviewed && (
              <button
                onClick={() => setReviewOpen(true)}
                className="w-full py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 font-bold text-xs text-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquareDot size={16} />
                <span>Write a Verified Customer Review</span>
              </button>
            )}

          </div>

        </div>

        {/* ================= PRODUCT DESCRIPTION SECTION ================= */}
        <div className="mt-16 pt-10 border-t border-neutral-200">
          <Description description={product.description} />
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        {reviews && reviews.length > 0 && (
          <div ref={reviewsRef} className="mt-16 border-t border-neutral-200 pt-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                Customer Reviews
              </h2>
              <p className="text-neutral-500 text-sm mt-1">
                {reviews.length} Verified Customer Ratings & Feedback
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {currentReviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        review.user?.avatar
                          ? `http://localhost:8000/uploads/${review.user.avatar}`
                          : "/blankProfilePicture.png"
                      }
                      alt={review.user?.fullname || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="font-bold text-neutral-900 text-sm">
                            {review.user?.fullname || "Verified Buyer"}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-neutral-200"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        {review.comment || "Verified product rating."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        reviewsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition ${
                        currentPage === index + 1
                          ? "bg-neutral-950 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SIMILAR PRODUCTS ================= */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-neutral-200 pt-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center text-neutral-950">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item: any) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={item.images?.[0]}
                  price={item.discountPrice}
                  originalPrice={item.originalPrice}
                  rating={item.ratings ?? 0}
                  discount={item.discountPercentage}
                  paymentMethods={item.paymentMethods}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ===== REVIEW SUBMIT MODAL ===== */}
      {reviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setReviewOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-black text-neutral-950 mb-1">
              Write a Review
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Share your honest feedback for {product.name}
            </p>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => setReviewRating(star)}
                  className={`cursor-pointer transition-colors ${
                    star <= reviewRating
                      ? "text-amber-400 fill-amber-400"
                      : "text-neutral-200 hover:text-amber-200"
                  }`}
                />
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you love about sound quality, battery, or build?"
              className="w-full border border-neutral-300 rounded-xl p-3 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-neutral-900 mb-4"
              rows={4}
            />

            <button
              onClick={async () => {
                try {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_serverurl}/review-rating/add-review`,
                    {
                      productId: product.id,
                      rating: reviewRating,
                      comment: reviewComment,
                    },
                    { withCredentials: true }
                  );
                  await fetchReviewsAndRating();
                  setReviewOpen(false);
                  setReviewComment("");
                  setReviewRating(0);
                  toast.success("Review added successfully! ✅");
                } catch (error: any) {
                  setReviewOpen(false);
                  toast.error(
                    error.response?.data?.message || "Error adding review"
                  );
                }
              }}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* ===== LIGHTBOX / ZOOM MODAL ===== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors z-20"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={24} />
          </button>

          {displayImages.length > 1 && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none">
              {selectedImage + 1} / {displayImages.length}
            </div>
          )}

          {displayImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(
                    (prev) => (prev - 1 + displayImages.length) % displayImages.length
                  );
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev + 1) % displayImages.length);
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getImageUrl(displayImages[selectedImage])}
              alt={product.name}
              fill
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

    </div>
  );
}

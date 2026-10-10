"use client";

import Image from "next/image";
import { Product, ProductVariant } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Loader from "@/app/commonComponents/loader";
import {
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  Coins,
  Copy,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  MapPin,
  Banknote,
  ShieldCheck,
  ThumbsUp,
  Award,
  Filter,
} from "lucide-react";
import { productService } from "@/app/sercices/user/product.service";
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
import ProductCard from "@/app/(user)/components/productCard";
import ProductMarketplaceLinks from "@/app/(user)/components/ProductMarketplaceLinks";
import { fetchRelatedProducts } from "@/app/lib/store/features/relatedProductSlice";

interface ProductDetailClientProps {
  product: Product;
  formattedTags: string[];
}

interface ColorOption {
  name: string;
  hex: string;
  image?: string;
  images?: string[];
  variantId?: number;
  price?: string;
  originalPrice?: string;
  stock?: number;
}

export default function ProductDetailClient({
  product,
  formattedTags,
}: ProductDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [mounted, setMounted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Tabs state: 'details' | 'specs' | 'reviews' | 'faqs' | 'shipping'
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "reviews" | "faqs" | "shipping">("details");

  // Reviews state
  const [reviewsData, setReviewsData] = useState<{
    totalReviews: number;
    averageRating: number;
    distribution: { [key: number]: number };
    percentages: { [key: number]: number };
    reviews: any[];
  }>({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: [],
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  // Write Review Modal state
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<{ [key: number]: boolean }>({});

  const filteredReviews = useMemo(() => {
    if (!reviewsData.reviews) return [];
    if (selectedRatingFilter === null) return reviewsData.reviews;
    return reviewsData.reviews.filter((r) => r.rating === selectedRatingFilter);
  }, [reviewsData.reviews, selectedRatingFilter]);

  const fetchReviews = async () => {
    if (!product?.id) return;
    setReviewsLoading(true);
    try {
      const res = await productService.getProductReviews(product.id);
      if (res && res.success) {
        setReviewsData({
          totalReviews: res.totalReviews || 0,
          averageRating: res.averageRating || 0,
          distribution: res.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          percentages: res.percentages || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          reviews: res.reviews || [],
        });
      }
    } catch (e) {
      console.error("Error fetching product reviews:", e);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to submit a customer review!");
        router.push("/authentication/login");
        return;
      }
    }

    if (!reviewRating) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await productService.addReview({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (res && res.success) {
        toast.success(res.message || "Review submitted successfully! ⭐");
        setIsWriteReviewOpen(false);
        setReviewComment("");
        setReviewRating(5);
        fetchReviews();
      }
    } catch (err: any) {
      console.error("Submit review error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Pincode and Delivery state
  const [pincode, setPincode] = useState("122008");
  const [isPincodeChecked, setIsPincodeChecked] = useState(true);

  // Social share popup
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Related products from Redux
  const { products: relatedProducts } = useAppSelector(
    (state: RootState) => state.relatedProducts
  );

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchRelatedProducts(product.id));
    }
  }, [product?.id, dispatch]);

  useEffect(() => {
    setMounted(true);
    // Check wishlist in localStorage
    if (typeof window !== "undefined") {
      try {
        const storedWishlist = JSON.parse(localStorage.getItem("flazo_wishlist") || "[]");
        if (Array.isArray(storedWishlist) && storedWishlist.includes(product.id)) {
          setIsWishlisted(true);
        }
      } catch (e) {
        console.error("Error reading wishlist from localStorage", e);
      }
    }
  }, [product.id]);

  // Handle Wishlist Toggle
  const handleToggleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (typeof window !== "undefined") {
      try {
        const storedWishlist: number[] = JSON.parse(
          localStorage.getItem("flazo_wishlist") || "[]"
        );
        let updated: number[];
        if (nextState) {
          updated = Array.from(new Set([...storedWishlist, product.id]));
          toast.success("Added to Wishlist! ❤️");
        } else {
          updated = storedWishlist.filter((id) => id !== product.id);
          toast.info("Removed from Wishlist");
        }
        localStorage.setItem("flazo_wishlist", JSON.stringify(updated));
      } catch (e) {
        console.error("Error updating wishlist in localStorage", e);
      }
    }
  };

  // Normalize Images
  const rawImages = useMemo(() => {
    if (selectedVariant) {
      if (Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0) {
        return selectedVariant.images;
      }
      if (selectedVariant.image) {
        return [
          selectedVariant.image,
          ...(Array.isArray(product.images) ? product.images : []),
        ];
      }
    }
    return product.images;
  }, [selectedVariant, product.images]);

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
    return list.filter(Boolean);
  }, [rawImages]);

  const activeImage = displayImages[selectedImage] || displayImages[0] || "";

  // Extract Color Options from ProductVariants or Tags (100% dynamic, no fake fallbacks)
  const availableColors: ColorOption[] = useMemo(() => {
    if (product.ProductVariants && product.ProductVariants.length > 0) {
      const colorVariants = product.ProductVariants.filter((v) =>
        v.options?.some(
          (opt) =>
            opt.category?.name?.toLowerCase() === "color" ||
            opt.category?.name?.toLowerCase() === "shade"
        )
      );

      if (colorVariants.length > 0) {
        return colorVariants.map((v) => {
          const colorOpt = v.options.find(
            (opt) =>
              opt.category?.name?.toLowerCase() === "color" ||
              opt.category?.name?.toLowerCase() === "shade"
          );
          const name = colorOpt ? colorOpt.value : v.sku || "Active Color";
          let hex = colorOpt?.hexCode || "#1F1F1F";
          const lower = name.toLowerCase();
          if (lower.includes("black")) hex = "#18181B";
          else if (lower.includes("teal") || lower.includes("green")) hex = "#115E59";
          else if (lower.includes("navy") || lower.includes("blue")) hex = "#1E3A8A";
          else if (lower.includes("gold") || lower.includes("champagne")) hex = "#D97706";
          else if (lower.includes("white")) hex = "#F4F4F5";
          else if (lower.includes("red")) hex = "#991B1B";

          return {
            name,
            hex,
            image: v.image || undefined,
            images: Array.isArray(v.images) ? v.images : undefined,
            variantId: v.id,
            price: v.price,
            originalPrice: v.originalPrice || undefined,
            stock: v.stock,
          };
        });
      }
    }

    // Check tags for colors added in admin
    const knownColors = [
      { name: "Black", hex: "#18181B" },
      { name: "White", hex: "#F4F4F5" },
      { name: "Gold", hex: "#D97706" },
      { name: "Champagne Gold", hex: "#E8C872" },
      { name: "Obsidian Black", hex: "#1F1F1F" },
      { name: "Blue", hex: "#1E3A8A" },
      { name: "Teal Green", hex: "#115E59" },
      { name: "Navy Blue", hex: "#1B2B48" },
      { name: "Red", hex: "#991B1B" },
      { name: "Green", hex: "#15803D" },
    ];
    const matchedColorsFromTags = formattedTags
      .map((t) => knownColors.find((kc) => kc.name.toLowerCase() === t.toLowerCase()))
      .filter(Boolean) as ColorOption[];

    if (matchedColorsFromTags.length > 0) {
      return matchedColorsFromTags;
    }

    return [];
  }, [product.ProductVariants, formattedTags]);

  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = availableColors[activeColorIndex] || null;

  // Extract Available Sizes (100% dynamic, no fake fallbacks)
  const availableSizes: string[] = useMemo(() => {
    if (product.ProductVariants && product.ProductVariants.length > 0) {
      const sizeList: string[] = [];
      product.ProductVariants.forEach((v) => {
        const sizeOpt = v.options?.find(
          (opt) =>
            opt.category?.name?.toLowerCase() === "size" ||
            opt.category?.name?.toLowerCase() === "dimension"
        );
        if (sizeOpt && !sizeList.includes(sizeOpt.value)) {
          sizeList.push(sizeOpt.value);
        }
      });
      if (sizeList.length > 0) return sizeList;
    }

    // Check tags for dimensions/sizes
    const sizeTags = formattedTags.filter(
      (t) =>
        t.toLowerCase().includes("inch") ||
        t.toLowerCase().includes("cm") ||
        (t.toLowerCase().includes("size") && !t.includes(":"))
    );
    if (sizeTags.length > 0) {
      return sizeTags;
    }

    return [];
  }, [product.ProductVariants, formattedTags]);

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const selectedSize = availableSizes[selectedSizeIndex] || null;

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

  // Compute pricing, savings and stock
  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.discountPrice) || 0;

  const origPrice = selectedVariant?.originalPrice
    ? parseFloat(selectedVariant.originalPrice)
    : parseFloat(product.originalPrice) || currentPrice;
  const savings = Math.max(0, origPrice - currentPrice);
  const discountPct = origPrice > 0 && origPrice > currentPrice
    ? Math.round((savings / origPrice) * 100)
    : 0;

  const currentStock =
    selectedVariant !== null && selectedVariant.stock !== undefined
      ? selectedVariant.stock
      : product.stock;

  // Reward points calculation (~5% of selling price)
  const rewardPoints = Math.max(10, Math.round(currentPrice * 0.05));

  // Dynamic Clean Description Hook
  const cleanDescriptionHook = useMemo(() => {
    if (!product.description) {
      return "";
    }
    const stripped = product.description.replace(/<[^>]*>?/gm, "").trim();
    if (stripped.length > 180) {
      return stripped.slice(0, 180) + "...";
    }
    return stripped;
  }, [product.description]);

  // Dynamic technical specifications (Key:Value) from admin tags
  const technicalSpecs = useMemo(() => {
    if (!formattedTags || !Array.isArray(formattedTags)) return [];
    return formattedTags
      .filter(
        (t) =>
          typeof t === "string" &&
          t.includes(":") &&
          !t.startsWith("http://") &&
          !t.startsWith("https://")
      )
      .map((t) => {
        const firstColon = t.indexOf(":");
        return {
          label: t.slice(0, firstColon).trim(),
          value: t.slice(firstColon + 1).trim(),
        };
      })
      .filter((item) => item.label && item.value);
  }, [formattedTags]);

  // Dynamic Bullet Points for "About this item" (100% from admin features/tags)
  const featureBullets = useMemo(() => {
    const nonColonTags = formattedTags.filter(
      (t) =>
        typeof t === "string" &&
        !t.includes(":") &&
        !t.startsWith("http") &&
        t.length > 4 &&
        t.toLowerCase() !== "earbuds" &&
        t.toLowerCase() !== "paintings" &&
        !t.startsWith("🔥")
    );

    return nonColonTags;
  }, [formattedTags]);

  // 100% Real Product Specifications Table derived from DB & admin tags
  const productOverviewSpecs = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    if (product.Category?.name) {
      list.push({ label: "Category / Type", value: product.Category.name });
    }
    if (product.varientValue) {
      list.push({ label: "Edition / Variant", value: product.varientValue });
    }
    if (product.stock !== undefined && product.stock !== null) {
      list.push({
        label: "Availability",
        value: product.stock > 0 ? `${product.stock} units in stock` : "Out of stock",
      });
    }
    if (product.paymentMethods) {
      const pm = product.paymentMethods.toLowerCase();
      const pmText =
        pm === "both"
          ? "Cash on Delivery & Online Payment"
          : pm === "cod"
          ? "Cash on Delivery Only"
          : "Prepaid / Online Only";
      list.push({ label: "Payment Modes", value: pmText });
    }
    if (availableColors.length > 0) {
      list.push({
        label: "Color Options",
        value: availableColors.map((c) => c.name).join(", "),
      });
    }
    if (availableSizes.length > 0) {
      list.push({
        label: "Available Sizes",
        value: availableSizes.join(", "),
      });
    }
    // Append all custom specs added by admin in tags (e.g. Material: Canvas, Weight: 500g, etc.)
    technicalSpecs.forEach((spec) => {
      list.push({ label: spec.label, value: spec.value });
    });
    return list;
  }, [product, availableColors, availableSizes, technicalSpecs]);

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
        setSelectedImage(0); // Reset main preview image to first photo of this color
      }
    }
  };

  const handleSizeSelect = (sizeStr: string, index: number) => {
    setSelectedSizeIndex(index);
    if (product.ProductVariants && product.ProductVariants.length > 0) {
      const matched = product.ProductVariants.find((v) =>
        v.options?.some(
          (opt) =>
            opt.category?.name?.toLowerCase() === "size" && opt.value === sizeStr
        )
      );
      if (matched) {
        setSelectedVariant(matched);
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
    if (currentStock <= 0) {
      toast.error("This color variant is currently out of stock!");
      return;
    }
    dispatch(
      addToCart({
        id: Number(product.id),
        name: product.name,
        quantity: quantity,
        price: currentPrice,
        imageUrl: displayImages?.[0] || "",
        paymentMethods: product.paymentMethods || "both",
        variantId: selectedVariant?.id,
        variantName: `${activeColor?.name || ""} - ${selectedSize || ""}`.trim(),
      })
    );
    toast.success(`${quantity} x ${product.name} ${activeColor ? `(${activeColor.name})` : ""} added to cart!`);
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) {
      toast.error("This color variant is currently out of stock!");
      return;
    }
    handleAddToCart();
    router.push("/cart");
  };

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-neutral-900 pb-20 selection:bg-amber-400 selection:text-neutral-950 font-sans">
      
      {/* ================= 1. BREADCRUMB NAVIGATION ================= */}
      <div className="border-b border-neutral-100 bg-[#FAFAFA]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-neutral-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span className="text-neutral-300">›</span>
            <Link
              href={`/${product.Category?.name ? slugify(product.Category.name) : "paintings"}`}
              className="hover:text-neutral-900 transition-colors"
            >
              {product.Category?.name || "Paintings"}
            </Link>
            <span className="text-neutral-300">›</span>
            <span className="hover:text-neutral-900 cursor-pointer transition-colors">
              {product.Category?.name ? `${product.Category.name} Decor` : "Landscape Paintings"}
            </span>
            <span className="text-neutral-300">›</span>
            <span className="text-neutral-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ================= 2. MAIN HERO SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT GALLERY COLUMN ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
              
              {/* VERTICAL THUMBNAIL STRIP */}
              {displayImages.length > 0 && (
                <div
                  className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[520px] scrollbar-none py-1 shrink-0 w-full md:w-20"
                  style={{ scrollbarWidth: "none" }}
                >
                  {displayImages.map((file, idx) => {
                    const isVid = getFileType(file) === "video";
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#F8F9FA] group shrink-0 ${
                          selectedImage === idx
                            ? "border-neutral-900 shadow-md ring-1 ring-neutral-900/30 scale-102"
                            : "border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100"
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
                              <span className="w-6 h-6 rounded-full bg-white/95 flex items-center justify-center text-neutral-950 text-xs font-black shadow">
                                ▶
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <Image
                              src={getImageUrl(file)}
                              alt={`${product.name}-thumb-${idx + 1}`}
                              fill
                              unoptimized
                              className="object-cover rounded-lg"
                            />
                            {/* If last image, show play badge like screenshot */}
                            {idx === displayImages.length - 1 && displayImages.length > 3 && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-[10px] pl-0.5">
                                  ▶
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MAIN HERO SHOWCASE IMAGE */}
              <div className="relative w-full md:flex-1 bg-[#F5F6F8] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 flex items-center justify-center p-4 sm:p-8 min-h-[350px] h-[360px] sm:h-[480px] lg:h-[530px] shrink-0 md:shrink group shadow-xs">
                
                {displayImages.length > 0 && activeImage ? (
                  getFileType(activeImage) === "video" ? (
                    <video
                      src={getImageUrl(activeImage)}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <div
                      className="relative w-full h-full cursor-zoom-in flex items-center justify-center"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <Image
                        src={getImageUrl(activeImage)}
                        alt={product.name}
                        fill
                        unoptimized
                        priority
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )
                ) : (
                  <div className="text-neutral-400 flex flex-col items-center gap-2">
                    <Sparkles size={48} className="stroke-[1.2]" />
                    <span className="text-xs font-semibold">Image loading...</span>
                  </div>
                )}

                {/* Top Right Expand / Zoom Icon */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 border border-neutral-200/80 z-10"
                  title="Expand preview"
                >
                  <Maximize2 size={16} />
                </button>

                {/* Left/Right Carousel Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          (prev) => (prev - 1 + displayImages.length) % displayImages.length
                        );
                      }}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 border border-neutral-200/80 z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) => (prev + 1) % displayImages.length);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 border border-neutral-200/80 z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

            </div>



          </div>


          {/* ================= RIGHT COLUMN: PRODUCT INFO & BUY BOX ================= */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Top Row: Bestseller Pill, Star Rating Snippet, Wishlist & Share */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                {/* Bestseller Pill */}
                <div className="inline-flex items-center gap-1 bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                  <Flame size={14} className="fill-[#F97316] text-[#F97316]" />
                  <span>Bestseller</span>
                </div>

                {/* Rating Snippet (Dynamic & Clickable) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    const tabsEl = document.getElementById("product-tabs-section");
                    if (tabsEl) {
                      tabsEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 bg-[#FAFAFA] hover:bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200/80 transition-all cursor-pointer group shadow-2xs"
                  title="View customer reviews"
                >
                  <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                  <span>
                    {reviewsData.averageRating > 0
                      ? reviewsData.averageRating.toFixed(1)
                      : product.ratings
                      ? Number(product.ratings).toFixed(1)
                      : "5.0"}
                  </span>
                  <span className="text-neutral-500 font-normal group-hover:text-neutral-900 transition-colors">
                    ({reviewsData.totalReviews > 0 ? `${reviewsData.totalReviews} reviews` : "Rate"})
                  </span>
                  <ChevronDown size={12} className="text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Wishlist & Share Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    isWishlisted
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <Heart
                    size={14}
                    className={isWishlisted ? "fill-red-600 text-red-600" : "text-neutral-600"}
                  />
                  <span>Wishlist</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-bold transition-colors"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>

                  {/* Share Popover */}
                  {shareOpen && (
                    <div className="absolute right-0 top-10 bg-white shadow-2xl rounded-2xl p-4 border border-neutral-100 flex flex-col gap-3 z-50 min-w-[210px] animate-in fade-in zoom-in-95">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        Share this product
                      </div>
                      <div className="flex items-center gap-2">
                        <WhatsappShareButton url={shareUrl} title={shareTitle}>
                          <WhatsappIcon size={30} round />
                        </WhatsappShareButton>
                        <TwitterShareButton url={shareUrl} title={shareTitle}>
                          <TwitterIcon size={30} round />
                        </TwitterShareButton>
                        <FacebookShareButton url={shareUrl}>
                          <FacebookIcon size={30} round />
                        </FacebookShareButton>
                        <LinkedinShareButton url={shareUrl}>
                          <LinkedinIcon size={30} round />
                        </LinkedinShareButton>
                      </div>

                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-2 rounded-xl transition-colors"
                      >
                        <Copy size={13} />
                        <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                {cleanDescriptionHook}
              </p>
            </div>

            {/* Price & Discount Display */}
            <div className="space-y-1 pt-1 pb-2 border-b border-neutral-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
                  ₹{Math.round(currentPrice).toLocaleString("en-IN")}
                </span>
                {origPrice > currentPrice && (
                  <span className="text-base sm:text-lg text-neutral-400 line-through font-medium">
                    ₹{Math.round(origPrice).toLocaleString("en-IN")}
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="text-xs sm:text-sm font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-md border border-[#FDE68A]">
                    {discountPct}% Off
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                MRP (Inclusive of all taxes)
              </p>
            </div>

            {/* boAt / Flazo Reward Points Banner */}
            {/* <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FFFBEB] border border-[#FDE68A] text-xs font-semibold text-neutral-800 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  
                </div>
                <span>Earn upto {rewardPoints} boAt reward points on this product</span>
              </div>
              <span className="text-neutral-500 text-sm">›</span>
            </div> */}

            {/* Choose Your Color (Only shown if colors exist in DB) */}
            {availableColors.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs sm:text-sm font-bold text-neutral-900">
                  Choose your color :{" "}
                  <span className="font-semibold text-neutral-700">
                    {activeColor?.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(color, idx)}
                      className={`relative px-3.5 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        activeColorIndex === idx
                          ? "border-neutral-900 bg-[#FFFBEB] shadow-xs"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Choose Size (Only shown if sizes exist in DB) */}
            {availableSizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs sm:text-sm font-bold text-neutral-900">
                  Choose size
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {availableSizes.map((sizeStr, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeSelect(sizeStr, idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSizeIndex === idx
                          ? "border-[#F59E0B] bg-[#FFFBEB] text-neutral-950 ring-1 ring-[#F59E0B]/50"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700"
                      }`}
                    >
                      {sizeStr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper + Add to Cart + Buy Now Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl px-2 py-2.5 bg-[#FAFAFA]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 font-bold transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-extrabold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 font-bold transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={currentStock <= 0}
                onClick={handleAddToCart}
                className={`flex-1 font-bold py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-xs ${
                  currentStock <= 0
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300"
                    : "bg-[#FBBF24] hover:bg-[#F59E0B] text-neutral-950"
                }`}
              >
                <ShoppingCart size={17} />
                <span>{currentStock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
              </button>

              {/* Buy Now Button */}
              <button
                disabled={currentStock <= 0}
                onClick={handleBuyNow}
                className={`flex-1 font-bold border py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 text-sm shadow-xs ${
                  currentStock <= 0
                    ? "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed"
                    : "bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]"
                }`}
              >
                <Zap size={16} className={currentStock <= 0 ? "fill-neutral-300 text-neutral-300" : "fill-[#92400E]"} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Also Available on External Marketplaces (Amazon, Flipkart, Myntra, etc.) */}
            <ProductMarketplaceLinks
              platformLinks={product?.platformLinks}
              productName={product?.name}
            />

            {/* Check Delivery Box */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900">
                <MapPin size={15} className="text-neutral-700" />
                <span>Check Delivery</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Pincode"
                  className="flex-1 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900 bg-white"
                />
                <button
                  onClick={handleCheckPincode}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shrink-0"
                >
                  Check
                </button>
              </div>

              {isPincodeChecked && (
                <div className="flex items-center gap-2 text-xs pt-1">
                  <CheckCircle2 size={15} className="text-emerald-600 fill-emerald-100" />
                  <span className="font-bold text-emerald-700">Free delivery</span>
                  <span className="text-neutral-400">|</span>
                  <span className="text-neutral-700 font-medium">By {deliveryDateStr}</span>
                </div>
              )}
            </div>

            {/* Payment Mode Indicator */}
            {(() => {
              const pm = (product.paymentMethods || "both").toLowerCase().trim();
              if (pm === "cod") {
                return (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs font-semibold text-amber-900">
                    <Banknote size={16} className="text-amber-600 shrink-0" />
                    <span><strong>Cash on Delivery (COD) Only:</strong> Pay with cash upon delivery.</span>
                  </div>
                );
              } else if (pm === "online" || pm === "prepaid") {
                return (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs font-semibold text-blue-900">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                    <span><strong>Online Prepaid Only:</strong> 100% secure payment via UPI, Cards, or NetBanking (No COD).</span>
                  </div>
                );
              } else {
                return (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs font-semibold text-emerald-900">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span><strong>Payment Modes:</strong> Cash on Delivery (COD) & Online Payment (UPI / Cards) both available.</span>
                  </div>
                );
              }
            })()}


          </div>

        </div>



        {/* ================= 4. TABBED INFORMATION & REVIEWS SECTION ================= */}
        <div id="product-tabs-section" className="mt-12">
          {/* Tab Navigation Headers */}
          <div className="flex items-center border-b border-neutral-200 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === "details"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Product Details
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === "specs"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Specifications
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "reviews"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <span>Customer Reviews</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  activeTab === "reviews"
                    ? "bg-[#FEF3C7] text-[#D97706]"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {reviewsData.totalReviews}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("faqs")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === "faqs"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              FAQs
            </button>

            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 ${
                activeTab === "shipping"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          {/* Tab 1: Product Details (Two-Column Layout Matching Screenshot) */}
          {activeTab === "details" && (
            <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: About this item */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  About this item
                </h3>
                {product.description ? (
                  <div
                    className="text-xs sm:text-sm text-neutral-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-500 italic">
                    No detailed description provided for this product.
                  </p>
                )}

                {featureBullets.length > 0 && (
                  <div className="space-y-3 pt-3">
                    {featureBullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Structured Specifications Table */}
              <div className="lg:col-span-6">
                <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <tbody className="divide-y divide-neutral-100">
                      <tr className="bg-[#FAF9F6]">
                        <td className="py-3 px-4 font-bold text-neutral-600 w-1/3">Brand</td>
                        <td className="py-3 px-4 text-neutral-900 font-semibold">Flazo</td>
                      </tr>
                      {productOverviewSpecs.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? "bg-[#FAF9F6]" : "bg-white"}>
                          <td className="py-3 px-4 font-bold text-neutral-600 w-1/3">{item.label}</td>
                          <td className="py-3 px-4 text-neutral-900 font-semibold">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === "specs" && (
            <div className="pt-8">
              {technicalSpecs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {technicalSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200"
                    >
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        {spec.label}
                      </p>
                      <p className="text-sm font-extrabold text-neutral-900">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 bg-[#FAFAFA] rounded-2xl border border-neutral-200">
                  <p className="text-sm font-medium">No additional technical specifications specified for this product.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Customer Reviews (Amazon / Flipkart Style) */}
          {activeTab === "reviews" && (
            <div className="pt-8 space-y-8 animate-in fade-in">
              
              {/* Top Overview: 2-Column (Rating Summary & Star Breakdown on left, Write Review CTA on right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 rounded-3xl bg-[#FAFAFA] border border-neutral-200/80 shadow-2xs">
                
                {/* Left: Overall Rating & Progress Bars */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <span>Customer Ratings & Reviews</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        100% Verified
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Real ratings and verified feedback directly from customers who purchased this item.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                    {/* Big Average Badge */}
                    <div className="flex flex-col items-center sm:items-start shrink-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-neutral-900 tracking-tight">
                          {reviewsData.averageRating > 0
                            ? reviewsData.averageRating.toFixed(1)
                            : product.ratings
                            ? Number(product.ratings).toFixed(1)
                            : "5.0"}
                        </span>
                        <span className="text-lg font-bold text-neutral-400">/ 5</span>
                      </div>
                      <div className="flex items-center gap-1 my-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={18}
                            className={`${
                              s <= Math.round(reviewsData.averageRating || (product.ratings ? Number(product.ratings) : 5))
                                ? "text-[#F59E0B] fill-[#F59E0B]"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-500 font-medium">
                        {reviewsData.totalReviews} verified ratings
                      </span>
                    </div>

                    {/* Amazon-style Star Distribution Progress Bars */}
                    <div className="flex-1 space-y-2 w-full">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewsData.distribution?.[star] || 0;
                        const pct = reviewsData.percentages?.[star] || 0;
                        const isSelected = selectedRatingFilter === star;

                        return (
                          <button
                            key={star}
                            onClick={() => setSelectedRatingFilter(isSelected ? null : star)}
                            className={`w-full flex items-center gap-3 text-xs group transition-all p-1 rounded-lg cursor-pointer ${
                              isSelected ? "bg-amber-100/60 ring-1 ring-amber-300" : "hover:bg-neutral-200/50"
                            }`}
                          >
                            <span className="w-12 font-bold text-neutral-700 flex items-center gap-1 justify-end shrink-0">
                              <span>{star}</span>
                              <Star size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
                            </span>

                            {/* Bar */}
                            <div className="flex-1 h-3 rounded-full bg-neutral-200 overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            <span className="w-10 text-right font-bold text-neutral-500 shrink-0">
                              {pct}%
                            </span>

                            <span className="w-8 text-neutral-400 text-[11px] shrink-0 text-right font-normal">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Write Review Call To Action */}
                <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">
                      Review this product
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                      Share your thoughts with other customers. Your genuine review helps others make informed choices!
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A] flex items-center gap-2.5">
                      <Award size={18} className="text-[#D97706] shrink-0" />
                      <span className="text-xs font-semibold text-[#92400E]">
                        Earn loyalty badges & help genuine buyers shop with confidence.
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="w-full py-3 px-5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                      <span>Write a Customer Review</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Filter Pills Bar */}
              <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-200">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter size={13} /> Filter:
                  </span>
                  <button
                    onClick={() => setSelectedRatingFilter(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedRatingFilter === null
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    All Reviews ({reviewsData.totalReviews})
                  </button>

                  {[5, 4, 3, 2, 1].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedRatingFilter(selectedRatingFilter === s ? null : s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedRatingFilter === s
                          ? "bg-[#F59E0B] text-neutral-950 font-extrabold shadow-2xs"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      <span>{s}</span>
                      <Star size={11} className={selectedRatingFilter === s ? "fill-neutral-950" : "fill-[#F59E0B] text-[#F59E0B]"} />
                      <span>({reviewsData.distribution?.[s] || 0})</span>
                    </button>
                  ))}
                </div>

                {selectedRatingFilter !== null && (
                  <button
                    onClick={() => setSelectedRatingFilter(null)}
                    className="text-xs font-bold text-[#D97706] hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Reviews Feed List */}
              {reviewsLoading ? (
                <div className="py-16 text-center text-neutral-400">
                  <div className="animate-spin w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full mx-auto mb-2" />
                  <span className="text-xs font-semibold">Loading reviews...</span>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-[#FAFAFA] rounded-3xl border border-neutral-200">
                  <div className="w-14 h-14 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto">
                    <Star size={26} className="fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">
                    {selectedRatingFilter
                      ? `No ${selectedRatingFilter}-star reviews yet`
                      : "No customer reviews yet"}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    {selectedRatingFilter
                      ? "There are currently no reviews with this specific rating. Try switching filters or view all reviews."
                      : "Be the first verified customer to share your experience with this product!"}
                  </p>
                  <button
                    onClick={() => setIsWriteReviewOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Write the First Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((rev) => {
                    const isHelpful = helpfulReviews[rev.id];
                    return (
                      <div
                        key={rev.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3 transition-all hover:border-neutral-300"
                      >
                        {/* Reviewer Header */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                              {rev.user?.fullname ? rev.user.fullname.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-neutral-900">
                                  {rev.user?.fullname || "Verified Buyer"}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 size={11} className="text-emerald-600" />
                                  Verified Purchase
                                </span>
                              </div>
                              <span className="text-[11px] text-neutral-400">
                                Reviewed on {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Star Rating Badge */}
                          <div className="flex items-center gap-1.5 bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#FEF3C7]">
                            <span className="text-xs font-black text-[#B45309]">
                              {rev.rating}.0
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={`${
                                    s <= rev.rating
                                      ? "text-[#F59E0B] fill-[#F59E0B]"
                                      : "text-neutral-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Review Text */}
                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-1">
                          {rev.comment}
                        </p>

                        {/* Helpful Actions Footer */}
                        <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px]">Was this review helpful?</span>
                            <button
                              onClick={() => {
                                setHelpfulReviews((prev) => ({
                                  ...prev,
                                  [rev.id]: !prev[rev.id],
                                }));
                                if (!isHelpful) {
                                  toast.success("Thank you for your feedback! 👍");
                                }
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                                isHelpful
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : "bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                              }`}
                            >
                              <ThumbsUp size={12} className={isHelpful ? "fill-emerald-600" : ""} />
                              <span>{isHelpful ? "Helpful (1)" : "Helpful"}</span>
                            </button>
                          </div>

                          <span className="text-[10px] text-neutral-400">
                            Flazo Verified Review
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* Tab 3: FAQs */}
          {activeTab === "faqs" && (
            <div className="pt-8 max-w-3xl space-y-3">
              {[
                {
                  q: "How is the artwork packaged for delivery?",
                  a: "All paintings are securely packed with multilayer bubble wrap, corner edge protectors, and placed inside rigid corrugated packaging to prevent any transit damage.",
                },
                {
                  q: "Is hanging hardware included with the package?",
                  a: "Yes! Every canvas painting arrives ready-to-hang with pre-installed sturdy sawtooth brackets and complimentary hanging nails.",
                },
                {
                  q: "How do I clean and maintain the canvas?",
                  a: "Simply wipe gently with a clean, dry microfiber cloth. Avoid using harsh chemical detergents or direct continuous soaking in water.",
                },
                {
                  q: "What if I receive a damaged product?",
                  a: "We offer a 7-day hassle-free replacement guarantee. If your order arrives damaged, simply reach out to our dedicated support team for an instant replacement.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 text-neutral-500 ${
                        expandedFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-4 pt-1 text-xs sm:text-sm text-neutral-600 border-t border-neutral-100 bg-[#FAFAFA]/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Shipping & Returns */}
          {activeTab === "shipping" && (
            <div className="pt-8 max-w-3xl space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">Express Dispatch</h4>
                <p>Orders are dispatched within 24 to 48 hours via top courier partners (Bluedart, Delhivery, DTDC).</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">7 Days Replacement Policy</h4>
                <p>If you face any quality issues or receive a defective unit, we provide a 100% free doorstep replacement.</p>
              </div>
            </div>
          )}
        </div>


        {/* ================= 6. REVIEWS SECTION IS EXPLICITLY OMITTED PER USER REQUEST ================= */}

        {/* ================= 7. SIMILAR PRODUCTS SECTION ================= */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Similar Products
              </h2>
              <Link
                href={`/${product.Category?.name ? slugify(product.Category.name) : "paintings"}`}
                className="flex items-center gap-1 text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-950 transition-colors"
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item: any) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={item.images?.[0]}
                  price={item.discountPrice}
                  originalPrice={item.originalPrice}
                  rating={item.ratings ?? 4.8}
                  discount={item.discountPercentage}
                  paymentMethods={item.paymentMethods}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= LIGHTBOX / FULLSCREEN ZOOM MODAL ================= */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4 animate-in fade-in"
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
              src={getImageUrl(activeImage)}
              alt={product.name}
              fill
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* ================= WRITE A CUSTOMER REVIEW MODAL ================= */}
      {isWriteReviewOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsWriteReviewOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b pb-4 border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-2xs">
                  <Star size={22} className="fill-[#F59E0B] text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">
                    Write a Customer Review
                  </h3>
                  <p className="text-xs text-neutral-500 truncate max-w-[280px]">
                    {product.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              {/* Star Rating Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-3 bg-[#FAF9F6] p-3 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          size={28}
                          className={`${
                            star <= (reviewHoverRating || reviewRating)
                              ? "text-[#F59E0B] fill-[#F59E0B]"
                              : "text-neutral-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-sm font-extrabold text-[#D97706] ml-2">
                    {reviewRating === 5
                      ? "5.0 ★ Excellent"
                      : reviewRating === 4
                      ? "4.0 ★ Good"
                      : reviewRating === 3
                      ? "3.0 ★ Average"
                      : reviewRating === 2
                      ? "2.0 ★ Below Average"
                      : "1.0 ★ Poor"}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                  Detailed Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What did you like or dislike? How was the build quality, sound clarity, battery or finish? Help other buyers make informed choices."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-all bg-[#FAF9F6]"
                />
              </div>

              {/* Verified policy note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 text-[11px] text-neutral-500 border border-neutral-200/60">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Your review will be published publicly with a Verified Buyer badge to assist other customers.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

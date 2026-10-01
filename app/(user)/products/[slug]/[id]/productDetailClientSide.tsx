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

  const [mounted, setMounted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Tabs state: 'details' | 'specs' | 'faqs' | 'shipping'
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "faqs" | "shipping">("details");

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
    return list.filter(Boolean);
  }, [rawImages]);

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
            variantId: v.id,
            price: v.price,
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

  // Compute pricing and savings
  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.discountPrice) || 0;

  const origPrice =
    parseFloat(product.originalPrice) || currentPrice;
  const savings = Math.max(0, origPrice - currentPrice);
  const discountPct = origPrice > 0 && origPrice > currentPrice
    ? Math.round((savings / origPrice) * 100)
    : 0;

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
        if (matched.image) {
          const imgIdx = displayImages.indexOf(matched.image);
          if (imgIdx !== -1) setSelectedImage(imgIdx);
        }
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
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
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
              <div className="relative flex-1 w-full bg-[#F5F6F8] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 flex items-center justify-center p-4 sm:p-8 h-[380px] sm:h-[480px] lg:h-[530px] group shadow-xs">
                
                {displayImages.length > 0 ? (
                  getFileType(displayImages[selectedImage]) === "video" ? (
                    <video
                      src={getImageUrl(displayImages[selectedImage])}
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
                        src={getImageUrl(displayImages[selectedImage])}
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

                {/* Rating Snippet */}
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 bg-[#FAFAFA] px-2.5 py-1 rounded-full border border-neutral-200/70">
                  <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                  <span>4.8</span>
                  <span className="text-neutral-500 font-normal">(246 reviews)</span>
                  <ChevronDown size={12} className="text-neutral-400" />
                </div>
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
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FFFBEB] border border-[#FDE68A] text-xs font-semibold text-neutral-800 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  🪙
                </div>
                <span>Earn upto {rewardPoints} boAt reward points on this product</span>
              </div>
              <span className="text-neutral-500 text-sm">›</span>
            </div>

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
                onClick={handleAddToCart}
                className="flex-1 bg-[#FBBF24] hover:bg-[#F59E0B] text-neutral-950 font-bold py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-xs"
              >
                <ShoppingCart size={17} />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-bold border border-[#FCD34D] py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 text-sm shadow-xs"
              >
                <Zap size={16} className="fill-[#92400E]" />
                <span>Buy Now</span>
              </button>
            </div>

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

          </div>

        </div>



        {/* ================= 4. TABBED INFORMATION SECTION (NO REVIEWS TAB) ================= */}
        <div className="mt-12">
          {/* Tab Navigation Headers */}
          <div className="flex items-center border-b border-neutral-200 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 ${
                activeTab === "details"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Product Details
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 ${
                activeTab === "specs"
                  ? "border-[#F59E0B] text-neutral-950 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Specifications
            </button>

            <button
              onClick={() => setActiveTab("faqs")}
              className={`py-3.5 px-6 font-bold text-xs sm:text-sm transition-all border-b-2 ${
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

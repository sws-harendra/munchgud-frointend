"use client";

import Image from "next/image";
import { Product, ProductVariant } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { discountPercentage } from "@/app/utils/discountCalculator";
import { useState, useEffect } from "react";
import axios from "axios"; 
import Link from "next/link";
import Heading from "@/app/commonComponents/heading";
import Loader from "@/app/commonComponents/loader";
// import Description from "@/app/%28user%29/components/product/description";
// import Description from "@/app/components/Description";


import {
  BugPlayIcon,
  Share,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  Copy,
  Star,
  MessageSquareDot,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
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
import YouMayLike from "@/app/(user)/components/YouMayLike";
import ProductCard from "@/app/(user)/components/productCard";
import { fetchRelatedProducts } from "@/app/lib/store/features/relatedProductSlice";
import { useSelector } from "react-redux";
import { useRef } from "react";

interface ProductDetailClientProps {
  product: Product;
  formattedTags: string[];
}

export default function ProductDetailClient({
  product,
  formattedTags,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const dispatch = useAppDispatch(); // ✅ typed dispatch

  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const reviewsRef = useRef<HTMLDivElement | null>(null);

  // Pagination Logic
  const reviewsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  const currentReviews = reviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );


 

  const { user } = useSelector((state: RootState) => state.auth);
  const hasReviewed = reviews.some(
  (review: any) => review.userId === user?.id
);
  
  // related products
  const { products, loading: relatedLoading  } = useAppSelector(
    (state) => state.relatedProducts
  );

  // fetching reviews and rating 
  const fetchReviewsAndRating = async () => {
  try {
    const reviewRes = await axios.get(
      `${process.env.NEXT_PUBLIC_serverurl}/review-rating/product-reviews/${product.id}`
    );

    setReviews(reviewRes.data.reviews);
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
    }
  }, [product?.id, dispatch]);
  console.log("Product ID:", product?.id);
  console.log("Related products state:", products);



  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast("copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  useEffect(() => {
  if (product?.id) {
    fetchReviewsAndRating();
  }
}, [product?.id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loader />;
  }

  // Get images to display - either variant image or product images
  // product.images may be a JSON string from the DB driver, so we always normalize to an array
  const rawImages =
    selectedVariant && selectedVariant.image
      ? [selectedVariant.image]
      : product.images;

  const displayImages: string[] = Array.isArray(rawImages)
    ? rawImages
    : typeof rawImages === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(rawImages);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })()
    : [];

  const shareUrl = `${clienturl}/products/${slugify(product.name)}/${
    product.id
  }`; // dynamic link here
  const title = "Check out this product!";

  const handleVariantClick = (variant: ProductVariant) => {
    if (selectedVariant?.id === variant.id) {
      // If clicking the same variant, unselect it
      setSelectedVariant(null);
      setSelectedImage(0);
    } else {
      // Select the new variant
      setSelectedVariant(variant);
      setSelectedImage(0);
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-slate-50 via-gray-200 to-green-50">
      {/* Animated Background Elements */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb with Animation */}
        <div className="mb-8 animate-fade-in-up">
          <nav className="flex flex-wrap items-center space-x-1 text-[4px] sm:text-[8px] text-gray-500">
            <Link
              href={"/"}
              className="hover:text-green-700 cursor-pointer transition-colors"
            >
              <Heading title="Home" />
            </Link>
            <Heading title="/" />
            <Link
              href={"/products"}
              className="hover:text-green-700 cursor-pointer transition-colors"
            >
              <Heading title="Products" />
            </Link>{" "}
            <Heading title="/" />
            <Link
              href={`/products?search=${product?.categoryId}`}
              className="hover:text-green-700 cursor-pointer transition-colors"
            >
              <Heading title={product?.Category?.name} />
            </Link>
            <Heading title="/" />
            <span className="text-gray-900 font-medium">
              <Heading title={product.name} />
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ===== PRODUCT IMAGES - FLIPKART STYLE ===== */}
          <div className="animate-fade-in-left lg:sticky lg:top-4">
            {displayImages.length > 0 ? (
              <div className="space-y-3">

                {/* === MAIN IMAGE - CLICK TO OPEN LIGHTBOX === */}
                <div
                  className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg select-none cursor-zoom-in group"
                  style={{ height: "460px" }}
                  onClick={() => {
                    if (getFileType(displayImages[selectedImage]) !== "video")
                      setLightboxOpen(true);
                  }}
                >
                  {/* Image or Video */}
                  {getFileType(displayImages[selectedImage]) === "video" ? (
                    <video
                      src={getImageUrl(displayImages[selectedImage])}
                      className="w-full h-full object-contain"
                      controls
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <Image
                      src={getImageUrl(displayImages[selectedImage])}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  )}

                  {/* Zoom hint */}
                  {getFileType(displayImages[selectedImage]) !== "video" && (
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md text-gray-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={18} />
                    </div>
                  )}

                  {/* Prev Arrow */}
                  {displayImages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          (prev) =>
                            (prev - 1 + displayImages.length) % displayImages.length
                        );
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-2 z-10 transition-all duration-200 hover:scale-110 border border-gray-100"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                  )}

                  {/* Next Arrow */}
                  {displayImages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          (prev) => (prev + 1) % displayImages.length
                        );
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-2 z-10 transition-all duration-200 hover:scale-110 border border-gray-100"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  )}

                  {/* Image counter */}
                  {displayImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
                      {selectedImage + 1} / {displayImages.length}
                    </div>
                  )}

                  {/* Dot indicators */}
                  {displayImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
                      {displayImages.map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full transition-all duration-300 ${
                            i === selectedImage
                              ? "w-4 h-2 bg-green-500"
                              : "w-2 h-2 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* === THUMBNAIL STRIP === */}
                {displayImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 px-0.5" style={{ scrollbarWidth: "thin" }}>
                    {displayImages.map((file, index) => {
                      const ft = getFileType(file);
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedImage(index);
                            setIsZoomed(false);
                          }}
                          className={`flex-shrink-0 relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            selectedImage === index
                              ? "border-green-500 shadow-md scale-105"
                              : "border-gray-200 hover:border-green-300 hover:scale-105"
                          }`}
                        >
                          {ft === "image" ? (
                            <Image
                              src={getImageUrl(file)}
                              alt={`${product.name}-thumb-${index + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                              <video
                                src={getImageUrl(file)}
                                className="w-full h-full object-cover opacity-80"
                                muted
                                playsInline
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/80 rounded-full p-1">
                                  <ChevronRight size={14} className="text-gray-700" />
                                </div>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            ) : (
              <div className="h-[460px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="space-y-5 animate-fade-in-right">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-row justify-between ">
                <span className=" bg-gradient-to-r from-green-100 to-lime-100 text-green-700 text-sm font-semibold px-3 py-2 rounded-full">
                  {product.Category?.name || "Uncategorized"}
                </span>
                <div className="relative inline-block">
                  <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Share2 />
                  </button>

                  {open && (
                    <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-3 flex gap-2 z-50">
                      <FacebookShareButton url={shareUrl} quote={title}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={shareUrl} title={title}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <WhatsappShareButton url={shareUrl} title={title}>
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                      <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>

                      {/* Copy Link */}
                      <button
                        onClick={handleCopy}
                        className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                        title="Copy link"
                      >
                        <Copy size={28} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-lg md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>
              {/* ⭐ Average Rating Under Product Name */}
              <div className="flex items-center gap-2 mt-2">
                {/* Stars */}
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= Math.round(averageRating)
                          ? "text-green-600 fill-green-600"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* Rating Text */}
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Price Section with Animation */}
            <div className="space-y-1 ">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-3xl font-bold text-black bg-clip-text ">
                    ₹
                    {selectedVariant
                      ? selectedVariant.price
                      : product.discountPrice}
                  </span>
                  /
                  {selectedVariant
                    ? selectedVariant.options
                        .map((option) => option.name)
                        .join(", ")
                    : product?.varientValue}
                </div>
                <span className="text-2xl text-green-700 line-through">
                  ₹{product.originalPrice}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <span className="text-orange-500 ">You save: </span>
                  <span className="text-orange-500 font-bold ml-1">
                    ₹
                    {(
                      parseFloat(product.originalPrice) -
                      parseFloat(
                        selectedVariant
                          ? selectedVariant.price
                          : product.discountPrice,
                      )
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="space-y-4 mt-7  ">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    await dispatch(
                      addToCart({
                        id: selectedVariant
                          ? `${product.id}-${selectedVariant.id}`
                          : product.id,
                        name: product.name,
                        price: parseFloat(
                          selectedVariant
                            ? selectedVariant.price
                            : product.discountPrice,
                        ),
                        quantity: 1,
                        imageUrl: displayImages?.[0] || "",
                        paymentMethods: product.paymentMethods,
                        variant: selectedVariant
                          ? selectedVariant.options
                              .map((opt) => `${opt.category.name}: ${opt.value}`)
                              .join(", ")
                          : undefined,
                      }),
                    );
                    router.push("/cart");
                  }}
                  className="flex-1 group relative bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <Wallet />
                    <span>Buy Now</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    dispatch(
                      addToCart({
                        id: product.id,
                        name: product.name,
                        quantity: 1,
                        // imageUrl: product.images?.[0] || "",
                        paymentMethods: product.paymentMethods,
                        price: parseFloat(
                          selectedVariant
                            ? selectedVariant.price
                            : product.discountPrice,
                        ),

                        imageUrl: displayImages?.[0] || "",
                        variantId: selectedVariant?.id, // e.g. 31
                        variantName: selectedVariant?.options
                          .map((opt) => `${opt.category.name}: ${opt.value}`)
                          .join(", "), // "Dimension: 14*15"
                      }),
                    );
                  }}
                  className="flex-1 group bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingCart /> <span>Add to cart</span>
                  </div>
                </button>
              </div>
            </div>

            {/* write a review button */}
          {user && !hasReviewed && (
                <button
                onClick={() => setReviewOpen(true)}
                className="mt-3 bg-gray-300 border border-black hover:scale-105 duration-300 text-black font-semibold block w-full max-w-[500px] mx-auto py-2 rounded-lg transition"
              >
                <span className="flex gap-2 items-center justify-center">
                  <MessageSquareDot />
                  Write a Review 
                </span>
              </button>             
          )}

          {/* review popup */}
          {reviewOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
                
                <button
                  onClick={() => setReviewOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Write a Review</h2>

                {/* Star Rating */}
                <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      onClick={() => setReviewRating(star)}
                      className={`cursor-pointer ${
                        star <= reviewRating
                          ? "text-yelolow-500 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full border rounded-lg p-2 mb-4"
                  rows={4}
                />

                {/* Submit */}
                <button
                  onClick={async () => {
                    try {
                      console.log("Product ID:", product.id);
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

                    } catch (error:any) {
                      setReviewOpen(false);
                      toast.error(error.response?.data?.message || "Error adding review");
                    }
                  }}
                  className="w-full bg-green-700 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}


            {/* Description */}
            <Description description={product.description} />


            {/* Product Details Grid */}
            {((!selectedVariant && product?.stock < 10) ||
              (selectedVariant && selectedVariant.stock < 10)) && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stock Available
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-700 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium">
                      {selectedVariant ? selectedVariant.stock : product.stock}{" "}
                      units
                    </span>
                  </div>
                </div>
              </div>
            )}

            

            {/* Variants Section */}
            {product?.ProductVariants && product.ProductVariants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Choose a Variant
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.ProductVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantClick(variant)}
                      className={`p-3 rounded-xl border flex flex-col items-center ${
                        selectedVariant?.id === variant.id
                          ? "bg-green-100 text-green-800 border-green-600 ring-2 ring-green-500"
                          : "bg-white border-gray-300 text-gray-700 hover:border-green-400"
                      }`}
                    >
                      {/* Variant image if available */}
                      {variant.image && (
                        <div className="relative w-16 h-16 mb-2 rounded-md overflow-hidden">
                          <img
                            src={getImageUrl(variant.image)}
                            alt="Variant"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="text-xs text-gray-500 mt-1">
                        ₹{variant.price}
                      </span>
                      {/* Variant options */}
                      <span className="text-sm font-medium text-center">
                        {variant.options
                          .map((opt) => `${opt.category.name}: ${opt.value}`)
                          .join(", ")}
                      </span>

                      {/* Variant price */}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

{/* ================= PREMIUM REVIEWS SECTION ================= */}
{reviews && reviews.length > 0 && (
  <div 
  ref={reviewsRef}
  className="mt-14 border-t border-gray-200 pt-10 px-4 md:px-14">

    {/* Title */}
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
        Customer Reviews
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        {reviews.length} Verified Reviews
      </p>
    </div>

    <div className="space-y-6">
      {currentReviews.map((review: any) => (
        <div
          key={review.id}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300"
        >
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <img
              src={
                review.user?.avatar
                  ? `http://localhost:8000/uploads/${review.user.avatar}`
                  : "/blankProfilePicture.png"
              }
              alt={review.user?.fullname}
              className="w-12 h-12 rounded-full object-cover border"
            />

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {review.user?.fullname}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "text-green-600 fill-green-600"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              {review.comment ? (
                <p className="text-gray-600 leading-relaxed mt-2">
                  {review.comment}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  No written feedback.
                </p>
              )}
            </div>
          </div>
          
        </div>
      ))}
      {/* pagination buttons */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
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
                  className={`w-9 h-9 rounded-full text-sm font-medium transition 
                    ${
                      currentPage === index + 1
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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


      {/* similar products section */}
      {/* <YouMayLike/> */}
      {products.length === 0 &&(<p className="col-span-full text-center text-gray-500">No similar products available</p>)}

      {products.length > 0 && 
      (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-8 py-6">
            {products.map((item: any) => (
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
      )
      }

      {/* ===== LIGHTBOX / ZOOM MODAL ===== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-3 md:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2.5 transition-colors z-20"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={22} />
          </button>

          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full pointer-events-none">
              {selectedImage + 1} / {displayImages.length}
            </div>
          )}

          {/* Prev Arrow */}
          {displayImages.length > 1 && (
            <button
              className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors z-20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(
                  (prev) => (prev - 1 + displayImages.length) % displayImages.length
                );
              }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Main lightbox image */}
          <div
            className="relative w-full max-w-4xl mx-12 md:mx-20"
            style={{ height: "75vh" }}
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

          {/* Next Arrow */}
          {displayImages.length > 1 && (
            <button
              className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors z-20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev + 1) % displayImages.length);
              }}
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Thumbnail strip inside lightbox */}
          {displayImages.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {displayImages.map((file, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === selectedImage
                      ? "border-white scale-110"
                      : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  {getFileType(file) === "image" ? (
                    <Image
                      src={getImageUrl(file)}
                      alt={`thumb-${i}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={getImageUrl(file)}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>

    
  );
}

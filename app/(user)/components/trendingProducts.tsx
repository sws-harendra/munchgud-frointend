"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import Heading from "@/app/commonComponents/heading";
import ProductCard from "./productCard"; // 👈 Import reusable card
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { toast } from "sonner";
import { getTrendingProduct } from "@/app/lib/store/features/productSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { discount, discountPercentage } from "@/app/utils/discountCalculator";

const TrendingProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [favorites, setFavorites] = useState(new Set<number>());

  const dispatch = useAppDispatch();
  const { trendingProducts, status, error } = useAppSelector(
    (state) => state.product,
  );

  const isLoading = status === "loading";
  const itemsPerPage = 4;
  const totalPages = Math.ceil(trendingProducts.length / itemsPerPage);
  // Effects
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(getTrendingProduct());
  }, [dispatch]);

  useEffect(() => {
    if (!isHovered && totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextPage = Math.floor(prev / itemsPerPage) + 1;
          return nextPage >= totalPages ? 0 : nextPage * itemsPerPage;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, totalPages, itemsPerPage]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(productId)
        ? newFavorites.delete(productId)
        : newFavorites.add(productId);
      return newFavorites;
    });
  };

  const getVisibleProducts = () => {
    const startIndex = currentIndex;
    const endIndex = Math.min(
      startIndex + itemsPerPage,
      trendingProducts.length,
    );
    return trendingProducts.slice(startIndex, endIndex);
  };

  const currentPage = Math.floor(currentIndex / itemsPerPage);

  {
    isLoading && <Loader />;
  }
  return (
    <div className=" sm:mx-4 text-center md:mx-10 my-8 relative">
      {/* <Heading title="🔥 Trending Products" /> */}
      <div className="text-center mb-12">
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          🔥 Trending <span className="">Products</span>
        </h2>
        <p className="mt-3 text-gray-600">
          Discover best products that are trending right Now.
        </p>
      </div>
      <div
        className="relative overflow-hidden  rounded-3xl bg-gradient-to-br from-gray-50 to-white p-6 "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev - itemsPerPage < 0
                    ? (totalPages - 1) * itemsPerPage
                    : prev - itemsPerPage,
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 
              bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg 
              transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev + itemsPerPage >= trendingProducts.length
                    ? 0
                    : prev + itemsPerPage,
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 
              bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg 
              transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5 lg:gap-6">
          {getVisibleProducts().map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.images?.[0]} // ✅ convert filename → full URL
              price={product.discountPrice} // ✅ discounted price
              originalPrice={product.originalPrice}
              rating={product.ratings ?? 0} // ✅ fallback
              discount={discountPercentage(
                product.originalPrice,
                product.discountPrice,
              )}
              paymentMethods={product.paymentMethods}
              isFavorite={favorites.has(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "bg-green-700 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingProducts;

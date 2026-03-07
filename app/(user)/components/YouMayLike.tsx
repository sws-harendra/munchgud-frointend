"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchSections } from "@/app/lib/store/features/sectionSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Heading from "@/app/commonComponents/heading";
import ProductCard from "./productCard";
import { discountPercentage } from "@/app/utils/discountCalculator";

export default function YouMayLike() {
     const dispatch = useAppDispatch();
  const { sections, loading } = useAppSelector((s) => s.section);

  // carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // number of products visible at once
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  if (loading) return <p>Loading sections...</p>;

  return (
    <div className="md:space-y-14 mx-1 sm:mx-10 my-8 md:my-16">
      <h2 className="text-center font-extrabold text-xl md:text-3xl lg:text-5xl  ">You May Also Like</h2>
      {sections.map((section) => {
        const totalPages = Math.ceil(section.Products.length / itemsPerPage);
        const currentPage = Math.floor(currentIndex / itemsPerPage);

        // slice visible products
        const visibleProducts = section.Products.slice(
          currentIndex,
          currentIndex + itemsPerPage,
        );

        return (
          <div key={section.id} className="relative">
            {/* Section Heading */}
            {/* <div className="text-center relative">
              <Heading title={section.title} />
              <p>{section.description}</p>
            </div> */}
            <div
              className="relative overflow-hidden rounded-3xl  p-6"
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
                        prev + itemsPerPage >= section.Products.length
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-2 sm:gap-5 ">
                {visibleProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.images?.[0]}
                    price={product.discountPrice}
                    originalPrice={product.originalPrice}
                    rating={product.ratings ?? 0}
                    discount={discountPercentage(
                      product.originalPrice,
                      product.discountPrice,
                    )}
                    paymentMethods={product.paymentMethods} // isFavorite={favorites.has(product.id)}
                    // onToggleFavorite={toggleFavorite}
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
      })}
    </div>
  );
}

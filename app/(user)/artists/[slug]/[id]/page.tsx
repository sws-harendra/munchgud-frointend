"use client";

import React, { useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchArtistById } from "@/app/lib/store/features/artistSlice";
import ProductCard from "@/app/(user)/components/productCard";
import { discountPercentage } from "@/app/utils/discountCalculator";
import {
  Palette,
  Star,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  StarIcon,
} from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";

const ArtistDetailsProduct = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const dispatch = useAppDispatch();
  const { selectedArtist, products, pagination, status } = useAppSelector(
    (state) => state.artist
  );

  useEffect(() => {
    if (id) dispatch(fetchArtistById({ id: Number(id), page, limit: 6 }));
  }, [id, page, dispatch]);

  if (status === "loading" || !selectedArtist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium text-lg">
            Loading artist profile...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedArtist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Palette className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Artist Not Found
          </h2>
          <p className="text-gray-600">
            The artist profile you're looking for doesn't exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const renderPaginationButton = (pageNum, isActive = false) => (
    <a
      key={pageNum}
      href={`?page=${pageNum}`}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200 ${isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        }`}
    >
      {pageNum}
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Artist Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Artist Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center shadow-xl">
                  <img
                    src={`${getImageUrl(selectedArtist.image)}`}
                    alt={selectedArtist.name}
                    className=" text-blue-600"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedArtist.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-green-700 rounded-full font-medium">
                  <StarIcon className="w-4 h-4" />
                  Featured Artist
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Grid className="w-4 h-4" />
                  {products.length} Artworks
                </span>
              </div>
              {selectedArtist.aboutArtist ? (
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                  {selectedArtist.aboutArtist}
                </p>
              ) : (
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Discover exceptional handcrafted paintings and artwork, each
                  piece carefully created with passion and attention to detail.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Art Collection
            </h2>
            <p className="text-gray-600">
              Browse through {selectedArtist.name}'s beautiful artwork
              collection
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-xl group-hover:shadow-gray-900/10 transition-all duration-300">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.images?.[0]}
                    price={product.discountPrice}
                    originalPrice={product.originalPrice}
                    rating={product.ratings ?? 0}
                    discount={discountPercentage(
                      product.originalPrice,
                      product.discountPrice
                    )}
                    paymentMethods={product.paymentMethods}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No Artworks Available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This artist hasn't uploaded any artworks yet. Please check back
              later for new collections.
            </p>
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-1">
            {/* Previous Button */}
            {pagination.page > 1 && (
              <a
                href={`?page=${pagination.page - 1}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mr-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </a>
            )}

            {/* Page Numbers */}
            {Array.from({ length: Math.min(pagination.totalPages, 7) }).map(
              (_, idx) => {
                let pageNum;
                if (pagination.totalPages <= 7) {
                  pageNum = idx + 1;
                } else {
                  const current = pagination.page;
                  const total = pagination.totalPages;
                  if (current <= 4) {
                    pageNum = idx + 1;
                  } else if (current >= total - 3) {
                    pageNum = total - 6 + idx;
                  } else {
                    pageNum = current - 3 + idx;
                  }
                }

                if (pageNum === pagination.page) {
                  return renderPaginationButton(pageNum, true);
                }
                return renderPaginationButton(pageNum);
              }
            )}

            {/* Next Button */}
            {pagination.page < pagination.totalPages && (
              <a
                href={`?page=${pagination.page + 1}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ml-2"
              >
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default function ArtistDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
      }
    >
      <ArtistDetailsProduct />
    </Suspense>
  );
}

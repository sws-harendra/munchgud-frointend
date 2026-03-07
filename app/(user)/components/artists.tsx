"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchArtists } from "@/app/lib/store/features/artistSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

const AllArtistsHomePage = () => {
  const dispatch = useAppDispatch();
  const { artists, status } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchArtists());
  }, [dispatch, status]);

  if (status === "loading")
    return <div className="text-center py-10">Loading artists...</div>;
  if (status === "failed")
    return (
      <div className="text-center py-10 text-green-600">
        Failed to load artists.
      </div>
    );
  if (!artists || artists.length === 0) return null;

  return (
    <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-white via-gray-50 to-white relative">
      {/* Header with centered title and right-side button */}
      <div className="relative mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-center">
          ⭐ Our <span className="text-lime-600">Artists</span>
        </h2>
        <p className="mt-4 text-gray-600 text-base lg:text-lg max-w-xl mx-auto text-center">
          Discover the creative minds shaping trends and stories in the art
          world.
        </p>

        {/* View All Button */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <Link href="/artists">
            <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-white bg-lime-600 hover:bg-lime-700 font-medium shadow-md transition">
              View All <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      {/* Artist Grid */}
      <div
        className="grid gap-8 sm:gap-10 md:gap-12 max-w-7xl mx-auto"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        }}
      >
        {artists.slice(0, 6).map((artist) => (
          <Link
            href={`/artists/${slugify(artist.name)}/${artist.id}`}
            key={artist.id}
          >
            <div className="group flex flex-col items-center text-center cursor-pointer">
              <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border border-gray-200 transition-transform duration-300 group-hover:scale-105">
                {artist.image ? (
                  <img
                    src={getImageUrl(artist.image)}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-lime-600 transition-colors">
                {artist.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile CTA Button */}
      <div className="text-center mt-12 lg:hidden">
        <Link href="/artists">
          <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-medium shadow-md transition">
            View All <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default AllArtistsHomePage;

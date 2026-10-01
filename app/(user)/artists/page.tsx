"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchArtists } from "@/app/lib/store/features/artistSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Heading from "@/app/commonComponents/heading";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import Loader from "@/app/commonComponents/loader";

const AllArtists = () => {
  const dispatch = useAppDispatch();
  const { artists, status } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchArtists());
  }, [dispatch, status]);

  if (status === "loading") return <Loader text="Loading artists..." />;
  if (status === "failed") return <div>Failed to load artists.</div>;

  return (
    <div className="p-4">
      <Heading title="All Artists" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
        {artists.map((artist) => (
          <Link
            href={`/artists/${slugify(artist.name)}/${artist.id}`}
            key={artist.id}
          >
            <div
              key={artist.id}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => console.log("Clicked artist:", artist)}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-2">
                {artist.image ? (
                  <img
                    src={`${getImageUrl(artist.image)}`}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <span className="text-center font-medium">{artist.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllArtists;

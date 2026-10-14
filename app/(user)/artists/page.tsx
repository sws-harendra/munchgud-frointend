"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchArtists } from "@/app/lib/store/features/artistSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Heading from "@/app/commonComponents/heading";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import Loader from "@/app/commonComponents/loader";
import { FadeIn, Stagger, StaggerItem, HoverCard } from "@/app/commonComponents/motion";

const AllArtists = () => {
  const dispatch = useAppDispatch();
  const { artists, status } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchArtists());
  }, [dispatch, status]);

  if (status === "loading") return <Loader text="Loading artists..." />;
  if (status === "failed") return <div>Failed to load artists.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <FadeIn direction="up">
        <Heading title="All Artists" />
      </FadeIn>
      <Stagger staggerDelay={0.06}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8">
          {artists.map((artist) => (
            <StaggerItem key={artist.id}>
              <Link
                href={`/artists/${slugify(artist.name)}/${artist.id}`}
              >
                <HoverCard hoverY={-6} scale={1.03}>
                  <div
                    className="flex flex-col items-center cursor-pointer p-4 rounded-2xl bg-white border border-neutral-100 hover:border-amber-200 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-200/80 mb-3 shadow-inner">
                      {artist.image ? (
                        <img
                          src={`${getImageUrl(artist.image)}`}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-700 font-bold">
                          {artist.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-center font-bold text-sm text-neutral-900 line-clamp-1">{artist.name}</span>
                  </div>
                </HoverCard>
              </Link>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </div>
  );
};

export default AllArtists;

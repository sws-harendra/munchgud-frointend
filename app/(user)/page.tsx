import React from "react";
import EcommerceNavbar from "./components/navbar";
import BannerCarousel from "./components/caraousel";
import TrendingProducts from "./components/trendingProducts";
import ShopByCategory from "./shop-by-category/page";
import AllSections from "./components/allSections";
import VideoProduct from "./components/videoProduct";
import AboutUs from "./components/aboutUs";
import AllArtistsHomePage from "./components/artists";
import AllBlogsHomePage from "./components/blogs";
import MediaCoveragePage from "./components/mediaCoverage";
import TestimonialCarousel from "./components/testimonials";
import FeaturedArtists from "./components/featuredArtists";
import InstagramSection from "./components/InstagramSection";
import ChooseYourMakhana from "./components/ChooseYourMakhana";
import { Banner } from "../lib/store/features/bannerSlice";
import { serverurl } from "../contants";
import Script from "next/script";

const getInitialBanners = async (): Promise<Banner[]> => {
  if (!serverurl) return [];

  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000);

    const response = await fetch(`${serverurl}/banners`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return [];

    return response.json();
  } catch (error) {
    console.log("Banner fetch error:", error);
    return [];
  }
};

const HomePage = async () => {
  const initialBanners = await getInitialBanners();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "MunchGud",
    url: "https://munchgud.com",
    logo: "https://munchgud.com/logo.png",
    description: "Dashboard section for users",
    image: "https://munchgud.com/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kate wasti, Punawale",
      addressLocality: "Pimpri-Chinchwad",
      addressRegion: "Maharashtra",
      postalCode: "411033",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-84462-74791",
      contactType: "customer support",
      email: "munchgud@gmail.com",
    },
    sameAs: ["https://munchgud.com"],
  };

  return (
    <div>
      <Script
        id="schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <h1 className="sr-only">MunchGud Makhana</h1>
      <BannerCarousel initialBanners={initialBanners} />
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 space-y-12 md:space-y-20 py-8">
        <VideoProduct />

        <TrendingProducts />
        <AllSections />
        <FeaturedArtists />
        <ChooseYourMakhana />
        <InstagramSection />
        <TestimonialCarousel />
        <AllBlogsHomePage />
        <MediaCoveragePage />
        <AllArtistsHomePage />

        <AboutUs />
      </div>
      {/* <ShopByCategory /> */}
    </div>
  );
};

export default HomePage;

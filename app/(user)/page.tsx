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

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />
      <div className="lg:px-20">
        <VideoProduct />

        <TrendingProducts />
        <AllSections />
        <FeaturedArtists />
        <ChooseYourMakhana/>
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

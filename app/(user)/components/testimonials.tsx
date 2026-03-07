"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useAppSelector, useAppDispatch } from "@/app/lib/store/store";
import { fetchTestimonials } from "@/app/lib/store/features/testimonialSlice";
import { useEffect } from "react";
import { Quote, Star } from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function TestimonialCarousel() {
  const dispatch = useAppDispatch();
  const { testimonials, status } = useAppSelector((state) => state.testimonial);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center">Loading testimonials...</p>;
  }

  if (testimonials.length === 0) {
    return <p className="text-center">No testimonials available</p>;
  }
// const testimonials = [...data, ...data, ...data, ...data,...data,...data, ...data, ...data, ...data,...data];
  return (
    <div className="overflow-x-hidden mx-auto py-16 px-6 lg:px-20 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          ⭐ What Our Clients Say
        </h2>
        <p className="mt-3 text-gray-600 text-base lg:text-lg">
          Real feedback from people who trusted us.
        </p>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-14 min-h-[460px]"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="bg-[#f1f6ee] mb-4 rounded-2xl shadow-xl h-[320px] flex flex-col items-center relative overflow-hidden group transition-transform hover:-translate-y-2 hover:shadow-xl">
              {/* Quote icon */}
              <div className="mr-auto px-4">
                <Quote className="w-10 h-10 mt-6 text-start fill-green-700/40 text-green-700  opacity-60" />
              </div>

              {/* Testimonial text */}
              <div className="px-6 pb-8 flex-1 flex items-center">
                <p className="text-black font-semibold italic text-center text-sm md:text-base line-clamp-3 group-hover:line-clamp-none group-hover:animate-slideUp transition-all duration-300">
                  “{t.message}”
                  </p>
              </div>

              <div className="flex gap-4 items-center pl-2 mb-4 mr-auto">
                {/* Image */}
                {t.image? (
                  <img
                    src={getImageUrl(t.image)}
                    alt={t.name}
                    className="w-14 h-14 lg:w-18 lg:h-18 rounded-full object-cover border-4 border-lime-100  shadow-md"
                  />
                ): <img
                    src="blankProfilePicture.png"
                    alt={"t.name"}
                    className="w-34 h-34 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-lime-100  shadow-md"
                  />}

                  {/* Client info */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500">{t.designation}</p>
                </div>

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              

              

              {/* Divider */}
              {/* <div className="w-16 h-1 bg-green-500 rounded-full mb-4"></div> */}

              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

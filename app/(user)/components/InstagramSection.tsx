

// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Link } from "lucide-react";

// declare global {
//   interface Window {
//     instgrm: any;
//   }
// }

// export default function InstagramSection() {
//   const [posts, setPosts] = useState<any[]>([]);

//   useEffect(() => {
//     axios
//       .get(`${process.env.NEXT_PUBLIC_serverurl}/instagram/all`)
//       .then((res) => setPosts(res.data.posts));
//   }, []);

//   useEffect(() => {
//     if (window.instgrm) {
//       window.instgrm.Embeds.process();
//     }
//   }, [posts]);

//   if (!posts.length) return null;

//   return (
//     <section className="py-16 bg-gray-50">
//       <h2 className="text-3xl font-extrabold text-center mb-10">
//         Follow Us On Instagram
//       </h2>

//       <div className="px-4 ">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           spaceBetween={40}
//           navigation
//           pagination={{ clickable: true }}
//           breakpoints={{
//             0: { slidesPerView: 1 },
//             640: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//         >
//           {posts.map((post) => (
//             <SwiperSlide key={post.id} className="text-black">
//               <div
//                     key={post.id}
//                     className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between items-center"
//                 >
//                     {/* Instagram Embed */}
//                     <div className="w-full max-w-[320px] ">
//                     <blockquote
//                         className="instagram-media w-full min-h[610px]"
//                         data-instgrm-permalink={post.url}
//                         data-instgrm-version="13"
//                     ></blockquote>
//                     </div>

//                     <a href={post.url} target="_blank"  className="text-center mt-4 w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg font-medium">
//                       <button
//                       // onClick={() => handleDelete(post.id)}
                     
//                       >
//                       See Post
//                       </button>
//                     </a>
//                 </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <script async src="//www.instagram.com/embed.js"></script>
//     </section>
//   );
// }




"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

declare global {
  interface Window {
    instgrm: any;
  }
}

export default function InstagramSection() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_serverurl}/instagram/all`)
      .then((res) => setPosts(res.data.posts));
  }, []);

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [posts]);

  if (!posts.length) return null;

  return (
    <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 md:mb-10">
        Follow Us On Instagram
      </h2>

      <div className="max-w-8xl mx-auto px-3 sm:px-6">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <div className="bg-white shadow-md rounded-xl p-3 sm:p-4 flex flex-col items-center">

                {/* Instagram Embed */}
                <div className="w-full flex justify-center overflow-hidden">
                  <div className="scale-[0.85] sm:scale-[0.9] md:scale-100 origin-top">
                    <blockquote
                      className="instagram-media min-w-[280px] max-w-[350px]"
                      data-instgrm-permalink={post.url}
                      data-instgrm-version="13"
                    ></blockquote>
                  </div>
                </div>

                {/* Button */}
                <a
                  href={post.url}
                  target="_blank"
                  className="text-center mt-4 w-full max-w-[220px] bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg font-medium"
                >
                  See Post
                </a>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <script async src="//www.instagram.com/embed.js"></script>
    </section>
  );
}
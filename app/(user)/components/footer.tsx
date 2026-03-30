"use client";
import { brandName } from "@/app/contants";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, LocateIcon, Mail, MapPin, Phone, X } from "lucide-react";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaXTwitter, FaTwitter } from "react-icons/fa6";
import axios from "axios";
import { useEffect, useState } from "react";


export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get("http://localhost:8008/social-links");
        if (res.data) {
          setSocialLinks(res.data);
        }
      } catch (err) {
        console.log("Footer fetch error", err);
      }
    };

    fetchLinks();
  }, []);

  return (
    <footer className=" bg-green-700  ">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          {/* {brandName} */}
          <Image
            className=" bg-white px-2 py-1 rounded-lg"
            src="/logo.png"
            width={210}
            height={110}
            alt="Logo" />
          <p className="mt-4 text-sm  max-w-xs text-white">
            Premium roasted makhana packed with bold flavors and irresistible crunch.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">


            {/* Instagram */}
            <a
              href={socialLinks?.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-black hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-500 hover:text-white transition"
            >
              <FaInstagram size={16} />
            </a>

            {/* Facebook */}
            <a
              href={socialLinks?.facebook || "#"}

              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-black hover:bg-blue-600 hover:text-white transition"
            >
              <FaFacebookF size={16} />
            </a>

            {/* Twitter */}

            <a
              href={socialLinks?.twitter || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full text-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition"
            >
              <FaXTwitter size={16} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4 text-white">
            Shop
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <Link href="/products" className="hover:text-white">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Offers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4 text-white">
            Company
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <Link href="/refund-policy" className="hover:text-white">
                Refund Policy{" "}
              </Link>
            </li>
            <li>
              <Link href="terms&conditions" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4 text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white">
            <li className="flex items-center gap-2">
              <Mail size={16} /> munchgud@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 84462 74791
            </li>
            <li className="flex items-center  gap-2">
              <MapPin size={25} />  Kate wasti, Punawale, Pimpri-Chinchwad, Pune-411033
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white py-4 text-center text-sm text-white">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">{brandName}</span>. All
        rights reserved.
        <span className="font-bold"> Design by Startup Web Support</span>
      </div>
    </footer>
  );
}

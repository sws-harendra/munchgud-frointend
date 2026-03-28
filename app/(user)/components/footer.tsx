"use client";
import { brandName } from "@/app/contants";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, LocateIcon, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
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
            <a className="w-9 h-9 rounded-full text-black flex items-center justify-center bg-white hover:text-blue-600 transition">
              <Facebook size={16} />
            </a>
            <a className="w-9 h-9 rounded-full text-black flex items-center justify-center bg-white hover:text-pink-600 transition">
              <Instagram size={16} />
            </a>
            <a className="w-9 h-9 rounded-full text-black flex items-center justify-center bg-white hover:text-blue-600 transition">
              <Linkedin size={16} />
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
              <MapPin size={25} />  Kate wasti , Punawale, Pimpri-Chinchwad ,Pune ,411033
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

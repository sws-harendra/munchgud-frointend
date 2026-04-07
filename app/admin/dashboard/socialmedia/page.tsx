"use client";

import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";
import { socialLinksService } from "@/app/sercices/user/social-media.service";


const Page = () => {
    const [links, setLinks] = useState({
        instagram: "",
        facebook: "",
        twitter: "",
    });

    const handleChange = (e: any) => {
        setLinks({ ...links, [e.target.name]: e.target.value });
    };

    // Fetch links
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const data = await socialLinksService.getLinks();
                if (data) {
                    setLinks(data);
                }
            } catch (err) {
                console.log("Fetch error", err);
            }
        };

        fetchLinks();
    }, []);

    // Save links
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await socialLinksService.saveLinks(links);
            toast.success("Links saved successfully 🚀");
        } catch (err) {
            console.log("Save error", err);
            toast.error("Error saving links ❌");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-8">
                    Social Media Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* LEFT: FORM */}
                    <div className="space-y-5">

                        {/* Instagram */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 font-medium">
                                <FaInstagram className="text-pink-500" />
                                Instagram
                            </label>
                            <input
                                type="text"
                                name="instagram"
                                value={links.instagram}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                            />
                        </div>

                        {/* Facebook */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 font-medium">
                                <FaFacebookF className="text-blue-600" />
                                Facebook
                            </label>
                            <input
                                type="text"
                                name="facebook"
                                value={links.facebook}
                                onChange={handleChange}
                                placeholder="https://facebook.com/..."
                                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Twitter */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 font-medium">
                                <FaTwitter className="text-black" />
                                Twitter / X
                            </label>
                            <input
                                type="text"
                                name="twitter"
                                value={links.twitter}
                                onChange={handleChange}
                                placeholder="https://x.com/..."
                                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                        >
                            Save Changes
                        </button>

                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div className="flex flex-col items-center justify-center p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Live Preview
                        </h3>

                        <div className="flex gap-4">

                            <a
                                href={links.instagram || "#"}
                                target="_blank"
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                            >
                                <FaInstagram className="text-pink-500 text-xl" />
                            </a>

                            <a
                                href={links.facebook || "#"}
                                target="_blank"
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                            >
                                <FaFacebookF className="text-blue-600 text-xl" />
                            </a>

                            <a
                                href={links.twitter || "#"}
                                target="_blank"
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                            >
                                <FaTwitter className="text-black text-xl" />
                            </a>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Page;
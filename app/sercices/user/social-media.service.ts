// app/services/social-links.service.ts

import axiosInstance from "@/app/utils/axiosinterceptor";

const BASE_URL = "/social-links";

export const socialLinksService = {
    // Get all social links
    getLinks: async () => {
        const res = await axiosInstance.get(BASE_URL);
        return res.data;
    },

    // Save / update social links
    saveLinks: async (links: {
        instagram: string;
        facebook: string;
        twitter: string;
    }) => {
        const res = await axiosInstance.post(BASE_URL, links);
        return res.data;
    },
};
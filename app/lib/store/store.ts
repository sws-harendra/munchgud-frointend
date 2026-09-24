// /lib/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import bannerReducer from "./features/bannerSlice";
import heroImageReducer from "./features/heroImageSlice";
import trendingImageReducer from "./features/trendingImageSlice";
import cartReducer from "./features/cartSlice";
import orderReducer from "./features/orderSlice";
import dashboardReducer from "./features/dashboardSlice";
import userReducer from "./features/userSlice";
import sectionReducer from "./features/sectionSlice";
import categoryReducer from "./features/categorySlice";
import videoReducer from "./features/video.slice";
import artistReducer from "./features/artistSlice";
import blogReducer from "./features/blogSlice";
import mediaCoveragesReducer from "./features/mediaCoverageSlice";
import testimonialReducer from "./features/testimonialSlice";
import varientReducer from "./features/variantSlice";

import relatedProductReducer from "./features/relatedProductSlice";
import communityReducer from "./features/communitySlice";
export const store = configureStore({
  reducer: {
    relatedProducts: relatedProductReducer,
    auth: authReducer,
    product: productReducer,
    banners: bannerReducer,
    heroImages: heroImageReducer,
    trendingImages: trendingImageReducer,
    cart: cartReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    users: userReducer, // all users (admin side)\
    section: sectionReducer,
    category: categoryReducer,
    video: videoReducer,
    artist: artistReducer,
    blog: blogReducer,
    community: communityReducer,
    mediaCoverages: mediaCoveragesReducer,
    testimonial: testimonialReducer,
    variants: varientReducer,
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production", // ✅ disable in prod
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

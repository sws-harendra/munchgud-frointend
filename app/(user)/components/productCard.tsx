"use client";
import React from "react";
import { Star, Heart, ShoppingCart, Eye, Zap, Truck } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import { useAppDispatch } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: string;
  originalPrice: string;
  rating: number;
  discount: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  paymentMethods: string;
}

// const cartCount = JSON.parse(localStorage.getItem("cart"))

// let ProductsInCart =[]
// let productQuantity

// cartCount?.forEach((element) => {
//   ProductsInCart.push(element.id)
// })

// console.log(cartCount?.forEach((element) => {
//   if (element.id == 2){
//     productQuantity= element.quantity

//   }
// }))

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  discount,
  isFavorite,
  paymentMethods,
  onToggleFavorite,
}) => {
  const dispatch = useAppDispatch();
  const discountAmount = (
    parseFloat(originalPrice) - parseFloat(price)
  ).toFixed(0);

  return (
    <Link href={`/products/${slugify(name)}/${id}`} className="block h-full">
      <div className="group relative bg-white p-3.5 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
        
        {/* Top Badges & Wishlist */}
        <div className="flex items-center justify-between z-10 mb-1">
          {discount > 0 ? (
            <span className="bg-amber-100 text-amber-900 font-bold text-[11px] px-2 py-0.5 rounded-md">
              {discount}% Off
            </span>
          ) : (
            <span />
          )}

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(id);
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
            >
              <Heart
                size={18}
                className={isFavorite ? "text-red-500 fill-red-500" : ""}
              />
            </button>
          )}
        </div>

        {/* Product Image */}
        <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-neutral-50/50 rounded-xl flex items-center justify-center p-2 my-1">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
          />
        </div>

        {/* Product Info */}
        <div className="pt-2 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs my-1.5">
              <Star size={13} className="text-[#FFC220] fill-[#FFC220]" />
              <span className="font-bold text-neutral-900">
                {Number(rating || 4.5).toFixed(1)}
              </span>
              <span className="text-neutral-400">(1.2K)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base sm:text-lg font-black text-neutral-900">
                ₹{price}
              </span>
              {originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Yellow Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(
                addToCart({
                  id: id,
                  name: name,
                  price: parseFloat(price),
                  quantity: 1,
                  imageUrl: image || "",
                  paymentMethods: paymentMethods,
                })
              );
              toast.success(`${name} added to cart! 🛒`);
            }}
            className="w-full bg-[#FFC220] hover:bg-[#E5AC1C] active:scale-[0.98] text-neutral-950 font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;

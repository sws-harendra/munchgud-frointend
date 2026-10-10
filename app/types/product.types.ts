export interface ProductVariantOption {
  id: number;
  name: string;
  value: string;
  hexCode?: string | null;
  imageUrl?: string | null;
  category: {
    id: number;
    name: string;
  };
}

export interface ProductVariant {
  id: number;
  sku?: string | null;
  price: string;
  originalPrice?: string | null;
  stock: number;
  image?: string | null;
  images?: string[] | null;
  isActive: boolean;
  options: ProductVariantOption[];
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  user?: {
    id: number;
    fullname: string;
    avatar?: string | null;
  };
}

export interface PlatformLink {
  name: string; // "Amazon", "Flipkart", "Myntra", "Meesho", etc.
  url: string;
  badge?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  tags: string[] | string;
  originalPrice: string;
  discountPrice: string;
  stock: number;
  images: string[] | string;
  trending_product?: boolean;
  trending?: boolean;
  reviews?: Review[];
  ratings?: number | string | null;
  averageRating?: number;
  totalReviews?: number;
  sold_out: number;
  max_quantity_to_order: number;
  createdAt: Date;
  updatedAt: Date;
  Category: Category;
  paymentMethods: string;
  varientValue: string;
  ProductVariants?: ProductVariant[];
  platformLinks?: PlatformLink[] | string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}
export interface ProductApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  products: Product[];
  total?: number;
  activeProducts?: number;
  inactiveProducts?: number;
}

export interface ProductState {
  // products: ProductApiResponse | []; // whole API response
  products: ProductApiResponse | null; // just the products array
  product: Product | null;
  trendingProducts: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown;
}

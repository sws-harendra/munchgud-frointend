"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts, Product } from "@/app/lib/store/features/productSlice";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Grid,
  List,
  ChevronDown,
  X,
  Eye,
} from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import { categoryService } from "@/app/sercices/category.service";

// Product Card Component
interface ProductCardProps {
  product: Product;
  viewMode: string;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onToggleFavorite,
  isFavorite,
}) => {
  // Calculate discount percentage
  const originalPrice = parseFloat(product.originalPrice);
  const discountPrice = parseFloat(product.discountPrice);
  const discountPercent = Math.round(
    ((originalPrice - discountPrice) / originalPrice) * 100
  );

  // Get first image from images array
  const productImage =
    product.images && product.images.length > 0
      ? `${getImageUrl(product.images[0])}`
      : `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center`;

  return (
    <Link href={`/products/${slugify(product.name)}/${product.id}`}>
      <div
        className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
          viewMode === "list" ? "flex items-start p-4" : "flex flex-col"
        }`}
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-700 via-[#D32F2F] to-[#B71C1C] text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
            {discountPercent}% OFF
          </div>
        )}


        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isFavorite ? "text-green-600 fill-green-600" : "text-gray-400"
            }`}
          />
        </button>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-12 left-3 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Only {product.stock} left!
          </div>
        )}

        {product.sold_out === 1 && (
          <div className="absolute top-12 left-3 z-10 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Sold Out
          </div>
        )}

        {/* Product Image */}
        <div
          className={`relative overflow-hidden ${
            viewMode === "list"
              ? "w-40 h-40 rounded-xl mr-4 flex-shrink-0"
              : "aspect-square w-full"
          }`}
        >
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Action Buttons */}
          {/* <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white hover:scale-105 transition-all duration-200">
              <Eye size={16} className="text-gray-700" />
            </button>
            <button
              className={`bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-200 flex items-center justify-center ${
                product.sold_out === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={product.sold_out === 1}
            >
              <ShoppingCart size={16} />
            </button>
          </div> */}
        </div>

        {/* Product Info */}
        <div
          className={`${viewMode === "list" ? "flex-1 py-2" : "p-4 space-y-3"}`}
        >
          {/* Category Badge */}
          <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full capitalize mb-2">
            {product.Category?.name || "General"}
          </span>

          {/* Product Name */}
          <h3
            className={`font-medium text-gray-800 group-hover:text-green-700 transition-colors duration-300 line-clamp-2 ${
              viewMode === "list" ? "text-lg" : "text-sm leading-tight"
            }`}
          >
            {product.name}
          </h3>

          {/* Description - Only show in list view */}
          {viewMode === "list" && (
            <p className="text-gray-600 mb-3 text-sm line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`${
                    i < 4 // Using a fixed 4-star rating for now
                      ? "text-green-700 fill-green-700"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">4.0</span>
            </div>

            {/* Stock Status */}
            <span
              className={`text-xs font-medium ${
                product.stock > 0 ? "text-green-700" : "text-gray-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{discountPrice.toLocaleString()}
              </span>
              {originalPrice > discountPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className={`p-2 rounded-lg transition-colors duration-200 group/cart ${
                product.sold_out === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-100 text-green-700 hover:bg-red-200"
              }`}
              disabled={product.sold_out === 1}
            >
              <ShoppingCart
                size={16}
                className="group-hover/cart:scale-110 transition-transform"
              />
            </button>
          </div>

          {/* Tags - Only show in list view */}
          {viewMode === "list" && product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 2).map((tag, index) => {
                const cleanTag = tag.replace(/[\[\]"]/g, "");
                return (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {cleanTag}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </Link>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({
  isOpen,
  onClose,
  categoryId,
  setCategoryId,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  rating,
  setRating,
}) => {
  const [categories, setCategories] = useState();
  // ✅ fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        console.log(res);
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white z-50 lg:z-auto transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-r border-gray-100 h-full lg:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
            <div className="space-y-2">
              {categories &&
                categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id.toString()}
                      checked={categoryId.toString() === cat.id.toString()}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-green-600 transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Price Range (₹)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min Price: ₹{priceRange[0].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Price: ₹{priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((stars) => (
                <label
                  key={stars}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={stars}
                    checked={rating === stars}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <div className="ml-3 flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < stars
                            ? "fill-green-700 text-green-700"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-700 group-hover:text-green-600 transition-colors">
                      & up
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setCategoryId("");
              setPriceRange([0, 100000]);
              setSortBy("");
              setRating(0);
            }}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

function AllProducts() {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  const queryCategory = searchParams.get("category") || "";

  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.product);
  const isLoading = status === "loading";

  // State
  const [searchInput, setSearchInput] = useState(querySearch);
  const [search, setSearch] = useState(querySearch);
  const [categoryId, setCategoryId] = useState(queryCategory);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("");
  const [rating, setRating] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    if (queryCategory !== categoryId) {
      setCategoryId(queryCategory);
      setPage(1);
    }
  }, [queryCategory]);

  useEffect(() => {
    setSearch(querySearch);
    setSearchInput(querySearch);
    setPage(1);
  }, [querySearch]);

  // Effects
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    const params: any = {
      page,
      limit,
      search,
      categoryId: categoryId ? Number(categoryId) : undefined,
    };

    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 100000) params.maxPrice = priceRange[1];

    dispatch(fetchProducts(params));
  }, [dispatch, page, limit, search, categoryId, priceRange]);

  // Filter and sort products locally
  const filteredProducts = products?.products
    ? [...products.products]
        .filter((product) => {
          // Price filter
          const discountPrice = parseFloat(product.discountPrice);
          if (discountPrice < priceRange[0] || discountPrice > priceRange[1])
            return false;

          // Rating filter
          if (rating > 0 && 4 < rating) return false; // Using fixed 4-star rating

          return true;
        })
        .sort((a, b) => {
          const priceA = parseFloat(a.discountPrice);
          const priceB = parseFloat(b.discountPrice);
          const originalPriceA = parseFloat(a.originalPrice);
          const originalPriceB = parseFloat(b.originalPrice);

          switch (sortBy) {
            case "price-low":
              return priceA - priceB;
            case "price-high":
              return priceB - priceA;
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "discount":
              const discountA =
                ((originalPriceA - priceA) / originalPriceA) * 100;
              const discountB =
                ((originalPriceB - priceB) / originalPriceB) * 100;
              return discountB - discountA;
            default:
              return 0;
          }
        })
    : [];

  const totalProducts = products?.totalItems || 0;
  const totalPages = products?.totalPages || 1;

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600 mt-1">
                Discover our amazing collection of products
              </p>
            </div>

            {/* Search Bar */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            categoryId={categoryId}
            setCategoryId={(id) => {
              setCategoryId(id);
              setPage(1);
            }}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            rating={rating}
            setRating={setRating}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <div className="text-sm text-gray-600">
                  {totalProducts} products found
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSearch(searchInput);
                    setPage(1);
                  }}
                  className="relative"
                >
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => {
                      setSearch(searchInput);
                      setPage(1);
                    }}
                  />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  />
                </form>
              </div>
              {/* View Toggle and Sort */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                >
                  <option value="">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Highest Discount</option>
                </select>

                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading amazing products...</p>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }`}
              >
                {filteredProducts.map((product: Product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(product.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* No Products Found */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setCategoryId("");
                    setPriceRange([0, 100000]);
                    setRating(0);
                    setSortBy("");
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2 p-2 bg-white rounded-xl shadow-sm">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          page === pageNum
                            ? "bg-green-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default function AllProductsSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllProducts />
    </Suspense>
  );
}

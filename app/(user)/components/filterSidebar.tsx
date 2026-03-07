// components/FilterSidebar.tsx
import React from "react";

interface FilterSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Toys & Games",
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isVisible,
  onClose,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  selectedCategories,
  setSelectedCategories,
}) => {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed md:static top-0 left-0 h-full md:h-auto w-72 bg-white shadow-lg md:shadow-none z-50 p-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={onClose} className="p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="px-1">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value), priceRange[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`p-2 rounded-lg border ${
                  minRating === rating
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <div className="flex">
                  {[...Array(rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setPriceRange([0, 1000]);
            setMinRating(0);
            setSelectedCategories([]);
          }}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Clear All Filters
        </button>
      </div>
    </>
  );
};

export default FilterSidebar;

import Link from "next/link";
import { ChevronDown } from "lucide-react";

type CategoryType = {
  id: number;
  name: string;
  subcategories?: CategoryType[];
};

const   DropdownCategory: React.FC<{ category: CategoryType }> = ({
  category,
}) => {
  return (
    <div className="relative group">
      {/* Main Category Button (now clickable link) */}
      <Link
        href={`/products?categoryId=${category.id}`}
        className="flex items-center space-x-1 px-3 py-2 text-black hover:text-green-600 transition-colors duration-200"
      >
        <span className="font-medium capitalize">{category.name}</span>
        {category.subcategories?.length ? (
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
        ) : null}
      </Link>

      {/* Subcategories Dropdown */}
      {category.subcategories?.length ? (
        <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-20">
          <ul className="py-2">
            {category.subcategories.map((sub) => (
              <li key={sub.id} className="relative group/sub">
                <Link
                  href={`/products?category=${sub.id}`}
                  className="flex items-center justify-between px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-green-600 transition-colors rounded-md"
                >
                  <span className="capitalize">{sub.name}</span>
                  {sub.subcategories?.length ? (
                    <ChevronDown className="w-3 h-3 ml-2 rotate-[-90deg] group-hover/sub:rotate-0 transition-transform" />
                  ) : null}
                </Link>

                {/* Nested Dropdown (Second Level) */}
                {sub.subcategories?.length ? (
                  <div className="absolute top-0 left-full w-56 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible translate-x-0 transition-all duration-200 z-30">
                    <ul className="py-2">
                      {sub.subcategories.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/products?category=${child.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors rounded-md"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default DropdownCategory;






// import Link from "next/link";

// type CategoryType = {
//   id: number;
//   name: string;
//   subcategories?: CategoryType[];
// };

// const DropdownCategory: React.FC<{ category: CategoryType }> = ({
//   category,
// }) => {
//   return (
//     <div className="relative group">
//       {/* Top Nav Category */}
//       <Link
//         href={`/products?categoryId=${category.id}`}
//         className="px-4 py-2 font-medium text-black hover:text-green-700 transition-colors"
//       >
//         {category.name}
//       </Link>

//       {/* Mega Menu Dropdown */}
//       {category.subcategories?.length ? (
//         <div
//           className="absolute -left-1/2 top-full mt-3
//                     w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[50vw]
//                     max-w-6xl bg-white shadow-xl rounded-xl
//                     opacity-0 invisible group-hover:opacity-100
//                     group-hover:visible transition-all duration-200 z-50"
//         >
//           <div
//             className="grid gap-6 p-6
//                       grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
//           >
//             {category.subcategories.map((column) => (
//               <div key={column.id}>
//                 {/* Column Title */}
//                 <Link 
//                   href={`/products?categoryId=${category.id}`}
//                   className="inline-block font-semibold text-gray-900 mb-4 hover:text-green-700 uppercase text-sm">
//                   {column.name}
//                 </Link>

//                 {/* Column Items */}
//                 <ul className="space-y-2">
//                   {column.subcategories?.map((item) => (
//                     <li key={item.id}>
//                       <Link
//                         href={`/products?category=${item.id}`}
//                         className="text-sm text-gray-600 hover:text-green-700 transition-colors"
//                       >
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : null}
//     </div>

//   );
// };

// export default DropdownCategory;

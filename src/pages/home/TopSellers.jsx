// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper/modules";
// import { FiArrowRight } from "react-icons/fi"; // Import an icon

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Link } from "react-router-dom";
// import { useFetchAllItemsQuery } from "../../redux/features/itemAPI";
// import ItemCard from "../items/ItemCard";
// import Loading from "../../components/Loading";

// // const categories = [
// //   "Choose a genre",
// //   "Fiction",
// //   "Business",
// //   "Horror",
// //   "Adventure",
// // ];

// const TopSellers = () => {
//   const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

//   const { data: itemsData = {}, error, isLoading } = useFetchAllItemsQuery();
//   const items = itemsData.item || [];
//   console.log("Items:", items);

//   // Extract unique categories from items
//   const categories = Array.from(new Set(items.map((item) => item.category)));
//   console.log("Categories:", categories);

//   const filteredItems = Array.isArray(items)
//     ? selectedCategory === "Choose a genre"
//       ? items
//       : items.filter(
//           (item) =>
//             item.category.toLowerCase() === selectedCategory.toLowerCase()
//         )
//     : [];

//   if (isLoading) {
//     return (
//       <div>
//         <Loading />
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error loading items</div>;
//   }
//   return (
//     <div className="py-6">
//       <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
//         Top Sellers
//       </h2>
//       {/* categories Selection */}
//       <div className="w-full flex justify-center md:justify-start mb-3">
//         <div className="w-[95%] sm:w-[90%] md:w-[300px]">
//           <select
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             name="category"
//             id="category"
//             className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
//           >
//             {categories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       {/* See All Link */}
//       <div className="flex justify-end mb-2 px-4 font-semibold">
//         <Link
//           to="/all-products"
//           className="text-blue-500 flex items-center gap-1 hover:underline text-blue-700 dark:text-blue-400"
//         >
//           See All <FiArrowRight />
//         </Link>
//       </div>
//       {/* Modern Mobile Layout */}
//       <div className="block md:hidden">
//         <div className="flex gap-3 overflow-x-auto pb-2 px-2">
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item, index) => (
//               <div key={index} className="flex-shrink-0 w-56">
//                 <ItemCard item={item} />
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 dark:text-gray-400">
//               No items found.
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Responsive Grid for Desktop */}
//       <div className="hidden md:block px-2">
//         {filteredItems.length > 0 ? (
//           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {filteredItems.map((item, index) => (
//               <ItemCard key={index} item={item} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-gray-500 dark:text-gray-400">
//             No items found for the selected category.
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // return (
//   //   <div className="py-6">
//   //     <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
//   //       Top Sellers
//   //     </h2>
//   //     {/* categories Selection */}
//   //     <div className="w-full flex justify-center md:justify-start mb-3">
//   //       <div className="w-[95%] sm:w-[90%] md:w-[300px]">
//   //         <select
//   //           onChange={(e) => setSelectedCategory(e.target.value)}
//   //           name="category"
//   //           id="category"
//   //           className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
//   //         >
//   //           {categories.map((category, index) => (
//   //             <option key={index} value={category}>
//   //               {category}
//   //             </option>
//   //           ))}
//   //         </select>
//   //       </div>
//   //     </div>
//   //     {/* See All Link */}
//   //     <div className="flex justify-end mb-2 px-4 font-semibold">
//   //       <Link
//   //         to="/all-products"
//   //         className="text-blue-500 flex items-center gap-1 hover:underline text-blue-700 dark:text-blue-400"
//   //       >
//   //         See All <FiArrowRight />
//   //       </Link>
//   //     </div>
//   //     {/* Modern Mobile Layout */}
//   //     <div className="block md:hidden">
//   //       <div className="flex gap-3 overflow-x-auto pb-2 px-2">
//   //         {filteredItems.length > 0 ? (
//   //           filteredItems.map((item, index) => (
//   //             <div key={index} className="flex-shrink-0 w-56">
//   //               <ItemCard item={item} />
//   //             </div>
//   //           ))
//   //         ) : (
//   //           <div className="text-gray-500 dark:text-gray-400">
//   //             No items found.
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //     {/* Swiper for Desktop */}
//   //     <div className="hidden md:block px-2">
//   //       <Swiper
//   //         navigation
//   //         key={selectedCategory}
//   //         spaceBetween={20}
//   //         breakpoints={{
//   //           768: { slidesPerView: 2 },
//   //           1024: { slidesPerView: 2 },
//   //           1180: { slidesPerView: 3 },
//   //           1240: { slidesPerView: 4 },
//   //         }}
//   //         modules={[Pagination, Navigation]}
//   //         className="mySwiper"
//   //       >
//   //         {filteredItems.map((item, index) => (
//   //           <SwiperSlide key={index} className="flex">
//   //             <ItemCard item={item} />
//   //           </SwiperSlide>
//   //         ))}
//   //       </Swiper>
//   //     </div>
//   //   </div>
//   // );
// };

// export default TopSellers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../items/ItemCard";

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const cols = 4;
  const rows = 2;
  const maxVisible = cols * rows;

  useEffect(() => {
    axios
      .get("https://store-production-39af.up.railway.app/api/admin/top-sellers")
      .then((res) => setTopSellers(res.data))
      .catch((err) => console.error("Failed to fetch top sellers", err))
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = showAll ? topSellers : topSellers.slice(0, maxVisible);

  if (loading)
    return <p className="text-center py-6">Loading top sellers...</p>;

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Top Sellers This Month
      </h2>

      {/* Mobile Scroll */}
      <div className="md:hidden px-2">
        <div className="flex overflow-x-auto gap-3 pb-2">
          {topSellers.map((item) => (
            <div key={item._id} className="flex-shrink-0 w-56">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block px-2">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>

        {topSellers.length > maxVisible && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellers;

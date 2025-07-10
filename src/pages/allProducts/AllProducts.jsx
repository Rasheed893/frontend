// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/grid";
// import "swiper/css/pagination";
// import "./AllProducts.css";

// import { Grid, Pagination } from "swiper/modules";
// import ItemCard from "../items/ItemCard";
// import { useFetchAllItemsQuery } from "../../redux/features/itemAPI";
// import { Link } from "react-router-dom";

// import Masonry from "react-masonry-css";
// import InfiniteScroll from "react-infinite-scroll-component";

// const AllProducts = () => {
//   const [selectedCategory, setSelectedCategory] = useState("All Categories");
//   const [searchQuery, setSearchQuery] = useState(""); // new search query state

//   const { data: itemsData = {}, error, isLoading } = useFetchAllItemsQuery();
//   const items = itemsData.item || [];

//   // Extract unique categories from items
//   const categories = [
//     "All Categories",
//     ...new Set(items.map((item) => item.category)),
//   ];
//   console.log("Categories:", categories);

//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 🔍 Apply search and category filter logic
//   const filteredItems = Array.isArray(items)
//     ? items.filter((item) => {
//         const matchesCategory =
//           selectedCategory === "All Categories" ||
//           item.category.toLowerCase() === selectedCategory.toLowerCase();
//         const matchesSearch =
//           item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.description.toLowerCase().includes(searchQuery.toLowerCase());
//         return searchQuery ? matchesSearch : matchesCategory;
//       })
//     : [];

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading items</div>;

//   return (
//     <>
//       {/* Search + Category Controls */}
//       <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between mb-6 px-4">
//         <div className="w-full md:w-[300px]">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
//           />
//         </div>

//         <div className="w-full md:w-[300px]">
//           <select
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             value={selectedCategory}
//             name="category"
//             id="category"
//             className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
//           >
//             {categories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Mobile: Horizontal Scroll */}
//       <div className="block md:hidden">
//         <div className="flex gap-3 overflow-x-auto pb-2 px-2">
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item, index) => (
//               <div key={index} className="flex-shrink-0 w-56">
//                 <ItemCard item={item} />
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 dark:text-gray-400 w-full text-center py-10">
//               No products found.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Desktop: Swiper Grid */}
//       <div className="hidden md:block">
//         <Swiper
//           slidesPerView={1}
//           key={selectedCategory}
//           breakpoints={{
//             640: { slidesPerView: 1 },
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//           grid={{ rows: 3, fill: "row" }}
//           spaceBetween={20}
//           pagination={{ clickable: true }}
//           modules={[Grid, Pagination]}
//           className="mySwiper px-4 sm:px-8"
//         >
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item, index) => (
//               <SwiperSlide key={index}>
//                 <ItemCard item={item} />
//               </SwiperSlide>
//             ))
//           ) : (
//             <div className="w-full text-center col-span-full py-10">
//               No products found.
//             </div>
//           )}
//         </Swiper>
//       </div>
//     </>
//   );
// };

// export default AllProducts;
import React, { useEffect, useState } from "react";
import ItemCard from "../items/ItemCard";
import { useFetchAllItemsQuery } from "../../redux/features/itemAPI";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";

const ITEMS_PER_PAGE = 20;

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { data: itemsData = {}, error, isLoading } = useFetchAllItemsQuery();
  const items = itemsData.item || [];

  // Extract unique categories from items
  const categories = [
    "All Categories",
    ...new Set(items.map((item) => item.category)),
  ];

  // Responsive window width for layout switching
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter logic
  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        const matchesCategory =
          selectedCategory === "All Categories" ||
          item.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return searchQuery ? matchesSearch : matchesCategory;
      })
    : [];

  // Pagination for infinite scroll
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleItems.length < filteredItems.length;
  const fetchMoreItems = () => setVisibleCount((prev) => prev + ITEMS_PER_PAGE);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">Error loading items</div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Search + Category Controls */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between mb-6 px-2 sm:px-4 pt-6">
        <div className="w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE); // reset pagination on search
            }}
            className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
          />
        </div>
        <div className="w-full md:w-[300px]">
          <select
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE); // reset pagination on filter
            }}
            value={selectedCategory}
            name="category"
            id="category"
            className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile: Responsive Grid Cards */}
      <div className="block md:hidden px-2">
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl shadow-md bg-white dark:bg-gray-900"
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 w-full text-center py-10">
            No products found.
          </div>
        )}
        {hasMore && (
          <div className="flex justify-center mt-4 mb-6">
            <button
              onClick={fetchMoreItems}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Desktop/Tablet: Masonry Grid with Infinite Scroll */}
      <div className="hidden md:block px-2 sm:px-4">
        <InfiniteScroll
          dataLength={visibleItems.length}
          next={fetchMoreItems}
          hasMore={hasMore}
          loader={<h4 className="text-center py-4">Loading...</h4>}
          endMessage={
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No more products.
            </p>
          }
        >
          <Masonry
            breakpointCols={{ default: 4, 1100: 3, 900: 2, 700: 2, 500: 1 }}
            className="flex w-auto gap-4"
            columnClassName="masonry-column"
          >
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <div key={item.id} className="mb-6">
                  <ItemCard item={item} />
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 w-full text-center py-10">
                No products found.
              </div>
            )}
          </Masonry>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AllProducts;

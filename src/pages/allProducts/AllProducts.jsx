import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "./AllProducts.css";

import { Grid, Pagination } from "swiper/modules";
import ItemCard from "../items/ItemCard";
import { useFetchAllItemsQuery } from "../../redux/features/itemAPI";
import { Link } from "react-router-dom";

import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState(""); // new search query state

  const { data: itemsData = {}, error, isLoading } = useFetchAllItemsQuery();
  const items = itemsData.item || [];

  // Extract unique categories from items
  const categories = [
    "All Categories",
    ...new Set(items.map((item) => item.category)),
  ];
  console.log("Categories:", categories);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔍 Apply search and category filter logic
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading items</div>;

  return (
    <>
      {/* Search + Category Controls */}
      <div className="px-2 sm:px-4 py-6">
        {/* <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between mb-6 px-4"> */}
        <div className="w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
          />
        </div>

        <div className="w-full md:w-[300px]">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
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

      <InfiniteScroll
        dataLength={filteredItems.length}
        next={fetchMoreItems} // your function to fetch more
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className="text-center text-gray-500">No more products.</p>
        }
      >
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className="flex w-auto gap-4"
          columnClassName="masonry-column"
        >
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </Masonry>
      </InfiniteScroll>
      {/* Mobile: Horizontal Scroll */}
      {/* <div className="block md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 px-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-56">
                <ItemCard item={item} />
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400 w-full text-center py-10">
              No products found.
            </div>
          )}
        </div>
      </div> */}

      {/* Desktop: Swiper Grid */}
      {/* <div className="hidden md:block">
        <Swiper
          slidesPerView={1}
          key={selectedCategory}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          grid={{ rows: 3, fill: "row" }}
          spaceBetween={20}
          pagination={{ clickable: true }}
          modules={[Grid, Pagination]}
          className="mySwiper px-4 sm:px-8"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <SwiperSlide key={index}>
                <ItemCard item={item} />
              </SwiperSlide>
            ))
          ) : (
            <div className="w-full text-center col-span-full py-10">
              No products found.
            </div>
          )}
        </Swiper>
      </div> */}
    </>
  );
};

export default AllProducts;

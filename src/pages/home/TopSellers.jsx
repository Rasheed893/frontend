import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FiArrowRight } from "react-icons/fi"; // Import an icon

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { useFetchAllItemsQuery } from "../../redux/features/itemAPI";
import ItemCard from "../items/ItemCard";
import Loading from "../../components/Loading";

// const categories = [
//   "Choose a genre",
//   "Fiction",
//   "Business",
//   "Horror",
//   "Adventure",
// ];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  const { data: itemsData = {}, error, isLoading } = useFetchAllItemsQuery();
  const items = itemsData.item || [];
  console.log("Items:", items);

  // Extract unique categories from items
  const categories = Array.from(new Set(items.map((item) => item.category)));
  console.log("Categories:", categories);

  const filteredItems = Array.isArray(items)
    ? selectedCategory === "Choose a genre"
      ? items
      : items.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
    : [];

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error loading items</div>;
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
        Top Sellers
      </h2>
      {/* categories Selection */}
      <div className="w-full flex justify-center md:justify-start mb-3">
        <div className="w-[95%] sm:w-[90%] md:w-[300px]">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            name="category"
            id="category"
            className="w-full border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition duration-200"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* See All Link */}
      <div className="flex justify-end mb-2 px-4 font-semibold">
        <Link
          to="/all-products"
          className="text-blue-500 flex items-center gap-1 hover:underline text-blue-700 dark:text-blue-400"
        >
          See All <FiArrowRight />
        </Link>
      </div>
      {/* Modern Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 px-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-56">
                <ItemCard item={item} />
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              No items found.
            </div>
          )}
        </div>
      </div>
      {/* Swiper for Desktop */}
      <div className="hidden md:block">
        <Swiper
          navigation={true}
          key={selectedCategory}
          spaceBetween={10}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 10 },
            1024: { slidesPerView: 2, spaceBetween: 10 },
            1180: { slidesPerView: 3, spaceBetween: 10 },
            1240: { slidesPerView: 4, spaceBetween: 10 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {filteredItems.length > 0 &&
            filteredItems.map((item, index) => (
              <SwiperSlide key={index}>
                <ItemCard item={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopSellers;

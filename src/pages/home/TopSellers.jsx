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
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>
      {/* categories Selection */}
      <div className="w-full flex justify-center md:justify-start mb-4">
        <div className="w-[90%] md:w-[300px]">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            name="category"
            id="category"
            className="w-full border bg-gray-100 border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
      <div className="flex justify-end mb-0 px-10 font-semibold">
        <Link
          to="/all-products"
          className="text-blue-500 flex items-center gap-1 hover:underline text-blue-700"
        >
          See All <FiArrowRight />
        </Link>
      </div>
      {/* Swiper */}
      <Swiper
        navigation={true}
        // slidesPerView={1}
        key={selectedCategory}
        spaceBetween={10}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1240: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
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
  );
};

export default TopSellers;

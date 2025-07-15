import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetRecommendedItemsQuery } from "../../../redux/features/itemAPI";
import ItemCard from "../../items/ItemCard";
import Loading from "../../../components/Loading";

const Recommended = () => {
  const { currentUser } = useAuth();
  const email = currentUser?.email;

  const { data, isLoading, isError } = useGetRecommendedItemsQuery(email, {
    skip: !email, // avoid firing before user is loaded
  });

  const items = data?.recommended || [];

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading recommended items</div>;

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        More For You
      </h2>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 px-2">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-70">
                <ItemCard item={item} />
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400 w-full text-center py-10">
              No recommended items found.
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block px-2">
        <div className="flex gap-8 overflow-x-auto pb-2">
          {items.length > 0 &&
            items.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default Recommended;

// import React, { useEffect, useState } from "react";

// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";
// import "./Recommended.css";

// // import required modules
// import { EffectCoverflow, Pagination } from "swiper/modules";
// import ItemCard from "../../items/ItemCard";
// import { useFetchAllItemsQuery } from "../../../redux/features/itemAPI";
// import Loading from "../../../components/Loading";

// const Recommended = () => {
//   const { data: itemsData = {}, error, isLoading } = useFetchAllItemsQuery();
//   const items = itemsData.item || [];

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
//     <div className="py-16">
//       <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
//         More For You
//       </h2>

//       {/* Mobile: Horizontal Scroll */}
//       <div className="block md:hidden">
//         <div className="flex gap-3 overflow-x-auto pb-2 px-2">
//           {items.length > 0 ? (
//             items.map((item, index) => (
//               <div key={index} className="flex-shrink-0 w-56">
//                 <ItemCard item={item} />
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 dark:text-gray-400 w-full text-center py-10">
//               No recommended items found.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Desktop: Swiper */}
//       <div className="hidden md:block px-2">
//         <div className="flex gap-8 overflow-x-auto pb-2">
//           {items.length > 0 &&
//             items.map((item, index) => <ItemCard item={item} />)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Recommended;

// ************
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";
// import "./Recommended.css";

// // Import required modules
// import { EffectCoverflow, Pagination } from "swiper/modules";
// import ItemCard from "../../items/ItemCard";
// import { useFetchAllItemsQuery } from "../../../redux/features/itemAPI";
// import { useGetOrdersByCustomerIdQuery } from "../../../redux/features/orderAPI";
// import { useAuth } from "../../../context/AuthContext";
// import Loading from "../../../components/Loading";

// const Recommended = () => {
//   const { currentUser } = useAuth(); // Get the logged-in user's email
//   const [filteredItems, setFilteredItems] = useState([]);

//   // Fetch items and orders
//   const { data: itemsData = {}, isLoading: isItemsLoading } =
//     useFetchAllItemsQuery();
//   const { data: ordersData = {}, isLoading: isOrdersLoading } =
//     useGetOrdersByCustomerIdQuery(
//       currentUser?.email, // Only fetch orders if currentUser is available
//       { skip: !currentUser } // Skip the query if currentUser is null
//     );

//   const items = itemsData.item || [];
//   const orders = ordersData || [];

//   useEffect(() => {
//     console.log("Orders Data:", orders);
//     console.log("Items Data:", items);

//     if (orders.length > 0 && items.length > 0) {
//       // Extract categories from the user's orders
//       const userOrderCategories = orders
//         .flatMap((order) => order.products.map((product) => product.category))
//         .filter((category, index, self) => self.indexOf(category) === index); // Remove duplicates

//       console.log("User Order Categories:", userOrderCategories);

//       // Filter items by categories from the user's orders
//       const filtered = items.filter((item) =>
//         userOrderCategories.includes(item.category)
//       );

//       console.log("Filtered Items:", filtered);

//       setFilteredItems(filtered);
//     }
//   }, [orders, items]);

//   // Show loading state while fetching data
//   if (isItemsLoading || isOrdersLoading || !currentUser) {
//     return (
//       <div>
//         <Loading />
//       </div>
//     );
//   }

//   return (
//     <div className="py-16">
//       <h2 className="text-3xl font-semibold mb-6">Recommended For You</h2>

//       <Swiper
//         effect={"coverflow"}
//         grabCursor={true}
//         centeredSlides={true}
//         spaceBetween={20}
//         slidesPerView={"auto"}
//         coverflowEffect={{
//           rotate: 50,
//           stretch: 0,
//           depth: 100,
//           modifier: 1,
//           slideShadows: true,
//         }}
//         pagination={true}
//         modules={[EffectCoverflow, Pagination]}
//         className="mySwiper"
//       >
//         {filteredItems.length > 0 ? (
//           filteredItems.map((item, index) => (
//             <SwiperSlide key={index}>
//               <ItemCard item={item} />
//             </SwiperSlide>
//           ))
//         ) : (
//           <div className="text-center text-gray-500">
//             No recommended items found. Please make a purchase to see
//             recommendations.
//           </div>
//         )}
//       </Swiper>
//     </div>
//   );
// };

// export default Recommended;

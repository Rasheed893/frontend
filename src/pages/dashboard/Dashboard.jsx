// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Loading from "../../components/Loading";
// import getBaseURL from "../../utils/baseURL";
// import { MdIncompleteCircle } from "react-icons/md";
// import RevenueChart from "./RevenueChart";
// import TabbedTopItems from "../../components/TabbedTopItems";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({});
//   const Navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${getBaseURL()}/api/admin`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         });
//         setData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error", error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);
//   console.log(data);
//   // Mothly sales
//   const currentMonthSales = data?.monthlySales?.at(-1)?.totalSales || 0;
//   const previousMonthSales = data?.monthlySales?.at(-2)?.totalSales || 0;
//   const salesChange =
//     previousMonthSales > 0
//       ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100
//       : 0;

//   if (loading) return <Loading />;
//   return (
//     <>
//       <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">
//         <div className="flex items-center p-8 bg-white shadow rounded-lg">
//           <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
//             <svg
//               aria-hidden="true"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="h-6 w-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//               />
//             </svg>
//           </div>
//           <div>
//             <span className="block text-2xl font-bold">{data?.totalItems}</span>
//             <span className="block text-gray-500">Products</span>
//           </div>
//         </div>
//         <div className="flex items-center p-8 bg-white shadow rounded-lg">
//           <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
//             <svg
//               aria-hidden="true"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="h-6 w-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
//               />
//             </svg>
//           </div>
//           <div>
//             <span className="block text-2xl font-bold">
//               ${data?.totalSales.toFixed(2)}
//             </span>
//             <span
//               className={`block font-semibold ${
//                 salesChange >= 0 ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               {salesChange >= 0 ? "+" : ""}
//               {salesChange.toFixed(1)}% from last month
//             </span>
//             <span className="block text-gray-500">Total Sales</span>
//           </div>
//         </div>
//         <div className="flex items-center p-8 bg-white shadow rounded-lg">
//           <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
//             <svg
//               aria-hidden="true"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="h-6 w-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
//               />
//             </svg>
//           </div>
//           <div>
//             <span className="inline-block text-2xl font-bold">
//               {data?.trendingItems}
//             </span>
//             <span className="inline-block text-xl text-gray-500 font-semibold">
//               (13%)
//             </span>
//             <span className="block text-gray-500">
//               Trending Item in This Month
//             </span>
//           </div>
//         </div>
//         <div className="flex items-center p-8 bg-white shadow rounded-lg">
//           <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
//             <MdIncompleteCircle className="size-6" />
//           </div>
//           <div>
//             <span className="block text-2xl font-bold">
//               {data?.totalOrders}
//             </span>
//             <span className="block text-gray-500">Total Orders</span>
//           </div>
//         </div>
//       </section>
//       <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
//         {/* Big Revenue Chart */}
//         <div className="col-span-1 md:col-span-2 xl:col-span-2 row-span-2 bg-white shadow rounded-lg">
//           <div className="px-6 py-5 font-semibold border-b border-gray-100">
//             The number of orders per month
//           </div>
//           <div className="p-4">
//             <RevenueChart monthlySales={data?.monthlySales || []} />
//           </div>
//         </div>

//         {/* Orders by Status */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
//           <ul className="space-y-3">
//             {data?.ordersByStatus?.map((statusItem) => (
//               <li
//                 key={statusItem._id}
//                 className="flex justify-between items-center"
//               >
//                 <span className="capitalize text-gray-700">
//                   {statusItem._id}
//                 </span>
//                 <span className="font-bold text-indigo-600">
//                   {statusItem.count}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Low Stock Alert */}
//         <div className="bg-white shadow rounded-lg p-6 overflow-y-auto max-h-64">
//           <h3 className="text-lg font-semibold mb-4">⚠️ Low Stock Items</h3>
//           <ul className="space-y-3">
//             {data?.lowStockItems?.map((item) => (
//               <li key={item._id} className="flex justify-between items-center">
//                 <span className="text-gray-700">{item.title}</span>
//                 <span className="text-red-600 font-semibold">
//                   {item.stockQuantity} left
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Top Customers */}
//         <div className="col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow rounded-lg flex flex-col">
//           <div className="px-6 py-5 font-semibold border-b border-gray-100">
//             Top Customers by Total Spend
//           </div>
//           <div
//             className="overflow-y-auto flex-grow px-6 pb-6"
//             style={{ maxHeight: "28rem" }}
//           >
//             <ul className="space-y-4">
//               {data?.topCustomers?.map((customer, idx) => (
//                 <li key={idx} className="flex flex-col">
//                   <div className="flex justify-between">
//                     <span className="text-gray-700 font-medium">
//                       {customer._id.name}
//                     </span>
//                     <span className="font-semibold text-green-600">
//                       AED {customer.totalSpent.toFixed(2)}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {customer._id.email} • {customer.orderCount} order(s)
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Tabbed Top Items */}
//         <div className="col-span-1 md:col-span-2 xl:col-span-2 bg-white shadow rounded-lg">
//           <TabbedTopItems
//             mostPurchased={data?.mostPurchasedItems || []}
//             leastPurchased={data?.leastPurchasedItems || []}
//           />
//         </div>
//       </section>
//       {/* Footer */}
//       <section className="text-center mt-8 text-gray-500 text-sm font-semibold">
//         <p className="mb-2">
//           &copy; {new Date().getFullYear()} E-commerce Dashboard. All rights
//           reserved.
//         </p>
//         <p className="mb-2">
//           Made by{" "}
//           <a
//             href="mailto:rasheed893@hotmail.com"
//             className="text-blue-500 hover:underline cursor-pointer"
//           >
//             RASHEED
//           </a>
//         </p>
//       </section>
//     </>
//   );
// };

// export default Dashboard;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import getBaseURL from "../../utils/baseURL";
import { MdIncompleteCircle } from "react-icons/md";
import RevenueChart from "./RevenueChart";
import TabbedTopItems from "../../components/TabbedTopItems";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseURL()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Mothly sales
  const currentMonthSales = data?.monthlySales?.at(-1)?.totalSales || 0;
  const previousMonthSales = data?.monthlySales?.at(-2)?.totalSales || 0;
  const salesChange =
    previousMonthSales > 0
      ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100
      : 0;

  if (loading) return <Loading />;
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr p-2 sm:p-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 dark:bg-purple-900 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
              {data?.totalItems}
            </span>
            <span className="block text-gray-500 dark:text-gray-400">
              Products
            </span>
          </div>
        </div>
        <div className="flex items-center p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg min-w-0">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 dark:bg-green-900 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100 break-words">
              ${data?.totalSales?.toFixed(2)}
            </span>
            <span
              className={`block font-semibold ${
                salesChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {salesChange >= 0 ? "+" : ""}
              {salesChange.toFixed(1)}% from last month
            </span>
            <span className="block text-gray-500 dark:text-gray-400">
              Total Sales
            </span>
          </div>
        </div>
        <div className="flex items-center p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 dark:bg-red-900 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <div>
            <span className="inline-block text-2xl font-bold text-gray-800 dark:text-gray-100">
              {data?.trendingItems}
            </span>
            <span className="inline-block text-xl text-gray-500 dark:text-gray-400 font-semibold">
              (13%)
            </span>
            <span className="block text-gray-500 dark:text-gray-400">
              Trending Item in This Month
            </span>
          </div>
        </div>
        <div className="flex items-center p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 dark:bg-blue-900 rounded-full mr-6">
            <MdIncompleteCircle className="size-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
              {data?.totalOrders}
            </span>
            <span className="block text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8 p-2 sm:p-4 bg-gray-100 dark:bg-gray-900">
        {/* Big Revenue Chart */}
        <div className="col-span-1 md:col-span-2 xl:col-span-2 row-span-2 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 sm:px-6 py-5 font-semibold border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100">
            The number of orders per month
          </div>
          <div className="p-2 sm:p-4">
            <RevenueChart monthlySales={data?.monthlySales || []} />
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Orders by Status
          </h3>
          <ul className="space-y-3">
            {data?.ordersByStatus?.map((statusItem) => (
              <li
                key={statusItem._id}
                className="flex justify-between items-center"
              >
                <span className="capitalize text-gray-700 dark:text-gray-300">
                  {statusItem._id}
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {statusItem.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 overflow-y-auto max-h-64">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            ⚠️ Low Stock Items
          </h3>
          <ul className="space-y-3">
            {data?.lowStockItems?.map((item) => (
              <li key={item._id} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.title}
                </span>
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  {item.stockQuantity} left
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Customers */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1 bg-white dark:bg-gray-800 shadow rounded-lg flex flex-col">
          <div className="px-4 sm:px-6 py-5 font-semibold border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100">
            Top Customers by Total Spend
          </div>
          <div
            className="overflow-y-auto flex-grow px-4 sm:px-6 pb-6"
            style={{ maxHeight: "28rem" }}
          >
            <ul className="space-y-4">
              {data?.topCustomers?.map((customer, idx) => (
                <li key={idx} className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {customer._id.name}
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      AED {customer.totalSpent.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {customer._id.email} • {customer.orderCount} order(s)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabbed Top Items */}
        <div className="col-span-1 md:col-span-2 xl:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg">
          <TabbedTopItems
            mostPurchased={data?.mostPurchasedItems || []}
            leastPurchased={data?.leastPurchasedItems || []}
          />
        </div>
      </section>
      {/* Footer */}
      <section className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm font-semibold">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} E-commerce Dashboard. All rights
          reserved.
        </p>
        <p className="mb-2">
          Made by{" "}
          <a
            href="mailto:rasheed893@hotmail.com"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            RASHEED
          </a>
        </p>
      </section>
    </>
  );
};

export default Dashboard;

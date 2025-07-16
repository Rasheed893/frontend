// import React, { useEffect, useState } from "react";
// import getBaseURL from "../../utils/baseURL";
// import Loading from "../../components/Loading";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { HiViewGridAdd } from "react-icons/hi";
// import { MdOutlineManageHistory } from "react-icons/md";
// import { useGetRecentOrderNotificationsQuery } from "../../redux/features/orderAPI";
// import { CiLogout } from "react-icons/ci";
// import { useDispatch } from "react-redux";
// import { logout } from "../../redux/features/authSlice"; // adjust path as needed
// import { BiSolidOffer } from "react-icons/bi";

// const DashboardLayout = () => {
//   const { data, isLoading, isError } = useGetRecentOrderNotificationsQuery();

//   const orders = data?.item || [];
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [hasMarkedRead, setHasMarkedRead] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Flatten all notifications from all orders into one list
//   const allNotifications = orders
//     .flatMap((order) =>
//       order.notifications.map((n) => ({
//         ...n,
//         orderId: order.id,
//         customerName: order.customerName,
//       }))
//     )
//     .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

//   const hasNotifications = allNotifications.length > 0;

//   useEffect(() => {
//     if (!hasMarkedRead && allNotifications.length) {
//       setUnreadCount(allNotifications.length);
//     }
//   }, [allNotifications, hasMarkedRead]);

//   useEffect(() => {
//     const savedRead = localStorage.getItem("notificationsRead");
//     const savedTime = savedRead ? new Date(savedRead) : null;

//     if (savedTime && allNotifications.length) {
//       const newUnread = allNotifications.filter(
//         (notif) => new Date(notif.date) > savedTime
//       );
//       setUnreadCount(newUnread.length);
//     } else {
//       setUnreadCount(allNotifications.length);
//     }
//   }, [allNotifications]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/admin");
//   };
//   return (
//     <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">
//       <aside className="hidden sm:flex sm:flex-col">
//         <a
//           href="/"
//           className="inline-flex items-center justify-center h-20 w-20 bg-purple-600 hover:bg-purple-500 focus:bg-purple-500"
//         >
//           <img src="/RFS.png" alt="" />
//         </a>
//         <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-900">
//           <nav className="flex flex-col mx-4 my-6 space-y-4">
//             <a
//               href="/dashboard/manage-orders"
//               className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
//             >
//               <span className="sr-only">Folders</span>
//               <svg
//                 aria-hidden="true"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="h-6 w-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
//                 />
//               </svg>
//             </a>
//             <Link
//               to="/dashboard"
//               className="inline-flex items-center justify-center py-3 text-purple-600 bg-white rounded-lg"
//             >
//               <span className="sr-only">Dashboard</span>
//               <svg
//                 aria-hidden="true"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="h-6 w-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                 />
//               </svg>
//             </Link>
//             <Link
//               to="/dashboard/add-new-item"
//               className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
//             >
//               <span className="sr-only">Add Item</span>
//               <HiViewGridAdd className="h-6 w-6" />
//             </Link>
//             <Link
//               to="/dashboard/manage-items"
//               className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
//             >
//               <span className="sr-only">Documents</span>
//               <MdOutlineManageHistory className="h-6 w-6" />
//             </Link>
//             <Link
//               to="/dashboard/slides-managment"
//               className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
//             >
//               <span className="sr-only">Documents</span>
//               <BiSolidOffer className="h-6 w-6" />
//             </Link>
//             <Link
//               to="/dashboard/promo-managment"
//               className="inline-flex items-center justify-center py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
//             >
//               <span className="sr-only">Documents</span>
//               <BiSolidOffer className="h-6 w-6" />
//             </Link>
//           </nav>
//           <div className="inline-flex items-center justify-center h-20 w-20 border-t border-gray-700">
//             <button
//               onClick={handleLogout}
//               className="p-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
//             >
//               <span className="sr-only">Logout</span>
//               <svg
//                 aria-hidden="true"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="h-6 w-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </aside>
//       <div className="flex-grow text-gray-800">
//         <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
//           <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full">
//             <span className="sr-only">Menu</span>
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
//                 d="M4 6h16M4 12h16M4 18h7"
//               />
//             </svg>
//           </button>
//           <div className="relative w-full max-w-md sm:-ml-2">
//             <svg
//               aria-hidden="true"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//               className="absolute h-6 w-6 mt-2.5 ml-2 text-gray-400"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <input
//               type="text"
//               role="search"
//               placeholder="Search..."
//               className="py-2 pl-10 pr-4 w-full border-4 border-transparent placeholder-gray-400 focus:bg-gray-50 rounded-lg"
//             />
//           </div>
//           <div className="flex flex-shrink-0 items-center ml-auto">
//             <button className="inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg">
//               <span className="sr-only">User Menu</span>
//               <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
//                 <span className="font-semibold">Grace Simmons</span>
//                 <span className="text-sm text-gray-600">Lecturer</span>
//               </div>
//               <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
//                 <img
//                   src="https://randomuser.me/api/portraits/women/68.jpg"
//                   alt="user profile photo"
//                   className="h-full w-full object-cover"
//                 />
//               </span>
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 className="hidden sm:block h-6 w-6 text-gray-300"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//             <div className="border-l pl-3 ml-3 space-x-1 relative">
//               <button
//                 onClick={() => {
//                   setShowNotifications(!showNotifications);
//                   if (!showNotifications) {
//                     // icat;
//                     const now = new Date().toISOString();
//                     localStorage.setItem("notificationsRead", now); // Save timestamp
//                     setUnreadCount(0);
//                     setHasMarkedRead(true);
//                   }
//                 }}
//                 className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full"
//               >
//                 <span className="sr-only">Notifications</span>
//                 {unreadCount > 0 && (
//                   <>
//                     <span className="absolute -top-0.5 -right-0.5 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
//                       {unreadCount}
//                     </span>
//                   </>
//                 )}
//                 <svg
//                   aria-hidden="true"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-6 w-6"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                   />
//                 </svg>
//               </button>

//               {/* Notifications dropdown */}
//               {showNotifications && hasNotifications && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-50 text-sm">
//                   <div className="p-2 font-semibold border-b">
//                     Notifications
//                   </div>
//                   <ul className="max-h-60 overflow-auto">
//                     {allNotifications.slice(0, 5).map((notif, index) => (
//                       <li
//                         key={`${notif.orderId}-${notif.date}-${index}`}
//                         className="px-3 py-2 border-b hover:bg-gray-50"
//                       >
//                         🛎 <strong>{notif.type}</strong>
//                         <br />
//                         <span className="text-gray-500 text-xs">
//                           {notif.customerName} •{" "}
//                           {new Date(notif.date).toLocaleString()}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="text-center py-2">
//                     <a
//                       href="/dashboard/manage-orders"
//                       className="text-blue-600 hover:underline"
//                     >
//                       View All Orders
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>
//         <main className="p-6 sm:p-10 space-y-6 ">
//           <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
//             <div className="mr-6">
//               <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
//               <h2 className="text-gray-600 ml-0.5">Store Inventory</h2>
//             </div>
//             <div className="flex flex-col md:flex-row items-start justify-end -mb-3">
//               <Link
//                 to="/dashboard/manage-items"
//                 className="btn-primary inline-flex border border-black rounded-md mb-3"
//               >
//                 <svg
//                   aria-hidden="true"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                   />
//                 </svg>
//                 Manage Items
//               </Link>
//               <Link
//                 to="/dashboard/add-new-item"
//                 className="btn-primary inline-flex px-5 py-3 border border-black rounded-md ml-6 mb-3"
//               >
//                 <svg
//                   aria-hidden="true"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="flex-shrink-0 h-6 w-6 -ml-1 mr-2"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                   />
//                 </svg>
//                 Add New Item
//               </Link>
//               <Link
//                 to="/dashboard/manage-orders"
//                 className="btn-primary inline-flex border border-black rounded-md ml-6 mb-3"
//               >
//                 <svg
//                   aria-hidden="true"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
//                   />
//                 </svg>
//                 Manage Orders
//               </Link>
//             </div>
//           </div>
//           <Outlet />
//         </main>
//       </div>
//     </section>
//   );
// };

// export default DashboardLayout;

import React, { useEffect, useState, useRef } from "react";
import getBaseURL from "../../utils/baseURL";
import Loading from "../../components/Loading";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import { useGetRecentOrderNotificationsQuery } from "../../redux/features/orderAPI";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { BiSolidOffer } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { RiAdvertisementLine } from "react-icons/ri";

const DashboardLayout = () => {
  const { data, isLoading, isError } = useGetRecentOrderNotificationsQuery();
  const orders = data?.item || [];
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleRef = useRef(null);
  const asideRef = useRef(null);

  const allNotifications = orders
    .flatMap((order) =>
      order.notifications.map((n) => ({
        ...n,
        orderId: order.id,
        customerName: order.customerName,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const hasNotifications = allNotifications.length > 0;

  useEffect(() => {
    if (!hasMarkedRead && allNotifications.length) {
      setUnreadCount(allNotifications.length);
    }
  }, [allNotifications, hasMarkedRead]);

  useEffect(() => {
    const savedRead = localStorage.getItem("notificationsRead");
    const savedTime = savedRead ? new Date(savedRead) : null;

    if (savedTime && allNotifications.length) {
      const newUnread = allNotifications.filter(
        (notif) => new Date(notif.date) > savedTime
      );
      setUnreadCount(newUnread.length);
    } else {
      setUnreadCount(allNotifications.length);
    }
  }, [allNotifications]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin");
  };

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Close sidebar when switching from mobile to desktop
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [sidebarOpen]);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleClickOutside = (e) => {
      // If open, on mobile, and click is outside BOTH aside & toggle button
      if (
        isMobile &&
        asideRef.current &&
        !asideRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen, isMobile]);

  // Prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen, isMobile]);

  return (
    <section className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={asideRef}
        className={`
    fixed md:static inset-y-0 left-0 z-50
    ${isMobile ? "w-48" : "w-56"} flex-shrink-0 flex flex-col
    bg-gray-900 text-gray-500 md:overflow-y-auto max-h-[100vh]
    transform transition-transform duration-300 ease-in-out
    ${
      isMobile
        ? sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
        : "translate-x-0"
    }
  `}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            className="absolute top-3 right-3 text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
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
        )}

        {/* Logo */}
        <div className="flex items-center justify-center h-20 bg-purple-600">
          <a href="/">
            <img src="/RFS.png" alt="Logo" className="h-10 w-auto" />
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-6 space-y-2 px-2">
          <NavLink
            to="/dashboard/manage-orders"
            className={({ isActive }) =>
              `p-3 rounded-lg flex items-center gap-2 ${
                isActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400"
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Manage Orders
            </span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `p-3 rounded-lg flex items-center gap-2 ${
                isActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400"
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Dashboard
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/add-new-item"
            className={({ isActive }) =>
              `p-3 rounded-lg flex items-center gap-2 ${
                isActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400"
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <HiViewGridAdd className="h-6 w-6" />
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Add New Item
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/manage-items"
            className={({ isActive }) =>
              `p-3 rounded-lg flex items-center gap-2 ${
                isActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400"
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <MdOutlineManageHistory className="h-6 w-6" />
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Manage Items
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/slides-managment"
            className={({ isActive }) =>
              `p-3 rounded-lg flex items-center gap-2 ${
                isActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400"
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <RiAdvertisementLine className="h-6 w-6" />
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Slides Management
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/promo-managment"
            className={({ isActive }) =>
              `p-3 rounded-lg flex items-center gap-2 ${
                isActive
                  ? "bg-white text-purple-600"
                  : "hover:bg-gray-700 hover:text-gray-400"
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <BiSolidOffer className="h-6 w-6" />
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Promocode Management
            </span>
          </NavLink>
        </nav>

        {/* Logout button */}
        <div className="flex items-center justify-center h-20 border-t border-gray-700 mt-auto">
          <button
            onClick={handleLogout}
            className="p-3 hover:text-gray-400 hover:bg-gray-700 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <CiLogout className="h-6 w-6" />
            <span className={`${isMobile ? "block" : "hidden"} md:block`}>
              Log Out
            </span>
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col text-gray-800">
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 bg-white">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              ref={toggleRef}
              className="md:hidden mr-4 text-gray-700 hover:text-purple-600"
              onClick={() => setSidebarOpen(true)}
            >
              <CiMenuBurger className="h-8 w-8" />
            </button>

            <div className="relative flex-grow max-w-full sm:max-w-md">
              <svg
                className="absolute h-6 w-6 mt-2.5 ml-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 border-2 border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-purple-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="font-semibold">Grace Simmons</div>
              <div className="text-sm text-gray-600">Lecturer</div>
            </div>
            <div className="relative">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="User profile"
                className="h-12 w-12 rounded-full object-cover border-2 border-purple-300"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  setUnreadCount(0);
                }
              }}
              className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-10 space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Store Inventory</p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full mt-2">
              <Link
                to="/dashboard/manage-items"
                className="btn-primary border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-md px-4 py-2 transition-colors w-full sm:w-auto"
              >
                Manage Items
              </Link>
              <Link
                to="/dashboard/add-new-item"
                className="btn-primary border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-md px-4 py-2 transition-colors w-full sm:w-auto"
              >
                Add New Item
              </Link>
              <Link
                to="/dashboard/manage-orders"
                className="btn-primary border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-md px-4 py-2 transition-colors w-full sm:w-auto"
              >
                Manage Orders
              </Link>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );

  // return (
  //   <section className="flex flex-col md:flex-row bg-gray-100 min-h-screen overflow-hidden">
  //     <aside className="w-20 flex-shrink-0 flex md:flex-col bg-gray-900 text-gray-500 overflow-x-auto md:overflow-y-auto max-h-[100vh]">
  //       <div className="flex items-center justify-center h-20 bg-purple-600">
  //         <a href="/">
  //           <img src="/RFS.png" alt="Logo" className="h-10 w-auto" />
  //         </a>
  //         {/* "// "flex flex-col md:flex-row flex-wrap items-start justify-end gap-3"" */}
  //         {/* flex md:flex-col justify-around md:mx-4 md:my-6 space-x-3 md:space-x-0 md:space-y-4 */}
  //       </div>
  //       <nav className="flex md:flex-col justify-around md:py-6 space-x-4 md:space-x-0 md:space-y-4">
  //         <NavLink
  //           to="/dashboard/manage-orders"
  //           className={({ isActive }) =>
  //             `p-3 rounded-lg flex items-center justify-center
  //        ${
  //          isActive
  //            ? "bg-white text-purple-600"
  //            : "hover:bg-gray-700 hover:text-gray-400"
  //        }`
  //           }
  //         >
  //           <svg
  //             className="h-6 w-6"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="2"
  //               d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
  //             />
  //           </svg>
  //         </NavLink>
  //         <NavLink
  //           to="/dashboard"
  //           className={({ isActive }) =>
  //             `p-3 rounded-lg flex items-center justify-center
  //        ${
  //          isActive
  //            ? "bg-white text-purple-600"
  //            : "hover:bg-gray-700 hover:text-gray-400"
  //        }`
  //           }
  //         >
  //           <svg
  //             className="h-6 w-6"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="2"
  //               d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  //             />
  //           </svg>
  //         </NavLink>
  //         <NavLink
  //           to="/dashboard/add-new-item"
  //           cclassName={({ isActive }) =>
  //             `p-3 rounded-lg flex items-center justify-center
  //        ${
  //          isActive
  //            ? "bg-white text-purple-600"
  //            : "hover:bg-gray-700 hover:text-gray-400"
  //        }`
  //           }
  //         >
  //           <HiViewGridAdd className="h-6 w-6" />
  //         </NavLink>
  //         <NavLink
  //           to="/dashboard/manage-items"
  //           className="p-3 hover:text-gray-400 hover:bg-gray-700 rounded-lg"
  //         >
  //           <MdOutlineManageHistory className="h-6 w-6" />
  //         </NavLink>
  //         <NavLink
  //           to="/dashboard/slides-managment"
  //           className={({ isActive }) =>
  //             `p-3 rounded-lg flex items-center justify-center
  //        ${
  //          isActive
  //            ? "bg-white text-purple-600"
  //            : "hover:bg-gray-700 hover:text-gray-400"
  //        }`
  //           }
  //         >
  //           <BiSolidOffer className="h-6 w-6" />
  //         </NavLink>
  //         <NavLink
  //           to="/dashboard/promo-managment"
  //           className={({ isActive }) =>
  //             `p-3 rounded-lg flex items-center justify-center
  //        ${
  //          isActive
  //            ? "bg-white text-purple-600"
  //            : "hover:bg-gray-700 hover:text-gray-400"
  //        }`
  //           }
  //         >
  //           <BiSolidOffer className="h-6 w-6" />
  //         </NavLink>
  //       </nav>
  //       <div className="flex md:hidden items-center justify-center h-20 border-t border-gray-700">
  //         <button
  //           onClick={handleLogout}
  //           className={({ isActive }) =>
  //             `p-3 rounded-lg flex items-center justify-center
  //        ${
  //          isActive
  //            ? "bg-white text-purple-600"
  //            : "hover:bg-gray-700 hover:text-gray-400"
  //        }`
  //           }
  //         >
  //           <CiLogout className="h-6 w-6" />
  //         </button>
  //       </div>
  //       <div className="hidden md:flex items-center justify-center h-20 border-t border-gray-700">
  //         <button
  //           onClick={handleLogout}
  //           className="p-3 hover:text-gray-400 hover:bg-gray-700 rounded-lg"
  //         >
  //           <CiLogout className="h-6 w-6" />
  //         </button>
  //       </div>
  //     </aside>

  //     <div className="flex-grow flex flex-col text-gray-800">
  //       <header className="flex flex-wrap items-center justify-between h-auto px-4 sm:px-6 lg:px-10 py-4 bg-white">
  //         <div className="relative flex-grow max-w-full sm:max-w-md">
  //           <svg
  //             className="absolute h-6 w-6 mt-2.5 ml-2 text-gray-400"
  //             fill="currentColor"
  //             viewBox="0 0 20 20"
  //           >
  //             <path
  //               fillRule="evenodd"
  //               d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
  //               clipRule="evenodd"
  //             />
  //           </svg>
  //           <input
  //             type="text"
  //             placeholder="Search..."
  //             className="w-full py-2 pl-10 pr-4 border-2 border-transparent rounded-lg bg-gray-50 focus:outline-none"
  //           />
  //         </div>
  //         <div className="flex items-center mt-4 sm:mt-0 space-x-4">
  //           <div className="text-right hidden sm:block">
  //             <div className="font-semibold">Grace Simmons</div>
  //             <div className="text-sm text-gray-600">Lecturer</div>
  //           </div>
  //           <img
  //             src="https://randomuser.me/api/portraits/women/68.jpg"
  //             alt="User profile"
  //             className="h-12 w-12 rounded-full object-cover"
  //           />
  //           <button
  //             onClick={() => {
  //               setShowNotifications(!showNotifications);
  //               if (!showNotifications) {
  //                 const now = new Date().toISOString();
  //                 localStorage.setItem("notificationsRead", now);
  //                 setUnreadCount(0);
  //                 setHasMarkedRead(true);
  //               }
  //             }}
  //             className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full"
  //           >
  //             {unreadCount > 0 && (
  //               <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
  //                 {unreadCount}
  //               </span>
  //             )}
  //             <svg
  //               className="h-6 w-6"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  //               />
  //             </svg>
  //           </button>
  //         </div>
  //       </header>

  //       <main className="p-4 sm:p-6 lg:p-10 space-y-6">
  //         <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
  //           <div>
  //             <h1 className="text-3xl font-bold">Dashboard</h1>
  //             <p className="text-gray-600">Store Inventory</p>
  //           </div>
  //           <div className="flex flex-col sm:flex-row flex-wrap gap-3">
  //             <Link
  //               to="/dashboard/manage-items"
  //               className="btn-primary border border-black rounded-md px-4 py-2"
  //             >
  //               Manage Items
  //             </Link>
  //             <Link
  //               to="/dashboard/add-new-item"
  //               className="btn-primary border border-black rounded-md px-4 py-2"
  //             >
  //               Add New Item
  //             </Link>
  //             <Link
  //               to="/dashboard/manage-orders"
  //               className="btn-primary border border-black rounded-md px-4 py-2"
  //             >
  //               Manage Orders
  //             </Link>
  //           </div>
  //         </div>
  //         <Outlet />
  //       </main>
  //     </div>
  //   </section>
  // );
};

export default DashboardLayout;

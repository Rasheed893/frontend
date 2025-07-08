import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoCartOutline } from "react-icons/io5";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/features/cartSlice";
import SearchBar from "./SearchBar";

const navigations = [
  { name: "Dashboard", href: "./dashboard" },
  { name: "Orders", href: "./orders" },
  { name: "Cart", href: "./cart" },
  { name: "Check Out", href: "./checkout" },
];

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  // console.log(cartItems);
  const { currentUser, logOut } = useAuth();
  console.log("This is the current user", currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hundleLogOut = async () => {
    await logOut(); // Wait for the logout process to complete
    dispatch(clearCart()); // Clear the cart in Redux store
    navigate("/login"); // Navigate to the login page
  };

  const handleLogoutClick = () => {
    hundleLogOut();
    setIsDropdownOpen(false);
  };

  // const currentUser = false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* Options button */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to={"/"}>
            <img
              src="/RFS.png"
              alt="RFS Logo"
              className="size-15 object-contain rounded-full border-2 border-black ml-3"
            />
          </Link>

          {/* search bar */}
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoIosSearch className="absolute inline-block left-2 inset-y-2.5" />
            <input
              type="text"
              placeholder="search here"
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-7 rounded-md focus:outline-none"
            />
          </div>
          {/* <SearchBar /> */}
        </div>
        {/* right items */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>
            {currentUser ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarImg}
                    className={`size-7 rounded-full ${
                      currentUser ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                </button>
                {/* Drop Down */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[white] shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigations.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 w-full text-left text-sm hover:bg-gray-100"
                        >
                          <Link to={item.href}>{item.name}</Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogoutClick}
                          className="block px-4 py-2 w-full text-left text-sm hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to={"/login"}>
                {" "}
                <FaRegUser className="size-6" />{" "}
              </Link>
            )}
          </div>
          <button className="hidden sm:block">
            <FcLike className="size-6" />
          </button>
          <Link
            to={"/cart"}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="p-1 gap-1 sm:px-6 flex items-center"
          >
            <IoCartOutline />
            {cartItems.length > 0 ? (
              <span className="text-sm font-semibold sm-ml-1">
                {cartItems.length}
              </span>
            ) : (
              <span className="text-sm font-semibold sm-ml-1">0</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoCartOutline } from "react-icons/io5";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/features/cartSlice";

const navigations = [
  { name: "Dashboard", href: "./dashboard" },
  { name: "Orders", href: "./orders" },
  { name: "Cart", href: "./cart" },
  { name: "Check Out", href: "./checkout" },
];

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hundleLogOut = async () => {
    await logOut();
    dispatch(clearCart());
    navigate("/login");
  };

  const handleLogoutClick = () => {
    hundleLogOut();
    setIsDropdownOpen(false);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="max-w-screen-2xl mx-auto px-2 sm:px-4 py-4 bg-gray-900 dark:bg-gray-900 text-white shadow-md">
      <nav className="flex flex-col sm:flex-row justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <Link to={"/"}>
            <img
              src="/RFS.png"
              alt="RFS Logo"
              className="size-15 object-contain rounded-full border-2 border-white ml-3"
            />
          </Link>
        </div>
        {/* right items */}
        <div className="relative flex items-center space-x-3 mt-2 sm:mt-0">
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
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 dark:bg-gray-800 shadow-lg rounded-md z-40 border border-gray-700">
                    <ul className="py-2">
                      {navigations.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 w-full text-left text-sm hover:bg-gray-800 hover:text-blue-400 transition-colors"
                        >
                          <Link to={item.href}>{item.name}</Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogoutClick}
                          className="block px-4 py-2 w-full text-left text-sm hover:bg-gray-800 hover:text-red-400 transition-colors"
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
                <FaRegUser className="size-6" />
              </Link>
            )}
          </div>
          <button className="hidden sm:block">
            <FcLike className="size-6" />
          </button>
          <Link
            to={"/cart"}
            className="btn-primary p-1 gap-1 sm:px-6 flex items-center"
          >
            <IoCartOutline />
            <span className="text-sm font-semibold ml-1">
              {cartItems.length > 0 ? cartItems.length : 0}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

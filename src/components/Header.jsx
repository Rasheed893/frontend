import { hover } from "framer-motion";
import React from "react";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-5 py-2 bg-gray-900 text-white">
      <div className="text-2xl font-bold mb-2 md:mb-0">Fashion Store</div>
      <nav className="flex flex-col md:flex-row gap-3">
        <a
          href="/"
          className="text-white text-lg hover:underline transition-colors duration-300"
        >
          Home
        </a>
        <a
          href="/all-products"
          className="text-white text-lg hover:underline transition-colors duration-300"
        >
          Products
        </a>
        <a
          href="/about-us"
          className="text-white text-lg hover:underline transition-colors duration-300"
        >
          About
        </a>
        <a
          href="/contact-us"
          className="text-white text-lg hover:underline transition-colors duration-300"
        >
          Contact
        </a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
};

export default Header;

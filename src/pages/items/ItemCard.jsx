// export default ItemCard;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cartSlice";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const ItemCard = ({ item }) => {
  const [imgSrc, setImgSrc] = useState(item?.coverImage);
  const defaultImage = "/default_img.png";
  const dispatch = useDispatch();

  // calculate discount percentage
  const discount =
    item?.oldPrice && item?.newPrice
      ? Math.round(((item.oldPrice - item.newPrice) / item.oldPrice) * 100)
      : 0;

  // handlers stop event bubbling so Link isn't triggered
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(item));
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to favorites:", item?.title);
  };

  return (
    <div className="w-full md:w-64">
      <Link to={`/item/${item?.id}`} className="group">
        <div className="bg-white rounded-lg overflow-hidden border hover:shadow-md transition-shadow duration-300">
          <div className="relative">
            {/* Image */}
            <div className="overflow-hidden aspect-[3/4]">
              <img
                src={imgSrc}
                alt={item?.title || "Item"}
                onError={() => setImgSrc(defaultImage)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Quick action buttons */}
            <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleFavorite}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                aria-label="Add to favorites"
              >
                <FiHeart size={16} />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600"
                aria-label="Add to cart"
              >
                <FiShoppingCart size={16} />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {item?.isNew && (
                <span className="bg-yellow-500 text-black text-xs font-medium px-2 py-1 rounded">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Item details */}
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {item?.title}
            </h3>
            <div className="flex items-baseline mt-1">
              <span className="font-semibold text-base">
                ${item?.newPrice?.toFixed(2)}
              </span>
              {item?.oldPrice && (
                <span className="ml-2 text-xs text-gray-500 line-through">
                  ${item?.oldPrice?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center mt-1"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < Math.round(item?.rating?.average ?? 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                {(item?.rating?.average ?? 0).toFixed(1)} (
                {item?.rating?.count ?? 0} ratings)
              </span>
            </div>

            {/* Savings info */}
            {discount > 0 && (
              <p className="text-xs text-green-600 mt-1">
                You save {discount}%!
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;

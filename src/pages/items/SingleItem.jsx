import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchItemByIdQuery } from "../../redux/features/itemAPI";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cartSlice";
import getBaseURL from "../../utils/baseURL";
import CommentSection from "../../components/CommentSection";
import { getAuth } from "firebase/auth";

// import FeaturedProducts from "../../components/FeaturedProducts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/tabs";
import Loading from "../../components/Loading";
import { FiShoppingCart } from "react-icons/fi";
// import { Heart, Share2 } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { MdOutlineShare } from "react-icons/md";
import Swal from "sweetalert2";

const SingleItem = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchItemByIdQuery(id);
  const item = data?.item;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Rating state
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (isLoading) return <Loading />;
  if (isError || !item) return <div>Error loading item</div>;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, quantity }));
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const discount =
    item?.oldPrice && item?.newPrice
      ? Math.round(((item.oldPrice - item.newPrice) / item.oldPrice) * 100)
      : 0;

  const productImages = [item.coverImage, ...(item.galleryImages || [])];

  const handleSubmitRating = async (stars) => {
    setUserRating(stars);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser?.email?.toLowerCase();

    if (!userId) {
      Swal.fire("Please log in to rate this item.", "", "warning");
      return;
    }

    try {
      const res = await fetch(`${getBaseURL()}/api/items/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: stars, userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setRatingSubmitted(true);
      } else {
        Swal.fire("Error", data.message, "info");
      }
    } catch (err) {
      console.error("Failed to send rating:", err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-full">
      {/* Breadcrumb */}
      <div className="w-full px-4 py-4 max-w-screen-xl mx-auto">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-800">
            Home
          </Link>
          <MdChevronRight size={14} className="mx-1" />
          <Link
            to={`/category/${item.category}`}
            className="hover:text-gray-800 capitalize"
          >
            {item.category.replace("-", " ")}
          </Link>
          <MdChevronRight size={14} className="mx-1" />
          <span className="text-gray-800 font-medium truncate">
            {item.title}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full px-4 py-6 md:py-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={item.title}
                className="w-full object-contain aspect-square"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  className={`border-2 rounded ${
                    selectedImage === index
                      ? "border-brand-yellow"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${item.title} view ${index + 1}`}
                    className="aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {item.title}
            </h1>

            {/* Ratings Display */}
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < Math.round(item?.rating?.average || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {item?.rating?.average?.toFixed(1) ?? "0.0"} (
                {item?.rating?.count ?? 0} ratings)
              </span>
            </div>

            {/* User Rating Submission */}
            {!ratingSubmitted ? (
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-2">
                    Your Rating:
                  </span>
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setUserRating(i + 1)}
                      className="hover:scale-110 transition-transform"
                    >
                      <CiStar
                        size={20}
                        className={`${
                          userRating >= i + 1
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  disabled={userRating === 0}
                  onClick={() => handleSubmitRating(userRating)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50 transition-colors"
                >
                  Submit Rating
                </button>
              </div>
            ) : (
              <p className="text-sm text-green-600 mt-2">
                Thanks for your rating!
              </p>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">
                  AED {(item?.newPrice ?? 0).toFixed(2)}
                </span>
                {item.oldPrice && (
                  <>
                    <span className="ml-3 text-gray-500 line-through">
                      AED {item.oldPrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-red-500 font-medium">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center text-green-600 mb-6">
              <FaCheck size={16} className="mr-1" />
              <span>
                {item.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <div className="mb-15">
              <p className="text-gray-600">{item.description}</p>
            </div>

            {/* Quantity Selector */}
            {/* <div className="mb-8 mt-8">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex h-9 items-center">
                <button
                  className="border px-3 py-1"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  className="border px-3 py-1"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-20 justify-between items-center">
              <button
                className="btn-primary px-6 py-2 space-x-2 flex items-center justify-center w-full sm:w-auto lg:w-auto"
                onClick={handleAddToCart}
              >
                <FiShoppingCart className="mr-2" />
                Add to Cart
              </button>
              {/* <button className="btn-primary border px-4 py-2 rounded">
                Wishlist
              </button> */}
              <button className="size-12 sm:ml-auto">
                <MdOutlineShare />
              </button>
            </div>
            {/* Additional Info */}
            <div className="border-t pt-6 space-y-3 ">
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-800 break-all truncate max-w-[150px]">
                  SKU:
                </div>
                <div className="bg-gray-100 dark:bg-gray-800">
                  RF-{item.id.toString().padStart(4, "0")}
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium min-w-[150px]">Category:</div>
                <div className="bg-gray-100 dark:bg-gray-800 capitalize">
                  {item.category.replace("-", " ")}
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium min-w-[150px]">Delivery:</div>
                <div className="bg-gray-100 dark:bg-gray-800">
                  Within 3 Days
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Tabs */}
        <div className="w-full px-2 py-5 sm:px-4 max-w-screen-xl mx-auto">
          <Tabs defaultValue="description">
            <TabsList
              className="
                grid w-full grid-cols-3
                bg-gray-100 dark:bg-gray-800
                rounded-lg overflow-hidden
                text-gray-700 dark:text-gray-200
                border dark:border-gray-700
                mb-4
                text-xs sm:text-base
                p-2
              "
            >
              <TabsTrigger
                value="description"
                className="focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-yellow-400"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-yellow-400"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-yellow-400"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="description"
              className="py-6 px-3 bg-white dark:bg-gray-900 rounded-lg"
            >
              <h3 className="font-bold text-lg mb-3 dark:text-gray-100">
                Product Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {item?.additionalDescription}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {item?.moreDetails}
              </p>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                {item.features && item.features.length > 0 ? (
                  item.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <li>No features available</li>
                )}
              </ul>
            </TabsContent>

            <TabsContent
              value="specs"
              className="py-6 px-3 bg-white dark:bg-gray-900 rounded-lg"
            >
              <h3 className="font-bold text-lg mb-3 dark:text-gray-100">
                Technical Specifications
              </h3>
              <div className="border rounded-md divide-y dark:border-gray-700 dark:divide-gray-700">
                <div className="grid grid-cols-2 p-3">
                  <span className="font-medium dark:text-gray-200">
                    Material
                  </span>
                  <span className="dark:text-gray-300">{item?.material}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-medium dark:text-gray-200">
                    Dimensions
                  </span>
                  <span className="dark:text-gray-300">{item?.dimensions}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-medium dark:text-gray-200">Weight</span>
                  <span className="dark:text-gray-300">{item?.weight}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-medium dark:text-gray-200">
                    Color Options
                  </span>
                  <span className="dark:text-gray-300">
                    {item.colorOptions && item.colorOptions.length > 0
                      ? item.colorOptions.join(", ")
                      : "No color options available"}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-medium dark:text-gray-200">
                    Warranty
                  </span>
                  <span className="dark:text-gray-300">{item?.warranty}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-medium dark:text-gray-200">
                    Country of Origin
                  </span>
                  <span className="dark:text-gray-300">
                    {item?.countryOfOrigin}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="reviews"
              className="py-6 px-3 bg-white dark:bg-gray-900 rounded-lg"
            >
              <h3 className="font-bold text-lg mb-3 dark:text-gray-100">
                Customer Reviews
              </h3>
              <div className="space-y-6">
                {/* Mock reviews */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b pb-6 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium dark:text-gray-200">
                        Customer {i + 1}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(
                          Date.now() - i * 5 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, j) => (
                        <CiStar
                          key={j}
                          size={14}
                          className={`${
                            j < 4 + (i % 2)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {i === 0 &&
                        "Great product, exactly as described. Fast delivery and excellent packaging. Would buy again!"}
                      {i === 1 &&
                        "I love this accessory! It's well made and looks even better in person. Highly recommend."}
                      {i === 2 &&
                        "Good value for money. Works as expected and arrived on time. Very happy with my purchase."}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Comments Section */}
        <div className="w-full px-4 py-10 max-w-screen-xl mx-auto">
          <CommentSection productId={item.id} />
        </div>
      </div>

      {/* Related Products */}
      {/* <FeaturedProducts
        title="You May Also Like"
        products={item.relatedProducts || []}
        viewAllLink={`/category/${item.category}`}
      /> */}
    </div>
  );
};

export default SingleItem;

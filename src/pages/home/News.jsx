import React from "react";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Layla",
    avatar: "https://i.pravatar.cc/150?img=47",
    comment:
      "Absolutely love the handbag I purchased — it's stylish and goes with everything!",
    rating: 5,
  },
  {
    name: "Maya",
    avatar: "https://i.pravatar.cc/150?img=68",
    comment:
      "The home accessories are such high quality. My guests always ask where I got them!",
    rating: 4,
  },
  {
    name: "Zara",
    avatar: "https://i.pravatar.cc/150?img=36",
    comment:
      "Beautiful pieces and fast delivery. This is my new go-to shop for gifts.",
    rating: 5,
  },
];

const News = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Customer Favorites</h2>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white p-6 shadow-md rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{review.name}</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;

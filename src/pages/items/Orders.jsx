import React from "react";
import { useGetOrdersByCustomerIdQuery } from "../../redux/features/orderAPI";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const { currentUser } = useAuth();
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrdersByCustomerIdQuery(currentUser.email);
  const location = useLocation();
  const { orderId, paymentId, discountAmount } = location.state || {};
  console.log("Discount amount", discountAmount);
  if (isLoading) {
    return (
      <div className="text-center text-lg">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Error fetching orders</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No Orders Found!</div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 shadow-lg bg-white"
            >
              {/* Order ID, Date and Status */}
              <p className="mb-5 font-bold bg-secondary text-white w-10 rounded p-1">
                # {index + 1}
              </p>
              <h3 className="text-xl font-bold">
                Payment ID:{" "}
                <span className="text-blue-600">
                  {order.paymentId || "Payment on delivery"}
                </span>
              </h3>
              <div className="flex justify-between items-center mb-4">
                {/* <p className="mr-1"># {index + 1}</p> */}
                <h3 className="text-xl font-bold">
                  Order ID: <span className="text-blue-600">{order.id}</span>
                </h3>

                <p className="text-gray-500 text-sm">
                  Placed on:{" "}
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-500 text-white"
                      : order.status === "Shipped"
                      ? "bg-blue-500 text-white"
                      : order.status === "Delivered"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer Information */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Customer Info</h4>
                <p className="text-gray-600">
                  <strong>Name:</strong> {order.customer.customerName}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {order.customer.email}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {order.customer.phone}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700">
                  Shipping Address
                </h4>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}
                </p>
                <p className="text-gray-600">
                  ZIP Code: {order.address.zipcode}
                </p>
              </div>

              {/* Product List */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Products</h4>
                <ul className="mt-2">
                  {order.products.map((product, idx) => (
                    <li
                      key={idx}
                      className="flex items-center border-b py-2 space-x-4"
                    >
                      {/* Left: Text details */}
                      <div className="flex-1">
                        <p className="text-gray-600">
                          <strong>Product ID:</strong>{" "}
                          {product.productIds?.id ||
                            product.productIds?._id ||
                            "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong>Product title:</strong>{" "}
                          {product.productIds?.title || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong>Quantity:</strong> {product.quantity}
                        </p>
                      </div>

                      {/* Middle: Image */}
                      {product.productIds?.coverImage && (
                        <img
                          src={product.productIds.coverImage}
                          alt={product.productIds.title}
                          className="w-20 h-20 object-cover rounded-lg shadow mx-4"
                        />
                      )}
                      {/* Right: Pricing Details */}
                      <div className="ml-2 sm:ml-4 text-right flex flex-col items-end space-y-1 w-1/3 sm:w-1/4">
                        <p className="text-lg font-semibold text-gray-800">
                          AED {product.price.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total Price */}
              <div className="flex flex-col items-end mt-4 space-y-1">
                <p className="text-lg font-semibold text-gray-800">
                  Shipping: AED {order.shipping}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  VAT: AED {order.vat}
                </p>
                {order.discount > 0 && (
                  <p className="text-lg font-semibold text-green-600">
                    Promo Code Discount: -AED {order.discount.toFixed(2)}
                  </p>
                )}
                <h3 className="text-xl font-bold">Total:</h3>
                <span className="text-2xl font-bold text-green-600">
                  AED{order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

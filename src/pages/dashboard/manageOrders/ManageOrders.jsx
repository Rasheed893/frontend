import React, { useState } from "react";
import axios from "axios";
import getBaseURL from "../../../utils/baseURL";
import Loading from "../../../components/Loading";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  useGetAllOrdersPaginatedQuery,
  useLazyGetInvoiceDownloadUrlQuery,
} from "../../../redux/features/orderAPI";

const ManageOrders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const { data, isLoading, isError, refetch } = useGetAllOrdersPaginatedQuery({
    page,
    limit: 10,
    status: statusFilter,
    email: emailFilter,
  });

  const orders = data?.item || [];
  const totalPages = data?.totalPages || 1;
  const user = useSelector((state) => state.auth.user);

  const [triggerGetInvoiceUrl] = useLazyGetInvoiceDownloadUrlQuery();

  const handleDownloadInvoice = async (orderId) => {
    try {
      const result = await triggerGetInvoiceUrl(orderId).unwrap();
      window.open(result.url, "_blank");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice.");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${getBaseURL()}/api/orders/update/order/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDelete = async (orderId) => {
    if (user.role !== "admin") {
      Swal.fire({
        title: "Permission Denied",
        text: "You do not have permission to delete this item.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the item and all of its images.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `${getBaseURL()}/api/orders/delete/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        refetch();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching orders</div>;

  return (
    <div className="p-2 sm:p-6 max-w-screen-xl mx-auto bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-gray-100">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Manage Orders
      </h1>

      {/* Filter */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
        <label className="font-medium w-full sm:w-auto">
          Filter by Status:
          <select
            className="ml-2 border px-3 py-1 rounded w-full sm:w-auto mt-2 sm:mt-0 bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1); // Reset page
            }}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <label className="font-medium w-full sm:w-auto">
          Filter by Email:
          <input
            type="text"
            placeholder="Enter email"
            className="ml-2 border px-3 py-1 rounded w-full sm:w-auto mt-2 sm:mt-0 bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
            value={emailFilter}
            onChange={(e) => {
              setEmailFilter(e.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-[700px] sm:table-auto w-full border-collapse text-xs sm:text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border px-2 py-2">#</th>
              <th className="border px-2 py-2">Order ID</th>
              <th className="border px-2 py-2">Customer</th>
              <th className="border px-2 py-2">Email</th>
              <th className="border px-2 py-2">Phone</th>
              <th className="border px-2 py-2">Address</th>
              <th className="border px-2 py-2">Products</th>
              <th className="border px-2 py-2">Total</th>
              <th className="border px-2 py-2">Payment ID</th>
              <th className="border px-2 py-2">Promo Code</th>
              <th className="border px-2 py-2">Status</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td className="border px-2 py-2 text-center">{index + 1}</td>
                  <td className="border px-2 py-2">{order.id}</td>
                  <td className="border px-2 py-2">
                    {order.customer?.customerName}
                  </td>
                  <td className="border px-2 py-2">{order.customer?.email}</td>
                  <td className="border px-2 py-2">{order.phone}</td>
                  <td className="border px-2 py-2">
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country} - {order.address.zipcode}
                  </td>
                  <td className="border px-2 py-2">
                    <ul className="list-disc pl-4">
                      {order.products.map((product, i) => (
                        <li key={i}>
                          <strong>Product:</strong>{" "}
                          {product.productIds?.title || product.productIds}
                          <br />
                          <strong>Qty:</strong> {product.quantity}
                          <br />
                          <strong>Price:</strong> ${product.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-2 text-green-600 font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="border px-2 py-2 text-green-600 font-semibold">
                    {order.paymentId || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-green-600 font-semibold">
                    {order.promoCode || "N/A"}
                  </td>
                  <td className="border px-2 py-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        title="Download Invoice"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageOrders;

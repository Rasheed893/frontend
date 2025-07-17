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
    <div className="h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-md px-6 pt-6 pb-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
          Admin Dashboard Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              {...register("username", { required: "username is required" })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
            />
            <p className="text-sm text-red-500">{errors.username?.message}</p>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>
          {message && (
            <div
              className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 mb-4"
              role="alert"
            >
              <p>{message}</p>
            </div>
          )}
          <div>
            <Button
              className="btn-blue bg-blue-500 dark:bg-blue-700 w-full text-white font-bold py-2 px-4 flex items-center justify-center mb-2"
              type="submit"
            >
              <CgLogIn className="mr-2" />
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageOrders;

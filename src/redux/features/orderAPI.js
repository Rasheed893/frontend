import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseURL from "../../utils/baseURL";

const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/orders`,
    credentials: "include",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
        credentials: "include",
      }),
    }),
    fetchAllOrders: builder.query({
      query: () => ({
        url: "/get-orders",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),
    getAllOrdersPaginated: builder.query({
      query: ({ page = 1, limit = 10, status = "", email = "" }) =>
        `/get-orders?page=${page}&limit=${limit}&status=${status}&email=${email}`,
    }),
    getRecentOrderNotifications: builder.query({
      query: () => `/get-orders?limit=7`, // you can also add `&status=Pending`
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update/order/status/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
    }),
    getOrdersByCustomerId: builder.query({
      query: (customerId) => ({
        url: `/customer/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getInvoiceDownloadUrl: builder.query({
      query: (orderId) => `/invoice-url/${orderId}`,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useFetchAllOrdersQuery,
  useGetAllOrdersPaginatedQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersByCustomerIdQuery,
  useGetRecentOrderNotificationsQuery,
  useLazyGetInvoiceDownloadUrlQuery,
} = orderApi;
export default orderApi;

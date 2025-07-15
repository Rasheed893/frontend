import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseURL from "../../utils/baseURL";
import { loadState } from "../../sessionStorage/sessionStorage";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseURL()}/api/items`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    // const token = localStorage.getItem("token");
    const token = loadState("token", null);
    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
    return Headers;
  },
});

const itemsApi = createApi({
  reducerPath: "itemApi",
  baseQuery,
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    fetchAllItems: builder.query({
      query: () => "/get-all",
      providesTags: ["Items"],
    }),
    fetchItemById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Items", id }],
    }),
    addItem: builder.mutation({
      query: (newItem) => ({
        url: "/create-book",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Items"],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: rest,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Items"],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/delete-${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),
    updateItemQuantity: builder.mutation({
      query: (items) => ({
        url: `/updateStock`,
        method: "POST",
        body: items,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    searchItems: builder.query({
      query: (searchTerm) => `/search?title=${searchTerm}`,
    }),
    getRecommendedItems: builder.query({
      query: (email) => `/items/recommended/${email}`,
    }),
  }),
});

export const {
  useFetchAllItemsQuery,
  useFetchItemByIdQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useUpdateItemQuantityMutation,
  useSearchItemsQuery,
  useGetRecommendedItemsQuery,
} = itemsApi;
export default itemsApi;

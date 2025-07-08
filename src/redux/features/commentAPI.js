import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseURL from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseURL()}/api/comments`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
    return Headers;
  },
});

const commentAPI = createApi({
  reducerPath: "commentAPI",
  baseQuery,
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getCommentsByProductId: builder.query({
      query: (productId) => `/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Comments", productId },
      ],
    }),
    addComment: builder.mutation({
      query: (commentData) => ({
        url: "/",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Comments", productId },
      ],
    }),
  }),
});

export const { useGetCommentsByProductIdQuery, useAddCommentMutation } =
  commentAPI;

export default commentAPI;

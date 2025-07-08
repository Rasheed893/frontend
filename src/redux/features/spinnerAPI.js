// spinnerApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseURL from "../../utils/baseURL";
import { loadState } from "../../sessionStorage/sessionStorage";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseURL()}/api/spinner`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = loadState("token", null);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const spinnerApi = createApi({
  reducerPath: "spinnerApi",
  baseQuery,
  tagTypes: ["Spinner"],
  endpoints: (builder) => ({
    fetchAllSpinners: builder.query({
      query: () => "/all",
      providesTags: ["Spinner"],
    }),
    fetchCarousel: builder.query({
      query: (name) => `/${name}`,
      providesTags: ["Spinner"],
      transformResponse: (response) => ({
        ...response,
        slides: response.slides || [],
        settings: response.settings || { autoplay: true, interval: 3000 },
      }),
    }),
    addSlide: builder.mutation({
      query: ({ name, formData }) => ({
        url: `/${name}/slides`,
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: ["Spinner"],
    }),
    updateSlide: builder.mutation({
      query: ({ name, slideId, formData }) => ({
        url: `/${name}/slides/${slideId}`,
        method: "PATCH",
        body: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: ["Spinner"],
    }),
    deleteSlide: builder.mutation({
      query: ({ name, slideId }) => ({
        url: `/${name}/slides/${slideId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Spinner"],
    }),
    reorderSlides: builder.mutation({
      query: ({ name, order }) => ({
        url: `/${name}/reorder`,
        method: "PUT",
        body: { order },
      }),
      invalidatesTags: ["Spinner"],
    }),
  }),
});

export const {
  useFetchAllSpinnersQuery,
  useFetchCarouselQuery,
  useAddSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
  useReorderSlidesMutation,
} = spinnerApi;

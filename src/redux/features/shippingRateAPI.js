import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseURL from "../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseURL()}/api/shipping-rate`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
    return Headers;
  },
});

const shippingRatesSlice = createSlice({
  name: "shippingRates",
  initialState: {
    data: {}, // will hold { Dubai: 15.0, … }
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingRates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShippingRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchShippingRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default shippingRatesSlice.reducer;

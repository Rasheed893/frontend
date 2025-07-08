import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import itemsApi from "./features/itemAPI";
import reducer from "./features/cartSlice";
import orderApi from "./features/orderAPI";
import commentAPI from "./features/commentAPI";
import authReducer from "./features/authSlice";
import { spinnerApi } from "./features/spinnerAPI";
// import { shippingRatesAPI } from "./shippingRatesSlice";

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    // spinner: spinnerReducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [commentAPI.reducerPath]: commentAPI.reducer,
    [spinnerApi.reducerPath]: spinnerApi.reducer,
    // [shippingRatesAPI.reducerPath]: shippingRatesAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      itemsApi.middleware,
      orderApi.middleware,
      commentAPI.middleware,
      spinnerApi.middleware
      // shippingRatesAPI.middleware
    ),
});

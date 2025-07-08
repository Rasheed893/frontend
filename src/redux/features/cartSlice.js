import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { loadState, saveState } from "../../sessionStorage/sessionStorage";

const sessionKey = "itemsInCart";
const initialState = {
  cartItems: loadState(sessionKey, []),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log("Adding item to cart:", action.payload); // Log the item being added
      const exictingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (!exictingItem) {
        state.cartItems.push(action.payload);
        saveState(sessionKey, state.cartItems);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Book added to cart",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log("Item already in cart:", exictingItem); // Log the existing item
        Swal.fire({
          title: "Already in cart!",
          text: "This book is already in your cart",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      saveState("itemsInCart", state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      sessionStorage.removeItem("itemsInCart");
    },
    itemQuantity: (state, action) => {
      const { id, quantity, stockQuantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item && quantity <= stockQuantity) {
        // Prevent exceeding stock
        item.quantity = quantity;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  itemQuantity,
  // setCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;

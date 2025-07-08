import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "../../sessionStorage/sessionStorage";

const initialState = {
  user: loadState("user", null),
  token: loadState("token", null),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Setting user in Redux with action:", action);
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save to sessionStorage
      saveState("user", state.user);
      saveState("token", state.token);
      console.log("Saved user and token to sessionStorage");
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

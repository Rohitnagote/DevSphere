import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import toastReducer from "./toastSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
  },
});

export default appStore;
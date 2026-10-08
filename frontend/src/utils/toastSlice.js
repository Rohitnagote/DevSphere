import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: null,
  reducers: {
    showToast: (state, action) => action.payload,
    hideToast: () => null,
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Ensure this path matches your userSlice file location

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import blogSlice from "../features/blogSlice";
import searchSlice from "../features/searchSlice";

export const store = configureStore({
    reducer: {
        "auth": authSlice,
        "blogs": blogSlice,
        "search": searchSlice,
    }
})

export default store;
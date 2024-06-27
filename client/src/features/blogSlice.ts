import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogData: null
}

export const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        addData: (state, action) => {
            state.blogData = action.payload
        },
        clearData: (state) => {
            state.blogData = null
        }
    }
})

export const {addData, clearData} = blogSlice.actions;

export default blogSlice.reducer;
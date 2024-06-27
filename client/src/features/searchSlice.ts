import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,  // search status
    searchQuery: ""
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.status = true
            state.searchQuery = action.payload
        },
        unsetSearchQuery: (state) => {
            state.status = false,
            state.searchQuery = ""
        }
    }
})

export const {setSearchQuery, unsetSearchQuery} = searchSlice.actions;

export default searchSlice.reducer;
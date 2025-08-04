import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        loading: false,
        allJobs: [],
        allAdminJobs: [],
        appliedJobs: [],
        singleJob: null,
        searchJobByText: "",
        searchQuery: '',
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAllJobs : (state, action) =>{
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) =>{
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) =>{
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) =>{
            state.searchJobByText = action.payload;
        },
        setAppliedJobs: (state, action) => {
            state.appliedJobs = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    }
});

export const { setAllJobs, setLoading, setSingleJob, setAllAdminJobs, setSearchJobByText, setAppliedJobs, setSearchQuery } = jobSlice.actions;
export default jobSlice.reducer;
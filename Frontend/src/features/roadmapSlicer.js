import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRoadmap = createAsyncThunk(
    "roadmap/fetchRoadmap",
    async ({userDescription, userLevel}, { rejectWithValue }) => {
        try {
            console.log("Generating roadmap for userDescription:", userDescription);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/generate`,
                { userDescription, userLevel },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error in fetchRoadmap:", error);
            return rejectWithValue(error.response?.data || { message: "Unknown error" });
        }
    }
);

const initialState = {
    currRoadmap: {},
    isLoading: false,
    error: null,
};

export const roadmapSlice = createSlice({
    name: "roadmap",
    initialState,
    reducers: {
        setcurrRoadmap: (state, action) => {
            state.currRoadmap = action.payload;
        },
        resetRoadmap: (state) => {
            state.currRoadmap = {};
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoadmap.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })

            .addCase(fetchRoadmap.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = false;
                state.currRoadmap = action.payload.data;
            })

            .addCase(fetchRoadmap.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || true;
            });
    },
});

export const { setcurrRoadmap, resetRoadmap } = roadmapSlice.actions;
export const roadmapReducer = roadmapSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const generateRoadmap = createAsyncThunk(
    "roadmap/generateRoadmap",
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
            console.error("Error in generateRoadmap:", error);
            return rejectWithValue(error.response?.data || { message: "Unknown error" });
        }
    }
);

export const fetchUserRoadmaps = createAsyncThunk(
    "roadmap/fetchUserRoadmaps",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/get-roadmaps`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("Fetched user roadmaps:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error in fetchUserRoadmaps:", error);
            return rejectWithValue(error.response?.data || { message: "Unknown error" });
        }
    }
);

export const deleteUserRoadmap = createAsyncThunk(
    "roadmap/deleteUserRoadmap",
    async (roadmapId, { rejectWithValue }) => {
        try {
            console.log("Deleting roadmap with ID:", roadmapId);  
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/delete-roadmap`,
                { roadmapId },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("Deleted roadmap response:", response);
            return response.data;
        } catch (error) {
            console.error("Error in deleteUserRoadmap:", error);
            return rejectWithValue(error.response?.data || { message: "Unknown error" });
        }
    }
);

export const getUserRoadmapById = createAsyncThunk(
    "roadmap/getUserRoadmapById",
    async (roadmapId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/get-roadmap-by-id`,
                { roadmapId },
                {   
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }   
            );
            // console.log("Fetched roadmap response:", response);
            return response.data;
        } catch (error) {
            console.error("Error in getUserRoadmapById:", error);
            return rejectWithValue(error.response?.data || { message: "Unknown error" });
        }
    }
);

const initialState = {
    currRoadmap: {},
    generation_loading: false,
    generation_error: false,
    fetch_loading: true,
    fetch_error: false,
    userRoadmaps: [],
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
            state.generation_loading = false;
            state.generation_error = false;
        },
        setUserRoadmaps: (state, action) => {
            state.userRoadmaps = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateRoadmap.pending, (state) => {
                state.generation_loading = true;
                state.generation_error = false;
            })

            .addCase(generateRoadmap.fulfilled, (state, action) => {
                state.generation_loading = false;
                state.generation_error = false;
                // state.currRoadmap = action.payload.data;
                state.userRoadmaps.push(action.payload.data);
            
            })

            .addCase(generateRoadmap.rejected, (state, action) => {
                state.generation_loading = false;
                state.generation_error = true;
            })
            .addCase(fetchUserRoadmaps.pending, (state) => {
                state.fetch_loading = true;
                state.fetch_error = false;
            })
            .addCase(fetchUserRoadmaps.fulfilled, (state, action) => {
                state.fetch_loading = false;
                state.fetch_error = false;
                state.userRoadmaps = action.payload.data;
            })
            .addCase(fetchUserRoadmaps.rejected, (state, action) => {
                state.fetch_loading = false;
                state.fetch_error = true;
            });
    },
});

export const { setcurrRoadmap, resetRoadmap, setUserRoadmaps } = roadmapSlice.actions;
export const roadmapReducer = roadmapSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchRoadmap = createAsyncThunk(
    "roadmap/fetchRoadmap",
    async (topic, {rejectWithValue}) => {
        try{
            console.log("HELLO");
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/roadmap/generate", 
                { topic },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            console.log("Got response", response.data.data);
            return response.data.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    currRoadmap: {},
}

export const roadmapSlice = createSlice({
    name: "roadmap",
    initialState,
    reducers: {
        setcurrRoadmap: (state, action) => {  
            state.currRoadmap = action.payload;
        },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchRoadmap.fulfilled, (state, action) => {
            const clean = action.payload.replace(/```json|```/g, "").trim();
            state.currRoadmap = JSON.parse(clean);
        })
    }
})

export const { setcurrRoadmap } = roadmapSlice.actions;

export const roadmapReducer = roadmapSlice.reducer;
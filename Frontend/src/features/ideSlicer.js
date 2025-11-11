import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reducer } from "@uiw/react-md-editor";
import axios from "axios";

export const fetchFiles = createAsyncThunk(
    "ide/fetchFiles",
    async ({ roadmapId },{rejectWithValue}) => {
        try{
            const response = axios.post(`${import.meta.env.BACKEND_URL}/api/s3/load`, 
                {key: `project/${roadmapId}`},
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            )
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }        
    }
);

export const saveNode = createAsyncThunk(
    "ide/saveFile",
    async({ roadmapId, filePath, content } ,{rejectWithValue}) => {
        try {
            const response = axios.post(`${import.meta.env.BACKEND_URL}/api/s3/save`, 
                {key: `project/${roadmapId}`, filePath, content },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteNode = createAsyncThunk(
    "ide/saveFile",
    async({ roadmapId, filePath } ,{rejectWithValue}) => {
        try {
            const response = axios.post(`${import.meta.env.BACKEND_URL}/api/s3/delete`, 
                {key: `project/${roadmapId}`, filePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const renameNode = createAsyncThunk(
    "ide/saveFile",
    async({ roadmapId, oldFilePath, newFilePath } ,{rejectWithValue}) => {
        try {
            const response = axios.post(`${import.meta.env.BACKEND_URL}/api/s3/rename`, 
                {key: `project/${roadmapId}`, oldFilePath, newFilePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

const initialState = {
    loading_fetch: false,
    currFiles: [],
}

const ideSlice = createSlice({
    name: 'ideSlice',
    initialState,
    reducer: {
        setCurrFiles: (state, action) => {
            state.currFiles = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFiles.pending, (state, action) => {
                state.loading_fetch = true;
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.currFiles = action.payload.data
                state.loading_fetch = false;
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.loading_fetch = false;
            })
    }
})

export const { setCurrFiles } = ideSlice.actions;

export const ideReducer = ideSlice.reducer;
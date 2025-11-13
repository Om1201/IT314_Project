import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reducer } from '@uiw/react-md-editor';
import axios from 'axios';

export const fetchFiles = createAsyncThunk(
    'ide/fetchFiles',
    async ({ roadmapId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/load`,
                { key: `project/${roadmapId}` },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const saveNode = createAsyncThunk(
    'ide/saveFile',
    async ({ roadmapId, filePath, content }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/save`,
                { key: `project/${roadmapId}`, filePath, content },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            console.log('werajlfjasljf', response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteNode = await createAsyncThunk(
    'ide/deleteNode',
    async ({ roadmapId, filePath }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/delete-file`,
                { key: `project/${roadmapId}`, filePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const deleteFolder = createAsyncThunk(
    'ide/deleteFolder',
    async ({ roadmapId, filePath }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/delete-folder`,
                { key: `project/${roadmapId}`, filePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const renameNode = createAsyncThunk(
    'ide/renameNode',
    async ({ roadmapId, oldFilePath, newFilePath }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/rename-file`,
                { key: `project/${roadmapId}`, oldFilePath, newFilePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const renameFolder = createAsyncThunk(
    'ide/renameFolder',
    async ({ roadmapId, oldFilePath, newFilePath }, { rejectWithValue }) => {
        try {
            console.log('In ideSlice renameFolder:', oldFilePath, newFilePath);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/rename-folder`,
                { key: `project/${roadmapId}`, oldFilePath, newFilePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    loading_fetch: false,
    currFiles: [],
    loading_general: false,
};

const ideSlice = createSlice({
    name: 'ideSlice',
    initialState,
    reducer: {
        setCurrFiles: (state, action) => {
            state.currFiles = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFiles.pending, (state, action) => {
                state.loading_fetch = true;
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.currFiles = action.payload.data;
                state.loading_fetch = false;
            })
            .addCase(fetchFiles.rejected, (state, action) => {
                state.loading_fetch = false;
            })
            .addCase(deleteNode.pending, (state, action) => {
                state.loading_general = true;
            })
            .addCase(deleteNode.fulfilled, (state, action) => {
                const args = action.meta.arg;
                state.currFiles = state.currFiles.filter(file => file.name !== args.filePath);
                state.loading_general = false;
            })
            .addCase(deleteNode.rejected, (state, action) => {
                state.loading_general = false;
            })
            .addCase(deleteFolder.pending, (state, action) => {
                state.loading_general = true;
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
                const args = action.meta.arg;
                state.currFiles = state.currFiles.filter(
                    file => !file.name.startsWith(args.filePath)
                );
                state.loading_general = false;
            })
            .addCase(deleteFolder.rejected, (state, action) => {
                state.loading_general = false;
            })
            .addCase(saveNode.pending, (state, action) => {
                state.loading_general = true;
            })
            .addCase(saveNode.fulfilled, (state, action) => {
                console.log('This isisisis', action);
                state.currFiles.push(action.payload.data);
                state.loading_general = false;
            })
            .addCase(saveNode.rejected, (state, action) => {
                state.loading_general = false;
            })
            .addCase(renameFolder.pending, (state, action) => {
                state.loading_general = true;
            })
            .addCase(renameFolder.fulfilled, (state, action) => {
                const args = action.meta.arg;
                let oldPrefix = args.oldFilePath;
                const newPrefix = args.newFilePath;

                console.log('Renaming folder in state from', oldPrefix, 'to', newPrefix);

                state.currFiles = state.currFiles.map(file => {
                    if (file.name.startsWith(oldPrefix)) {
                        return {
                            ...file,
                            name: file.name.replace(oldPrefix, newPrefix),
                        };
                    }
                    return file;
                });

                state.loading_general = false;
            })
            .addCase(renameFolder.rejected, (state, action) => {
                state.loading_general = false;
            });
    },
});

export const { setCurrFiles } = ideSlice.actions;

export const ideReducer = ideSlice.reducer;

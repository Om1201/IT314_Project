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
    async ({ roadmapId, name, filePath, content }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/save`,
                { key: `project/${roadmapId}`, name, filePath, content },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
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
    async ({ roadmapId, name, oldFilePath, newFilePath }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/rename-file`,
                { key: `project/${roadmapId}`, name, oldFilePath, newFilePath },
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
    async ({ roadmapId, name, oldFilePath, newFilePath }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/rename-folder`,
                { key: `project/${roadmapId}`, name, oldFilePath, newFilePath },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateFileContent = createAsyncThunk(
    'ide/updateFileContent',
    async ({ roadmapId, filePath, content }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/s3/file-update`,
                { key: `project/${roadmapId}`, filePath, content },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }   
    }
);

export const executeCode = createAsyncThunk(
    'ide/runCode',
    async ({ language, files, args = [], stdin = '' }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/code/execute`,
                { language, files, args, stdin },
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
    currFile: {code:"", id:"", input:"", language:"", name:"", output:"", saved: false},
    is_saving: false,
    is_running: false, 
};

const ideSlice = createSlice({
    name: 'ideSlice',
    initialState,
    reducers: {
        setCurrFiles: (state, action) => {
            state.currFiles = action.payload;
        },
        setCurrFile: (state, action) => {
            state.currFile = action.payload;
        },
        setIsRunning: (state, action) => {
            state.is_running = action.payload;
        }
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
            })
            .addCase(updateFileContent.pending, (state, action) => {
                state.is_saving = true;
            })
            .addCase(updateFileContent.fulfilled, (state, action) => {
                state.is_saving = false;
                const args = action.meta.arg;
                state.currFiles = state.currFiles.map(file => {
                    if (file.name === args.filePath) {
                        return {
                            ...file,
                            saved: true,
                        };
                    }
                    return file;
                });
                if(state.currFile.name === args.filePath){
                    state.currFile.saved = true;
                }                
            })
            .addCase(updateFileContent.rejected, (state, action) => {
                state.is_saving = false;
            })
    },
});

export const { setCurrFiles, setCurrFile, setIsRunning } = ideSlice.actions;

export const ideReducer = ideSlice.reducer;

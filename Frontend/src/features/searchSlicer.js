import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchAll = createAsyncThunk(
    'search/searchAll',
    async ({ query, page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/search`,
                {
                    params: { q: query, page, pageSize },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error' });
        }
    }
);

const initialState = {
    query: '',
    loading: false,
    error: null,
    results: {
        roadmaps: { total: 0, items: [] },
        chapters: { total: 0, items: [] },
        subtopics: { total: 0, items: [] },
        notes: { total: 0, items: [] },
        page: 1,
        pageSize: 10,
    },
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery(state, action) {
            state.query = action.payload;
        },
        clearResults(state) {
            state.results = initialState.results;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(searchAll.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchAll.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const data = action.payload.data;
                state.results = {
                    roadmaps: data.roadmaps,
                    chapters: data.chapters,
                    subtopics: data.subtopics,
                    notes: data.notes,
                    page: data.page,
                    pageSize: data.pageSize,
                };
            })
            .addCase(searchAll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Search failed';
            });
    },
});

export const { setQuery, clearResults } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;

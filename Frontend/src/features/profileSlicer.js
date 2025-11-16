import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const loadProfileData = createAsyncThunk(
  'profile/loadProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const options = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const [profileRes, statsRes, roadmapsRes, notesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, options),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/stats`, options),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/roadmaps`, options),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/notes`, options),
      ]);

      return {
        user: profileRes.data?.data,
        stats: statsRes.data?.data,
        roadmaps: roadmapsRes.data?.data || [],
        notes: notesRes.data?.data || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to load profile' });
    }
  }
);

export const purgeAllData = createAsyncThunk(
  'profile/purgeAllData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/purge`, {}, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to purge data' });
    }
  }
);

const initialState = {
  user: null,
  stats: { coursesCompleted: 0, currentStreak: 0, maxStreak: 0, loginDates: [] },
  roadmaps: [],
  notes: [],
  loading: false,
  error: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAvatar(state, action) {
      if (state.user) {
        state.user.avatar = action.payload?.avatar || state.user.avatar;
        state.user.avatarPublicId = action.payload?.avatarPublicId || state.user.avatarPublicId;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadProfileData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.stats = action.payload.stats || initialState.stats;
        state.roadmaps = Array.isArray(action.payload.roadmaps) ? action.payload.roadmaps : [];
        state.notes = Array.isArray(action.payload.notes) ? action.payload.notes : [];
      })
      .addCase(loadProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load profile';
      })
      .addCase(purgeAllData.pending, state => {
        state.error = null;
      })
      .addCase(purgeAllData.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.roadmaps = [];
          state.notes = [];
          state.user = action.payload.data || state.user;
          state.stats = { ...initialState.stats };
        } else {
          state.error = action.payload?.message || 'Purge failed';
        }
      })
      .addCase(purgeAllData.rejected, (state, action) => {
        state.error = action.payload?.message || 'Purge failed';
      })
  },
});

export const { setUser, setAvatar } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;

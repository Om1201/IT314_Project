import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signupUser = createAsyncThunk(
    'user/signupUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/register',
                { name, email, password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const signinUser = createAsyncThunk(
    'user/signinUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/signin',
                { email, password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/send-reset-token',
                { email },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ email, newPassword, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/reset-password',
                { email, newPassword, token },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/auth/logout',
            {},
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const checkAuth = createAsyncThunk('user/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/auth/is-auth', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const googleAuth = createAsyncThunk('user/googleAuth', async (code, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/auth/oauth/google/callback',
            { code },
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const githubAuth = createAsyncThunk('user/githubAuth', async (code, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/auth/oauth/github/callback',
            { code },
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const initialState = {
    username: '',
    email: '',
    tempemail: '',
    isLoggedin: false,
    authLoading: true,
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
        },
        setTempEmail: (state, action) => {
            state.tempemail = action.payload.tempemail;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(signinUser.fulfilled, (state, action) => {
                state.isLoggedin = true;
                state.username = action.payload.user.name;
                state.email = action.payload.user.email;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoggedin = false;
                state.username = '';
                state.email = '';
            })
            .addCase(checkAuth.pending, state => {
                state.authLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log(action.payload);
                if (action.payload.success) {
                    state.authLoading = false;
                    state.isLoggedin = true;
                    state.username = action.payload.user.name;
                    state.email = action.payload.user.email;
                }
            })
            .addCase(checkAuth.rejected, state => {
                state.authLoading = false;
                state.isLoggedin = false;
            })
            .addCase(googleAuth.fulfilled, (state, action) => {
                state.authLoading = false;
                state.isLoggedin = true;
                state.username = action.payload.user.name;
                state.email = action.payload.user.email;
            })
            .addCase(githubAuth.fulfilled, (state, action)=> {
                state.authLoading = false;
                state.isLoggedin = true;
                state.username = action.payload.user.name;
                state.email = action.payload.user.email;
            });
    },
});

export const { setUserData, setTempEmail } = userSlice.actions;

export const userReducer = userSlice.reducer;

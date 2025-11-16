import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createChat = createAsyncThunk(
    'chat/createChat',
    async ({ roadmapId, moduleId, userMessage }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/create-chat`,
                { roadmapId, moduleId, userMessage },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error' });
        }
    }
);

export const getChatResponse = createAsyncThunk(
    'chat/getChatResponse',
    async ({ chatId, userMessage }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/get-response`,
                { chatId, userMessage },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error' });
        }
    }
);

export const fetchChatsForChapter = createAsyncThunk(
    'chat/fetchChatsForChapter',
    async ({ roadmapId, moduleId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/get-chats`,
                { roadmapId, moduleId },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error' });
        }
    }
);

export const fetchChat = createAsyncThunk(
    'chat/fetchChat',
    async ({ chatId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/get-chat`,
                { chatId },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error' });
        }
    }
);

export const deleteChat = createAsyncThunk(
    'chat/deleteChat',
    async ({ chatId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/delete-chat`,
                { chatId },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error' });
        }
    }
);

export const renameChat = createAsyncThunk(
    'chat/renameChat',
    async ({ chatId, newTitle }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/rename-chat`,
                { chatId, newTitle },
                {
                    headers: { 'Content-Type': 'application/json' },
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
    chats: {}, // Structure: { "chapterId": { chats: [{ id, chatId, title, messages: [] }], activeChatId: null } }
    temp_msg: '',
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            const { chapterId, chatId } = action.payload;
            const chatKey = `${chapterId}`;
            if (!state.chats[chatKey]) {
                state.chats[chatKey] = { chats: [], activeChatId: null };
            }
            state.chats[chatKey].activeChatId = chatId || null;
        },
    },
    extraReducers: builder => {
        builder
        
            .addCase(createChat.pending, (state, action) => {
                state.temp_msg = action.meta.arg.userMessage;
                
                // Chat creation triggers fetchChatsForChapter which will add the chat with proper chatId
                // We just mark that we need to refresh
            })
            .addCase(createChat.fulfilled, (state, action) => {
                // Chat creation triggers fetchChatsForChapter which will add the chat with proper chatId
                // We just mark that we need to refresh
            })
            .addCase(getChatResponse.pending, (state, action) => {
                const { chatId } = action.meta.arg;
                const chat = Object.values(state.chats)
                    .flatMap(ch => ch.chats)
                    .find(c => c.chatId === chatId || c.id === chatId);
                
                if (chat) {
                    chat.messages.push({ role: 'user', content: action.meta.arg.userMessage, time: Date.now() });
                    chat.messages.push({ role: 'ai', content: '', time: Date.now() });
                }
            })
            .addCase(getChatResponse.fulfilled, (state, action) => {
                const { chatId } = action.meta.arg;
                const chat = Object.values(state.chats)
                    .flatMap(ch => ch.chats)
                    .find(c => c.chatId === chatId || c.id === chatId);

                if (chat && action.payload.message === 'AI response generated') {
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    if (lastMessage.role === 'ai' && !lastMessage.content) {
                        lastMessage.content = action.payload.data || '';
                    }
                }
            })
            .addCase(getChatResponse.rejected, (state, action) => {
                const { chatId } = action.meta.arg;
                const chat = Object.values(state.chats)
                    .flatMap(ch => ch.chats)
                    .find(c => c.chatId === chatId || c.id === chatId);

                if (chat && chat.messages.length >= 2) {
                    chat.messages.pop();
                    chat.messages.pop();
                }
            })
            .addCase(fetchChatsForChapter.fulfilled, (state, action) => {
                const { moduleId } = action.meta.arg;
                const chatKey = `${moduleId}`;
                const payload = action.payload;

                if (payload.message === 'Chats retrieved successfully' && Array.isArray(payload.data)) {
                    if (!state.chats[chatKey]) {
                        state.chats[chatKey] = { chats: [], activeChatId: null };
                    }

                    // Map backend chats to frontend format, sorted by createdAt (newest first)
                    const backendChats = payload.data
                        .map(chat => ({
                            id: chat._id,
                            chatId: chat._id,
                            title: chat.title,
                            messages: chat.messages || [],
                            createdAt: chat.createdAt || new Date(0),
                        }))
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    const previousActiveId = state.chats[chatKey].activeChatId;
                    
                    // Replace all chats with backend data
                    state.chats[chatKey].chats = backendChats;
                    
                    // Set active chat: if previous was null (new chat button clicked), select newest
                    // Otherwise, try to find the chat with matching ID
                    if (previousActiveId === null) {
                        // New chat was just created, select the newest one
                        state.chats[chatKey].activeChatId = backendChats[0]?.id || null;
                    } else if (previousActiveId) {
                        const found = backendChats.find(c => c.id === previousActiveId || c.chatId === previousActiveId);
                        state.chats[chatKey].activeChatId = found?.id || backendChats[0]?.id || null;
                    }
                }
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                const payload = action.payload;
                if (payload.message === 'Chat retrieved successfully' && payload.data) {
                    const chat = payload.data;
                    const chatKey = `${chat.moduleId}`;
                    
                    if (!state.chats[chatKey]) {
                        state.chats[chatKey] = { chats: [], activeChatId: null };
                    }

                    const chatObj = {
                        id: chat._id,
                        chatId: chat._id,
                        title: chat.title,
                        messages: chat.messages || [],
                    };

                    const existingIndex = state.chats[chatKey].chats.findIndex(c => c.chatId === chat._id);
                    if (existingIndex >= 0) {
                        state.chats[chatKey].chats[existingIndex] = chatObj;
                    } else {
                        state.chats[chatKey].chats.push(chatObj);
                    }
                }
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                const { chatId } = action.meta.arg;
                const chatKey = Object.keys(state.chats).find(key =>
                    state.chats[key].chats.some(c => c.chatId === chatId || c.id === chatId)
                );

                if (chatKey) {
                    state.chats[chatKey].chats = state.chats[chatKey].chats.filter(
                        c => c.chatId !== chatId && c.id !== chatId
                    );
                    if (state.chats[chatKey].activeChatId === chatId) {
                        state.chats[chatKey].activeChatId = state.chats[chatKey].chats[0]?.id || null;
                    }
                }
            })
            .addCase(renameChat.fulfilled, (state, action) => {
                const { chatId, newTitle } = action.meta.arg;
                const chat = Object.values(state.chats)
                    .flatMap(ch => ch.chats)
                    .find(c => c.chatId === chatId || c.id === chatId);

                if (chat) {
                    chat.title = newTitle;
                }
            });
    },
});

export const { setActiveChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;

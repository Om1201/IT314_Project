import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from '../features/userSlicer.js';
import { roadmapReducer } from '../features/roadmapSlicer.js';
import { chatReducer } from '../features/chatSlicer.js';
import { searchReducer } from '../features/searchSlicer.js';


const store = configureStore({
    reducer: {
        user: userReducer,
        roadmap: roadmapReducer,
        chat: chatReducer,
        search: searchReducer,
    },
});

export default store;

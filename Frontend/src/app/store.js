import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from '../features/userSlicer.js';
import { roadmapReducer } from '../features/roadmapSlicer.js';
import { chatReducer } from '../features/chatSlicer.js';
import { searchReducer } from '../features/searchSlicer.js';
import { ideReducer } from '../features/ideSlicer.js';
import { profileReducer } from '../features/profileSlicer.js';


const store = configureStore({
    reducer: {
        user: userReducer,
        roadmap: roadmapReducer,
        chat: chatReducer,
        search: searchReducer,
        ide: ideReducer,
        profile: profileReducer,
    },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from '../features/userSlicer.js';
import { roadmapReducer } from '../features/roadmapSlicer.js';
import { searchReducer } from '../features/searchSlicer.js';


const store = configureStore({
    reducer: {
        user: userReducer,
        roadmap: roadmapReducer,
        search: searchReducer,
    },
});

export default store;

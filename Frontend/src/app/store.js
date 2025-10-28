import { configureStore } from "@reduxjs/toolkit";

import {userReducer} from "../features/userSlicer.js";
import {roadmapReducer} from "../features/roadmapSlicer.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    roadmap : roadmapReducer,
  },
});

export default store;

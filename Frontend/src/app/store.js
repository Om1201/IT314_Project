import { configureStore } from "@reduxjs/toolkit";

import {userReducer} from "../features/userSlicer.js";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

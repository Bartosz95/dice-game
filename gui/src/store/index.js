import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import configSlice from "./config-slice";

const store = configureStore({
  reducer: { auth: authSlice.reducer, config: configSlice.reducer },
});

export default store;

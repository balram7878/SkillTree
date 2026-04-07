import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { ragApi } from "./ragAPIs";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ragApi.reducerPath]: ragApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(ragApi.middleware),
});

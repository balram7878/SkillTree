import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    // false until getMe resolves — ProtectedRoute waits for this
    isInitialized: false,
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMe success → user is authenticated
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      // getMe failure (e.g. 401) → user is not authenticated
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      // Successful login → store user
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      // Successful email verification → auto-login, store user
      .addMatcher(
        authApi.endpoints.verifyEmail.matchFulfilled,
        (state, action) => {
          if (action.payload.user) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
          }
        }
      )
      // Logout → clear user
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

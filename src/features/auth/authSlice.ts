import { createSlice } from "@reduxjs/toolkit";
import { executeLogin } from "./authThunk";

export interface AuthState {
  accessToken: string | null;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  email: null,
  name: null,
  avatarUrl: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.email = null;
      state.name = null;
      state.avatarUrl = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeLogin.fulfilled, (state, action) => {
        const { accessToken, userSessionResponse } = action.payload;
        state.accessToken = accessToken;
        state.email = userSessionResponse.email;
        state.name = userSessionResponse.name;
        state.avatarUrl = userSessionResponse.avatarUrl;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(executeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Đã có lỗi xảy ra";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

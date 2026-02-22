import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { executeLogin } from "./authThunk";
import { fetchMe } from "../user/userThunk";
import type { DefaultAuthResponse } from "@/types/auth/DefaultAuthResponse";

export interface AuthState {
  id: number | null;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  id: null,
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
      localStorage.removeItem("access_token");
      state.id = null;
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
    setTokens(state, action: PayloadAction<DefaultAuthResponse>) {
      const { accessToken, userSessionResponse } = action.payload;
      localStorage.setItem("access_token", accessToken);
      state.id = userSessionResponse.id;
      state.email = userSessionResponse.email;
      state.name = userSessionResponse.name;
      state.avatarUrl = userSessionResponse.avatarUrl;
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
        localStorage.setItem("access_token", accessToken);
        state.id = userSessionResponse.id;
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
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.avatarUrl = action.payload.avatarUrl;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Không thể tải thông tin người dùng";
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;

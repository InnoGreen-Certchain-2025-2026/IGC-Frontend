import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../../services/authService";
import type { LoginRequest } from "../../types/auth/LoginRequest";
import type { RegisterRequest } from "../../types/auth/RegisterRequest";
import type { DefaultAuthResponse } from "../../types/auth/DefaultAuthResponse";

export const executeLogin = createAsyncThunk<
  DefaultAuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/executeLogin", async (request, { rejectWithValue }) => {
  try {
    const response = await loginApi(request);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.errorMessage || "Đăng nhập thất bại";
    return rejectWithValue(message);
  }
});

export const executeRegister = createAsyncThunk<
  void,
  RegisterRequest,
  { rejectValue: string }
>("auth/executeRegister", async (request, { rejectWithValue }) => {
  try {
    await registerApi(request);
  } catch (error: any) {
    const message =
      error.response?.data?.errorMessage || "Đăng ký thất bại";
    return rejectWithValue(message);
  }
});

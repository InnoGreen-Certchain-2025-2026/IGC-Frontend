import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../../services/authService";
import type { LoginRequest } from "../../types/auth/LoginRequest";
import type { RegisterRequest } from "../../types/auth/RegisterRequest";
import type { DefaultAuthResponse } from "../../types/auth/DefaultAuthResponse";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "errorMessage" in error.response.data &&
    typeof error.response.data.errorMessage === "string"
  ) {
    return error.response.data.errorMessage;
  }

  return fallback;
};

export const executeLogin = createAsyncThunk<
  DefaultAuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/executeLogin", async (request, { rejectWithValue }) => {
  try {
    const response = await loginApi(request);
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Đăng nhập thất bại");
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
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Đăng ký thất bại");
    return rejectWithValue(message);
  }
});

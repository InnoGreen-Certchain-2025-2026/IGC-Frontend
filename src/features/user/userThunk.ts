import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi } from "../../services/userService";
import type { UserSessionResponse } from "../../types/user/UserSessionResponse";

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

export const fetchMe = createAsyncThunk<
  UserSessionResponse,
  void,
  { rejectValue: string }
>("user/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const response = await getMeApi();
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(
      error,
      "Không thể tải thông tin người dùng",
    );
    return rejectWithValue(message);
  }
});

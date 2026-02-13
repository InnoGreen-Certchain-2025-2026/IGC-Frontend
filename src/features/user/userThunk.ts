import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi } from "../../services/userService";
import type { UserSessionResponse } from "../../types/user/UserSessionResponse";

export const fetchMe = createAsyncThunk<
  UserSessionResponse,
  void,
  { rejectValue: string }
>("user/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const response = await getMeApi();
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.errorMessage || "Không thể tải thông tin người dùng";
    return rejectWithValue(message);
  }
});

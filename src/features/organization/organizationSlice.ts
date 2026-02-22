import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrganizationSummaryResponse } from "@/types/organization/OrganizationSummaryResponse";

export interface OrganizationState {
  selectedOrganization: OrganizationSummaryResponse | null;
}

const initialState: OrganizationState = {
  selectedOrganization: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    selectOrganization(
      state,
      action: PayloadAction<OrganizationSummaryResponse>,
    ) {
      state.selectedOrganization = action.payload;
    },
    clearSelectedOrganization(state) {
      state.selectedOrganization = null;
    },
  },
});

export const { selectOrganization, clearSelectedOrganization } =
  organizationSlice.actions;
export default organizationSlice.reducer;

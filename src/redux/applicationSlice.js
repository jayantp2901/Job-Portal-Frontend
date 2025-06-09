import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applicants: null,
    allAppliedJobs: [],  // ✅ default as empty array
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    setAllAppliedJobs: (state, action) => {   // ✅ add this new reducer
      state.allAppliedJobs = action.payload;
    }
  }
});

export const { setAllApplicants, setAllAppliedJobs } = applicationSlice.actions; // ✅ export new action
export default applicationSlice.reducer;

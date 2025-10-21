import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../Services/userService";
import { STATUSES } from "./contactSlice";

const initialState = {
  userData: null,
  status: STATUSES.IDLE,
  hasFetched: false,
  error: null,
};

// Thunks

export const fetchCurrentUser = createAsyncThunk(
  "user/currentUser",
  async (userData, { fulfillWithValue }) => {
    if (userData) return fulfillWithValue(userData);

    const data = await userService.getCurrentUserDetails();
    return data;
  }
);

export const updateCurrentUser = createAsyncThunk(
  "user/update",
  async (data) => {
    console.log("Payload being sent:", data);
    return await userService.updateUserDetails(data);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    resetUserDetails: (state) => {
      state.userData = null;
      state.status = STATUSES.IDLE;
      state.hasFetched = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.status = STATUSES.IDLE;
        state.hasFetched = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.hasFetched = true;
        state.error = action.error?.message || "Failed to load user details";
      })

      .addCase(updateCurrentUser.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.error = action.error?.message || "Failed to update user details";
      });
  },
});

export default userSlice.reducer;
export const selectUser = (state) => state.user.userData;
export const selectUserStatus = (state) => state.user.status;
export const selectUserHasFetched = (state) => state.user.hasFetched;
export const { resetUserDetails } = userSlice.actions;
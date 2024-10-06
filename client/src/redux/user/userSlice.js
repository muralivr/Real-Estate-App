import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  msg: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.msg = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload.userdetails;
      state.loading = false;
      state.error = null;
      state.msg = null;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload.userdetails;
      state.loading = false;
      state.error = null;
      state.msg = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.msg = null;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.msg = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.msg = null;
    },
    signoutUserStart: (state) => {
      state.loading = true;
    },
    signoutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.msg = null;
    },
    signoutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.msg = null;
    },
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { globalErrorCatch } from "../workout/workoutSlice";
const initialState = {
  comments: [],
};
export const commentAction = () => async (dispatch) => {
  try {
    dispatch(getCommentRequest());
    const response = await axios.get(
      `http://localhost:8000/api/v1/comment/get`
    );
    dispatch(getCommentSuccess(response.data.data));
  } catch (e) {
    globalErrorCatch(e.response.data.message);
  }
};
export const comments = createSlice({
  name: "comments",
  initialState,
  reducers: {
    getCommentRequest(state) {
      state.loading = true;
    },
    getCommentSuccess(state, action) {
      state.loading = false;
      state.comments = action.payload;
    },
  },
});
export const { getCommentRequest, getCommentSuccess } = comments.actions;
export default comments.reducer;

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  comments: [],
};
const getAuthorizationHeader = (token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};
export const commentAction = () => async (dispatch) => {
  try {
    dispatch(getCommentRequest());
    const response = await axios.get(
      `http://localhost:8000/api/v1/comment/get`
    );
    dispatch(getCommentSuccess(response.data.data));
  } catch (e) {
    dispatch(catchError(e.response.data ? e.response.data : e.response));
  }
};
export const getWorkoutComments = (id) => async (dispatch) => {
  try {
    dispatch(getCommentRequest());
    const response = await axios.get(
      `http://localhost:8000/api/v1/comment/get/${id}`
    );
    dispatch(getCommentSuccess(response.data.data));
  } catch (e) {
    dispatch(catchError(e.response.data ? e.response.data : e.response));
  }
};
export const addComment = (id, rating, message) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = getAuthorizationHeader(token);
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/comment/add/${id}`,
      { rating: parseInt(rating), message },
      config
    );
    dispatch(getWorkoutComments(id));
  } catch (e) {
    dispatch(catchError(e.response.data ? e.response.data : e.response));
  }
};
export const deleteComment = (id,workoutId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = getAuthorizationHeader(token);
    const data = await axios.delete(
      `http://localhost:8000/api/v1/comment/delete/${id}`,
      config
    );
    dispatch(getWorkoutComments(workoutId));
  } catch (e) {
    dispatch(catchError(e.response.data ? e.response.data : e.response));
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
    catchError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors(state, action) {
      state.error = null;
    },
  },
});
export const { getCommentRequest, getCommentSuccess, catchError, clearErrors } =
  comments.actions;
export default comments.reducer;

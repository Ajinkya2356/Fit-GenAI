import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getPosts = (keyword, asc, desc) => async (dispatch) => {
  try {
    dispatch(getPostsRequest());
    const config = { headers: { "Content-Type": "application/json" } };
    let query = "";
    if (keyword) query += `keyword=${keyword}&`;
    if (asc) query += `asc=${asc}&`;
    if (desc) query += `desc=${desc}&`;

    const response = await axios.get(
      `http://localhost:8000/api/v1/post?${query}`,
      config
    );
    dispatch(getPostsSuccess(response.data.data));
  } catch (e) {
    console.log(e);
    dispatch(catchError(e.response.data.message));
  }
};
export const getComments = (postId) => async (dispatch) => {
  try {
    dispatch(getCommentsRequest());
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.get(
      `http://localhost:8000/api/v1/post/comments/${postId}`,
      config
    );
    dispatch(getCommentsSuccess({ comments: response.data.data.comments }));
  } catch (e) {
    console.log(e);
    dispatch(catchError(e.response?.data?.message || e?.message));
  }
};
export const createComment = (comment, postId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(getCommentsRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/post/comment/${postId}`,
      {
        content: comment,
      },
      config
    );
    dispatch(getCommentsSuccess({ comments: response.data.data.comments }));
    dispatch(getComments(postId));
  } catch (e) {
    dispatch(catchError(e.response.data.message));
  }
};
export const updateComment =
  (comment, postId, commentId) => async (dispatch) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      dispatch(getCommentsRequest());
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `http://localhost:8000/api/v1/post/${postId}/update/${commentId}`,
        { content: comment },
        config
      );
      dispatch(getCommentsSuccess({ comments: response.data.data.comments }));
      dispatch(getComments(postId));
    } catch (e) {
      dispatch(catchError(e.response.data.message));
    }
  };
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(
      `http://localhost:8000/api/v1/post/${postId}/delete/${commentId}`,
      config
    );
    dispatch(getCommentsSuccess({ comments: response.data.data.comments }));
    dispatch(getComments(postId));
  } catch (e) {
    dispatch(catchError(e.response.data.message));
  }
};
export const likePost = (postId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/post/like/${postId}`,
      config
    );
    dispatch(getPosts());
  } catch (e) {
    dispatch(catchError(e.response.data.message));
  }
};
export const dislikePost = (postId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/post/dislike/${postId}`,
      config
    );
    dispatch(getPosts());
  } catch (e) {
    dispatch(catchError(e.response.data.message));
  }
};
export const createPost = (data) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const postData = new FormData();
    postData.append("name", data.name);
    postData.append("content", data.content);
    postData.append("image", data.image);
    const response = await axios.post(
      "http://localhost:8000/api/v1/post/create",
      postData,
      config
    );
    const { posts } = getState().posts;
    dispatch(getPostsSuccess({ posts: [...posts, response.data.data.post] }));
  } catch (error) {
    dispatch(catchError(error.response.data.message));
  }
};
export const updatePost = (data, postId) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const updateData = new FormData();
    updateData.append("name", data.name);
    updateData.append("content", data.content);
    updateData.append("image", data.image);
    const response = await axios.put(
      `http://localhost:8000/api/v1/post/update/${postId}`,
      updateData,
      config
    );
    dispatch(getPosts());
  } catch (error) {
    dispatch(catchError(error.response.data.message));
  }
};
export const deletePost = (postId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(
      `http://localhost:8000/api/v1/post/delete/${postId}`,
      config
    );
    dispatch(getPosts());
  } catch (error) {
    dispatch(catchError(error.response.data.message));
  }
};
export const getSinglePost = (postId) => async (dispatch) => {
  try {
    dispatch(getPostRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/post/${postId}`,
      config
    );
    dispatch(getPostSuccess(response.data.data));
  } catch (error) {
    dispatch(catchError(error.response.data.message));
  }
};
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    post: null,
    loading: false,
    error: null,
    postComments: [],
  },
  reducers: {
    catchError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getPostsRequest(state) {
      state.loading = true;
    },
    getPostsSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },
    getCommentsRequest(state) {
      state.loading = true;
    },
    getCommentsSuccess(state, action) {
      state.loading = false;
      state.postComments = action.payload.comments;
    },
    getPostRequest(state) {
      state.loading = true;
    },
    getPostSuccess(state, action) {
      state.loading = false;
      state.post = action.payload;
    },
  },
});
export const {
  catchError,
  getPostsRequest,
  getPostsSuccess,
  getCommentsRequest,
  getCommentsSuccess,
  getPostRequest,
  getPostSuccess,
} = postSlice.actions;
export default postSlice.reducer;

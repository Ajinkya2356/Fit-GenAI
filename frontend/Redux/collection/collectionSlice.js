import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  else return token;
};
const newconfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${isAuthenticated()}`,
  },
  withCredentials: true,
};
export const getCollections = () => async (dispatch) => {
  try {
    dispatch(getCollectionRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAuthenticated()}`,
      },
      withCredentials: true,
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/collection`,
      config
    );
    /*     console.log(response); */
    dispatch(getCollectionSuccess(response.data.data));
  } catch (error) {
    console.log(error);
    catchError(error.response.data.message);
  }
};
export const createCollection = (name) => async (dispatch) => {
  try {
    if (!isAuthenticated) return;
    dispatch(createColl());
    const response = await axios.post(
      `http://localhost:8000/api/v1/collection/create`,
      { name: name },
      newconfig
    );
    dispatch(createCollS());
    dispatch(getCollections());
  } catch (error) {
    catchError(error.response.data.message);
  }
};
export const updateCollection = (name, id) => async (dispatch) => {
  try {
    if (!isAuthenticated) return;
    dispatch(createColl());
    const response = await axios.put(
      `http://localhost:8000/api/v1/collection/update/${id}`,
      { name: name },
      newconfig
    );
    dispatch(createCollS());
    dispatch(getCollections());
  } catch (error) {
    catchError(error.response.data.message);
  }
};
export const deleteCollection = (id) => async (dispatch) => {
  try {
    if (!isAuthenticated) return;
    dispatch(createColl());
    const response = await axios.delete(
      `http://localhost:8000/api/v1/collection/delete/${id}`,
      newconfig
    );
    dispatch(createCollS());
    dispatch(getCollections());
  } catch (error) {
    catchError(error.response.data.message);
  }
};
const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    loading: false,
    error: null,
    collections: [],
    collection: null,
  },
  reducers: {
    catchError(state, action) {
      state.error = action.payload;
    },
    createColl(state) {
      state.loading = true;
    },
    createCollS(state, action) {
      state.loading = false;
    },
    getCollectionRequest(state) {
      state.loading = true;
    },
    getCollectionSuccess(state, action) {
      state.loading = false;
      state.collections = action.payload;
    },
  },
});
export const {
  catchError,
  createColl,
  createCollS,
  getCollectionRequest,
  getCollectionSuccess,
} = collectionSlice.actions;
export default collectionSlice.reducer;

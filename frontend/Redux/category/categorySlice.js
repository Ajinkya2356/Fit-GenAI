import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { globalErrorCatch } from "../workout/workoutSlice";
import { isRouteErrorResponse } from "react-router-dom";
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch(getAllCategoriesRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/category/getCategory`,
      config
    );
    dispatch(getAllCategoriesSuccess(data.data));
  } catch (e) {
    dispatch(
      globalErrorCatch(
        e.response.data.message ? e.response.data.message : e.message
      )
    );
  }
};
export const createCategory = (category) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/category/create`,
      { name: category },
      config
    );
    dispatch(getAllCategories());
  } catch (error) {
    dispatch(
      catchError(error.response.data ? error.response.data : error.response)
    );
  }
};
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
  },
  reducers: {
    getAllCategoriesRequest(state) {
      state.loading = true;
    },
    getAllCategoriesSuccess(state, action) {
      state.loading = false;
      state.categories = action.payload;
    },
    catchError(state, action) {
      state.error = action.payload;
    },
  },
});
export const { getAllCategoriesRequest, getAllCategoriesSuccess, catchError } =
  categorySlice.actions;
export default categorySlice.reducer;

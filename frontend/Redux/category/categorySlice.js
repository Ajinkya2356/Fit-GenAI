import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { globalErrorCatch } from "../workout/workoutSlice";
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
  },
});
export const { getAllCategoriesRequest, getAllCategoriesSuccess } =
  categorySlice.actions;
export default categorySlice.reducer;

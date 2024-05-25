import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getPlans = () => async (dispatch) => {
  try {
    dispatch(getPlanRequest());
    const response = await axios.get(
      "http://localhost:8000/api/v1/plan/allPlans"
    );
    dispatch(getPlanSuccess(response.data.data));
  } catch (e) {
    dispatch(setError(e.response.data.message));
  }
};
export const createPlan = (name, exercises) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(getPlanRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/plan/create`,
      { name, exercises },
      config
    );
    dispatch(setSuccess());
  } catch (e) {
    dispatch(setError(e.response.data.message));
  }
};
export const generatePlan = (planName, exercises) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(getPlanRequest());
    if (planName === "" || exercises.length === 0) {
      dispatch(interruptAction("Plan Name is Required"));
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/plan/generate`,
      { planName, exercises },
      config
    );
    dispatch(setGeneratedPlan(response.data.data));
  } catch (e) {
    dispatch(setError(e.response.data.message));
  }
};
export const saveAction = (name, exercises) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(saveActionRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/plan/save`,
      { name, exercises },
      config
    );
    dispatch(saveActionSuccess());
  } catch (e) {
    dispatch(setError(e.response.data.message));
  }
};
export const setGP = () => async (dispatch) => {
  dispatch(setGeneratedPlan({}));
};
export const clearErrorsPlan = () => async (dispatch) => {
  dispatch(clearErrors());
};
const planSlice = createSlice({
  name: "plan",
  initialState: {
    loading: false,
    error: null,
    plans: [],
    generatedPlan: {},
  },
  reducers: {
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getPlanRequest: (state) => {
      state.loading = true;
    },
    getPlanSuccess: (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    },
    setSuccess: (state, action) => {
      state.loading = false;
    },
    setGeneratedPlan: (state, action) => {
      state.loading = false;
      state.generatedPlan = action.payload;
    },
    saveActionRequest: (state, action) => {
      state.loading = true;
    },
    saveActionSuccess: (state, action) => {
      state.loading = false;
    },
    interruptAction: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state, action) => {
      state.error = null;
    },
  },
});
export const {
  setError,
  getPlanRequest,
  getPlanSuccess,
  setSuccess,
  setGeneratedPlan,
  saveActionRequest,
  saveActionSuccess,
  interruptAction,
  clearErrors,
} = planSlice.actions;
export default planSlice.reducer;

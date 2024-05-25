import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  workouts: [],
  AllUsers: [],
  AllPlans: [],
  AllExercises: [],
  AllCategories: [],
  workout: null,
};
export const workoutAction = () => async (dispatch) => {
  try {
    dispatch(getWorkoutRequest());
    const response = await axios.get(
      "http://localhost:8000/api/v1/workout/getWorkouts"
    );
    // console.log(response.data.data);
    dispatch(getWorkoutSuccess(response.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};

export const getBoth = () => async (dispatch, getState) => {
  try {
    await dispatch(workoutAction());
    const store = getState();
    const userIds = new Array();

    const arr = store.WORKOUT.workouts.map((w) => {
      return w.users.map((u) => {
        userIds.push(u);
        return u;
      });
    });
    const planIds = store.WORKOUT.workouts.map((w) => w.plan);
    //console.log(planIds);
    // console.log("Arr", finallz.length);
    const uniqueUserIds = [...new Set(userIds)];
    console.log(uniqueUserIds);
    await dispatch(getAllUsers(uniqueUserIds));
    const uniquePlanIds = [...new Set(planIds)];
    await dispatch(getPlan(uniquePlanIds));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const getAllUsers = (userIds) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(getAllUsersRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/users/getUsers`,
      {
        userIDs: userIds,
      },
      config
    );
    dispatch(getAllUsersSuccess(data.data.users));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const getPlan = (ids) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(getPlanRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/plan/getMultiplePlans`,
      {
        ids,
      },
      config
    );
    //console.log(data.data);
    dispatch(getPlanSuccess(data.data));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const getDetailedWorkout = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(getDetailedWorkoutRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    await dispatch(getBoth());
    const exerciseIDs = new Array();
    const store = getState();
    //console.log("All Plans", store.WORKOUT.AllPlans);
    const arr = store.WORKOUT.AllPlans.map((p) => {
      return p.exercises.map((e) => {
        exerciseIDs.push(e.exercise);
        return e;
      });
    });
    const uniqueExerciseIDs = [...new Set(exerciseIDs)];
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/exercise/getMultipleExercises",
      { ids: uniqueExerciseIDs },
      config
    );
    //console.log(data.data);

    await dispatch(getDetailedWorkoutSuccess(data.data));
    await dispatch(getCategories());
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const getCategories = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(getCategoryRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/category/getCategory",
      config
    );
    //console.log("categories",data.data)
    dispatch(getCategorySuccess(data.data));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const joinWorkout = (workoutId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(joinWorkoutRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/workout/join/${workoutId}`,
      {},
      config
    );
    dispatch(singleWorkout(workoutId));
  } catch (error) {
    dispatch(globalErrorCatch(error.response.data.message));
  }
};
export const leaveWorkout = (workoutId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(leaveWorkoutRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/workout/leave/${workoutId}`,
      {},
      config
    );
    dispatch(singleWorkout(workoutId));
  } catch (error) {
    dispatch(globalErrorCatch(error.response.data.message));
  }
};
export const singleWorkout = (id) => async (dispatch) => {
  try {
    dispatch(singleWorkoutRequest());
    const response = await axios.get(
      `http://localhost:8000/api/v1/workout/single/${id}`
    );
    dispatch(singleWorkoutSuccess(response.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const createWorkout = (workoutData) => async (dispatch) => {
  try {
    dispatch(createWorkoutRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const data = new FormData();
    Object.keys(workoutData).forEach((key) => {
      data.append(key, workoutData[key]);
    });

    const response = await axios.post(
      `http://localhost:8000/api/v1/workout/create`,
      data,
      config
    );
    dispatch(createWorkoutSuccess());
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(globalErrorCatch(error.response.data.message));
    } else {
      dispatch(globalErrorCatch(error.message));
    }
  }
};
export const Workouts = createSlice({
  name: "Workouts",
  initialState,
  reducers: {
    getWorkoutRequest(state, action) {
      state.loading = true;
    },
    getWorkoutSuccess(state, action) {
      state.loading = false;
      state.workouts = action.payload;
    },
    globalErrorCatch(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getAllUsersRequest(state, action) {
      state.loading = true;
    },
    getAllUsersSuccess(state, action) {
      state.loading = false;
      state.AllUsers = action.payload;
    },
    getPlanRequest(state, action) {
      state.loading = true;
    },
    getPlanSuccess(state, action) {
      state.loading = false;
      state.AllPlans = action.payload;
    },
    getAllExercisesRequest(state, action) {
      state.loading = true;
    },
    getAllExercisesSuccess(state, action) {
      state.loading = false;
      state.AllExercises = action.payload;
    },
    getDetailedWorkoutRequest(state, action) {
      state.loading = true;
    },
    getDetailedWorkoutSuccess(state, action) {
      state.AllExercises = action.payload;
    },
    getCategoryRequest(state, action) {
      state.loading = true;
    },
    getCategorySuccess(state, action) {
      state.loading = false;
      state.AllCategories = action.payload;
    },
    joinWorkoutRequest(state, action) {
      state.loading = true;
    },
    joinWorkoutSuccess(state, action) {
      state.loading = false;
    },
    clearErrors(state, action) {
      state.error = null;
    },
    singleWorkoutRequest(state, action) {
      state.loading = true;
    },
    singleWorkoutSuccess(state, action) {
      state.loading = false;
      state.workout = action.payload;
    },
    leaveWorkoutRequest(state) {
      state.loading = true;
    },
    leaveWorkoutSuccess(state) {
      state.loading = false;
    },
    createWorkoutRequest(state) {
      state.loading = true;
    },
    createWorkoutSuccess(state) {
      state.loading = false;
    },
  },
});
export const {
  getWorkoutRequest,
  getWorkoutSuccess,
  globalErrorCatch,
  clearErrors,
  getAllUsersRequest,
  getAllUsersSuccess,
  getPlanRequest,
  getPlanSuccess,
  getAllExercisesRequest,
  getAllExercisesSuccess,
  getDetailedWorkoutRequest,
  getDetailedWorkoutSuccess,
  getCategoryRequest,
  getCategorySuccess,
  joinWorkoutRequest,
  joinWorkoutSuccess,
  singleWorkoutRequest,
  singleWorkoutSuccess,
  leaveWorkoutRequest,
  leaveWorkoutSuccess,
  createWorkoutRequest,
  createWorkoutSuccess,
} = Workouts.actions;
export default Workouts.reducer;

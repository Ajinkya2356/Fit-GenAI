import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getExerciseAction = (difficulty, search) => async (dispatch) => {
  try {
    dispatch(getExerciseRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/exercise/getExercises?difficulty=${difficulty}&search=${search}`,
      config
    );
    dispatch(getExerciseSuccess(response.data.data));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const likeAction = (id) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    // dispatch(userLikeRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/exercise/like/${id}`,
      {},
      config
    );
    dispatch(
      userLikeSuccess({
        id,
        LikedBy: response.data.data.likedBy,
        DisLikedBy: response.data.data.dislikedBy,
      })
    );
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const dislikeAction = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    // dispatch(userDislikeRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/exercise/dislike/${id}`,
      {},
      config
    );
    dispatch(
      userDislikeSuccess({
        id,
        LikedBy: response.data.data.likedBy,
        DisLikedBy: response.data.data.dislikedBy,
      })
    );
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const getSingleExercise = (id) => async (dispatch) => {
  try {
    dispatch(getSingleExerciseRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/exercise/single/${id}`,
      config
    );

    dispatch(getExercise(response.data.data));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const createExercise = (exerciseData) => async (dispatch) => {
  try {
    dispatch(getExerciseRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const data = new FormData();
    data.append("name", exerciseData.name);
    data.append("description", exerciseData.description);
    data.append("categoryID", exerciseData.categoryID);
    data.append("difficulty_level", exerciseData.difficulty_level);
    data.append("video", exerciseData.video);
    data.append("image", exerciseData.image);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.post(
      "http://localhost:8000/api/v1/exercise/create",
      data,
      config
    );
    dispatch(getExerciseSuccess(response.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const userExercise = () => async (dispatch) => {
  try {
    dispatch(userExerciseRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const exercises = await axios.get(
      `http://localhost:8000/api/v1/exercise/my-exercises`,
      config
    );
    dispatch(userExerciseSuccess(exercises.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const updateExercise = (exerciseData, id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    console.log("Exercise Data", exerciseData);
    const data = new FormData();
    data.append("name", exerciseData?.name);
    data.append("description", exerciseData?.description);
    data.append("categoryID", exerciseData?.categoryID);
    data.append("difficulty_level", exerciseData?.difficulty_level);
    data.append("video", exerciseData?.video);
    data.append("image", exerciseData?.image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.put(
      `http://localhost:8000/api/v1/exercise/update/${id}`,
      data,
      config
    );
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
export const deleteExercise = (id) => async (dispatch) => {
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
    const { response } = await axios.delete(
      `http://localhost:8000/api/v1/exercise/delete/${id}`,
      config
    );
    dispatch(userExercise());
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data.message));
  }
};
const exerciseSlice = createSlice({
  name: "exercise",
  initialState: {
    exercises: [],
    exercise: null,
    error: null,
    userExercises: [],
  },
  reducers: {
    getExerciseRequest(state, action) {
      state.loading = true;
    },
    getExerciseSuccess(state, action) {
      state.loading = false;
      state.exercises = action.payload;
    },
    getExercises(state, action) {
      state.loading = false;
      state.exercises = action.payload;
    },
    getExercise(state, action) {
      state.loading = false;
      state.exercise = action.payload;
    },
    globalErrorCatch(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    userLikeRequest(state) {
      state.loading = true;
    },
    userLikeSuccess(state, action) {
      const { id, LikedBy, DisLikedBy } = action.payload;
      state.loading = false;
      state.exercises = state.exercises.map((exercise) => {
        if (exercise._id === id) {
          return { ...exercise, likedBy: LikedBy, dislikedBy: DisLikedBy };
        }
        return exercise;
      });
    },
    userDislikeRequest(state) {
      state.loading = true;
    },
    userDislikeSuccess(state, action) {
      const { id, DisLikedBy, LikedBy } = action.payload;
      state.loading = false;
      state.exercises = state.exercises.map((exercise) => {
        if (exercise._id === id) {
          return { ...exercise, dislikedBy: DisLikedBy, likedBy: LikedBy };
        }
        return exercise;
      });
    },

    getSingleExerciseRequest(state) {
      state.loading = true;
    },
    userExerciseRequest(state) {
      state.loading = true;
    },
    userExerciseSuccess(state, action) {
      state.loading = false;
      state.userExercises = action.payload;
    },
  },
});
export const {
  getExercises,
  getExercise,
  clearErrors,
  globalErrorCatch,
  getExerciseRequest,
  getExerciseSuccess,
  userLikeRequest,
  userLikeSuccess,
  userDislikeRequest,
  userDislikeSuccess,
  getSingleExerciseRequest,
  userExerciseRequest,
  userExerciseSuccess,
} = exerciseSlice.actions;
export default exerciseSlice.reducer;

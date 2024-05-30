import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { loadUser } from "../user/userSlice";
export const getChallengeAction = (keyword, status) => async (dispatch) => {
  try {
    dispatch(getChallengesRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/challenge/getAll?searchKeyword=${keyword}&status=${status}`,
      config
    );

    dispatch(getChallengesSuccess(response.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const getSingleChallenge = (id) => async (dispatch) => {
  try {
    dispatch(getSingleChallengeRequest());
    const challenge = await axios.get(
      `http://localhost:8000/api/v1/challenge/single/${id}`
    );
    dispatch(getSingleChallengeSuccess(challenge.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const joinChallenge = (id) => async (dispatch) => {
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
    const response = await axios.post(
      `http://localhost:8000/api/v1/challenge/join/${id}`,
      {},
      config
    );
    dispatch(getSingleChallenge(id));
  } catch (e) {
    console.log(e);
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const leaveChallenge = (id) => async (dispatch) => {
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
    const response = await axios.post(
      `http://localhost:8000/api/v1/challenge/leave/${id}`,
      {},
      config
    );
    dispatch(getSingleChallenge(id));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const createChallenge = (challengeData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const formData = new FormData();
    Object.keys(challengeData).forEach((key) => {
      formData.append(key, challengeData[key]);
    });
    console.log("Controller", formData);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/challenge/create`,
      formData,
      config
    );
    console.log(response);
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const getUserChallenges = () => async (dispatch) => {
  try {
    dispatch(getUserChallengesRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/challenge/user`,
      config
    );
    dispatch(getUserChallengeSuccess(data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const deleteChallenge = (challengeId) => async (dispatch) => {
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
    const { data } = await axios.delete(
      `http://localhost:8000/api/v1/challenge/delete/${challengeId}`,
      config
    );
    dispatch(getUserChallenges());
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const updateChallenge = (challengeData, id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const formData = new FormData();
    Object.keys(challengeData).forEach((key) => {
      formData.append(key, challengeData[key]);
    });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.put(
      `http://localhost:8000/api/v1/challenge/update/${id}`,
      formData,
      config
    );
    dispatch(getUserChallenges());
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const createTask = (taskData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(createTaskRequest());
    console.log("Task", taskData);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/challenge/addTask`,
      taskData,
      config
    );
    dispatch(createTaskSuccess());
    dispatch(getChallengeTask(taskData.challenge));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const getChallengeTask = (challengeId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(getTaskReq());
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/challenge/getTask/${challengeId}`,
      config
    );
    dispatch(getTaskSucc(response.data.data));
    dispatch(getSingleChallenge(challengeId));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const completeTask = (taskId, id) => async (dispatch) => {
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
    dispatch(getTaskReq());
    const response = await axios.get(
      `http://localhost:8000/api/v1/challenge/check/${taskId}`,
      config
    );
    dispatch(createTaskSuccess());
    dispatch(getChallengeTask(id));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const getTask = (taskId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(setSingleTaskReq());
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const response = await axios.get(
      `http://localhost:8000/api/v1/challenge/task/${taskId}`,
      config
    );
    dispatch(setSingleTaskSuccess(response.data.data));
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const creditCoins = (val, challengeID, userID) => async (dispatch) => {
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
    const response = await axios.post(
      `http://localhost:8000/api/v1/challenge/addCoins`,
      { val, challengeID, userID },
      config
    );
    dispatch(loadUser());
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const leaderBoard = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(getLeaderReq());
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/users/leaderBoard`,
      config
    );
    dispatch(getLeaderSuccess(data.data));
  } catch (error) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const challengeLeaderBoard = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    dispatch(getLeaderReq());
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/challenge/board/${id}`,
      config
    );
    dispatch(getLeaderSuccess(data.data));
  } catch (error) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
export const chooseWinner = (id, userID) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/challenge/winner",
      {
        id,
        userID,
      }
    );
  } catch (e) {
    dispatch(globalErrorCatch(e.response.data ? e.response.data : e.response));
  }
};
const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    challenges: [],
    challenge: null,
    userChallenges: [],
    Task: [],
  },
  reducers: {
    getChallenges(state, action) {
      state.challenges = action.payload;
    },
    getChallenge(state, action) {
      state.challenge = action.payload;
    },
    getChallengesRequest(state, action) {
      state.loading = true;
    },
    getChallengesSuccess(state, action) {
      state.loading = false;
      state.challenges = action.payload;
    },
    getSingleChallengeRequest(state) {
      state.loading = true;
    },
    getSingleChallengeSuccess(state, action) {
      state.loading = false;
      state.challenge = action.payload;
    },
    getUserChallengesRequest(state) {
      state.loading = true;
    },
    getUserChallengeSuccess(state, action) {
      state.loading = false;
      state.userChallenges = action.payload;
    },
    createTaskRequest(state, action) {
      state.loading = true;
    },
    createTaskSuccess(state, action) {
      state.loading = false;
    },
    getTaskReq(state, action) {
      state.loading = true;
    },
    getTaskSucc(state, action) {
      state.loading = false;
      state.Task = action.payload;
    },
    setSingleTaskReq(state, action) {
      state.taskLoading = true;
    },
    setSingleTaskSuccess(state, action) {
      state.taskLoading = false;
      state.currentTask = action.payload;
    },
    getLeaderReq: (state) => {
      state.leadLoading = true;
    },
    getLeaderSuccess: (state, action) => {
      state.leadLoading = false;
      state.userLeaderBoard = action.payload;
    },
    globalErrorCatch: (state, action) => {
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});
export const {
  getChallenges,
  getChallenge,
  getChallengesRequest,
  getChallengesSuccess,
  getSingleChallengeRequest,
  getSingleChallengeSuccess,
  getUserChallengeSuccess,
  getUserChallengesRequest,
  createTaskRequest,
  createTaskSuccess,
  getTaskReq,
  getTaskSucc,
  setSingleTaskReq,
  setSingleTaskSuccess,
  getLeaderReq,
  getLeaderSuccess,
  globalErrorCatch,
  clearErrors,
} = challengeSlice.actions;
export default challengeSlice.reducer;

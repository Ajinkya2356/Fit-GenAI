import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getSteps = (id) => async (dispatch) => {
  try {
    dispatch(setStepRequest());
    const response = await axios.get(`http://localhost:8000/api/v1/step/${id}`);
    /*   console.log("Response", response.data.data); */
    dispatch(setSteps(response.data.data));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data ? error.response.data.message : error.message
      )
    );
  }
};
export const getGeneratedSteps = (exercise) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    dispatch(setGeneratedStepsReq());
    const response = await axios.post(
      `http://localhost:8000/api/v1/step/generate/new`,
      { exercise: exercise },
      config
    );
    dispatch(setGenerateSteps(response.data.data));
  } catch (error) {
    console.log(error);
    dispatch(
      setError(
        error.response?.data ? error.response.data.message : error.message
      )
    );
  }
};
export const saveGeneratedSteps = (steps, id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `http://localhost:8000/api/v1/step/save`,
      { steps, id },
      config
    );
  } catch (error) {
    console.log(error)
    dispatch(
      setError(
        error.response?.data ? error.response.data: error.message
      )
    );
  }
};
export const addStep = (step) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    dispatch(addStepRequest());
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/step/create`,
      step,
      config
    );
    dispatch(addStepSuccess(data.data));
    dispatch(getSteps(step.exerciseID));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data ? error.response.data.message : error.message
      )
    );
  }
};
export const updateStep = (step, id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    dispatch(updateStepReq());
    const response = await axios.put(
      `http://localhost:8000/api/v1/step/update`,
      { step },
      config
    );
    dispatch(updateStepSuccess());
    dispatch(getSteps(id));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data ? error.response.data.message : error.message
      )
    );
  }
};
export const deleteStep = (id, exerciseID) => async (dispatch) => {
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
      `http://localhost:8000/api/v1/step/delete/${id}`,
      config
    );
    dispatch(getSteps(exerciseID));
  } catch (error) {
    dispatch(
      setError(
        error.response?.data ? error.response.data.message : error.message
      )
    );
  }
};
const stepSlice = createSlice({
  name: "stepDetail",
  initialState: {
    steps: [],
    error: "",
    currentVideo: null,
    generatedSteps: [],
  },
  reducers: {
    setStepRequest: (state, action) => {
      state.loading = true;
    },
    setSteps: (state, action) => {
      state.steps = action.payload.map((step) => ({
        stepNo: step._id,
        data: step,
        active: false,
        progress: 0,
      }));
      state.loading = false;
    },
    setError: (state, action) => {
      state.loading=false;
      state.error = action.payload;
    },
    setStepStatus: (state, action) => {
      const { stepIndex, status } = action.payload;
      state.steps = state.steps.map((step) => {
        if (step.stepNo === stepIndex) {
          step.active = status;
        }
        return step;
      });
    },
    setStepProgress: (state, action) => {
      const { stepIndex, progress } = action.payload;
      state.steps = state.steps.map((step) => {
        if (step.stepNo === stepIndex) {
          step.progress = progress;
        }
        return step;
      });
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setCurrentIndex:(state,action)=>{
      state.currentIndex=action.payload;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    getGeneratedSteps: (state, action) => {
      state.loading = true;
    },
    setGeneratedStepsReq: (state, action) => {
      state.loading = true;
    },
    setGenerateSteps: (state, action) => {
      state.loading = false;
      state.generatedSteps = action.payload;
    },
    saveGenerateSteps: (state, action) => {
      state.generatedSteps = [];
    },
    addStepRequest: (state) => {
      state.loading = true;
    },
    addStepSuccess: (state, action) => {
      state.steps.push(action.payload);
      state.loading = false;
    },
    updateStepReq: (state) => {
      state.loading = true;
    },
    updateStepSuccess: (state, action) => {
      state.loading = false;
    },
  },
});
export const {
  setSteps,
  setError,
  setStepStatus,
  setStepProgress,
  setCurrentStep,
  setCurrentIndex,
  setCurrentVideo,
  setGenerateSteps,
  saveGenerateSteps,
  setGeneratedStepsReq,
  addStepRequest,
  addStepSuccess,
  setStepRequest,
  updateStepReq,
  updateStepSuccess,
} = stepSlice.actions;
export default stepSlice.reducer;

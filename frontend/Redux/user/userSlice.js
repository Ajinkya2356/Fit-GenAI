import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  user: {},
  coins: 0,
};
export const loginAction = (username, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const config = {
      Headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/users/login",
      { username, password },
      config
    );
    localStorage.setItem("accessToken", data.data.accessToken);
    dispatch(loginSuccess(data.data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};
export const registerAction = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    const config = {
      Headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      formData,
      config
    );
    dispatch(registerSuccess());
  } catch (error) {
    dispatch(registerFail(error.response.data.message));
  }
};
export const logoutAction = () => async (dispatch) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return;
  }
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    await axios.post("http://localhost:8000/api/v1/users/logout", {}, config);
    localStorage.removeItem("accessToken");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(error.response.data.message));
  }
};
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return;
  }
  try {
    dispatch(loadUserRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/users/me",
      config
    );

    dispatch(loadUserSuccess(data.data));
  } catch (error) {
    dispatch(loadUserFail(error.response.data.message));
  }
};
export const changePasswordAction =
  (newPassword, oldPassword) => async (dispatch) => {
    try {
      dispatch(changePasswordRequest());
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/users/changePassword",
        { newPassword, oldPassword },
        config
      );

      dispatch(changePasswordSuccess());
    } catch (error) {
      console.log(error);
      dispatch(changePasswordFail(error.response.data.message));
    }
  };
export const changeAvatar = (avatar) => async (dispatch) => {
  try {
    dispatch(updateAvatarRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const formData = new FormData();
    formData.append("avatar", avatar);
    await axios.post(
      "http://localhost:8000/api/v1/users/updateAvatar",
      formData,
      config
    );
    dispatch(updateAvatarSuccess());
  } catch (e) {
    console.log(e);
    dispatch(updateAvatarFail(e.response.data.message));
  }
};
export const updateDetails = (userData) => async (dispatch) => {
  try {
    dispatch(updateDetailsRequest());
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    await axios.post(
      "http://localhost:8000/api/v1/users/updateProfile",
      userData,
      config
    );
    dispatch(updateDetailsSuccess());
  } catch (e) {
    console.log(e);
    dispatch(updateDetailsFail(e.response.data.message));
  }
};
export const forgotPasswordAction = (userEmail) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      Headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/users/forgotPassword",
      { email: userEmail },
      config
    );
    dispatch(forgotPasswordSuccess());
  } catch (e) {
    dispatch(forgotPasswordFail(e.response.data.message));
  }
};
export const resetPasswordAction =
  (newpassword, confirmpassword, token) => async (dispatch) => {
    try {
      if (!token) return;

      dispatch(resetPasswordRequest());
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/users/resetPassword/${token}`,
        { newPassword: newpassword, confirmPassword: confirmpassword },
        config
      );
      dispatch(resetPasswordSuccess());
    } catch (e) {
      console.log(e);
      dispatch(resetPasswordFail(e.response.data.message));
    }
  };
export const addCoins = (coins) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    dispatch(addCoinsReq());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/users/addCoins",
      { coins },
      config
    );
    dispatch(addCoinsSuc(data.data.coinBalance));
  } catch (e) {
    console.log(e);
    dispatch(resetPasswordFail(e.response.data.message));
  }
};
export const loginSlice = createSlice({
  name: "USER",
  initialState,
  reducers: {
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
    },
    loginFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    registerRequest(state, action) {
      state.loading = true;
      state.isRegistered = false;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isRegistered = true;
    },
    registerFail(state, action) {
      state.loading = false;
      state.isRegistered = false;
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFail(state, action) {
      state.error = action.payload;
    },
    loadUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    loadUserFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    loadUserSuccess(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
    },
    changePasswordRequest(state, action) {
      state.loading = true;
    },
    changePasswordSuccess(state, action) {
      state.loading = false;
    },
    changePasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateAvatarRequest(state, action) {
      state.loading = true;
    },
    updateAvatarSuccess(state, action) {
      state.loading = false;
    },
    updateAvatarFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateDetailsRequest(state, action) {
      state.loading = true;
    },
    updateDetailsSuccess(state, action) {
      state.loading = false;
    },
    updateDetailsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
    },
    forgotPasswordRequest(state, action) {
      state.loading = true;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state, action) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
    },
    resetPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors(state, action) {
      state.error = null;
    },
    addCoinsReq(state, action) {
      state.loading = true;
    },
    addCoinsSuc(state, action) {
      state.coins = action.payload;
      state.loading = false;
    },
  },
});
export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearErrors,
  registerSuccess,
  registerRequest,
  registerFail,
  logoutSuccess,
  logoutFail,
  loadUserRequest,
  loadUserFail,
  loadUserSuccess,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFail,
  updateAvatarRequest,
  updateAvatarSuccess,
  updateAvatarFail,
  updateDetailsFail,
  updateDetailsRequest,
  updateDetailsSuccess,
  forgotPasswordSuccess,
  forgotPasswordRequest,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  addCoinsReq,
  addCoinsSuc,
} = loginSlice.actions;
export default loginSlice.reducer;

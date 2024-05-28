import React, { useEffect, useState } from "react";
import styles from "./register.module.css";
import { defaultValues } from "../Constants/defaultValues";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Container from "@mui/material/Container";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../../Redux/user/userSlice";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { clearErrors } from "../../../Redux/user/userSlice";
import Notification from "../common/Notification";
const Login = () => {
  const fields = ["Username or Email", "Password"];
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPasswordField, setShowPasswordField] = useState(false);
  const { user, loading, isAuthenticated, error } = useSelector(
    (state) => state.USER
  );
  const handleSubmit = (username, password) => {
    if (username && password) {
      dispatch(loginAction(username, password));
    }
  };
  const location = useLocation();
  useEffect(() => {
    if (error) {
      Notification(error, "danger");
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      Notification("Login successful", "success");
      navigate("/profile");
    }
  }, [dispatch, isAuthenticated, error]);

  return (
    <>
      <Container maxWidth="sm" className={styles.outer}>
        <div className={styles.text}>
          <h3>{defaultValues.loginTitle}</h3>
        </div>
        <div className={styles.inputContainer}>
          {fields.map((field) => {
            const isPasswordField = field.toLowerCase() === "password";
            return (
              <TextField
                key={field}
                id="outlined-basic"
                label={field}
                variant="outlined"
                autoComplete="off"
                required
                onChange={(e) =>
                  isPasswordField
                    ? setPassword(e.target.value)
                    : setUsername(e.target.value)
                }
                value={isPasswordField ? password : username}
                type={
                  isPasswordField
                    ? showPasswordField
                      ? "text"
                      : "password"
                    : "text"
                }
                InputProps={
                  isPasswordField
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPasswordField(!showPasswordField)
                              }
                              edge="end"
                            >
                              {showPasswordField ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
                sx={{ margin: "10px" }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            Forgot Password
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => handleSubmit(username, password)}
            sx={{ margin: "10px" }}
          >
            {defaultValues.loginButtonTitle}
          </Button>
        </div>
        <Snackbar
          open={visible}
          autoHideDuration={4000}
          TransitionComponent={Slide}
        >
          {error ? (
            <Alert
              severity="error"
              sx={{ width: "100%", display: "flex", alignItems: "center" }}
            >
              {error}
              <Button
                sx={{ alignSelf: "flex-end" }}
                onClick={() => {
                  dispatch(clearErrors());
                  setVisible(false);
                }}
              >
                <CloseIcon />
              </Button>
            </Alert>
          ) : null}
        </Snackbar>
      </Container>
    </>
  );
};

export default Login;

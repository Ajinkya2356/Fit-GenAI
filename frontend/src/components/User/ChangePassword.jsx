import React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { defaultValues } from "../Constants/defaultValues";
import { useDispatch, useSelector } from "react-redux";
import {
  changePasswordAction,
  clearErrors,
} from "../../../Redux/user/userSlice";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
const ChangePassword = () => {
  const fields = ["Old Password", "New Password"];
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, loading, isAuthenticated, error } = useSelector(
    (state) => state.USER
  );
  const handleSubmit = (newPassword, oldPassword) => {
    if (newPassword && oldPassword) {
      dispatch(changePasswordAction(newPassword, oldPassword));
    }
  };
  useEffect(() => {
    if (error) {
      setVisible(true);
    }
    if (isAuthenticated == false) {
      navigate("/");
    }
  }, [dispatch, isAuthenticated, error]);
  
  return (
    <>
      <Container maxWidth="sm" className={styles.outer}>
        <div className={styles.text}>
          <h3>{defaultValues.changePasswordTitle}</h3>
        </div>
        <div className={styles.inputContainer}>
          {fields.map((field) => {
            const isPasswordField = field === "New Password";

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
                    ? setNewPassword(e.target.value)
                    : setOldPassword(e.target.value)
                }
                value={isPasswordField ? newPassword : oldPassword}
                type={showPassword ? "password" : "text"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ margin: "10px" }}
              />
            );
          })}
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => handleSubmit(newPassword, oldPassword)}
            sx={{ margin: "10px" }}
          >
            {defaultValues.changePasswordTitle}
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

export default ChangePassword;

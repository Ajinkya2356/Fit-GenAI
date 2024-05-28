import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { defaultValues } from "../Constants/defaultValues";
import { useDispatch, useSelector } from "react-redux";
import styles from "./register.module.css";
import {
  clearErrors,
  resetPasswordAction,
} from "../../../Redux/user/userSlice";
import Notification from "../common/Notification";
const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, passwordReset } = useSelector((state) => state.USER);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (newP, confirm) => {
    if (newP && confirm) {
      dispatch(resetPasswordAction(newP, confirm, token));
    }
  };
  useEffect(() => {
    if (error) {
      Notification(error, "danger");
      dispatch(clearErrors());
    }
    if (passwordReset) {
      Notification("Password reset successfully", "success");
      navigate("/login");
    }
  }, [error, passwordReset]);
  return (
    <Container maxWidth="sm" className={styles.outer}>
      <div className={styles.text}>
        <h3>{defaultValues.resetPasswordTitle}</h3>
      </div>
      <div className={styles.inputContainer}>
        <TextField
          id="outlined-basic"
          label={"New Password"}
          variant="outlined"
          autoComplete="off"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ margin: "10px" }}
        />
        <TextField
          id="outlined-basic"
          label={"Confirm Password"}
          variant="outlined"
          autoComplete="off"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ margin: "10px" }}
        />
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => handleSubmit(newPassword, confirmPassword)}
          sx={{ margin: "10px" }}
        >
          {defaultValues.resetPasswordButtonText}
        </Button>
      </div>
    </Container>
  );
};

export default ResetPassword;

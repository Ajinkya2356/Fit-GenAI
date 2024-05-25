import React from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { defaultValues } from "../Constants/defaultValues";
import { useDispatch } from "react-redux";
import styles from "./register.module.css";
import { resetPasswordAction } from "../../../Redux/user/userSlice";
const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  console.log(token);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (newP, confirm) => {
    if (newP && confirm) {
      dispatch(resetPasswordAction(newP, confirm,token));
    }
  };
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

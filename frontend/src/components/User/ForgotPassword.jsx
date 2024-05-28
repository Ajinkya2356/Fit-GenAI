import React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { defaultValues } from "../Constants/defaultValues";
import { useDispatch, useSelector } from "react-redux";
import styles from "./register.module.css";
import {
  clearErrors,
  forgotPasswordAction,
} from "../../../Redux/user/userSlice";
import Notification from "../common/Notification";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isEmailSent } = useSelector((state) => state.USER);
  const [email, setEmail] = useState("");
  const handleSubmit = (email) => {
    if (email) {
      dispatch(forgotPasswordAction(email));
    }
  };
  useEffect(() => {
    if (error) {
      Notification(error, "danger");
      dispatch(clearErrors());
    }
    if (isEmailSent) {
      Notification("Check E-mail for reseting password", "success");
      navigate("/");
    }
  }, [error, isEmailSent]);
  return (
    <Container maxWidth="sm" className={styles.outer}>
      <div className={styles.text}>
        <h3>{defaultValues.forgotPasswordTitle}</h3>
      </div>
      <div className={styles.inputContainer}>
        <TextField
          id="outlined-basic"
          label={"Email"}
          variant="outlined"
          autoComplete="off"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ margin: "10px" }}
        />
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => handleSubmit(email)}
          sx={{ margin: "10px" }}
        >
          {defaultValues.forgotPasswordButtonText}
        </Button>
      </div>
    </Container>
  );
};

export default ForgotPassword;

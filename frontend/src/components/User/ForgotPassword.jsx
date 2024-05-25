import React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { defaultValues } from "../Constants/defaultValues";
import { useDispatch } from "react-redux";
import styles from "./register.module.css";
import { forgotPasswordAction } from "../../../Redux/user/userSlice";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const handleSubmit = (email) => {
    if (email) {
      dispatch(forgotPasswordAction(email));
    }
  };
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

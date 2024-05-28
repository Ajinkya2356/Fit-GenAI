import React, { useEffect, useState } from "react";
import styles from "./register.module.css";
import { defaultValues } from "../Constants/defaultValues";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import { useDispatch } from "react-redux";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerAction, clearErrors } from "../../../Redux/user/userSlice";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Notification from "../common/Notification";
const Register = () => {
  const fields = ["Name", "Username", "Email", "Password"];
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
  const { loading, error, isRegistered } = useSelector((state) => state.USER);
  const user = {
    name,
    username,
    email,
    password,
    avatar,
  };
  const [showPasswordField, setShowPasswordField] = useState(false);
  // console.log(user);
  useEffect(() => {
    if (isRegistered) {
      Notification("Registration Successful", "success");
      navigate("/login");
    }
    if (error) {
      Notification(error, "danger");
      dispatch(clearErrors());
    }
  }, [error, dispatch, isRegistered]);
  return (
    <>
      <Container maxWidth="sm" className={styles.outer}>
        <div className={styles.text}>
          <h3>{defaultValues.registerTitle}</h3>
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
                value={
                  field === "Name"
                    ? name
                    : field === "Username"
                    ? username
                    : field === "Email"
                    ? email
                    : password
                }
                onChange={(event) => {
                  if (field === "Name") {
                    setName(event.target.value);
                  } else if (field === "Username") {
                    setUsername(event.target.value);
                  } else if (field === "Email") {
                    setEmail(event.target.value);
                  } else {
                    setPassword(event.target.value);
                  }
                }}
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
                                isPasswordField
                                  ? setShowPasswordField(!showPasswordField)
                                  : null
                              }
                              edge="end"
                            >
                              {isPasswordField ? (
                                showPasswordField ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )
                              ) : null}
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
        <div>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            sx={{ margin: "10px", justifyContent: "center" }}
          >
            {file && <img src={file} alt="avatar" className={styles.img} />}
            <CloudUploadIcon />
            &nbsp;&nbsp;{defaultValues.fileButtonText}
            <Input
              type="file"
              sx={{ display: "none" }}
              accept=".jpg,.png,.jpeg"
              onChange={(event) => {
                const file = event.target.files[0];
                setAvatar(file);
                setFile(URL.createObjectURL(file));
              }}
            />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(registerAction(user));
            }}
            sx={{ margin: "10px" }}
          >
            {defaultValues.registerButtonText}
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
export default Register;

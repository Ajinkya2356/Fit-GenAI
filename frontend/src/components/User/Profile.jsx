import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch } from "react-redux";
import {
  changeAvatar,
  clearErrors,
  updateDetails,
} from "../../../Redux/user/userSlice";
import { CircularProgress } from "@mui/material";
import Notification from "../common/Notification";
const Profile = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.USER
  );
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.user?.name);
  const [username, setUsername] = useState(user?.user?.username);
  const [email, setEmail] = useState(user?.user?.email);
  const [createdAt, setCreatedAt] = useState(user?.user?.createdAt);
  const NameToState = {
    Name: setName,
    Username: setUsername,
    Email: setEmail,
    "Created At": setCreatedAt,
  };
  const StateToName = {
    Name: name,
    Username: username,
    Email: email,
    "Created At": createdAt,
  };
  const userData = {
    name,
    username,
    email,
    createdAt,
  };
  const [avatar, setAvatar] = useState(user?.user?.avatar);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const isUpdated = () => {
    if (user) {
      if (
        user.user.name !== name ||
        user.user.username !== username ||
        user.user.email !== email
      ) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (error) {
      Notification(error, "danger");
      dispatch(clearErrors());
    }
  }, [navigate, isAuthenticated, error]);
  if (loading || !user) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 5,
        }}
      >
        <Typography variant="h4" gutterBottom margin={"5%"}>
          My Profile
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            border: "1px solid gray",
            padding: 5,
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Avatar
              src={avatar}
              sx={{
                width: 100,
                height: 100,
                margin: "1rem",
              }}
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              <CloudUploadIcon />
              &nbsp;Update Avatar
              <Input
                type="file"
                sx={{ display: "none" }}
                accept=".jpg,.png,.jpeg"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setAvatar(URL.createObjectURL(file));
                  setFile(file);
                }}
              />
            </Button>
          </Box>
          <Box
            sx={{
              margin: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {Object.keys(NameToState).map((key, index) => {
              return (
                <TextField
                  key={index}
                  id="outlined-basic"
                  label={key}
                  variant="outlined"
                  readOnly={key === "createdAt"}
                  value={
                    key == "createdAt"
                      ? FormalDate(createdAt)
                      : StateToName[key]
                  }
                  onChange={(e) => {
                    if (key !== "createdAt") NameToState[key](e.target.value);
                  }}
                  sx={{ margin: "1rem", width: "100%" }}
                />
              );
            })}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "1rem" }}
                onClick={() => {
                  if (file !== null) {
                    dispatch(changeAvatar(file));
                  }
                  if (user && isUpdated()) {
                    dispatch(updateDetails(userData));
                    Notification("Profile Updated Successfully", "success");
                  }
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ margin: "1rem" }}
                onClick={() => {
                  setAvatar(user?.user?.avatar);
                  setName(user?.user?.name);
                  setUsername(user?.user?.username);
                  setEmail(user?.user?.email);
                  setCreatedAt(user?.user?.createdAt);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Profile;

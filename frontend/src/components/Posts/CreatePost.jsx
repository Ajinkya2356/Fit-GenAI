import { Button, Container, TextField, Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getSinglePost,
  updatePost,
} from "../../../Redux/posts/postSlice";
const CreatePost = ({ setDrawer }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [fileName, setFileName] = useState("");
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        minWidth: "300px",
      }}
    >
      <h1>Create Post</h1>
      <TextField
        variant="standard"
        label="Name"
        fullWidth
        onChange={(e) => {
          setData({ ...data, name: e.target.value });
        }}
      />
      <TextField
        variant="standard"
        label="Content"
        fullWidth
        multiline
        rows={4}
        onChange={(e) => {
          setData({ ...data, content: e.target.value });
        }}
      />
      <Button
        variant="contained"
        component="label"
        role={undefined}
        tabIndex={-1}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Input
          type="file"
          sx={{ display: "none" }}
          accept=".jpg,.png,.jpeg"
          onChange={(event) => {
            const file = event.target.files[0];
            setFileName(file.name);
            setData({ ...data, image: file });
          }}
        />
        <CloudUploadIcon />
        {fileName !== "" ? fileName : "Upload Image"}
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(createPost(data));
          setDrawer(false);
        }}
      >
        Create Post
      </Button>
    </Container>
  );
};

export default CreatePost;

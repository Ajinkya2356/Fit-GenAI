import { Button, Container, TextField, Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePost, updatePost } from "../../../Redux/posts/postSlice";
const UpdatePost = ({ setDrawer, postId }) => {
  const dispatch = useDispatch();
  const { post, posts } = useSelector((state) => state.POSTS);
  const initialData = posts.filter((p) => {
    return p._id === postId;
  });
  const [data, setData] = useState(initialData);
  const [fileName, setFileName] = useState("");
  useEffect(() => {
    if (postId) {
      dispatch(getSinglePost(postId));
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      setData(post);
    }
  }, [post]);
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        minWidth: "400px",
      }}
    >
      <h1>Update Post</h1>
      <TextField
        variant="standard"
        label="Name"
        fullWidth
        value={data.name}
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
        value={data.content}
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
          dispatch(updatePost(data, postId));
          setDrawer(false);
        }}
      >
        Update Post
      </Button>
    </Container>
  );
};

export default UpdatePost;

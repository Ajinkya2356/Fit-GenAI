import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Drawer,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../Redux/posts/postSlice";
import PostCard from "./PostCard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CreatePost from "./CreatePost";
const Posts = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [ascending, setAscending] = useState(false);
  const [descending, setDescending] = useState(false);
  const { posts, loading } = useSelector((state) => state.POSTS);
  const [drawer, setDrawer] = useState(false);
  const handleDrawerClick = () => {
    setDrawer((drawer) => !drawer);
  };
  useEffect(() => {
    dispatch(getPosts(keyword, ascending, descending));
  }, [keyword, ascending, descending]);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <Container
      maxWidth={false}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#333",
      }}
    >
      <Box
        style={{
          alignSelf: "flex-end",
          margin: "20px 0",
        }}
      >
        <Button onClick={handleDrawerClick} variant="contained">
          <Typography>Create Post</Typography>
        </Button>
      </Box>
      <Drawer onClose={handleDrawerClick} open={drawer} anchor="right">
        <CreatePost setDrawer={setDrawer} />
      </Drawer>
      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            margin: "20px 0",
          }}
        >
          <IconButton
            onClick={() => {
              setCurrentIndex(
                currentIndex - 1 < 0 ? posts.length - 1 : currentIndex - 1
              );
            }}
          >
            <ArrowCircleLeftIcon style={{ color: "white" }} />
          </IconButton>
          <PostCard post={posts[currentIndex]} />
          <IconButton
            onClick={() => {
              setCurrentIndex(
                currentIndex + 1 > posts.length - 1 ? 0 : currentIndex + 1
              );
            }}
          >
            <ArrowCircleRightIcon style={{ color: "white" }} />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default Posts;

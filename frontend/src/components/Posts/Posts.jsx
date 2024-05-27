import React, { useState, useEffect } from "react";
import { Container, Box, Drawer, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../Redux/posts/postSlice";
import PostCard from "./PostCard";
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
          Create Post
        </Button>
      </Box>
      <Drawer onClose={handleDrawerClick} open={drawer} anchor="right">
        <CreatePost setDrawer={setDrawer} />
      </Drawer>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {posts.map((post, index) => {
          return <PostCard post={post} key={index} />;
        })}
      </Box>
    </Container>
  );
};

export default Posts;

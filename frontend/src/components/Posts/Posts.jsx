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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignSelf: "flex-start",
            margin: "20px",
            width: "60%",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            label="Search"
            value={keyword}
            InputLabelProps={{
              style: {
                color: "#fff",
              },
            }}
            InputProps={{
              style: {
                color: "#fff",
                borderBottom: "1px solid white",
              },
            }}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Box>
        <Box
          style={{
            margin: "20px",
            padding: "10px",
            flex: 1,
          }}
        >
          <FormControl>
            <InputLabel
              style={{
                color: "white",
              }}
            >
              Sort By
            </InputLabel>
            <Select
              onChange={(e) => {
                if (e.target.value === "ascending") {
                  setAscending(true);
                  setDescending(false);
                } else if (e.target.value === "descending") {
                  setDescending(true);
                  setAscending(false);
                }
              }}
              style={{
                color: "white",
                border: "1px solid white",
                minWidth: "120px",
              }}
            >
              <MenuItem value="descending">Recently Added</MenuItem>
              <MenuItem value="ascending">Reset</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <IconButton onClick={handleDrawerClick}>
          <PostAddIcon style={{ color: "white" }} />
        </IconButton>
        <Drawer onClose={handleDrawerClick} open={drawer} anchor="right">
          <CreatePost setDrawer={setDrawer} />
        </Drawer>
      </Box>

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
            gap: 10,
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

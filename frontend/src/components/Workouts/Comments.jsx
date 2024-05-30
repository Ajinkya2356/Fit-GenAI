import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Typography,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  clearErrors,
  deleteComment,
  getWorkoutComments,
} from "../../../Redux/comment/commentSlice";
import { Rating } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Notification from "../common/Notification";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const Comments = ({ id }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWorkoutComments(id));
    if (error) {
      Notification(error, "danger");
      dispatch(clearErrors());
    }
  }, [dispatch, id]);
  const { comments, loading, error } = useSelector((state) => state.COMMENT);
  const [display, setDisplay] = useState(false);
  const [comment, setComment] = useState({
    message: "",
    rating: 0,
  });
  return loading ? (
    <Box>
      <CircularProgress />
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: "20px",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" color="text.primary">
          Comments
        </Typography>
        <IconButton onClick={() => setDisplay((prev) => !prev)}>
          <AddCommentIcon />
        </IconButton>
      </Box>
      {display && (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <TextField
            label="Add your comments here"
            variant="standard"
            multiline
            rows={5}
            style={{
              width: "50%",
            }}
            value={comment.message}
            onChange={(e) => {
              setComment({ ...comment, message: e.target.value });
            }}
          />
          <Rating
            name="half-rating-read"
            precision={0.5}
            value={comment.rating}
            style={{
              fontSize: "20px",
            }}
            onChange={(e) => {
              setComment({ ...comment, rating: e.target.value });
            }}
          />
          <Button
            variant="contained"
            style={{
              alignSelf: "flex-end",
            }}
            onClick={() => {
              dispatch(addComment(id, comment.rating, comment.message));
              Notification("Comment Added successfully", "success");
              setDisplay(false);
            }}
          >
            Post
          </Button>
        </Box>
      )}
      {comments.map((comment, index) => (
        <Card
          key={index}
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
          }}
        >
          <CardHeader
            avatar={<Avatar src={comment.user.avatar} />}
            title={comment.user.username}
            subheader={
              <Rating
                name="half-rating-read"
                value={comment.rating}
                precision={0.5}
                readOnly
                style={{
                  fontSize: "20px",
                }}
              />
            }
            action={
              <Box>
                <IconButton
                  onClick={() => {
                    setDisplay(true);
                    setComment({
                      message: comment.message,
                      rating: comment.rating,
                    });
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    dispatch(deleteComment(comment._id, id));
                    setComment({ message: "", rating: 0 });
                    Notification("Comment Deleted Successfully", "success");
                  }}
                >
                  <DeleteIcon style={{ color: "red" }} />
                </IconButton>
              </Box>
            }
            titleTypographyProps={{
              style: {
                fontSize: "20px",
              },
            }}
          />
          <CardContent>
            <Typography variant="body1">{comment.message}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Comments;

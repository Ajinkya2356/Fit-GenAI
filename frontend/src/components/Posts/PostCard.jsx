import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MessageIcon from "@mui/icons-material/Message";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FormalDate } from "../Challenge/Card";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Box, TextField, Button, Drawer } from "@mui/material";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likePost,
  dislikePost,
  deletePost,
} from "../../../Redux/posts/postSlice";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import UpdatePost from "./UpdatePost";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

export default function PostCard({ post }) {
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();
  const handleExpandClick = () => {
    setExpanded(!expanded);
    dispatch(getComments(post._id));
  };
  const [open, setOpen] = React.useState(false);
  const handleCommentClick = () => {
    setOpen(!open);
    setComment("");
  };
  const [drawer, setDrawer] = React.useState(false);
  const handleDrawerClick = () => {
    setDrawer((drawer) => !drawer);
  };
  const [comment, setComment] = React.useState("");
  const [update, setUpdate] = React.useState(false);
  const [commentId, setCommentId] = React.useState(null);
  const { user } = useSelector((state) => state.USER);
  const { postComments, loading } = useSelector((state) => state.POSTS);
  const liked = post?.likes?.includes(user?.user?._id);
  const disliked = post?.dislikes?.includes(user?.user?._id);

  return (
    <Card sx={{ width: 345, height: "auto" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={post?.createdBy.avatar}
          ></Avatar>
        }
        action={
          post?.createdBy._id === user?.user?._id ? (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton onClick={handleDrawerClick}>
                <EditIcon />
              </IconButton>
              <Drawer onClose={handleDrawerClick} open={drawer} anchor="right">
                <UpdatePost setDrawer={setDrawer} postId={post?._id} />
              </Drawer>
              <IconButton
                onClick={() => {
                  dispatch(deletePost(post?._id));
                }}
              >
                <DeleteIcon style={{ color: "red" }} />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <IconButton></IconButton>
            </Box>
          )
        }
        title={post?.createdBy.name}
        subheader={FormalDate(post?.createdAt)}
      />
      <CardMedia
        component="img"
        height="194"
        image={post?.image}
        alt="Paella dish"
        style={{
          objectFit: "contain",
        }}
      />
      <CardContent>
        <Typography variant="h5" color="text.primary">
          {post?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post?.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              dispatch(likePost(post._id));
            }}
          >
            {liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
          </IconButton>
          <Typography variant="h6">{post?.likes.length}</Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              dispatch(dislikePost(post?._id));
            }}
          >
            {disliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
          </IconButton>
          <Typography variant="h6">{post?.dislikes.length}</Typography>
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <MessageIcon />
        </ExpandMore>
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        style={{
          borderTop: "1px solid gray",
        }}
      >
        <CardContent style={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            onClick={handleCommentClick}
            style={{
              alignSelf: "flex-end",
            }}
          >
            <AddCommentIcon />
          </IconButton>
          {open && (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                variant="standard"
                label="comment"
                style={{
                  flex: 1,
                }}
              />
              <Button
                onClick={() => {
                  if (update && commentId) {
                    dispatch(updateComment(comment, post._id, commentId));
                    setOpen(false);
                    setCommentId(null);
                    setUpdate(false);
                    setComment("");
                    return;
                  }
                  dispatch(createComment(comment, post._id));
                  setOpen(false);
                }}
              >
                POST
              </Button>
            </Box>
          )}

          {postComments.map((comment,index) => {
            return (
              <Box
                key={index}
                style={{
                  border: "1px solid gray",
                  display: "flex",
                  flexDirection: "column",
                  margin: "10px 0",
                  padding: "5px",
                  borderRadius: "10px",
                  gap: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",

                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar src={comment.createdBy.avatar}></Avatar>
                    <Typography>{comment.createdBy.name}</Typography>
                  </div>
                  {user?.user && user?.user?._id === comment.createdBy._id && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setOpen(true);
                          setComment(comment.content);
                          setUpdate(true);
                          setCommentId(comment._id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          dispatch(deleteComment(post._id, comment._id));
                        }}
                      >
                        <DeleteIcon
                          style={{
                            color: "red",
                          }}
                        />
                      </IconButton>
                    </div>
                  )}
                </Box>
                <Typography>{comment.content}</Typography>
              </Box>
            );
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
}

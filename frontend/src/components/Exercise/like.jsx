import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useDispatch, useSelector } from "react-redux";
import {
  dislikeAction,
  likeAction,
} from "../../../Redux/exercise/exerciseSlice";

const Like = ({ item, color }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.USER);
  const [liked, setLiked] = useState(item?.likedBy.includes(user?.user?._id));
  const [disliked, setDisliked] = useState(
    item?.dislikedBy.includes(user?.user?._id)
  );
  const [likeCount, setLikeCount] = useState(item?.likedBy?.length || 0);
  const [dislikeCount, setDislikeCount] = useState(
    item?.dislikedBy?.length || 0
  );
  useEffect(() => {
    setLiked(item?.likedBy.includes(user?.user?._id));
    setDisliked(item?.dislikedBy.includes(user?.user?._id));
    setLikeCount(item?.likedBy?.length || 0);
    setDislikeCount(item?.dislikedBy?.length || 0);
  }, [item, user]);
  return (
    <>
      <IconButton
        style={{ gap: 5, color: color }}
        onClick={() => {
          setLiked(true);
          setDisliked(false);
          setLikeCount((prevCount) => prevCount + 1);
          setDislikeCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
          dispatch(likeAction(item?._id));
        }}
      >
        {liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
        {likeCount}
      </IconButton>
      <IconButton
        style={{ gap: 5, color: color }}
        onClick={() => {
          setLiked(false);
          setDisliked(true);
          setLikeCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
          setDislikeCount((prevCount) => prevCount + 1);
          dispatch(dislikeAction(item?._id));
        }}
      >
        {disliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
        {dislikeCount}
      </IconButton>
    </>
  );
};

export default Like;

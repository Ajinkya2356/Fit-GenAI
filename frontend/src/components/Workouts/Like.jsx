import React, { useEffect } from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useDispatch, useSelector } from "react-redux";
import {
  likeAction,
  dislikeAction,
} from "../../../Redux/exercise/exerciseSlice";
import { useState } from "react";
const Like = ({ exercise, workoutId }) => {
  const dispatch = useDispatch();
  const { workout } = useSelector((state) => state.WORKOUT);
  const { user } = useSelector((state) => state.USER);
  const liked = exercise.exercise.likedBy.includes(user?.user?._id);
  const disliked = exercise.exercise.dislikedBy.includes(user?.user?._id);
  const [flag,setFlag]=useState(false)
  useEffect(() => {
    setFlag(false)
  }, [liked, disliked, exercise, flag]);
  console.log("render")
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignSelf: "flex-end",
        /* border:"2px solid white", */
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
        }}
        onClick={() => {
          dispatch(likeAction(exercise.exercise._id));
            setFlag(true)
        }}
      >
        <ThumbUpOffAltIcon /> {exercise.exercise.likedBy.length}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
        }}
        onClick={() => {
          dispatch(dislikeAction(exercise.exercise._id));
          setFlag(true)
        }}
      >
        <ThumbDownOffAltIcon /> {exercise.exercise.dislikedBy.length}
      </div>
    </div>
  );
};

export default Like;

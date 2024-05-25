import React, { useEffect } from "react";
import { Chip, Container, Typography } from "@mui/material";
const colorMap = {
  beginner: "#00FF00",
  intermediate: "#FFA500",
  advanced: "#FF0000",
};
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ScaleIcon from "@mui/icons-material/Scale";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useDispatch } from "react-redux";
import {
  likeAction,
  dislikeAction,
} from "../../../Redux/exercise/exerciseSlice";
import Like from "./Like";

const ExerciseCard = ({ exercise, ind, workoutId }) => {
  const dispatch = useDispatch();

  return (
    <Container
      sx={{
        margin: "20px 0 ",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          /* flexWrap:"wrap", */
          gap: "5%",
        }}
      >
        <Typography
          variant="body1"
          color="black"
          sx={{
            backgroundColor: "white",
            padding: "2%",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {exercise.exercise.name}
          </div>
          <img
            src={exercise.exercise.image_url[0]}
            style={{
              width: "100%",
              height: "100px",

              alignSelf: "center",
            }}
          />
          <div>{exercise.exercise.description}</div>
          <Chip
            sx={{
              backgroundColor: colorMap[exercise.exercise.difficulty_level],
            }}
            label={exercise.exercise.difficulty_level.toUpperCase()}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FitnessCenterIcon />
            Sets : {exercise.sets}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <DirectionsRunIcon />
            Reps : {exercise.reps}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ScaleIcon />
            Weights : {exercise.weight}
          </div>
        </Typography>
        <div
          style={{
            /* border:"2px solid white", */
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            width: "60%",
            boxShadow: "0px 3px 10px #FFFFFF",
          }}
        >
          <video controls width="100%" style={{ borderRadius: 20 }}>
            <source src={exercise.exercise?.video_url} type="video/webm" />
          </video>
        </div>
      </div>
    </Container>
  );
};

export default ExerciseCard;

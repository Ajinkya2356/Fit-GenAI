import React, { useEffect } from "react";
import { Box, Chip, Container, Typography } from "@mui/material";
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
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import {
  likeAction,
  dislikeAction,
} from "../../../Redux/exercise/exerciseSlice";
import Like from "./Like";

const ExerciseCard = ({ exercise, ind, workoutId }) => {
  const dispatch = useDispatch();
  console.log(exercise);
  return (
    <Container
      sx={{
        margin: "20px 0 ",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        cursor: "pointer",
        justifyContent: "center",
        backgroundColor: "#444",
        borderRadius: "10px",
        /* border: "2px solid white" */
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",

          gap: "5%",
          justifyContent: "center",
          alignItems: "center",

          /* border: "2px solid white", */
        }}
      >
        <div style={{ maxWidth: "100%" }}>
          <div
            style={{
              fontSize: "2em",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {exercise.exercise.name}
          </div>
          <ReactPlayer
            url={exercise.exercise.video_url}
            controls={true}
            light={
              <img
                src={exercise.exercise.image_url[0]}
                style={{
                  borderRadius: "10px",
                  maxWidth: "100%",
                }}
              />
            }
            style={{
              borderRadius: "20px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              margin: "10px 0px",
              maxWidth: "100%",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            /* maxWidth:"50%", */
            flex: 1,
            gap: "10px",

            /* border:"2px solid white" */
          }}
        >
          <Typography variant="body1">
            {exercise.exercise.description}
          </Typography>
          <Chip
            sx={{
              backgroundColor: colorMap[exercise.exercise.difficulty_level],
            }}
            label={exercise.exercise.difficulty_level.toUpperCase()}
          />
          <Box
            style={{
              display: "flex",
              gap: "10%",
              /* justifyContent: "center", */
              padding: 10,
              flexWrap: "wrap",
              /* alignItems: "center", */
             /*  border: "2px solid white", */
            }}
          >
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
          </Box>
        </div>
      </div>
    </Container>
  );
};

export default ExerciseCard;

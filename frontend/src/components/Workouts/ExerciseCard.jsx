import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ScaleIcon from "@mui/icons-material/Scale";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useDispatch } from "react-redux";
import {
  likeAction,
  dislikeAction,
} from "../../../Redux/exercise/exerciseSlice";

const colorMap = {
  beginner: "#00FF00",
  intermediate: "#FFA500",
  advanced: "#FF0000",
};

const ExerciseCard = ({ exercise, ind, workoutId }) => {
  const dispatch = useDispatch();

  return (
    <Card
      sx={{
        margin: "20px 0",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CardMedia
            component="video"
            controls
            src={exercise.exercise?.video_url}
            style={{ borderRadius: "0px 0px 10px 10px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Typography variant="h5" component="div">
              {exercise.exercise.name}
            </Typography>
            <CardMedia
              component="img"
              image={exercise.exercise.image_url[0]}
              style={{ width: "100%", height: "auto" }}
            />
            <Typography variant="body2" color="text.secondary">
              {exercise.exercise.description}
            </Typography>
            <Chip
              sx={{
                backgroundColor: colorMap[exercise.exercise.difficulty_level],
              }}
              label={exercise.exercise.difficulty_level.toUpperCase()}
            />
            <Grid container spacing={1} direction="column">
              <Grid item xs={4}>
                <FitnessCenterIcon /> Sets: {exercise.sets}
              </Grid>
              <Grid item xs={4}>
                <DirectionsRunIcon /> Reps: {exercise.reps}
              </Grid>
              <Grid item xs={4}>
                <ScaleIcon /> Weights: {exercise.weight}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ExerciseCard;

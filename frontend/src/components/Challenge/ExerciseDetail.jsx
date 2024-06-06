import {
  Chip,
  Container,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import getContrast from "../common/getRandomColor";
const ExerciseDetail = ({ exercise }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const difficulty_levelToColorMap = {
    beginner: "green",
    intermediate: "orange",
    advanced: "red",
  };
  const { loading } = useSelector((state) => state.CHALLENGE);
  const bgColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h5"
              style={{
                color: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {exercise.name}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={exercise.category?.[0].name}
                style={{
                  backgroundColor: bgColor,
                  color: getContrast(bgColor),
                }}
              />
              <Chip
                label={exercise.difficulty_level.toUpperCase()}
                style={{
                  backgroundColor:
                    difficulty_levelToColorMap[
                      exercise.difficulty_level.toLowerCase()
                    ],
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexWrap:"wrap"
            }}
          >
            <div style={{flex:1 }}>
              <div>
                <video
                  controls
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                >
                  <source src={exercise.video_url} type="video/mp4" />
                  Your browser does not support the video tag, or the video
                  cannot be played.
                </video>
              </div>
            </div>
            <Typography
              variant="body1"
              style={{
                color: "white",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px",
              }}
              textOverflow={"ellipsis"}
            >
              {exercise.description}&nbsp;&nbsp;
              <IconButton
                onClick={() => {
                  navigate(`/exercise/${exercise._id}`);
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Typography>
          </div>
        </>
      )}
    </Container>
  );
};

export default ExerciseDetail;

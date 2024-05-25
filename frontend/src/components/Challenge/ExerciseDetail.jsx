import {
  Chip,
  Container,
  Typography,
  Switch,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useDispatch, useSelector } from "react-redux";
import {
  completeTask,
  getChallengeTask,
  getTask,
} from "../../../Redux/challenge/challengeSlice";
import { addCoins } from "../../../Redux/user/userSlice";
const ExerciseDetail = ({ exercise }) => {
  const dispatch = useDispatch();
  const difficulty_levelToColorMap = {
    beginner: "green",
    intermediate: "orange",
    advanced: "red",
  };
  const { loading } = useSelector((state) => state.CHALLENGE);
  /*  
  useEffect(() => {
    if (!currentTask) {
      dispatch(getTask(id));
    }
  }, [dispatch, id, currentTask]);
  console.log(currentTask); */
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
              }}
            >
              <Typography
                variant="body2"
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <ThumbUpOffAltIcon style={{ color: "white" }} />
                {exercise.likedBy.length}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <ThumbDownOffAltIcon style={{ color: "white" }} />
                {exercise.dislikedBy.length}
              </Typography>
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
            }}
          >
            <div style={{ maxWidth: "50%" }}>
              <Carousel
                showStatus={false}
                showIndicators={false}
                showArrows={false}
                autoPlay={true}
                infiniteLoop={true}
                showThumbs={false}
              >
                {exercise.image_url.map((picture, index) => {
                  return (
                    <div key={index}>
                      <img
                        src={picture}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "20px",
                        }}
                        alt="exercise"
                      />
                    </div>
                  );
                })}
              </Carousel>
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
              <Link
                style={{
                  color: "white",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                to={`/exercise/${exercise._id}`}
              >
                Learn More
              </Link>
            </Typography>
          </div>
        </>
      )}
    </Container>
  );
};

export default ExerciseDetail;

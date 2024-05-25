import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ReactPlayer from "react-player";
import { Slide } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import { getExerciseAction } from "../../../Redux/exercise/exerciseSlice";
const Section = () => {
  const videos = [
    "https://youtu.be/sDEZSFNQmP0?si=grLPg1jKSPW-iZQH",
    "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getExerciseAction("", ""));
  }, []);
  const { exercises } = useSelector((state) => state.EXERCISE);
  console.log(exercises);
  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        height: "auto",
        width: "100%",
        padding: "10px",
        borderRadius: "20px",
        margin: "10px 0",
      }}
    >
      <Typography variant="h4" color="white">
        <Slide>Elevate Your Fitness Journey to New Heights</Slide>
      </Typography>
      <Box display="flex" flexDirection="column" padding="5%">
        {exercises.slice(3).map((item, index) => (
          <Box
            key={index}
            display="flex"
            margin="10px"
            flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
          >
            <ReactPlayer
              url={item.video_url}
              width="50%"
              height="250px"
              controls
            />

            <Typography variant="p" color="white" flex="1">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  /* border: "2px solid red", */
                  height: "250px",
                }}
              >
                {item.description}
              </div>
            </Typography>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Section;

import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleExercise } from "../../../Redux/exercise/exerciseSlice";
import { useDispatch, useSelector } from "react-redux";
import { Chip, Drawer } from "@mui/material";
import Like from "./like";
import { Carousel } from "react-responsive-carousel";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import BoltIcon from "@mui/icons-material/Bolt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StepDetail from "./StepDetail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getGeneratedSteps,
  getSteps,
  setCurrentStep,
  setStepStatus,
} from "../../../Redux/stepDetail/stepDetailSlice";
import styles from "./exercise.module.css";
import CreateSteps from "./CreateSteps";
const DetailExercise = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const { exercise } = useSelector((state) => state.EXERCISE);
  const { steps, currentStep, currentVideo } = useSelector(
    (state) => state.STEP
  );
  const [step, setStep] = useState(
    steps.find((step) => step.stepNo === currentStep)
  );

  useEffect(() => {
    dispatch(getSingleExercise(id));
    dispatch(getSteps(id));
  }, [dispatch, id]);

  useEffect(() => {
    setStep(steps.find((step) => step.stepNo === currentStep));
  }, [currentStep, steps]);
  console.log("Current Step", step);
  return (
    <Container
      maxWidth={false}
      style={{
        backgroundColor: "#333",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "auto",
      }}
    >
      <Typography
        variant="h6"
        color="white"
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "flex-start",
          gap: 10,
        }}
      >
        Category
        {exercise?.category.map((c, i) => {
          return (
            <Chip
              key={i}
              label={c.name}
              style={{
                color: "black",
                maxWidth: "auto",
                backgroundColor: "floralwhite",
                fontSize: "15px",
              }}
            />
          );
        })}
      </Typography>
      <Chip
        label={exercise?.difficulty_level.toUpperCase()}
        style={{
          color: "black",
          maxWidth: "200px",
          backgroundColor: "floralwhite",
          alignSelf: "flex-end",
        }}
      />
      <Typography
        variant="h3"
        color="white"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px",
        }}
      >
        {exercise?.name}

        <Box>
          <Like item={exercise} color={"white"} />
        </Box>
      </Typography>
      <Typography
        variant="h6"
        color="white"
        style={{ margin: "15px", alignSelf: "flex-start" }}
      >
        {exercise?.description}
      </Typography>
      <Box className={styles.boxContainer}>
        <div
          style={{
            flex: 0.6,
            borderRadius: "20px",
            width: "auto",
            height: "100%",
          }}
        >
          {!currentVideo ? (
            <Carousel
              showStatus={false}
              showIndicators={false}
              showArrows={false}
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              style={{
                border: "2px solid white",
                width: "100%",
                height: "80vh",
              }}
            >
              {exercise?.image_url.map((i) => {
                return (
                  <div key={i} style={{ width: "100%", height: "100%" }}>
                    <img
                      src={i}
                      alt="exercise"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",
                      }}
                    />
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <iframe
              style={{ borderRadius: "20px", width: "100%", height: "80vh" }}
              src={`https://www.youtube.com/embed/${new URLSearchParams(
                new URL(currentVideo).search
              ).get("v")}`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          )}
        </div>
        <div
          style={{
            flex: 0.4,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Button onClick={toggleDrawer(true)} variant="contained">
            Add Steps
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
            <CreateSteps
              name={exercise?.name}
              id={id}
              toggleDrawer={toggleDrawer}
            />
          </Drawer>
          {steps &&
            steps.map((s, i) => {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid white",
                    borderRadius: "20px",
                    padding: 5,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(setCurrentStep(s.stepNo));
                    dispatch(
                      setStepStatus({ stepIndex: s.stepNo, status: !s.active })
                    );
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "white",
                      gap: 20,
                    }}
                  >
                    <img
                      src={exercise?.image_url[0]}
                      alt="exercise"
                      style={{
                        width: "25%",
                        height: "100%",
                        borderRadius: "20px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {s.data.title}
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            fontSize: "15px",
                          }}
                        >
                          <AccessTimeFilledIcon />
                          {s.data.time}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "15px",
                          }}
                        >
                          <BoltIcon />
                          {s.data.calories} kcal
                        </div>
                      </Box>
                    </div>
                    {s?.progress == 1 ? (
                      <CheckCircleIcon
                        style={{
                          color: "green",
                          height: "25px",
                          width: "25px",
                        }}
                      />
                    ) : (
                      <CircularProgress
                        variant="determinate"
                        value={s?.progress * 100}
                        style={{
                          height: "25px",
                          width: "25px",
                        }}
                      />
                    )}
                  </Typography>
                </div>
              );
            })}
        </div>
      </Box>
      <Box>
        {step && step.active && (
          <StepDetail
            currentStep={step}
            combineSteps={step.data.steps}
            color={"white"}
          />
        )}
      </Box>
    </Container>
  );
};

export default DetailExercise;

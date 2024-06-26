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
import AddIcon from "@mui/icons-material/Add";
import StepDetail from "./StepDetail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import {
  deleteStep,
  getSteps,
  setCurrentIndex,
  setCurrentStep,
  setStepStatus,
} from "../../../Redux/stepDetail/stepDetailSlice";
import styles from "./exercise.module.css";
import CreateSteps from "./CreateSteps";
import CreateManualStep from "./CreateManualStep";
import EditIcon from "@mui/icons-material/Edit";
import UpdateManualStep from "./UpdateManualStep";
import DeleteIcon from "@mui/icons-material/Delete";
const DetailExercise = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [editingStep, setEditingStep] = React.useState(null);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const { exercise } = useSelector((state) => state.EXERCISE);
  const { steps, currentStep, currentVideo, loading } = useSelector(
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
    if (steps.length > 0) {
      setStep(steps.find((step) => step.stepNo === currentStep));
    }
  }, [currentStep, steps]);
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
        <Chip
          label={exercise?.difficulty_level.toUpperCase()}
          style={{
            color: "black",
            maxWidth: "200px",
            backgroundColor: "floralwhite",
            alignSelf: "flex-end",
          }}
        />
      </Typography>

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
      <div style={{ display: "inherit", gap: 10, alignSelf: "flex-end" }}>
        <IconButton
          style={{ backgroundColor: "white" }}
          onClick={() => setDrawer(true)}
        >
          <AddIcon style={{ color: "black" }} />
        </IconButton>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          style={{
            alignSelf: "flex-end",
          }}
        >
          Generate Steps with AI
        </Button>
      </div>
      <Typography
        variant="h6"
        color="white"
        style={{
          margin: "15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {exercise?.description}
      </Typography>
      <Drawer anchor="right" onClose={() => setDrawer(false)} open={drawer}>
        <CreateManualStep setDrawer={setDrawer} id={id} />
      </Drawer>

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
            overflow: "auto",
            height: "80vh",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #f1f1f1",
            padding: 10,
          }}
        >
          <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
            <CreateSteps
              name={exercise?.name}
              id={id}
              toggleDrawer={toggleDrawer}
            />
          </Drawer>

          {loading ? (
            <Box>
              <CircularProgress />
            </Box>
          ) : (
            steps &&
            steps?.map((s, i) => {
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
                    backgroundColor: "white",
                  }}
                  onClick={() => {
                    dispatch(setCurrentStep(s.stepNo));
                    dispatch(setCurrentIndex(i + 1));
                    if (!s.active) {
                      dispatch(
                        setStepStatus({ stepIndex: s.stepNo, status: true })
                      );
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "black",
                      gap: 20,
                    }}
                  >
                    <img
                      src={exercise?.image_url[0]}
                      alt="exercise"
                      style={{
                        minWidth: "50px",
                        height: "100%",
                        borderRadius: "20px",
                        objectFit: "cover",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {s.data?.title}
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
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
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
                          {s.data?.time} Minutes
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "15px",
                          }}
                        >
                          <BoltIcon />
                          {s.data?.calories} kcal
                        </div>
                      </Box>
                    </div>
                    <Box>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingStep(s);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          dispatch(deleteStep(s?.data?._id, id));
                        }}
                      >
                        <DeleteIcon style={{ color: "red" }} />
                      </IconButton>
                    </Box>
                    <Drawer
                      anchor="right"
                      onClose={() => setEditingStep(null)}
                      open={editingStep !== null}
                    >
                      <UpdateManualStep
                        setEditingStep={setEditingStep}
                        data={editingStep?.data}
                        id={id}
                      />
                    </Drawer>
                  </Typography>
                </div>
              );
            })
          )}
        </div>
      </Box>
      <Box>
        {step && step?.active && (
          <StepDetail
            currentStep={step}
            combineSteps={step?.data?.steps}
            color={"white"}
          />
        )}
      </Box>
    </Container>
  );
};

export default DetailExercise;

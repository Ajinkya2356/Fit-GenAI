import React, { useEffect, useState } from "react";
import {
  clearErrors,
  workoutAction,
} from "../../../Redux/workout/workoutSlice";

import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Loader from "../common/Loader";
import Workout_Card from "./Workout_Card";
import { useNavigate } from "react-router-dom";
import { Button, Box, Drawer, IconButton } from "@mui/material";
import WorkoutDrawer from "./WorkoutDrawer";
import PlanDrawer from "./PlanDrawer";
import AddIcon from "@mui/icons-material/Add";
import { setGP, setGeneratedPlan } from "../../../Redux/plan/planSlice";
const Workout = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
  const { generatedPlan } = useSelector((state) => state.PLANS);
  const toggleSecond = (second) => (event) => {
    if (!second) {
      dispatch(setGP());
    }
    setSecond(second);
  };
  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };
  const { workouts, error, AllUsers, AllPlans, loading } = useSelector(
    (state) => state.WORKOUT
  );
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(workoutAction());

    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        backgroundColor: "#333",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: "20px",
        /* justifyContent: "center", */
        padding: "20px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <IconButton
              variant="contained"
              style={{
                backgroundColor: "green",
              }}
              onClick={toggleDrawer(true)}
            >
              <AddIcon />
            </IconButton>
            <Button variant="contained" onClick={toggleSecond(true)}>
              Custom Plan
            </Button>
          </Box>
          <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
            <WorkoutDrawer />
          </Drawer>
          <Drawer open={second} onClose={toggleSecond(false)} anchor="right">
            <PlanDrawer toggleSecond={toggleSecond} />
          </Drawer>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {workouts.map((workout) => (
              <Workout_Card
                onClick={() => {
                  navigate(`${workout._id}`);
                }}
                key={workout._id}
                workout={workout}
              />
            ))}
          </Box>
        </div>
      )}
    </Container>
  );
};

export default Workout;

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExerciseAction } from "../../../Redux/exercise/exerciseSlice";
import {
  clearErrorsPlan,
  createPlan,
  generatePlan,
  saveAction,
  setGeneratedPlan,
} from "../../../Redux/plan/planSlice";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CreateIcon from "@mui/icons-material/Create";
import Notification from "../common/Notification";
const PlanDrawer = ({ toggleSecond }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getExerciseAction("", ""));
  }, []);

  const { exercises } = useSelector((state) => state.EXERCISE);
  const { generatedPlan, loading, error } = useSelector((state) => state.PLANS);
  useEffect(() => {
    if (generatedPlan) {
      setPlanName(generatedPlan.name);
    }
    if (error) {
      Notification(error, "danger");
    }
    dispatch(clearErrorsPlan());
  }, [generatedPlan, error]);
  const [planExercise, setPlanExercise] = useState([]);
  const [exercise, setExercise] = useState({});
  const [planName, setPlanName] = useState("");
  const [flag, setFlag] = useState(false);
  console.log("Generated Plan ", generatedPlan);
  const getExerciseID = (name) => {
    const exercise = exercises.find(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    );
    return exercise._id;
  };
  return (
    <Container
      style={{
        minWidth: "300px",
        padding: "20px",
      }}
    >
      <Typography variant="h4">Create Plan</Typography>
      {loading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          style={{
            margin: "20px 0px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TextField
            label="Plan Name"
            value={planName}
            error={error}
            helperText="Plan Name is required"
            required
            onChange={(e) => {
              setPlanName(e.target.value);
            }}
          />
          {planExercise.length > 0 &&
            planExercise.map((exe, index) => {
              return (
                <Box
                  style={{
                    border: "2px solid gray",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "10px",
                    padding: "10px",
                  }}
                >
                  <Typography>Exercise : {exe.exercise}</Typography>
                  <Typography>Sets : {exe.sets}</Typography>
                  <Typography>Reps : {exe.reps}</Typography>
                  <Typography>Weight : {exe.weight}</Typography>
                </Box>
              );
            })}
          {generatedPlan?.exercises?.length > 0 &&
            generatedPlan?.exercises?.map((exe, index) => {
              return (
                <Box
                  style={{
                    border: "2px solid gray",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "10px",
                    padding: "10px",
                  }}
                >
                  <Typography>Exercise : {exe.exercise}</Typography>
                  <Typography>Sets : {exe.sets}</Typography>
                  <Typography>Reps : {exe.reps}</Typography>
                  <Typography>Weight : {exe.weight}</Typography>
                </Box>
              );
            })}
          <FormControl>
            <InputLabel>Exercise</InputLabel>
            <Select
              value={exercise.exercise || ""}
              onChange={(e) => {
                console.log(e.target.value);
                setExercise({ ...exercise, exercise: e.target.value });
              }}
            >
              {exercises.map((item) => {
                return <MenuItem value={item._id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <TextField
            label="Sets"
            value={exercise.sets || ""}
            onChange={(e) => {
              setExercise({ ...exercise, sets: e.target.value });
            }}
          />
          <TextField
            label="Reps"
            value={exercise.reps || ""}
            onChange={(e) => {
              setExercise({ ...exercise, reps: e.target.value });
            }}
          />
          <TextField
            label="Weight"
            value={exercise.weight || ""}
            onChange={(e) => {
              setExercise({ ...exercise, weight: e.target.value });
            }}
          />

          <Box
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "space-around",
              backgroundColor: "lightgray",
              padding: "10px",
              borderRadius: "20px",
            }}
          >
            <IconButton
              variant="contained"
              onClick={() => {
                setPlanExercise([...planExercise, exercise]);
                setExercise({});
                if (!error) {
                  Notification("Exercise Added", "success");
                }
              }}
              style={{
                backgroundColor: "white",
              }}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              variant="contained"
              onClick={() => {
                dispatch(createPlan(planName, planExercise));
                toggleSecond(false)();
                Notification("Plan Created", "success");
              }}
              style={{
                backgroundColor: "white",
              }}
            >
              <CreateIcon />
            </IconButton>
            <IconButton
              variant="contained"
              onClick={() => {
                const newExercises = generatedPlan.exercises.map((e) => {
                  return { ...e, exercise: getExerciseID(e.exercise) };
                });
                dispatch(saveAction(generatedPlan.name, newExercises));
                toggleSecond(false)();
                Notification("Plan Saved", "success");
              }}
              style={{
                backgroundColor: "white",
              }}
            >
              <SaveIcon style={{ color: "blue" }} />
            </IconButton>
            <IconButton
              variant="contained"
              onClick={() => {
                const exerciseNames = exercises.map((e) => e.name);
                dispatch(generatePlan(planName, exerciseNames));
                setFlag(true);
                if (!loading) Notification("Plan Generated", "success");
              }}
              style={{
                backgroundColor: "white",
              }}
            >
              <TipsAndUpdatesIcon style={{ color: "gold" }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PlanDrawer;

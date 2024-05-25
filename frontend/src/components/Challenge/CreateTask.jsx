import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExerciseAction } from "../../../Redux/exercise/exerciseSlice";
import { createTask } from "../../../Redux/challenge/challengeSlice";
import Notification from "../common/Notification";

const CreateTask = ({ id, toggleDrawer }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getExerciseAction("", ""));
  }, []);
  const { exercises } = useSelector((state) => state.EXERCISE);
  const [data, setData] = useState({ challenge: id });
  return (
    <Container
      style={{
        padding: "20px",
        minWidth: "400px",
      }}
    >
      <Typography variant="h4">Create Task</Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        <TextField
          label="Reps"
          variant="outlined"
          fullWidth
          type="number"
          onChange={(e) => setData({ ...data, reps: parseInt(e.target.value) })}
        />

        <TextField
          label="Coin"
          variant="outlined"
          fullWidth
          type="number"
          onChange={(e) => setData({ ...data, coin: parseInt(e.target.value) })}
        />

        <TextField
          label="Time Limit"
          variant="outlined"
          fullWidth
          type="number"
          onChange={(e) =>
            setData({ ...data, time_limit: parseInt(e.target.value) })
          }
        />
        <FormControl fullWidth>
          <InputLabel>Select Exercise</InputLabel>
          <Select
            label="Select Exercise"
            onChange={(e) => setData({ ...data, exercise: e.target.value })}
          >
            {exercises.map((e) => {
              return (
                <MenuItem key={e._id} value={e._id}>
                  {e.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            dispatch(createTask(data));
            Notification("Task Created Successfully", "success");
            toggleDrawer(false);
          }}
        >
          Create Task
        </Button>
      </Box>
    </Container>
  );
};

export default CreateTask;

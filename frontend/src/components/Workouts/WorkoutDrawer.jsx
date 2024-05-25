import {
  Box,
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlans } from "../../../Redux/plan/planSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createWorkout } from "../../../Redux/workout/workoutSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Notification from "../common/Notification";
const WorkoutDrawer = () => {
  const dispatch = useDispatch();
  const [createPlan, setCreatePlan] = useState(false);
  useEffect(() => {
    dispatch(getPlans());
  }, []);
  const { plans } = useSelector((state) => state.PLANS);
  const [data, setData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cover_image, setCover_image] = useState(null);
  const [fileName, setFileName] = useState("");
  console.log("Entered Data", data);
  return (
    <Container
      style={{
        minWidth: "300px",
        padding: "20px",
      }}
    >
      <Typography variant="h4">Create Workout</Typography>
      <Box
        style={{
          margin: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <TextField
          label="Workout Name"
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
        <TextField
          type="number"
          label="Calories"
          value={data.calories_burnt}
          onChange={(e) => {
            setData({ ...data, calories_burnt: e.target.value });
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            {["Start Date", "End Date"].map((item, index) => {
              return (
                <DatePicker
                  label={item}
                  value={
                    data[item === "Start Date" ? "start_time" : "end_time"]
                  }
                  onChange={(newValue) => {
                    const convertedDate = dayjs(newValue).toISOString();
                    switch (item) {
                      case "Start Date":
                        setStartDate(convertedDate);
                        break;
                      case "End Date":
                        setEndDate(convertedDate);
                        break;
                      default:
                        break;
                    }
                  }}
                />
              );
            })}
          </DemoContainer>
        </LocalizationProvider>
        <FormControl>
          <InputLabel>Plan</InputLabel>
          <Select
            label="Plan"
            onChange={(e) => {
              setData({ ...data, plan: e.target.value });
            }}
          >
            {plans.map((p, i) => {
              return (
                <MenuItem value={p._id} key={i}>
                  {p.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          component="label"
          role={undefined}
          tabIndex={-1}
        >
          <Input
            type="file"
            sx={{ display: "none" }}
            accept=".jpg,.png,.jpeg"
            onChange={(event) => {
              const file = event.target.files[0];
              setFileName(file.name);
              setCover_image(file);
            }}
          />
          <CloudUploadIcon />
          &nbsp;&nbsp;{fileName !== "" ? fileName : "Upload Image"}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            data["start_time"] = startDate;
            data["end_time"] = endDate;
            data["cover_image"] = cover_image;
            dispatch(createWorkout(data));
            Notification("Workout Created Successfully", "success");
          }}
        >
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default WorkoutDrawer;

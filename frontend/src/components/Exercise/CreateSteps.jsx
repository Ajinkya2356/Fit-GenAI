import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGeneratedSteps,
  getSteps,
  saveGeneratedSteps,
} from "../../../Redux/stepDetail/stepDetailSlice";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import StepDetail from "./StepDetail";
import { CircularProgress } from "@mui/material";
import Notification from "../common/Notification";
const CreateSteps = ({ name, id, toggleDrawer }) => {
  const { generatedSteps, loading, error } = useSelector((state) => state.STEP);
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      Notification("Error Occured", "danger");
    }
  }, [error]);
  return (
    <Container
      style={{
        maxWidth: "500px",
      }}
    >
      <h1>Create Steps</h1>
      {loading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {generatedSteps &&
            generatedSteps.map((step, index) => {
              return (
                <Box
                  key={index}
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    borderRadius: "20px",
                  }}
                >
                  <Typography variant="h4">{step.title}</Typography>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <AccessTimeFilledIcon />
                      <Typography variant="body2">{step.time} mins</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <LocalFireDepartmentIcon />
                      <Typography variant="body2">
                        {step.calories} Kcal
                      </Typography>
                    </div>
                  </div>
                  <StepDetail
                    currentStep={step}
                    combineSteps={step.steps}
                    color={"black"}
                  />
                </Box>
              );
            })}
        </Container>
      )}

      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "10px",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          style={{
            marginTop: "10px",
          }}
          onClick={() => {
            dispatch(getGeneratedSteps(name));
            Notification("Steps Generated", "success");
          }}
        >
          Generate Steps
        </Button>
        <Button
          variant="contained"
          style={{
            marginTop: "10px",
          }}
          onClick={() => {
            dispatch(saveGeneratedSteps(generatedSteps, id));
            toggleDrawer(false)();
            Notification("Steps Saved", "success");
          }}
        >
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default CreateSteps;

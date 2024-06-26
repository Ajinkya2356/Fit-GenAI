import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { getExerciseAction } from "../../../Redux/exercise/exerciseSlice";
import {
  addStep,
  saveGenerateSteps,
  updateStep,
} from "../../../Redux/stepDetail/stepDetailSlice";
import Notification from "../common/Notification";

const stepsInputMap = ["title", "calories", "time"];
const indiviual = ["heading", "description", "video"];
const UpdateManualStep = ({ setEditingStep, data, id }) => {
  const dispatch = useDispatch();
  const [final, setFinal] = useState(data);
  const [seeSteps, setSeeSteps] = useState(data?.steps);
  const [currentStep, setCurrentStep] = useState({
    heading: "",
    description: "",
    video: "",
  });
  const { loading } = useSelector((state) => state.STEP);
  console.log(data);
  return loading ? (
    <Box>
      <CircularProgress />
    </Box>
  ) : (
    <Container
      style={{
        minWidth: 300,
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <h1>Update Steps</h1>
      <Box>
        {stepsInputMap.map((step, index) => (
          <TextField
            key={index}
            label={step.charAt(0).toUpperCase() + step.slice(1)}
            variant="outlined"
            margin="normal"
            fullWidth
            type={step === "time" || step === "calories" ? "number" : "text"}
            value={final?.[step]}
            onChange={(e) => {
              setFinal({ ...final, [step]: e.target.value });
            }}
          />
        ))}
      </Box>

      <Box>
        {seeSteps?.map((step, index) => (
          <Box
            style={{
              border: "1px solid gray",
              margin: 5,
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 20,
              padding: 10,
            }}
          >
            <div>
              <Typography variant="body2"> Heading : {step.heading}</Typography>
              <Typography variant="body2">
                {" "}
                Description : {step.description}
              </Typography>
              <Typography variant="body2"> Video : {step.video}</Typography>
            </div>
            <IconButton
              onClick={() => {
                const newSteps = seeSteps.filter((_, i) => i !== index);
                setSeeSteps(newSteps);
                setFinal({ ...final, steps: newSteps });
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Box
        style={{
          padding: 10,
          border: "1px solid black",
          borderRadius: 20,
        }}
      >
        {indiviual.map((step, index) => (
          <TextField
            key={index}
            label={step.charAt(0).toUpperCase() + step.slice(1)}
            variant="outlined"
            margin="normal"
            fullWidth
            value={currentStep[step]}
            onChange={(e) => {
              setCurrentStep({ ...currentStep, [step]: e.target.value });
            }}
          />
        ))}
        <Button
          variant="contained"
          onClick={() => {
            const newSteps = [...seeSteps, currentStep];
            setSeeSteps(newSteps);
            setCurrentStep({
              heading: "",
              description: "",
              video: "",
            });
            setFinal({ ...final, steps: newSteps });
          }}
        >
          Add Step
        </Button>
      </Box>
      <Button
        variant="contained"
        style={{
          margin: 10,
        }}
        onClick={() => {
          dispatch(updateStep(final, id));
          Notification("Step Updated Successfully", "success");
          setEditingStep(null);
        }}
      >
        Update Step
      </Button>
    </Container>
  );
};

export default UpdateManualStep;

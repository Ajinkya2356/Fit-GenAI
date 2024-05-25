import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentVideo,
  setStepProgress,
  setStepStatus,
} from "../../../Redux/stepDetail/stepDetailSlice";
export default function VerticalLinearStepper({ currentStep, combineSteps,color }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  useEffect(() => {
    if (activeStep === combineSteps.length) {
      dispatch(
        setStepStatus({
          stepIndex: currentStep.stepNo,
          status: false,
        })
      );
      dispatch(setCurrentVideo(null));
    }
    if (activeStep < combineSteps.length) {
      dispatch(setCurrentVideo(combineSteps[activeStep].video));
    }
  }, [activeStep]);
  const handleNext = () => {
    dispatch(
      setStepProgress({
        stepIndex: currentStep.stepNo,
        progress: (activeStep + 1) / combineSteps.length,
      })
    );
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    dispatch(
      setStepProgress({
        stepIndex: currentStep.stepNo,
        progress: (activeStep - 1) / combineSteps.length,
      })
    );
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ padding: "10px" }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {currentStep &&
          combineSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                <Typography variant="h5" style={{ color: color }}>
                  {step.heading}
                </Typography>
              </StepLabel>
              <StepContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    gap: 20,
                  }}
                >
                  <Typography style={{ color: color, textAlign: "justify" }}>
                    {step.description}
                  </Typography>
                  {/* <iframe
                    style={{ borderRadius: "20px" }}
                    src={`https://www.youtube.com/embed/${new URLSearchParams(
                      new URL(step.video).search
                    ).get("v")}`}
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe> */}
                </div>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === combineSteps.length - 1
                        ? "Finish"
                        : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
      </Stepper>
    </Box>
  );
}

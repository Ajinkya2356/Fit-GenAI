import { Container, Stepper, Typography } from "@mui/material";
import React from "react";
import VerticalLinearStepper from "./Stepper";
import { useSelector } from "react-redux";

const StepDetail = ({ currentStep, combineSteps, color }) => {
  const { currentIndex } = useSelector((state) => state.STEP);
  return (
    <Container
      style={{
        display: "flex",
        padding: "10px",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <Typography
        variant="h5"
        style={{
          color: color,
        }}
      >
        Step {currentIndex}
      </Typography>
      <VerticalLinearStepper
        currentStep={currentStep}
        combineSteps={combineSteps}
        color={color}
      />
    </Container>
  );
};

export default StepDetail;

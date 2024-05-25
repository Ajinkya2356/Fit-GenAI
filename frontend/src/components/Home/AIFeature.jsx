import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { defaultValues } from "../Constants/defaultValues";
import AILogo from "../../../public/AI.gif";
import Typist from "react-typist";
const AIFeature = () => {
  return (
    <Container
      style={{
        color: "white",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        background: "black",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        margin: "20px 0px ",
        flex: "1",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {defaultValues.AIFeatureText}
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <img
          src={AILogo}
          style={{
            width: "50%",
            height: "auto",
            boxShadow: "4px 4px 4px rgba(255, 255, 255, 0.4)",
            borderRadius: "10px",
            marginRight: "20px",
          }}
          alt="AI Logo"
        />
        <div
          style={{
            width: "50%",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <Typist
              cursor={{ show: false }}
              startDelay={1000}
              avgTypingDelay={50}
            >
              {defaultValues.AIFeatureDescription}
            </Typist>
          </Typography>
        </div>
      </div>
    </Container>
  );
};

export default AIFeature;

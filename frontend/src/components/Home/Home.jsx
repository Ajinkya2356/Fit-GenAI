import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { defaultValues } from "../Constants/defaultValues";
import { Button, Typography } from "@mui/material";
import Feature from "./Feature";
import { Slide } from "react-awesome-reveal";
import Section from "./Section";
import frontBanner from "../images/frontBanner.avif";
import Events from "./Events";
import Testimonials from "./Testimonials";
import { Link } from "react-router-dom";
import AIFeature from "./AIFeature";
const Home = () => {
  const title = defaultValues.homeTitleTextline1.toUpperCase();
  const line2 = defaultValues.homeTitleTextline2.toUpperCase();
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      flex="1"
      style={{
        backgroundImage: `url(${frontBanner})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        style={{
          display: "inherit",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="80vh"
          marginTop="10vh"
        >
          <Box style={{ minWidth: "60%" }}>
            <Typography fontSize={25} color="white">
              <Slide triggerOnce>
                <h1>
                  {title}
                  <br />
                  {line2}
                </h1>
              </Slide>
            </Typography>

            <Button
              variant="outlined"
              style={{ color: "white", borderColor: "white" }}
            >
              <Link
                to="/challenges"
                style={{ textDecoration: "none", color: "white" }}
              >
                <Typography variant="p">
                  {defaultValues.homeButtonText}
                </Typography>
              </Link>
            </Button>
          </Box>
        </Box>
        <AIFeature />
        <Feature />
        <Section />
        <Events />
        <Testimonials />
      </Container>
    </Box>
  );
};

export default Home;

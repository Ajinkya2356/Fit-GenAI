import React from "react";
import { Container, Typography } from "@mui/material";
import styles from "./style.module.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: "#2c3e50",
        height: "auto",
        width: "100%",
        color: "white",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <div>
          <Typography variant="h5">Quick Menu</Typography>
          <div className={styles.listContainer}>
            <Typography variant="h6">Home</Typography>

            <Typography variant="h6">About</Typography>

            <Typography variant="h6">Services</Typography>

            <Typography variant="h6">Contact</Typography>
          </div>
        </div>
        <div>
          <Typography variant="h5">Stayed Tuned</Typography>
          <Typography variant="h6" marginTop="3%">
            Subscribe Now and Get Access to Exclusive Workouts and Tips
          </Typography>
        </div>
        <div>
          <Typography variant="h5">Follow Us</Typography>
          <div className={styles.listContainer}>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <InstagramIcon />
              &nbsp;Instagram
            </Typography>

            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FacebookIcon />
              &nbsp;Facebook
            </Typography>

            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <LinkedInIcon />
              &nbsp;Linkedin
            </Typography>

            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <XIcon />
              &nbsp;Twitter
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;

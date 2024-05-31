import React from "react";
import {
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const LabelToLink = {
    Home: "/",
    Workouts: "/workout",
    Exercises: "/exercises",
    Challenges: "/challenges",
  };
  return (
    <Container
      component="footer"
      sx={{
        backgroundColor: "#2c3e50",
        color: "white",
        py: 3,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h5">Quick Menu</Typography>
          <List>
            {["Home", "Workouts", "Exercises", "Challenges"].map(
              (text, index) => (
                <ListItem
                  key={index}
                  onClick={() => navigate(LabelToLink[text])}
                >
                  <Typography variant="h6">{text}</Typography>
                </ListItem>
              )
            )}
          </List>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h5">Stay Fit, Stay Healthy</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Subscribe now for exclusive fitness workouts, tips, and health
            advice
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h5">Follow Us</Typography>
          <List>
            {[
              { icon: <InstagramIcon />, name: "Instagram" },
              { icon: <FacebookIcon />, name: "Facebook" },
              { icon: <LinkedInIcon />, name: "LinkedIn" },
              { icon: <TwitterIcon />, name: "Twitter" },
            ].map((social, index) => (
              <ListItem key={index}>
                <IconButton color="inherit">{social.icon}</IconButton>
                <Typography variant="h6">{social.name}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;

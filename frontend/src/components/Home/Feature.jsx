import { Box, Button, Container, ListItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { defaultValues } from "../Constants/defaultValues";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getChallengeAction } from "../../../Redux/challenge/challengeSlice";
import { useNavigate } from "react-router-dom";
const Feature = () => {
  const navigate = useNavigate();
  const title = defaultValues.featureTitleText.toUpperCase();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChallengeAction("", ""));
  }, []);
  const { challenges, loading } = useSelector((state) => state.CHALLENGE);
  console.log("Challenge", challenges);
  return (
    <>
      <Container>
        <Box display="flex" justifyContent="flex-start">
          <Typography color="white">
            <h1>{title}</h1>
          </Typography>
        </Box>
        <Box className={styles.featureContainer}>
          {challenges.slice(0, 3).map((item, index) => (
            <Card
              key={index}
              sx={{
                width: 280,
                backgroundColor: "white",
                margin: "10px",
                height: 300,
              }}
            >
              <CardActionArea
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  width: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  style={{ objectFit: "cover" }}
                  image={item.cover_image}
                  alt="Challenge Image"
                />
                <CardContent style={{}}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    color="black"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="black"
                    style={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "50%",
                  }}
                  onClick={() => {
                    navigate(`/challenges/${item._id}`);
                  }}
                >
                  {defaultValues.cardButtonText}
                </Button>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default Feature;

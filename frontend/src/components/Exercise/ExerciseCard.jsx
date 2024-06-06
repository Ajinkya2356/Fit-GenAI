import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  CardMedia,
  Chip,
} from "@mui/material";
import Like from "./like";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import { FormalDate } from "../Challenge/Card";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
const ExerciseCard = ({ item }) => {
  const { loading } = useSelector((state) => state.WORKOUT);
  const navigate = useNavigate();
  useEffect(() => {}, [item]);
  const colorMap = {
    beginner: "green",
    intermediate: "orange",
    advanced: "red",
  };
  return (
    <>
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
        <Card
          sx={{
            maxWidth: 345,
            margin: "2px 0px",
            backgroundColor: "white",
            color: "black",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() =>
            navigate(`/exercise/${item?._id}`, {
              state: item,
            })
          }
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 2%",
            }}
          >
            <CardHeader
              title={item?.name}
              textoverflow="ellipsis"
              subheader={FormalDate(item?.createdAt)}
            ></CardHeader>
            <Chip
              label={item?.difficulty_level.toUpperCase()}
              style={{
                backgroundColor: colorMap[item?.difficulty_level.toLowerCase()],
                color: "white",
              }}
            />
          </Box>
          <CardMedia
            sx={{
              display: "flex",
              justifyContent: "center",
              /*  paddingLeft: "2%", */
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              /* border: "2px solid red", */
            }}
          >
            <Carousel
              autoPlay={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              showIndicators={false}
              width="100%"
              showArrows={false}
            >
              {item?.image_url.map((img, ind) => {
                return (
                  <img
                    key={ind}
                    src={img}
                    alt="exercise"
                    width="80%"
                    height="170px"
                    style={{ objectFit: "cover" }}
                  />
                );
              })}
            </Carousel>
          </CardMedia>
          <CardContent display="flex" alignItems="flex-start">
            <Box
            /* sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid red",
              }} */
            >
              <Typography variant="body2" color="black" alignSelf="flex-start">
                {item?.description}
              </Typography>
            </Box>
            <Box
              style={{
                /*  border: "2px solid red", */
                display: "flex",
                justifyContent: "flex-end",
                /*   justifyContent: "center", */
              }}
            >
              <Like item={item} color={"black"} />
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ExerciseCard;

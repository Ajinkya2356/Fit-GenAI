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
            margin: 2,
            backgroundColor: "white",
            color: "black",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Chip
            label={item?.difficulty_level.toUpperCase()}
            style={{
              alignSelf: "flex-end",
              marginTop: "5%",
              marginRight: "2%",
            }}
          />
          <CardHeader
            title={item?.name}
            subheader={FormalDate(item?.createdAt)}
            onClick={() =>
              navigate(`/exercise/${item?._id}`, {
                state: item,
              })
            }
          ></CardHeader>

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
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Rating } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { commentAction } from "../../../Redux/comment/commentSlice";
import { useDispatch, useSelector } from "react-redux";
const Testimonials = () => {
  const feedbacks = {
    user: "John Doe",
    rating: 4.5,
    message: "Best course ever bought",
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(commentAction());
  }, []);
  const { comments } = useSelector((state) => state.COMMENT);
  console.log(comments);
  return (
    <>
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <Typography variant="h4" color="white">
          What our client says
        </Typography>

        <Carousel
          centerMode
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          autoPlay
          infiniteLoop
        >
          {comments.map((item, index) => (
            <Card
              key={index}
              sx={{
                margin: "10px",
                width: "auto",
              }}
            >
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar src={item.user.avatar} />
                <Rating
                  name="half-rating-read"
                  value={item.rating}
                  precision={0.5}
                  readOnly
                />
                <Typography variant="h6">{item.user.username}</Typography>
                <Typography variant="p">{item.message}</Typography>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Box>
    </>
  );
};

export default Testimonials;

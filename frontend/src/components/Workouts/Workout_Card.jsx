import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import style from "../Challenge/card.module.css";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
export const FormalDate = (date) => {
  const dateObj = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString("en-US", options);
};

const Workout_Card = ({ workout, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={[style.container, { width: "348", height: "auto" }]}
    >
      <CardHeader
        title={workout.name}
        subheader={FormalDate(workout.createdAt)}
      />
      <CardMedia
        component="img"
        height="194"
        style={{ maxWidth: "348px", objectFit: "cover" }}
        image={
          workout.cover_image
            ? workout.cover_image
            : "https://source.unsplash.com/random"
        }
        alt="Challenge Image"
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <PeopleAltIcon /> {workout.participants.length}
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={[style.Align, { marginBottom: "15px" }]}
        >
          <LocalFireDepartmentIcon />
          {workout.calories_burnt}
        </Typography>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            className={style.Align}
          >
            <TimerIcon /> {workout.duration}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={style.Align}
          >
            <TimelineIcon /> {FormalDate(workout.start_time)}
            &nbsp; to &nbsp;
            {FormalDate(workout.end_time)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Workout_Card;

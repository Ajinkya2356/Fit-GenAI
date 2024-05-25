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
  Hidden,
} from "@mui/material";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import style from "./card.module.css";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { colorToStatusMap } from "./Challenges";
export const FormalDate = (date) => {
  const dateObj = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString("en-US", options);
};
const ChallengeCard = ({ challenge, onClick }) => {
  return (
    <Card onClick={onClick} className={style.container}>
      <CardHeader
        title={challenge.name}
        subheader={FormalDate(challenge.createdAt)}
      />
      <CardMedia
        component="img"
        height="194"
        style={{ objectFit: "contain" }}
        image={
          challenge.cover_image
            ? challenge.cover_image
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
            marginBottom: "10px",
          }}
        >
          <Chip
            sx={{
              backgroundColor: colorToStatusMap[challenge.status.toLowerCase()],
              color: "white",
            }}
            avatar={
              <Avatar
                sx={{
                  backgroundColor:
                    colorToStatusMap[challenge.status.toLowerCase()],
                }}
              >
                <UpcomingIcon sx={{ fill: "white" }} />
              </Avatar>
            }
            label={challenge.status.toUpperCase()}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <PeopleAltIcon /> {challenge.participants.length}
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          margin="5px"
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          style={{
            maxHeight: "100px",
          }}
        >
          {challenge.description}
        </Typography>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            className={style.Align}
          >
            <EmojiEventsIcon /> {challenge.reward}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={style.Align}
            textOverflow={"ellipsis"}
          >
            <LocationSearchingIcon /> {challenge.goal}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;

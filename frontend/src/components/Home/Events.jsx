import {
  Box,
  Button,
  Card,
  CardMedia,
  Fade,
  Slide,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { CardContent } from "@mui/material";
import styles from "./style.module.css";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import AlarmOnSharpIcon from "@mui/icons-material/AlarmOnSharp";
import { useDispatch, useSelector } from "react-redux";
import { workoutAction } from "../../../Redux/workout/workoutSlice";
import { FormalDate } from "../Challenge/Card";
import GroupIcon from "@mui/icons-material/Group";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useNavigate } from "react-router-dom";
const Events = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(workoutAction());
  }, []);
  const { workouts } = useSelector((state) => state.WORKOUT);
 /*  console.log("Workouts", workouts); */
  return (
    <>
      <Box flex="1" bgcolor="#f5f5f5" padding="1%" borderRadius="20px">
        <Box>
          <Typography variant="h4" margin="2%">
            Hand picked workouts
          </Typography>
        </Box>
        <Box display="flex" className={styles.cardContainer}>
          {workouts.slice(0, 3).map((item, index) => (
            <Card
              sx={{ height: "auto", width: "auto", margin: "10px" }}
              key={index}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginBottom="10px"
                >
                  <Typography variant="p" display="flex" alignItems="center">
                    <CalendarMonthSharpIcon />
                    &nbsp;{FormalDate(item.createdAt)}
                  </Typography>
                  <Typography variant="p" display="flex" alignItems="center">
                    <LocationOnSharpIcon />
                    &nbsp;Virtual
                  </Typography>
                </Box>
                <CardMedia
                  component="img"
                  height="40%"
                  image="https://rb.gy/utjjno"
                  sx={{ borderRadius: "10px" }}
                />
                <Typography
                  variant="h6"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 5,
                    margin: "10px",
                  }}
                >
                  {item.name}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <GroupIcon />
                    {item.participants.length}
                  </div>
                </Typography>

                <Typography
                  variant="body1"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    margin: "10px",
                  }}
                >
                  <AlarmOnSharpIcon />
                  {FormalDate(item.start_time)}
                  &nbsp;to&nbsp;
                  {FormalDate(item.end_time)}
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px",
                    gap: 10,
                  }}
                >
                  <LocalFireDepartmentIcon />
                  {item.calories_burnt}
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    margin: "2%",
                    backgroundColor: "#ff6f61",
                  }}
                  onClick={() => {
                    navigate(`/workout/${item._id}`);
                  }}
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Events;

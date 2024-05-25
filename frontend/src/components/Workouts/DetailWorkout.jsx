import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import {
  clearErrors,
  joinWorkout,
  leaveWorkout,
  singleWorkout,
} from "../../../Redux/workout/workoutSlice";
import { Box, Button, Chip, Typography } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { FormalDate } from "./Workout_Card";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import TimerIcon from "@mui/icons-material/Timer";
import ExerciseCard from "./ExerciseCard";
import Loader from "../common/Loader";
import CustomTimeline from "../common/Timeline";
import Notification from "../common/Notification";
const DetailWorkout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { workout, error, loading } = useSelector((state) => state.WORKOUT);
  const { user } = useSelector((state) => state.USER);
  useEffect(() => {
    dispatch(singleWorkout(id));
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, id]);
  const isJoined = workout?.participants.find((p) => p._id === user?.user?._id);
  console.log("workout");
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
            flex={1}
            sx={{
              backgroundColor: "#333",
              padding: "20px",
            }}
          >
            {isJoined ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  dispatch(leaveWorkout(workout?._id));
                  Notification("Left Workout Successfully", "success");
                }}
              >
                Leave
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  dispatch(joinWorkout(workout?._id));
                  Notification("Joined Workout Successfully", "success");
                }}
              >
                Join
              </Button>
            )}
          </Box>
          <Container
            maxWidth={false}
            sx={{
              backgroundColor: "#333",
              display: "flex",
              padding: "2%",
              justifyContent: "center",
              gap: "10px",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" color="white">
              {workout?.name}
            </Typography>

            <div
              style={{
                display: "flex",
                alignSelf: "flex-end",
                flexDirection: "row",
                /* flexWrap: "wrap", */
                gap: "1%",
                width: "100%",
                /* border: "2px solid white", */
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignSelf: "flex-start",
                  width: "100%",
                  /* border: "2px solid white", */
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    /* border: "2px solid white", */
                    flex: 1,
                  }}
                >
                  <img
                    src={
                      workout?.cover_image
                        ? workout?.cover_image
                        : "https://source.unsplash.com/random"
                    }
                    alt="Workout"
                    style={{
                      height: "400px",
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "30px",
                    }}
                  />
                </div>
                <div
                  style={{
                    /* border: "2px solid red", */
                    height: "100%",
                    minWidth: "200px",
                    padding: "15px",
                  }}
                >
                  <Typography variant="h6" color="white">
                    Participants
                  </Typography>
                  <div
                    style={{
                      padding: "15px",
                      overflow: "auto",
                      maxHeight: "200px",
                    }}
                  >
                    {workout?.participants.map((p, i) => {
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <Avatar src={p.avatar} alt={p.name} />
                          <Typography color="white">{p.name}</Typography>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Typography
                variant="h6"
                color="white"
                display="flex"
                flexDirection="column"
                margin="10px"
                flexWrap="wrap"
                gap={2}
              >
                <div
                  style={{
                    border: "2px solid white",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
                  }}
                >
                  <CustomTimeline
                    list={[
                      {
                        label: FormalDate(workout?.start_time),
                        title: "Start",
                        color: "green",
                      },
                      {
                        label: FormalDate(workout?.end_time),
                        title: "End",
                        color: "red",
                      },
                    ]}
                  />
                </div>
                <Chip
                  sx={{
                    backgroundColor: "#f50057",
                    color: "white",
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: "white",
                      }}
                    >
                      <LocalFireDepartmentIcon sx={{ color: "#f50057" }} />
                    </Avatar>
                  }
                  label={workout?.calories_burnt + " Kcal"}
                />
                <Chip
                  sx={{
                    backgroundColor: "#444",
                    color: "white",
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: "#444",
                      }}
                    >
                      <TimerIcon sx={{ color: "black" }} />
                    </Avatar>
                  }
                  label={workout?.duration + " Days"}
                />
              </Typography>
            </div>
            <Typography
              variant="h6"
              color="white"
              style={{
                marginBottom: "10%",
              }}
            >
              <Typography variant="h4" color="white">
                Plan - {workout?.plan[0].name}
              </Typography>
              {workout?.plan[0].exercises.map((exercise, index) => {
                return (
                  <>
                    <ExerciseCard
                      key={index}
                      exercise={exercise}
                      ind={index}
                      workoutId={id}
                    />
                  </>
                );
              })}
            </Typography>
          </Container>
        </>
      )}
    </>
  );
};

export default DetailWorkout;

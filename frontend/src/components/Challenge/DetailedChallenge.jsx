import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Drawer,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  completeTask,
  creditCoins,
  getChallengeTask,
  getSingleChallenge,
  leaveChallenge,
} from "../../../Redux/challenge/challengeSlice";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import Typist from "react-typist";
import { useParams } from "react-router-dom";
import Loader from "../common/Loader";
import style from "./card.module.css";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { FormalDate } from "./Card";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Checkbox from "@mui/material/Checkbox";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import CategoryIcon from "@mui/icons-material/Category";
import Button from "@mui/material/Button";
import { joinChallenge } from "../../../Redux/challenge/challengeSlice";
import { colorToStatusMap } from "./Challenges";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CreateTask from "./CreateTask";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExerciseDetail from "./ExerciseDetail";
import CustomTimeline from "../common/Timeline";
import Notification from "../common/Notification";
import LeaderBoard from "./LeaderBoard";
const DetailedChallenge = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSingleChallenge(id));
    dispatch(getChallengeTask(id));
  }, [dispatch]);
  const [createFlag, setCreateFlag] = useState(false);
  const { challenge, loading, Task } = useSelector((state) => state.CHALLENGE);
  const { user } = useSelector((state) => state.USER);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(Array(Task?.length).fill(false));
  const toggleDrawer = (open) => {
    setOpen(open);
  };
  const joined = challenge?.participants?.filter((p) => {
    return p._id === user?.user?._id;
  });
  useEffect(() => {}, [Task]);
  return (
    <Container
      maxWidth={false}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        flexWrap: "wrap",
        flexDirection: "column",
        backgroundColor: "#333",
        gap: 10,
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignSelf="flex-end"
            gap={2}
            style={{
              padding: "0px 10px",
            }}
          >
            {joined?.length > 0 ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  dispatch(leaveChallenge(id));
                  Notification("You have left the challenge", "danger");
                }}
              >
                Leave Challenge
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  dispatch(joinChallenge(id));
                  Notification("You have joined the challenge", "success");
                }}
              >
                Join Challenge
              </Button>
            )}
          </Box>

          <Typography
            variant="h4"
            className={style.title}
            style={{
              color: "white",
              alignSelf: "center",
            }}
          >
            {challenge?.name}
          </Typography>
          <Box
            style={{
              alignSelf: "flex-end",
              padding: "0px 10px",
              display: "flex",
            }}
          >
            {challenge?.createdBy?._id === user?.user?._id && (
              <IconButton
                onClick={() => {
                  setCreateFlag(true);
                  toggleDrawer(true);
                }}
                style={{
                  color: "white",
                  alignSelf: "flex-end",
                }}
              >
                <AddTaskIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                setCreateFlag(false);
                toggleDrawer(true);
              }}
              style={{
                color: "white",
              }}
            >
              <LeaderboardIcon />
            </IconButton>
          </Box>
          <Drawer
            open={open}
            onClose={() => toggleDrawer(false)}
            anchor="right"
          >
            {createFlag ? (
              <CreateTask id={id} toggleDrawer={toggleDrawer} />
            ) : (
              <LeaderBoard id={id} />
            )}
          </Drawer>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              /* border: "2px solid white", */
              padding: "10px",
              alignItems: "flex-start",
              minWidth: "80%",
            }}
            minWidth={"sm"}
          >
            <img
              src={
                challenge?.cover_image
                  ? challenge?.cover_image
                  : "https://source.unsplash.com/random"
              }
              alt="cover"
              className={style.image}
              style={{
                borderRadius: "10px",
                objectFit: "contain",
              }}
            />
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                /*  border: "1px solid red", */
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                  alignSelf: "flex-start",
                  padding: 10,
                }}
              >
                <Chip
                  sx={{
                    backgroundColor:
                      colorToStatusMap[challenge?.status.toLowerCase()],
                    color: "white",
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor:
                          colorToStatusMap[challenge?.status.toLowerCase()],
                      }}
                    >
                      <UpcomingIcon sx={{ fill: "white" }} />
                    </Avatar>
                  }
                  label={challenge?.status.toUpperCase()}
                />
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                    >
                      <HourglassEmptyIcon style={{ color: "white" }} />
                    </Avatar>
                  }
                  label={challenge?.duration + " Days"}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                    >
                      <PeopleAltIcon style={{ color: "white" }} />
                    </Avatar>
                  }
                  label={challenge?.participants.length}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                    >
                      <CategoryIcon style={{ color: "white" }} />
                    </Avatar>
                  }
                  label={challenge?.category?.name}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  /*  border: "2px solid white", */
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    margin: "10px",
                    flex: 1,

                    height: "100%",
                  }}
                >
                  <CustomTimeline
                    list={[
                      {
                        label: FormalDate(challenge?.startDate),
                        title: "Start",
                        color: "green",
                      },
                      {
                        label: FormalDate(challenge?.endDate),
                        title: "End",
                        color: "red",
                      },
                    ]}
                  />
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                    flex: 1,
                    padding: 10,
                  }}
                >
                  <Typography
                    variant="body1"
                    className={style.title}
                    color="white"
                  >
                    <Typist
                      cursor={{ show: false }}
                      startDelay={1000}
                      avgTypingDelay={50}
                    >
                      {challenge?.description}
                    </Typist>
                  </Typography>

                  <Typography
                    variant="body1"
                    className={style.title}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    color="white"
                  >
                    <EmojiEventsIcon />
                    {challenge?.reward}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={style.title}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    color="white"
                  >
                    <LocationSearchingIcon />
                    {challenge?.goal}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box style={{ width: "90%" }}>
            <Typography
              variant="h4"
              className={style.title}
              color="white"
              style={{
                margin: "10px 0px",
              }}
            >
              Tasks
            </Typography>

            {Task?.map((task, i) => {
              return (
                <Box
                  key={i}
                  className={style.task}
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                  gap={2}
                  sx={{
                    backgroundColor: "#444",
                    padding: "15px",
                    margin: "10px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Checkbox
                        checked={task.completed.includes(user?.user?._id)}
                        onClick={() => {
                          Notification(
                            `You have ${
                              task.completed.includes(user?.user?._id)
                                ? "uncompleted"
                                : "completed"
                            } the task: ${task.title}`,
                            "success"
                          );
                          dispatch(completeTask(task._id, id));
                          dispatch(
                            creditCoins(
                              task.completed.includes(user?.user?._id)
                                ? -task.coin
                                : task.coin,
                              user?.user?._id
                            )
                          );
                        }}
                      />
                      {task.title}
                      {task.completed.includes(user?.user?._id) && (
                        <Chip
                          label="Completed"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    <div
                      style={{
                        alignSelf: "flex-end",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <MonetizationOnIcon sx={{ color: "gold", mr: 1 }} />
                        {task.coin}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setDetails((details) => [
                            ...details.slice(0, i),
                            !details[i],
                            ...details.slice(i + 1),
                          ]);
                        }}
                      >
                        {details[i] ? (
                          <KeyboardArrowUpIcon style={{ color: "white" }} />
                        ) : (
                          <KeyboardArrowDownIcon style={{ color: "white" }} />
                        )}
                      </IconButton>
                    </div>
                  </Box>
                  {details[i] && (
                    <Box>
                      <ExerciseDetail exercise={task.exercise} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Container>
  );
};

export default DetailedChallenge;

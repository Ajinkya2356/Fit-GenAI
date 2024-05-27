import { CircularProgress, Container, Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { challengeLeaderBoard } from "../../../Redux/challenge/challengeSlice";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const LeaderBoard = ({ id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.USER);
  useEffect(() => {
    dispatch(challengeLeaderBoard(id));

    const intervalId = setInterval(() => {
      dispatch(challengeLeaderBoard(id));
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);
  const { leadLoading, userLeaderBoard } = useSelector(
    (state) => state.CHALLENGE
  );

  return (
    <Container
      style={{
        minWidth: 300,
        maxWidth: 400,
        backgroundColor: "#333",
        width: "100%",
        height: "100%",
      }}
    >
      {leadLoading ? (
        <CircularProgress />
      ) : (
        <Box
          style={{
            padding: "20px 10px",
            color: "white",
          }}
        >
          <Typography variant="h5">Leaderboard</Typography>
          <Box
            style={{
              padding: 5,
              display: "flex",
              gap: 10,
              flexDirection: "column",
            }}
          >
            {userLeaderBoard?.slice(0, 10).map((item, index) => {
              return (
                <Box
                  key={index}
                  style={{
                    border:
                      item._id === user?.user?._id
                        ? "1px solid gold"
                        : "1px solid white",
                    display: "flex",
                    gap: 10,
                    padding: 5,
                    borderRadius: "10px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      display: "inherit",
                      gap: 10,
                      flexWrap: "wrap",
                      padding: 5,
                    }}
                  >
                    <Typography variant="body1">{index + 1}</Typography>
                    <Typography
                      variant="body1"
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item?.username}
                    </Typography>
                  </Box>
                  <Box
                    style={{
                      display: "inherit",
                      gap: 5,
                    }}
                  >
                    <MonetizationOnIcon style={{ color: "gold" }} />
                    <Typography variant="body1">{item?.coinBalance}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default LeaderBoard;

import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteChallenge,
  getUserChallenges,
} from "../../../Redux/challenge/challengeSlice";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const MyChallenges = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userChallenges, loading } = useSelector((state) => state.CHALLENGE);
  useEffect(() => {
    dispatch(getUserChallenges());
  }, []);
  return (
    <Container
      maxWidth={false}
      style={{
        backgroundColor: "#333",
        gap: "20px",
        padding: "20px",
      }}
    >
      {userChallenges.length == 0 ? (
        <Box style={{ display: "flex", flex: 1 }}>
          <Typography variant="h3" color="white">
            No Challenges Found
          </Typography>
        </Box>
      ) : (
        userChallenges.map((challenge, ind) => {
          return loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  boxShadow: "0 0 10px #fff, 0 0 5px #fff",
                  padding: 5,
                  margin: 10,
                  borderRadius: "20px",
                  gap: 20,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    /*     border: "2px solid red", */
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                  onClick={() => {
                    navigate(`/challenges/${challenge._id}`);
                  }}
                >
                  <img
                    src={challenge.cover_image}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "20%",
                    }}
                  />
                  <div
                    style={
                      {
                        /* border: "2px solid red", */
                      }
                    }
                  >
                    <Typography variant="h6">{challenge.name}</Typography>
                    <Typography variant="body1">
                      {challenge.description}
                    </Typography>
                  </div>
                </div>
                <div>
                  <IconButton
                    onClick={() => {
                      navigate(`/challenges/update/${challenge._id}`);
                    }}
                  >
                    <EditIcon style={{ color: "white" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      dispatch(deleteChallenge(challenge._id));
                    }}
                  >
                    <DeleteIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
              </div>
            </Box>
          );
        })
      )}
    </Container>
  );
};

export default MyChallenges;

import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteChallenge,
  getUserChallenges,
} from "../../../Redux/challenge/challengeSlice";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, IconButton,Card,CardContent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from '@mui/material/colors';
const MyChallenges = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userChallenges, loading } = useSelector((state) => state.CHALLENGE);
  useEffect(() => {
    dispatch(getUserChallenges());
  }, []);
  return (
    <Container maxWidth={false} sx={{ backgroundColor: "#333", gap: 2, p: 2 }}>
      {userChallenges.length === 0 ? (
        <Box sx={{ display: "flex", flex: 1 }}>
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
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: 3,
                p: 1,
                m: 1,
                borderRadius: 2,
                gap: 2,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => {
                navigate(`/challenges/${challenge._id}`);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img
                  src={challenge.cover_image}
                  alt="challenge"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "20%",
                  }}
                />
                <Box>
                  <Typography variant="h6">{challenge.name}</Typography>
                  <Typography variant="body1">
                    {challenge.description}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/challenges/update/${challenge._id}`);
                  }}
                >
                  <EditIcon  />
                </IconButton>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(deleteChallenge(challenge._id));
                  }}
                >
                  <DeleteIcon sx={{ color: red[500] }} />
                </IconButton>
              </Box>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default MyChallenges;

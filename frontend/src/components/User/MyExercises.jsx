import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteExercise,
  userExercise,
} from "../../../Redux/exercise/exerciseSlice";
import ExerciseCard from "../Exercise/ExerciseCard";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import EditExercise from "../Exercise/EditExercise";
const MyExercises = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userExercise());
  }, []);
  const { userExercises, loading } = useSelector((state) => state.EXERCISE);

  return (
    <Container
      maxWidth={false}
      style={{
        backgroundColor: "#333",
        gap: "20px",
        padding: "20px",
      }}
    >
      {userExercises.length == 0 ? (
        <Box style={{ display: "flex", flex: 1 }}>
          <Typography variant="h3" color="white">
            No Exercises Found
          </Typography>
        </Box>
      ) : (
        userExercises.map((exercise, index) => {
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
                    navigate(`/exercise/${exercise._id}`);
                  }}
                >
                  <img
                    src={exercise.image_url}
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
                    <Typography variant="h6">{exercise.name}</Typography>
                    <Typography variant="body1">
                      {exercise.description}
                    </Typography>
                  </div>
                </div>
                <div>
                  <IconButton
                    onClick={() => {
                      navigate(`/exercise/update/${exercise._id}`);
                    }}
                  >
                    <EditIcon style={{ color: "white" }} />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      dispatch(deleteExercise(exercise?._id));
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

export default MyExercises;

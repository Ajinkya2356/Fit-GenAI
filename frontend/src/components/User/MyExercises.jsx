import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  Card,CardContent,
  Typography,
} from "@mui/material";
import { red } from '@mui/material/colors';
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
    <Container maxWidth={false} sx={{ backgroundColor: '#333', gap: 2, p: 2 }}>
    {userExercises.length === 0 ? (
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Typography variant='h3' color='white'>
          No Exercises Found
        </Typography>
      </Box>
    ) : (
      userExercises.map((exercise, index) => {
        return loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 3,
              p: 1,
              m: 1,
              borderRadius: 2,
              gap: 2,
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              },
            }}
            onClick={() => {
              navigate(`/exercise/${exercise._id}`);
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <img
                src={exercise.image_url}
                alt='exercise'
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '20%',
                }}
              />
              <Box>
                <Typography variant='h6'>{exercise.name}</Typography>
                <Typography variant='body1'>{exercise.description}</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/exercise/update/${exercise._id}`);
                }}
              >
                <EditIcon  />
              </IconButton>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(deleteExercise(exercise?._id));
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

export default MyExercises;

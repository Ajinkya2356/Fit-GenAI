import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { getExerciseAction } from "../../../Redux/exercise/exerciseSlice";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import ExerciseCard from "./ExerciseCard";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";

const Exercises = () => {
  const dispatch = useDispatch();
  const { exercises, error, loading } = useSelector((state) => state.EXERCISE);
  const [searchKey, setSearchKey] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getExerciseAction(difficulty, searchKey));
    }, 1000);
    return () => clearTimeout(getData);
  }, [dispatch, searchKey, difficulty]);

  /*   console.log(exercises); */
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        backgroundColor: "#333",
        flexWrap: "wrap",
        minWidth: "sm",
        margin: "0",
        padding: "0",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          color: "white",
          minWidth: "sm",
          margin: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          id="input-with-icon-textfield"
          label="Search Exercises"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          InputProps={{
            style: { borderBottom: "1px solid white", color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: {
              color: "white",
            },
          }}
          variant="standard"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            /*  borderColor: "white",
            borderWidth: 1,
            borderStyle: "solid", */
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel
              id="demo-simple-select-autowidth-label"
              style={{
                color: "white",
              }}
            >
              Difficulty
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
              }}
              autoWidth
              label="Difficulty"
              style={{
                borderColor: "white",
              }}
            >
              <MenuItem value={"Begineer"}>Begineer</MenuItem>
              <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
              <MenuItem value={"Advanced"}>Advanced</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            sx={{
              m: 1,
            }}
            onClick={() => {
              setSearchKey("");
              setDifficulty("");
            }}
          >
            Clear
          </Button>
          <Button>
            <a
              href="/addexercise"
              style={{ textDecoration: "none", color: "white" }}
            >
              Add Exercise
            </a>
          </Button>
        </Box>
      </Box>
      <Box style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {loading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          exercises.map((item, index) => {
            return <ExerciseCard item={item} key={index} />;
          })
        )}
      </Box>
    </Container>
  );
};

export default Exercises;

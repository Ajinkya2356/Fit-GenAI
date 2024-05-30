import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Container, Drawer, TextField } from "@mui/material";
import { getChallengeAction } from "../../../Redux/challenge/challengeSlice";
import { useNavigate } from "react-router-dom";
import ChallengeCard from "./Card";
import CircularProgress from "@mui/material/CircularProgress";
import SearchBar from "../common/SearchBar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Create from "./Create";
import Notification from "../common/Notification";
export const colorToStatusMap = {
  upcoming: "#325ea8",
  live: "green",
  expired: "red",
};
const Challenges = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getChallengeAction(keyword, status));
    }, 1000);
    return () => clearTimeout(getData);
  }, [dispatch, keyword, status]);
  const { challenges, loading, error } = useSelector(
    (state) => state.CHALLENGE
  );
  useEffect(() => {
    if (error) {
      Notification(error, "danger");
    }
  }, [error]);
  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          backgroundColor: "#333",
          flexWrap: "wrap",
        }}
      >
        <>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <SearchBar keyword={keyword} setKeyword={setKeyword} />
            <Box
              sx={{ minWidth: 200, margin: "30px" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FormControl fullWidth style={{ border: "1px solid white" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: "white" }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status"
                  sx={{
                    color: "white",
                    minWidth: "100px",
                  }}
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <MenuItem value={"Upcoming"}>Upcoming</MenuItem>
                  <MenuItem value={"Live"}>Live</MenuItem>
                  <MenuItem value={"Expired"}>Expired</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                onClick={() => {
                  setOpen(true);
                }}
                sx={{ backgroundColor: "#4caf50" }}
              >
                <AddIcon style={{ color: "white" }} />
              </IconButton>

              <IconButton
                variant="contained"
                onClick={() => {
                  setStatus("");
                  setKeyword("");
                }}
                sx={{ backgroundColor: "#f44336" }}
              >
                <RestartAltIcon />
              </IconButton>
            </Box>
          </Box>
          <Container
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              gap: "20px",
              padding: "10px",
              margin: "10px",
            }}
          >
            {loading ? (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {challenges.map((challenge, index) => {
                  return (
                    <ChallengeCard
                      onClick={() => {
                        navigate(`${challenge._id}`);
                      }}
                      challenge={challenge}
                      key={index}
                    />
                  );
                })}
                <Drawer
                  open={open}
                  onClose={() => setOpen(false)}
                  anchor="right"
                >
                  <Create setOpen={setOpen} />
                </Drawer>
              </>
            )}
          </Container>
        </>
      </Container>
    </>
  );
};

export default Challenges;

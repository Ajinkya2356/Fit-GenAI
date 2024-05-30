import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Input,
  FormControl,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChallenge,
  getSingleChallenge,
  updateChallenge,
} from "../../../Redux/challenge/challengeSlice";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../../Redux/category/categorySlice";
import { FormalDate } from "../Challenge/Card";
const Update = () => {
  const { id } = useParams();
  useEffect(() => {
    dispatch(getSingleChallenge(id));
    dispatch(getAllCategories());
  }, [id]);

  const { challenge, loading } = useSelector((state) => state.CHALLENGE);
  const { categories } = useSelector((state) => state.CATEGORY);
  console.log("Challenge", challenge);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputLabels = [
    "Name",
    "Description",
    "Goal",
    "Reward",
    "Participants Limit",
  ];

  const dateLables = ["Start Date", "End Date"];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [reward, setReward] = useState("");
  const [participants_limit, setParticipants_limit] = useState("");
  const [category, setCategory] = useState("");
  const [cover_image, setCover_image] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");
  useEffect(() => {
    if (challenge) {
      setName(challenge.name);
      setDescription(challenge.description);
      setGoal(challenge.goal);
      setReward(challenge.reward);
      setParticipants_limit(challenge.participants_limit);
      setCover_image(challenge.cover_image);
      setStartDate(challenge.startDate);
      setEndDate(challenge.endDate);
      setStatus(challenge.status);
      setCategory(challenge.category._id);
    }
  }, [challenge]);
  const labelToValue = {
    Name: name,
    Description: description,
    Goal: goal,
    Reward: reward,
    "Participants Limit": participants_limit,
  };
  const challengeData = {
    name,
    description,
    startDate,
    endDate,
    goal,
    reward,
    participants_limit,
    cover_image,
    category,
    status,
  };
  return loading ? (
    <Box>
      <CircularProgress />
    </Box>
  ) : (
    <Container maxWidth={false}>
      <h1>Update Challenge</h1>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
          maxWidth: "70%",
          margin: "5%",
        }}
      >
        {inputLabels?.map((label, item) => {
          return (
            <TextField
              variant="outlined"
              label={label}
              value={labelToValue[label]}
              fullWidth
              onChange={(e) => {
                const value = e.target.value;
                switch (label) {
                  case "Name":
                    setName(value);
                    break;
                  case "Description":
                    setDescription(value);
                    break;
                  case "Goal":
                    setGoal(value);
                    break;
                  case "Reward":
                    setReward(value);
                    break;
                  case "Participants Limit":
                    setParticipants_limit(value);
                    break;
                  default:
                    break;
                }
              }}
            />
          );
        })}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {" "}
            {categories.map((category, ind) => {
              return <MenuItem value={category._id}>{category.name}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          component="label"
          role={undefined}
          tabIndex={-1}
        >
          <Input
            type="file"
            sx={{ display: "none" }}
            accept=".jpg,.png,.jpeg"
            onChange={(event) => {
              const file = event.target.files[0];
              setFileName(file.name);
              setCover_image(file);
            }}
          />
          <CloudUploadIcon />
          &nbsp;&nbsp;{fileName !== "" ? fileName : "Upload Image"}
        </Button>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",

            width: "100%",
          }}
        >
          {dateLables.map((date, item) => {
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label={date}
                    onChange={(e) => {
                      const convertedDate = e.toISOString();
                      switch (date) {
                        case "Start Date":
                          setStartDate(convertedDate);
                          break;
                        case "End Date":
                          setEndDate(convertedDate);
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            );
          })}
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(updateChallenge(challengeData, id));
            navigate(`/my-challenges`);
          }}
        >
          Update
        </Button>
      </Box>
    </Container>
  );
};

export default Update;

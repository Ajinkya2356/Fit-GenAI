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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChallenge } from "../../../Redux/challenge/challengeSlice";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  getAllCategories,
  createCategory,
} from "../../../Redux/category/categorySlice";
import Notification from "../common/Notification";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
const Create = ({ setOpen }) => {
  useEffect(() => {
    dispatch(getAllCategories());
  }, []);
  const [openNew, setOpenNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { categories } = useSelector((state) => state.CATEGORY);
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
  const [participants_limit, setParticipants_limit] = useState(10);
  const [category, setCategory] = useState("65ff29d5708382b5919178ef");
  const [cover_image, setCover_image] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileName, setFileName] = useState("");
  const challenge = {
    name,
    description,
    startDate,
    endDate,
    goal,
    reward,
    participants_limit,
    cover_image,
    category,
  };
  const clearfields = () => {
    setName("");
    setDescription("");
    setGoal("");
    setReward("");
    setParticipants_limit(10);
    setCategory("");
    setCover_image(null);
    setStartDate("");
    setEndDate("");
    setFileName("");
  };
  return (
    <Container
      style={{
        maxWidth: "300px",
      }}
    >
      <h1>Create Challenge</h1>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
          margin: "20px",
        }}
      >
        {inputLabels.map((label, item) => {
          return (
            <TextField
              variant="outlined"
              label={label}
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
              if (e.target.value === "new") {
                setOpenNew(true);
              } else {
                setCategory(e.target.value);
              }
            }}
          >
            {categories.map((category, ind) => {
              return <MenuItem value={category._id}>{category.name}</MenuItem>;
            })}
            <MenuItem value="new">Create new</MenuItem>
          </Select>
        </FormControl>
        <Dialog open={openNew} onClose={() => setOpenNew(false)}>
          <DialogTitle>Create new category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Category Name"
              type="text"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNew(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setNewCategory("");
                setOpenNew(false);
                dispatch(createCategory(newCategory));
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

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
                      const convertedDate = dayjs(e).toISOString();
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
          style={{
            width: "100%",
          }}
          variant="contained"
          onClick={() => {
            if (
              !name ||
              !description ||
              !goal ||
              !reward ||
              !participants_limit ||
              !category ||
              !cover_image ||
              !startDate ||
              !endDate
            ) {
              alert("Please fill all fields");
              return;
            }
            dispatch(createChallenge(challenge));
            setOpen(false);
            Notification("Challenge created successfully", "success");
          }}
        >
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default Create;

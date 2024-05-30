import React from "react";
import {
  Container,
  FormControl,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Input,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../Redux/category/categorySlice";
import {
  createExercise,
  getSingleExercise,
  updateExercise,
} from "../../../Redux/exercise/exerciseSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Notification from "../common/Notification";
import {CircularProgress} from "@mui/material";
const EditExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState("");
  const [fileName2, setFileName2] = useState("");
  const fields = [
    "name",
    "description",
    "categoryID",
    "difficulty_level",
    "video",
    "image",
  ];

  useEffect(() => {
    dispatch(getSingleExercise(id));
    dispatch(getAllCategories());
  }, [dispatch]);
  const { categories } = useSelector((state) => state.CATEGORY);
  const { exercise, loading, error } = useSelector((state) => state.EXERCISE);
  const [data, setData] = useState(exercise);
  useEffect(() => {
    setData({
      name: exercise?.name,
      description: exercise?.description,
      categoryID: exercise?.category?.[0]._id,
      difficulty_level: exercise?.difficulty_level,
      video: exercise?.video_url,
      image: exercise?.image_url?.[0],
    });
  }, [exercise]);
  console.log(data);
  return loading ? (
    <Box>
      <CircularProgress />
    </Box>
  ) : (
    <Container maxWidth={false} style={{ padding: 20 }}>
      <Typography variant="h6" style={{ margin: "15px 0px" }}>
        Update Exercise
      </Typography>
      <Box>
        <FormControl>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                {field != "video" && field != "image" ? (
                  field !== "categoryID" && field != "difficulty_level" ? (
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      variant="outlined"
                      value={data?.[field] || ""}
                      fullWidth
                      onChange={(e) => {
                        setData((prev) => {
                          return { ...prev, [field]: e.target.value };
                        });
                      }}
                    />
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel>
                        {field === "categoryID"
                          ? "Category"
                          : "Difficulty Level"}
                      </InputLabel>
                      <Select
                        value={data?.[field]}
                        onChange={(e) => {
                          setData((prev) => {
                            return { ...prev, [field]: e.target.value };
                          });
                        }}
                      >
                        {field === "categoryID" && categories
                          ? categories.map(
                              (category) =>
                                category._id && (
                                  <MenuItem
                                    value={category._id}
                                    key={category._id}
                                  >
                                    {category?.name}
                                  </MenuItem>
                                )
                            )
                          : ["Beginner", "Intermediate", "Advanced"].map(
                              (level) => (
                                <MenuItem
                                  value={level.toLowerCase()}
                                  key={level}
                                >
                                  {level}
                                </MenuItem>
                              )
                            )}
                      </Select>
                    </FormControl>
                  )
                ) : (
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
                        if (field === "video") {
                          setFileName(file.name);
                        } else {
                          setFileName2(file.name);
                        }
                        setData((prev) => {
                          return { ...prev, [field]: file };
                        });
                      }}
                    />
                    <CloudUploadIcon />
                    &nbsp;&nbsp;
                    {field === "video"
                      ? fileName
                        ? fileName
                        : `Upload ${field}`
                      : fileName2
                      ? fileName2
                      : `Upload ${field}`}
                  </Button>
                )}
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: "50px 0",
            }}
            onClick={() => {
              dispatch(updateExercise(data, id));
              Notification("Exercise Updated Successfully", "success");
              navigate(`/exercises`);
            }}
          >
            Update Exercise
          </Button>
        </FormControl>
      </Box>
    </Container>
  );
};

export default EditExercise;

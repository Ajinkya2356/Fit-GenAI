import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../../../Redux/collection/collectionSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const Collections = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [name, setName] = useState("");
  const { collections } = useSelector((state) => state.COLLECTION);
  const handleDrawerClick = () => {
    setOpen((open) => !open);
  };
  const handleUpdateClick = () => {
    setUpdate((update) => !update);
  };
  useEffect(() => {
    dispatch(getCollections());
  }, []);
  return (
    <Container
      maxWidth={false}
      style={{
        backgroundColor: "#333",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
      }}
    >
      <Box
        style={{
          alignSelf: "flex-end",
        }}
      >
        <Button variant="contained" onClick={handleDrawerClick}>
          Create Collection
        </Button>
        <Drawer onClose={handleDrawerClick} open={open} anchor="right">
          <Box
            style={{
              margin: "10px",
              padding: "10px",
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">Create Collection</Typography>
            <TextField
              variant="standard"
              fullWidth
              label="Collection Name"
              style={{
                margin: "10px",
              }}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                dispatch(createCollection(name));
                setOpen(false);
                setName("");
              }}
            >
              Create
            </Button>
          </Box>
        </Drawer>
      </Box>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {collections.map((collection) => {
          return (
            <Box
              key={collection._id}
              style={{
                border: "1px solid white",
                padding: "10px",
                margin: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                cursor: "pointer",
                flexDirection: "row",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body1" color="white">
                {collection.name}
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                <IconButton
                  onClick={() => {
                    setUpdate(true);
                    setName(collection.name);
                  }}
                >
                  <EditIcon style={{ color: "white" }} />
                </IconButton>
                <Drawer
                  onClose={handleUpdateClick}
                  anchor="right"
                  open={update}
                >
                  <Box
                    style={{
                      margin: "10px",
                      padding: "10px",
                      minWidth: "300px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h5">Update Collection</Typography>
                    <TextField
                      variant="standard"
                      fullWidth
                      label="Collection Name"
                      style={{
                        margin: "10px",
                      }}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <Button
                      onClick={() => {
                        dispatch(updateCollection(name, collection._id));
                        setUpdate(false);
                        setName("");
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </Drawer>
                <IconButton
                  onClick={() => {
                    dispatch(deleteCollection(collection._id));
                  }}
                >
                  <DeleteIcon style={{ color: "red" }} />
                </IconButton>
              </div>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default Collections;
